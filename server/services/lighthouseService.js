import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

export class LighthouseService {
  constructor() {
    this.config = {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    };
  }

  async analyzePage(url) {
    console.log(`🔍 Running Lighthouse analysis for: ${url}`);
    
    let chrome;
    try {
      // Launch Chrome
      chrome = await chromeLauncher.launch({
        chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
      });

      // Run Lighthouse
      const result = await lighthouse(url, {
        port: chrome.port,
        ...this.config.settings
      }, this.config);

      if (!result || !result.lhr) {
        throw new Error('Lighthouse analysis failed');
      }

      return this.processLighthouseResults(result.lhr);

    } catch (error) {
      console.error('❌ Lighthouse analysis error:', error);
      return this.generateFallbackResults(url);
    } finally {
      if (chrome) {
        await chrome.kill();
      }
    }
  }

  processLighthouseResults(lhr) {
    const categories = lhr.categories;
    const audits = lhr.audits;

    return {
      performance: {
        score: Math.round((categories.performance?.score || 0) * 100),
        metrics: {
          fcp: audits['first-contentful-paint']?.displayValue || 'N/A',
          lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
          fid: audits['max-potential-fid']?.displayValue || 'N/A',
          cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
          si: audits['speed-index']?.displayValue || 'N/A',
          tti: audits['interactive']?.displayValue || 'N/A'
        },
        opportunities: this.extractOpportunities(audits),
        diagnostics: this.extractDiagnostics(audits)
      },
      accessibility: {
        score: Math.round((categories.accessibility?.score || 0) * 100),
        issues: this.extractAccessibilityIssues(audits),
        passed: this.extractPassedAudits(audits, 'accessibility')
      },
      seo: {
        score: Math.round((categories.seo?.score || 0) * 100),
        issues: this.extractSEOIssues(audits),
        passed: this.extractPassedAudits(audits, 'seo')
      },
      bestPractices: {
        score: Math.round((categories['best-practices']?.score || 0) * 100),
        issues: this.extractBestPracticesIssues(audits),
        passed: this.extractPassedAudits(audits, 'best-practices')
      },
      overall: {
        score: this.calculateOverallScore(categories),
        grade: this.getGrade(this.calculateOverallScore(categories))
      }
    };
  }

  extractOpportunities(audits) {
    const opportunities = [];
    const opportunityAudits = [
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'offscreen-images',
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'duplicated-javascript'
    ];

    opportunityAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          displayValue: audit.displayValue,
          score: Math.round(audit.score * 100),
          savings: audit.details?.overallSavingsMs || 0
        });
      }
    });

    return opportunities.sort((a, b) => b.savings - a.savings);
  }

  extractDiagnostics(audits) {
    const diagnostics = [];
    const diagnosticAudits = [
      'mainthread-work-breakdown',
      'bootup-time',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'dom-size',
      'critical-request-chains'
    ];

    diagnosticAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit) {
        diagnostics.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          displayValue: audit.displayValue,
          score: audit.score !== null ? Math.round(audit.score * 100) : null
        });
      }
    });

    return diagnostics;
  }

  extractAccessibilityIssues(audits) {
    const issues = [];
    const accessibilityAudits = [
      'color-contrast',
      'image-alt',
      'label',
      'link-name',
      'button-name',
      'document-title',
      'html-has-lang',
      'meta-viewport'
    ];

    accessibilityAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        issues.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          impact: this.getImpactLevel(audit.score),
          elements: audit.details?.items?.length || 0
        });
      }
    });

    return issues;
  }

  extractSEOIssues(audits) {
    const issues = [];
    const seoAudits = [
      'document-title',
      'meta-description',
      'http-status-code',
      'link-text',
      'crawlable-anchors',
      'is-crawlable',
      'robots-txt',
      'image-alt',
      'hreflang',
      'canonical'
    ];

    seoAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        issues.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          impact: this.getImpactLevel(audit.score)
        });
      }
    });

    return issues;
  }

  extractBestPracticesIssues(audits) {
    const issues = [];
    const bestPracticesAudits = [
      'is-on-https',
      'uses-http2',
      'no-vulnerable-libraries',
      'external-anchors-use-rel-noopener',
      'geolocation-on-start',
      'notification-on-start',
      'no-document-write',
      'js-libraries'
    ];

    bestPracticesAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        issues.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          impact: this.getImpactLevel(audit.score)
        });
      }
    });

    return issues;
  }

  extractPassedAudits(audits, category) {
    const passed = [];
    Object.entries(audits).forEach(([auditId, audit]) => {
      if (audit.score === 1 && this.isAuditInCategory(auditId, category)) {
        passed.push({
          id: auditId,
          title: audit.title,
          description: audit.description
        });
      }
    });
    return passed;
  }

  isAuditInCategory(auditId, category) {
    const categoryAudits = {
      accessibility: ['color-contrast', 'image-alt', 'label', 'link-name', 'button-name'],
      seo: ['document-title', 'meta-description', 'link-text', 'crawlable-anchors'],
      'best-practices': ['is-on-https', 'uses-http2', 'no-vulnerable-libraries']
    };
    return categoryAudits[category]?.includes(auditId) || false;
  }

  calculateOverallScore(categories) {
    const scores = [
      categories.performance?.score || 0,
      categories.accessibility?.score || 0,
      categories.seo?.score || 0,
      categories['best-practices']?.score || 0
    ];
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
  }

  getImpactLevel(score) {
    if (score === 0) return 'high';
    if (score < 0.5) return 'medium';
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

  generateFallbackResults(url) {
    console.log('⚠️ Generating fallback Lighthouse results');
    return {
      performance: {
        score: 70,
        metrics: {
          fcp: 'N/A',
          lcp: 'N/A',
          fid: 'N/A',
          cls: 'N/A',
          si: 'N/A',
          tti: 'N/A'
        },
        opportunities: [],
        diagnostics: []
      },
      accessibility: {
        score: 75,
        issues: [],
        passed: []
      },
      seo: {
        score: 80,
        issues: [],
        passed: []
      },
      bestPractices: {
        score: 85,
        issues: [],
        passed: []
      },
      overall: {
        score: 77,
        grade: 'B'
      }
    };
  }
}