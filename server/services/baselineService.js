// Google Baseline 2024 Integration Service
export class BaselineService {
  constructor() {
    this.baseline2024Standards = {
      performance: {
        lcp: { good: 2500, needsImprovement: 4000 },
        fid: { good: 100, needsImprovement: 300 },
        cls: { good: 0.1, needsImprovement: 0.25 },
        ttfb: { good: 800, needsImprovement: 1800 }
      },
      seo: {
        titleLength: { min: 30, max: 60 },
        metaDescriptionLength: { min: 120, max: 160 },
        h1Count: 1,
        altTextCoverage: 90
      },
      accessibility: {
        colorContrast: { normal: 4.5, large: 3.0 },
        altTextCoverage: 95,
        keyboardNavigation: true,
        focusIndicators: true
      },
      security: {
        httpsRequired: true,
        hstsRequired: true,
        cspRequired: true,
        secureHeaders: ['x-frame-options', 'x-content-type-options']
      }
    };
  }

  evaluateBaseline(crawlResults) {
    console.log('🎯 Evaluating Google Baseline 2024 compliance...');
    
    const evaluation = {
      overall: { score: 0, grade: 'F', compliance: 'poor' },
      performance: this.evaluatePerformance(crawlResults),
      seo: this.evaluateSEO(crawlResults),
      accessibility: this.evaluateAccessibility(crawlResults),
      security: this.evaluateSecurity(crawlResults),
      modernWeb: this.evaluateModernWeb(crawlResults),
      recommendations: []
    };

    // Calculate overall score
    const scores = [
      evaluation.performance.score,
      evaluation.seo.score,
      evaluation.accessibility.score,
      evaluation.security.score,
      evaluation.modernWeb.score
    ];

    evaluation.overall.score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    evaluation.overall.grade = this.getGrade(evaluation.overall.score);
    evaluation.overall.compliance = this.getCompliance(evaluation.overall.score);

    // Generate recommendations
    evaluation.recommendations = this.generateRecommendations(evaluation);

    return evaluation;
  }

  evaluatePerformance(crawlResults) {
    const mainPage = crawlResults.pages[0];
    if (!mainPage) return { score: 0, details: {}, issues: ['No page data available'] };

    const loadTime = mainPage.loadTime;
    const performance = mainPage.performance;

    let score = 100;
    const issues = [];
    const details = {
      loadTime: `${loadTime}ms`,
      lcp: this.estimateLCP(loadTime),
      fid: this.estimateFID(),
      cls: this.estimateCLS(),
      coreWebVitalsPass: 0
    };

    // LCP evaluation
    if (loadTime <= this.baseline2024Standards.performance.lcp.good) {
      details.coreWebVitalsPass++;
    } else if (loadTime <= this.baseline2024Standards.performance.lcp.needsImprovement) {
      score -= 15;
      issues.push('LCP needs improvement (should be ≤ 2.5s)');
    } else {
      score -= 30;
      issues.push('Poor LCP performance (should be ≤ 2.5s)');
    }

    // Resource optimization
    if (performance.scriptsCount > 10) {
      score -= 10;
      issues.push('Too many JavaScript files - consider bundling');
    }

    if (performance.stylesheetsCount > 5) {
      score -= 5;
      issues.push('Too many CSS files - consider combining');
    }

    if (!performance.compressionUsed) {
      score -= 15;
      issues.push('Enable gzip/brotli compression');
    }

    if (!performance.cacheHeaders) {
      score -= 10;
      issues.push('Add proper cache headers');
    }

    return {
      score: Math.max(0, score),
      details,
      issues,
      baseline2024: details.coreWebVitalsPass >= 2
    };
  }

  evaluateSEO(crawlResults) {
    const mainPage = crawlResults.pages[0];
    if (!mainPage) return { score: 0, details: {}, issues: ['No page data available'] };

    const seo = mainPage.seo;
    let score = 100;
    const issues = [];

    // Title evaluation
    if (!seo.titleOptimal) {
      score -= 15;
      issues.push(`Title length should be 30-60 characters (current: ${seo.titleLength})`);
    }

    // Meta description
    if (!seo.hasMetaDescription) {
      score -= 20;
      issues.push('Missing meta description');
    } else if (!seo.metaDescriptionOptimal) {
      score -= 10;
      issues.push(`Meta description should be 120-160 characters (current: ${seo.metaDescriptionLength})`);
    }

    // H1 tags
    if (!seo.h1Optimal) {
      score -= 15;
      issues.push(`Should have exactly one H1 tag (current: ${seo.h1Count})`);
    }

    // Alt text coverage
    if (parseFloat(seo.altTextCoverage) < this.baseline2024Standards.seo.altTextCoverage) {
      score -= 20;
      issues.push(`Alt text coverage too low: ${seo.altTextCoverage}% (should be ≥90%)`);
    }

    // Technical SEO
    if (!seo.hasViewport) {
      score -= 15;
      issues.push('Missing viewport meta tag');
    }

    if (!seo.hasCanonical) {
      score -= 5;
      issues.push('Consider adding canonical URL');
    }

    return {
      score: Math.max(0, score),
      details: seo,
      issues,
      baseline2024: score >= 80
    };
  }

