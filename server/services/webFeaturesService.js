import * as webFeatures from 'web-features';

export class WebFeaturesService {
  constructor() {
    this.features = webFeatures;
    this.baseline2024 = this.getBaselineFeatures('2024');
    this.baseline2025 = this.getBaselineFeatures('2025');
  }

  getBaselineFeatures(year) {
    const baseline = {};
    
    Object.entries(this.features).forEach(([featureId, feature]) => {
      if (feature.status?.baseline === 'high' || feature.status?.baseline === true) {
        const baselineDate = feature.status?.baseline_high_date || feature.status?.baseline_low_date;
        if (baselineDate && new Date(baselineDate).getFullYear() <= parseInt(year)) {
          baseline[featureId] = feature;
        }
      }
    });

    return baseline;
  }

  analyzeWebsiteFeatures(crawlResults) {
    console.log('🔍 Analyzing website features against Google Baseline...');
    
    const analysis = {
      baseline2024: { supported: [], missing: [], score: 0 },
      baseline2025: { supported: [], missing: [], score: 0 },
      categories: {
        css: { supported: [], missing: [] },
        javascript: { supported: [], missing: [] },
        html: { supported: [], missing: [] },
        webapi: { supported: [], missing: [] },
        security: { supported: [], missing: [] }
      },
      overall: { score: 0, grade: 'F', compliance: 'poor' }
    };

    // Analyze Baseline 2024 features
    this.analyzeBaselineCompliance(crawlResults, this.baseline2024, analysis.baseline2024);
    
    // Analyze Baseline 2025 features
    this.analyzeBaselineCompliance(crawlResults, this.baseline2025, analysis.baseline2025);

    // Categorize features
    this.categorizeFeatures(analysis);

    // Calculate overall score
    analysis.overall.score = Math.round((analysis.baseline2024.score + analysis.baseline2025.score) / 2);
    analysis.overall.grade = this.getGrade(analysis.overall.score);
    analysis.overall.compliance = this.getComplianceLevel(analysis.overall.score);

    return analysis;
  }

  analyzeBaselineCompliance(crawlResults, baselineFeatures, analysis) {
    const totalFeatures = Object.keys(baselineFeatures).length;
    let supportedCount = 0;

    Object.entries(baselineFeatures).forEach(([featureId, feature]) => {
      const isSupported = this.checkFeatureSupport(crawlResults, featureId, feature);
      
      if (isSupported) {
        analysis.supported.push({
          id: featureId,
          name: feature.name,
          description: feature.description,
          category: this.getFeatureCategory(feature),
          evidence: isSupported.evidence
        });
        supportedCount++;
      } else {
        analysis.missing.push({
          id: featureId,
          name: feature.name,
          description: feature.description,
          category: this.getFeatureCategory(feature),
          impact: this.getFeatureImpact(feature)
        });
      }
    });

    analysis.score = totalFeatures > 0 ? Math.round((supportedCount / totalFeatures) * 100) : 0;
  }

  checkFeatureSupport(crawlResults, featureId, feature) {
    const mainPage = crawlResults.pages[0];
    if (!mainPage) return false;

    // Feature-specific detection logic
    switch (featureId) {
      case 'css-grid':
        return this.detectCSSGrid(mainPage);
      case 'css-flexbox':
        return this.detectFlexbox(mainPage);
      case 'es6-modules':
        return this.detectES6Modules(mainPage);
      case 'fetch':
        return this.detectFetch(mainPage);
      case 'service-workers':
        return this.detectServiceWorkers(mainPage);
      case 'web-components':
        return this.detectWebComponents(mainPage);
      case 'css-custom-properties':
        return this.detectCSSCustomProperties(mainPage);
      case 'intersection-observer':
        return this.detectIntersectionObserver(mainPage);
      case 'webp':
        return this.detectWebP(mainPage);
      case 'http2':
        return this.detectHTTP2(crawlResults);
      default:
        return this.detectGenericFeature(mainPage, featureId, feature);
    }
  }

  detectCSSGrid(page) {
    const stylesheets = page.stylesheets || [];
    const inlineStyles = page.inlineStyles || '';
    
    const gridPatterns = [
      /display:\s*grid/i,
      /grid-template/i,
      /grid-area/i,
      /grid-column/i,
      /grid-row/i
    ];

    const evidence = [];
    
    // Check stylesheets
    stylesheets.forEach(sheet => {
      gridPatterns.forEach(pattern => {
        if (pattern.test(sheet.content || '')) {
          evidence.push(`CSS Grid detected in stylesheet: ${sheet.href}`);
        }
      });
    });

    // Check inline styles
    gridPatterns.forEach(pattern => {
      if (pattern.test(inlineStyles)) {
        evidence.push('CSS Grid detected in inline styles');
      }
    });

    return evidence.length > 0 ? { evidence } : false;
  }

  detectFlexbox(page) {
    const stylesheets = page.stylesheets || [];
    const inlineStyles = page.inlineStyles || '';
    
    const flexPatterns = [
      /display:\s*flex/i,
      /flex-direction/i,
      /justify-content/i,
      /align-items/i,
      /flex-wrap/i
    ];

    const evidence = [];
    
    stylesheets.forEach(sheet => {
      flexPatterns.forEach(pattern => {
        if (pattern.test(sheet.content || '')) {
          evidence.push(`Flexbox detected in stylesheet: ${sheet.href}`);
        }
      });
    });

    flexPatterns.forEach(pattern => {
      if (pattern.test(inlineStyles)) {
        evidence.push('Flexbox detected in inline styles');
      }
    });

    return evidence.length > 0 ? { evidence } : false;
  }

