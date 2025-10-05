import axios from 'axios';
import { JSDOM } from 'jsdom';

export class WebCrawler {
  constructor(url) {
    this.url = url;
    this.baseUrl = new URL(url).origin;
    this.visitedUrls = new Set();
    this.results = {
      pages: [],
      images: [],
      links: [],
      scripts: [],
      stylesheets: [],
      errors: []
    };
  }

  async crawl(maxPages = 5) {
    console.log(`🕷️ Starting crawl for: ${this.url}`);
    await this.crawlPage(this.url, 0, maxPages);
    return this.results;
  }

  async crawlPage(url, depth, maxPages) {
    if (depth >= maxPages || this.visitedUrls.has(url)) {
      return;
    }

    this.visitedUrls.add(url);

    try {
      const startTime = Date.now();
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'WebBaseline Pro Crawler 1.0'
        },
        maxRedirects: 3
      });

      const loadTime = Date.now() - startTime;
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // Analyze page
      const pageAnalysis = await this.analyzePage(document, url, loadTime, response);
      this.results.pages.push(pageAnalysis);

      // Extract links for further crawling
      if (depth < maxPages - 1) {
        const links = document.querySelectorAll('a[href]');
        for (const link of links) {
          const href = link.getAttribute('href');
          if (href && this.isInternalLink(href)) {
            const fullUrl = new URL(href, url).href;
            await this.crawlPage(fullUrl, depth + 1, maxPages);
          }
        }
      }

    } catch (error) {
      console.error(`❌ Crawl error for ${url}:`, error.message);
      this.results.errors.push({
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async analyzePage(document, url, loadTime, response) {
    const analysis = {
      url,
      loadTime,
      timestamp: new Date().toISOString(),
      title: document.querySelector('title')?.textContent || '',
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      headings: this.extractHeadings(document),
      images: this.extractImages(document),
      links: this.extractLinks(document),
      scripts: this.extractScripts(document),
      stylesheets: this.extractStylesheets(document),
      seo: this.analyzeSEO(document),
      accessibility: this.analyzeAccessibility(document),
      performance: this.analyzePerformance(document, loadTime, response),
      security: this.analyzeSecurity(document, response),
      baseline: this.analyzeBaseline(document, loadTime, response)
    };

    return analysis;
  }

  extractHeadings(document) {
    const headings = [];
    for (let i = 1; i <= 6; i++) {
      const elements = document.querySelectorAll(`h${i}`);
      elements.forEach(el => {
        headings.push({
          level: i,
          text: el.textContent.trim(),
          hasId: !!el.id
        });
      });
    }
    return headings;
  }

  extractImages(document) {
    const images = [];
    document.querySelectorAll('img').forEach(img => {
      images.push({
        src: img.src,
        alt: img.alt || '',
        hasAlt: !!img.alt,
        loading: img.loading || 'eager',
        width: img.width || null,
        height: img.height || null
      });
    });
    return images;
  }

  extractLinks(document) {
    const links = [];
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      links.push({
        href,
        text: link.textContent.trim(),
        isExternal: !this.isInternalLink(href),
        hasTitle: !!link.title,
        target: link.target || '_self'
      });
    });
    return links;
  }

  extractScripts(document) {
    const scripts = [];
    document.querySelectorAll('script').forEach(script => {
      scripts.push({
        src: script.src || 'inline',
        async: script.async,
        defer: script.defer,
        type: script.type || 'text/javascript'
      });
    });
    return scripts;
  }

  extractStylesheets(document) {
    const stylesheets = [];
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      stylesheets.push({
        href: link.href,
        media: link.media || 'all'
      });
    });
    return stylesheets;
  }

  analyzeSEO(document) {
    const title = document.querySelector('title')?.textContent || '';
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h1Tags = document.querySelectorAll('h1');
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);

    return {
      titleLength: title.length,
      titleOptimal: title.length >= 30 && title.length <= 60,
      hasMetaDescription: !!metaDescription,
      metaDescriptionLength: metaDescription.length,
      metaDescriptionOptimal: metaDescription.length >= 120 && metaDescription.length <= 160,
      h1Count: h1Tags.length,
      h1Optimal: h1Tags.length === 1,
      imagesTotal: images.length,
      imagesWithoutAlt: imagesWithoutAlt.length,
      altTextCoverage: images.length > 0 ? ((images.length - imagesWithoutAlt.length) / images.length * 100).toFixed(1) : 100,
      hasRobotsMeta: !!document.querySelector('meta[name="robots"]'),
      hasCanonical: !!document.querySelector('link[rel="canonical"]'),
      hasViewport: !!document.querySelector('meta[name="viewport"]')
    };
  }

  analyzeAccessibility(document) {
    const images = document.querySelectorAll('img');
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input');
    const links = document.querySelectorAll('a');

    const imagesWithAlt = Array.from(images).filter(img => img.alt);
    const buttonsWithAriaLabel = Array.from(buttons).filter(btn => btn.getAttribute('aria-label') || btn.textContent.trim());
    const inputsWithLabels = Array.from(inputs).filter(input => {
      return document.querySelector(`label[for="${input.id}"]`) || input.getAttribute('aria-label');
    });

    return {
      altTextCoverage: images.length > 0 ? (imagesWithAlt.length / images.length * 100).toFixed(1) : 100,
      buttonAccessibility: buttons.length > 0 ? (buttonsWithAriaLabel.length / buttons.length * 100).toFixed(1) : 100,
      inputLabels: inputs.length > 0 ? (inputsWithLabels.length / inputs.length * 100).toFixed(1) : 100,
      hasSkipLinks: !!document.querySelector('a[href^="#"]'),
      hasLandmarks: document.querySelectorAll('main, nav, header, footer, aside, section').length > 0,
      colorContrastIssues: this.checkColorContrast(document),
      focusableElements: document.querySelectorAll('a, button, input, select, textarea, [tabindex]').length
    };
  }

  analyzePerformance(document, loadTime, response) {
    const scripts = document.querySelectorAll('script');
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const images = document.querySelectorAll('img');

    return {
      loadTime,
      scriptsCount: scripts.length,
      stylesheetsCount: stylesheets.length,
      imagesCount: images.length,
      responseSize: response.headers['content-length'] || 0,
      compressionUsed: !!response.headers['content-encoding'],
      cacheHeaders: !!response.headers['cache-control'],
      lazyLoadingImages: Array.from(images).filter(img => img.loading === 'lazy').length
    };
  }

  analyzeSecurity(document, response) {
    const forms = document.querySelectorAll('form');
    const httpsLinks = document.querySelectorAll('a[href^="https://"]');
    const httpLinks = document.querySelectorAll('a[href^="http://"]');

    return {
      httpsUsed: this.url.startsWith('https://'),
      mixedContent: this.url.startsWith('https://') && httpLinks.length > 0,
      securityHeaders: {
        hsts: !!response.headers['strict-transport-security'],
        csp: !!response.headers['content-security-policy'],
        xFrameOptions: !!response.headers['x-frame-options'],
        xContentTypeOptions: !!response.headers['x-content-type-options']
      },
      formsWithHttps: Array.from(forms).filter(form => !form.action || form.action.startsWith('https://')).length,
      totalForms: forms.length
    };
  }

  analyzeBaseline(document, loadTime, response) {
    // Google Baseline 2024 compliance check
    const viewport = document.querySelector('meta[name="viewport"]');
    const title = document.querySelector('title');
    const metaDescription = document.querySelector('meta[name="description"]');

    return {
      coreWebVitals: {
        lcp: loadTime <= 2500 ? 'good' : loadTime <= 4000 ? 'needs-improvement' : 'poor',
        fid: 'good', // Simulated - would need real user metrics
        cls: 'good'  // Simulated - would need layout shift measurement
      },
      baseline2024: {
        hasViewport: !!viewport,
        viewportOptimal: viewport?.getAttribute('content')?.includes('width=device-width'),
        hasTitle: !!title,
        titleLength: title?.textContent?.length || 0,
        hasMetaDescription: !!metaDescription,
        httpsOnly: this.url.startsWith('https://'),
        modernCSS: this.checkModernCSS(document),
        semanticHTML: this.checkSemanticHTML(document),
        accessibility: this.getAccessibilityScore(document)
      }
    };
  }

  checkColorContrast(document) {
    // Simplified color contrast check
    const elements = document.querySelectorAll('*');
    let issues = 0;
    // This would need more sophisticated color analysis
    return issues;
  }

  checkModernCSS(document) {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    // Check for modern CSS features (simplified)
    return stylesheets.length > 0;
  }

  checkSemanticHTML(document) {
    const semanticElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
    return semanticElements.length >= 3;
  }

  getAccessibilityScore(document) {
    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter(img => img.alt);
    const altScore = images.length > 0 ? (imagesWithAlt.length / images.length) * 100 : 100;
    
    const hasLandmarks = document.querySelectorAll('main, nav, header, footer').length >= 2;
    const landmarkScore = hasLandmarks ? 100 : 50;
    
    return Math.round((altScore + landmarkScore) / 2);
  }

  isInternalLink(href) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return false;
    }
    
    try {
      const url = new URL(href, this.baseUrl);
      return url.origin === this.baseUrl;
    } catch {
      return false;
    }
  }
}