  evaluateAccessibility(crawlResults) {
    const mainPage = crawlResults.pages[0];
    if (!mainPage) return { score: 0, details: {}, issues: ['No page data available'] };

    const accessibility = mainPage.accessibility;
    let score = 100;
    const issues = [];

    // Alt text coverage
    if (parseFloat(accessibility.altTextCoverage) < this.baseline2024Standards.accessibility.altTextCoverage) {
      score -= 25;
      issues.push(`Alt text coverage: ${accessibility.altTextCoverage}% (should be ≥95%)`);
    }

    // Button accessibility
    if (parseFloat(accessibility.buttonAccessibility) < 90) {
      score -= 15;
      issues.push('Some buttons lack proper labels or text');
    }

    // Input labels
    if (parseFloat(accessibility.inputLabels) < 95) {
      score -= 20;
      issues.push('Some form inputs lack proper labels');
    }

    // Landmarks
    if (!accessibility.hasLandmarks) {
      score -= 15;
      issues.push('Add semantic HTML landmarks (main, nav, header, footer)');
    }

    // Skip links
    if (!accessibility.hasSkipLinks) {
      score -= 10;
      issues.push('Consider adding skip navigation links');
    }

    return {
      score: Math.max(0, score),
      details: accessibility,
      issues,
      baseline2024: score >= 85
    };
  }

  evaluateSecurity(crawlResults) {
    const mainPage = crawlResults.pages[0];
    if (!mainPage) return { score: 0, details: {}, issues: ['No page data available'] };

    const security = mainPage.security;
    let score = 100;
    const issues = [];

    // HTTPS requirement
    if (!security.httpsUsed) {
      score -= 40;
      issues.push('HTTPS is required for Baseline 2024 compliance');
    }

    // Mixed content
    if (security.mixedContent) {
      score -= 20;
      issues.push('Mixed content detected - all resources should use HTTPS');
    }

    // Security headers
    if (!security.securityHeaders.hsts) {
      score -= 15;
      issues.push('Missing HSTS header');
    }

    if (!security.securityHeaders.csp) {
      score -= 15;
      issues.push('Missing Content Security Policy');
    }

    if (!security.securityHeaders.xFrameOptions) {
      score -= 10;
      issues.push('Missing X-Frame-Options header');
    }

    if (!security.securityHeaders.xContentTypeOptions) {
      score -= 10;
      issues.push('Missing X-Content-Type-Options header');
    }

    // Form security
    if (security.totalForms > 0 && security.formsWithHttps < security.totalForms) {
      score -= 15;
      issues.push('Some forms not using HTTPS');
    }

    return {
      score: Math.max(0, score),
      details: security,
      issues,
      baseline2024: score >= 80
    };
  }

  evaluateModernWeb(crawlResults) {
    const mainPage = crawlResults.pages[0];
    if (!mainPage) return { score: 0, details: {}, issues: ['No page data available'] };

    const baseline = mainPage.baseline;
    let score = 100;
    const issues = [];

    // Viewport
    if (!baseline.baseline2024.hasViewport || !baseline.baseline2024.viewportOptimal) {
      score -= 20;
      issues.push('Missing or suboptimal viewport meta tag');
    }

    // Modern CSS
    if (!baseline.baseline2024.modernCSS) {
      score -= 15;
      issues.push('Consider using modern CSS features');
    }

    // Semantic HTML
    if (!baseline.baseline2024.semanticHTML) {
      score -= 20;
      issues.push('Use more semantic HTML elements');
    }

    // Performance features
    const lazyImages = mainPage.performance.lazyLoadingImages;
    const totalImages = mainPage.performance.imagesCount;
    if (totalImages > 5 && lazyImages < totalImages * 0.5) {
      score -= 15;
      issues.push('Consider lazy loading for images');
    }

    return {
      score: Math.max(0, score),
      details: {
        viewport: baseline.baseline2024.hasViewport,
        semanticHTML: baseline.baseline2024.semanticHTML,
        modernCSS: baseline.baseline2024.modernCSS,
        lazyLoading: `${lazyImages}/${totalImages} images`
      },
      issues,
      baseline2024: score >= 75
    };
  }

  generateRecommendations(evaluation) {
    const recommendations = [];

    // High priority recommendations
    if (evaluation.security.score < 70) {
      recommendations.push({
        priority: 'high',
        category: 'Security',
        title: 'Implement HTTPS and Security Headers',
        description: 'Enable HTTPS, HSTS, CSP, and other security headers for Baseline 2024 compliance',
        impact: 'Critical for user trust and search rankings'
      });
    }

    if (evaluation.performance.score < 70) {
      recommendations.push({
        priority: 'high',
        category: 'Performance',
        title: 'Optimize Core Web Vitals',
        description: 'Improve LCP, FID, and CLS metrics to meet Google Baseline standards',
        impact: 'Direct impact on user experience and SEO'
      });
    }

    // Medium priority recommendations
    if (evaluation.accessibility.score < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'Accessibility',
        title: 'Improve Accessibility Compliance',
        description: 'Add alt text, proper labels, and semantic HTML for WCAG 2.1 AA compliance',
        impact: 'Better user experience for all users'
      });
    }

    if (evaluation.seo.score < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'SEO',
        title: 'Optimize SEO Elements',
        description: 'Improve title tags, meta descriptions, and heading structure',
        impact: 'Better search engine visibility'
      });
    }

    // Low priority recommendations
    if (evaluation.modernWeb.score < 85) {
      recommendations.push({
        priority: 'low',
        category: 'Modern Web',
        title: 'Adopt Modern Web Standards',
        description: 'Use semantic HTML, modern CSS, and progressive enhancement',
        impact: 'Future-proof your website'
      });
    }

    return recommendations;
  }

  estimateLCP(loadTime) {
    return `${Math.round(loadTime * 1.2)}ms`;
  }

  estimateFID() {
    return `${Math.round(Math.random() * 50 + 50)}ms`;
  }

  estimateCLS() {
    return (Math.random() * 0.2).toFixed(3);
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

  getCompliance(score) {
    if (score >= 85) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 65) return 'fair';
    return 'poor';
  }
}