  detectES6Modules(page) {
    const scripts = page.scripts || [];
    const evidence = [];

    scripts.forEach(script => {
      if (script.type === 'module' || script.src?.includes('type=module')) {
        evidence.push(`ES6 modules detected: ${script.src || 'inline'}`);
      }
    });

    return evidence.length > 0 ? { evidence } : false;
  }

  detectFetch(page) {
    const scripts = page.scripts || [];
    const evidence = [];

    scripts.forEach(script => {
      if (script.content && /fetch\s*\(/i.test(script.content)) {
        evidence.push(`Fetch API usage detected in script: ${script.src || 'inline'}`);
      }
    });

    return evidence.length > 0 ? { evidence } : false;
  }

  detectServiceWorkers(page) {
    const scripts = page.scripts || [];
    const evidence = [];

    scripts.forEach(script => {
      if (script.content && /navigator\.serviceWorker/i.test(script.content)) {
        evidence.push(`Service Worker registration detected: ${script.src || 'inline'}`);
      }
    });

    // Check for service worker files
    if (page.links) {
      page.links.forEach(link => {
        if (link.href && /sw\.js|service-worker\.js|serviceworker\.js/i.test(link.href)) {
          evidence.push(`Service Worker file detected: ${link.href}`);
        }
      });
    }

    return evidence.length > 0 ? { evidence } : false;
  }

  detectWebComponents(page) {
    const scripts = page.scripts || [];
    const evidence = [];

    scripts.forEach(script => {
      if (script.content) {
        if (/customElements\.define/i.test(script.content)) {
          evidence.push(`Custom Elements detected: ${script.src || 'inline'}`);
        }
        if (/attachShadow/i.test(script.content)) {
          evidence.push(`Shadow DOM detected: ${script.src || 'inline'}`);
        }
      }
    });

    return evidence.length > 0 ? { evidence } : false;
  }

  detectCSSCustomProperties(page) {
    const stylesheets = page.stylesheets || [];
    const inlineStyles = page.inlineStyles || '';
    const evidence = [];

    const customPropPattern = /--[\w-]+\s*:/i;
    const varPattern = /var\(--[\w-]+\)/i;

    stylesheets.forEach(sheet => {
      if (customPropPattern.test(sheet.content || '') || varPattern.test(sheet.content || '')) {
        evidence.push(`CSS Custom Properties detected in: ${sheet.href}`);
      }
    });

    if (customPropPattern.test(inlineStyles) || varPattern.test(inlineStyles)) {
      evidence.push('CSS Custom Properties detected in inline styles');
    }

    return evidence.length > 0 ? { evidence } : false;
  }

  detectIntersectionObserver(page) {
    const scripts = page.scripts || [];
    const evidence = [];

    scripts.forEach(script => {
      if (script.content && /IntersectionObserver/i.test(script.content)) {
        evidence.push(`Intersection Observer detected: ${script.src || 'inline'}`);
      }
    });

    return evidence.length > 0 ? { evidence } : false;
  }

  detectWebP(page) {
    const images = page.images || [];
    const evidence = [];

    images.forEach(img => {
      if (img.src && /\.webp$/i.test(img.src)) {
        evidence.push(`WebP image detected: ${img.src}`);
      }
    });

    return evidence.length > 0 ? { evidence } : false;
  }

  detectHTTP2(crawlResults) {
    // Check if any page was served over HTTP/2
    const evidence = [];
    
    crawlResults.pages.forEach(page => {
      if (page.protocol && page.protocol.includes('h2')) {
        evidence.push(`HTTP/2 detected for: ${page.url}`);
      }
    });

    return evidence.length > 0 ? { evidence } : false;
  }

  detectGenericFeature(page, featureId, feature) {
    // Generic feature detection based on feature spec
    const evidence = [];
    
    // Check for feature in scripts
    if (feature.spec && page.scripts) {
      const featureName = feature.name.toLowerCase();
      page.scripts.forEach(script => {
        if (script.content && script.content.toLowerCase().includes(featureName)) {
          evidence.push(`${feature.name} usage detected in script`);
        }
      });
    }

    return evidence.length > 0 ? { evidence } : false;
  }

  categorizeFeatures(analysis) {
    // Categorize supported and missing features
    [...analysis.baseline2024.supported, ...analysis.baseline2024.missing].forEach(feature => {
      const category = feature.category || 'other';
      if (analysis.categories[category]) {
        if (analysis.baseline2024.supported.includes(feature)) {
          analysis.categories[category].supported.push(feature);
        } else {
          analysis.categories[category].missing.push(feature);
        }
      }
    });
  }

  getFeatureCategory(feature) {
    if (feature.spec) {
      const spec = feature.spec.toLowerCase();
      if (spec.includes('css')) return 'css';
      if (spec.includes('javascript') || spec.includes('ecmascript')) return 'javascript';
      if (spec.includes('html')) return 'html';
      if (spec.includes('security')) return 'security';
    }
    return 'webapi';
  }

  getFeatureImpact(feature) {
    // Determine impact level based on feature importance
    if (feature.status?.baseline === 'high') return 'high';
    if (feature.status?.baseline === 'low') return 'medium';
    return 'low';
  }

  getGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 55) return 'C-';
    if (score >= 50) return 'D';
    return 'F';
  }

  getComplianceLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    if (score >= 60) return 'poor';
    return 'critical';
  }

  generateComplianceBadge(score) {
    if (score >= 95) return { level: 'platinum', color: '#E5E4E2', label: 'Platinum' };
    if (score >= 85) return { level: 'gold', color: '#FFD700', label: 'Gold' };
    if (score >= 75) return { level: 'silver', color: '#C0C0C0', label: 'Silver' };
    if (score >= 65) return { level: 'bronze', color: '#CD7F32', label: 'Bronze' };
    return { level: 'none', color: '#666666', label: 'Not Certified' };
  }
}