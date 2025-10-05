import { WebCrawler } from './crawlerService.js';
import { BaselineService } from './baselineService.js';
import { WebFeaturesService } from './webFeaturesService.js';
import { LighthouseService } from './lighthouseService.js';
import { ReportService } from './reportService.js';

export async function performAdvancedAnalysis(url, isAccessible, responseTime) {
  console.log(`🔬 Performing advanced analysis for: ${url}`);
  
  try {
    // Initialize services
    const crawler = new WebCrawler(url);
    const baselineService = new BaselineService();
    const webFeaturesService = new WebFeaturesService();
    const lighthouseService = new LighthouseService();
    const reportService = new ReportService();

    // Crawl website
    const crawlResults = await crawler.crawl(3); // Crawl up to 3 pages
    
    // Run Lighthouse analysis
    const lighthouseResults = await lighthouseService.analyzePage(url);
    
    // Analyze web features
    const webFeaturesAnalysis = webFeaturesService.analyzeWebsiteFeatures(crawlResults);
    
    // Evaluate against Google Baseline 2024
    const baselineEvaluation = baselineService.evaluateBaseline(crawlResults);

    // Generate comprehensive analysis
    const analysis = {
      url,
      timestamp: new Date().toISOString(),
      crawlResults,
      lighthouse: lighthouseResults,
      webFeatures: webFeaturesAnalysis,
      baseline: baselineEvaluation,
      performance: generatePerformanceAnalysis(crawlResults, baselineEvaluation, lighthouseResults),
      seo: generateSEOAnalysis(crawlResults, baselineEvaluation, lighthouseResults),
      accessibility: generateAccessibilityAnalysis(crawlResults, baselineEvaluation, lighthouseResults),
      security: generateSecurityAnalysis(crawlResults, baselineEvaluation, lighthouseResults),
      overall: {
        score: calculateOverallScore(baselineEvaluation, lighthouseResults, webFeaturesAnalysis),
        grade: baselineEvaluation.overall.grade,
        compliance: baselineEvaluation.overall.compliance,
        badge: webFeaturesService.generateComplianceBadge(webFeaturesAnalysis.overall.score)
      },
      recommendations: baselineEvaluation.recommendations,
      technicalDetails: generateTechnicalDetails(crawlResults),
      reports: {
        detailed: reportService.generateReport(analysis, 'detailed', 'json'),
        executive: reportService.generateReport(analysis, 'executive', 'json'),
        compliance: reportService.generateReport(analysis, 'compliance', 'json')
      }
    };

    console.log(`✅ Analysis completed with score: ${analysis.overall.score}`);
    return analysis;

  } catch (error) {
    console.error('❌ Analysis error:', error);
    
    // Fallback analysis if crawling fails
    return generateFallbackAnalysis(url, isAccessible, responseTime);
  }
}

function calculateOverallScore(baselineEvaluation, lighthouseResults, webFeaturesAnalysis) {
  const scores = [
    baselineEvaluation.overall.score,
    lighthouseResults.overall.score,
    webFeaturesAnalysis.overall.score
  ];
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function generatePerformanceAnalysis(crawlResults, baselineEvaluation, lighthouseResults) {
  const performance = baselineEvaluation.performance;
  
  return {
    score: Math.round((performance.score + lighthouseResults.performance.score) / 2),
    grade: getGrade(performance.score),
    details: {
      loadTime: performance.details.loadTime || crawlResults.pages[0]?.loadTime + 'ms',
      lcp: lighthouseResults.performance.metrics.lcp || performance.details.lcp,
      fid: lighthouseResults.performance.metrics.fid || performance.details.fid,
      cls: lighthouseResults.performance.metrics.cls || performance.details.cls,
      fcp: lighthouseResults.performance.metrics.fcp || 'N/A',
      si: lighthouseResults.performance.metrics.si || 'N/A',
      tti: lighthouseResults.performance.metrics.tti || 'N/A',
      coreWebVitals: {
        lcp: lighthouseResults.performance.metrics.lcp || performance.details.lcp,
        fid: lighthouseResults.performance.metrics.fid || performance.details.fid,
        cls: lighthouseResults.performance.metrics.cls || performance.details.cls,
        passing: performance.details.coreWebVitalsPass >= 2
      },
      resources: {
        scripts: crawlResults.pages[0]?.performance.scriptsCount || 0,
        stylesheets: crawlResults.pages[0]?.performance.stylesheetsCount || 0,
        images: crawlResults.pages[0]?.performance.imagesCount || 0
      },
      optimization: {
        compression: crawlResults.pages[0]?.performance.compressionUsed || false,
        caching: crawlResults.pages[0]?.performance.cacheHeaders || false,
        lazyLoading: crawlResults.pages[0]?.performance.lazyLoadingImages || 0
      },
      opportunities: lighthouseResults.performance.opportunities || [],
      diagnostics: lighthouseResults.performance.diagnostics || [],
      issues: performance.issues || []
    },
    baseline2024: performance.baseline2024
  };
}

function generateSEOAnalysis(crawlResults, baselineEvaluation, lighthouseResults) {
  const seo = baselineEvaluation.seo;
  const mainPage = crawlResults.pages[0];
  
  return {
    score: Math.round((seo.score + lighthouseResults.seo.score) / 2),
    grade: getGrade(seo.score),
    details: {
      title: {
        present: !!mainPage?.title,
        length: mainPage?.title?.length || 0,
        optimal: seo.details.titleOptimal,
        text: mainPage?.title || 'Not found'
      },
      metaDescription: {
        present: seo.details.hasMetaDescription,
        length: seo.details.metaDescriptionLength,
        optimal: seo.details.metaDescriptionOptimal,
        text: mainPage?.metaDescription || 'Not found'
      },
      headings: {
        structure: analyzeHeadingStructure(mainPage?.headings || []),
        h1Count: seo.details.h1Count,
        optimal: seo.details.h1Optimal
      },
      images: {
        total: seo.details.imagesTotal,
        withoutAlt: seo.details.imagesWithoutAlt,
        altCoverage: `${seo.details.altTextCoverage}%`
      },
      technical: {
        viewport: seo.details.hasViewport,
        canonical: seo.details.hasCanonical,
        robots: seo.details.hasRobotsMeta
      },
      lighthouseIssues: lighthouseResults.seo.issues || [],
      lighthousePassed: lighthouseResults.seo.passed || [],
      issues: seo.issues || []
    },
    baseline2024: seo.baseline2024
  };
}

function generateAccessibilityAnalysis(crawlResults, baselineEvaluation, lighthouseResults) {
  const accessibility = baselineEvaluation.accessibility;
  
  return {
    score: Math.round((accessibility.score + lighthouseResults.accessibility.score) / 2),
    grade: getGrade(accessibility.score),
    details: {
      altText: {
        coverage: accessibility.details.altTextCoverage,
        compliant: parseFloat(accessibility.details.altTextCoverage) >= 95
      },
      forms: {
        labelCoverage: accessibility.details.inputLabels,
        compliant: parseFloat(accessibility.details.inputLabels) >= 95
      },
      navigation: {
        skipLinks: accessibility.details.hasSkipLinks,
        landmarks: accessibility.details.hasLandmarks,
        focusableElements: accessibility.details.focusableElements
      },
      buttons: {
        accessibility: accessibility.details.buttonAccessibility,
        compliant: parseFloat(accessibility.details.buttonAccessibility) >= 90
      },
      colorContrast: {
        issues: accessibility.details.colorContrastIssues,
        status: accessibility.details.colorContrastIssues === 0 ? 'Good' : 'Needs Review'
      },
      lighthouseIssues: lighthouseResults.accessibility.issues || [],
      lighthousePassed: lighthouseResults.accessibility.passed || [],
      issues: accessibility.issues || []
    },
    baseline2024: accessibility.baseline2024
  };
}

function generateSecurityAnalysis(crawlResults, baselineEvaluation, lighthouseResults) {
  const security = baselineEvaluation.security;
  
  return {
    score: Math.round((security.score + lighthouseResults.bestPractices.score) / 2),
    grade: getGrade(security.score),
    details: {
      https: {
        enabled: security.details.httpsUsed,
        mixedContent: security.details.mixedContent
      },
      headers: {
        hsts: security.details.securityHeaders.hsts,
        csp: security.details.securityHeaders.csp,
        xFrameOptions: security.details.securityHeaders.xFrameOptions,
        xContentTypeOptions: security.details.securityHeaders.xContentTypeOptions
      },
      forms: {
        total: security.details.totalForms,
        secure: security.details.formsWithHttps,
        compliance: security.details.totalForms === 0 || security.details.formsWithHttps === security.details.totalForms
      },
      lighthouseIssues: lighthouseResults.bestPractices.issues || [],
      lighthousePassed: lighthouseResults.bestPractices.passed || [],
      issues: security.issues || []
    },
    baseline2024: security.baseline2024
  };
}

function generateTechnicalDetails(crawlResults) {
  const mainPage = crawlResults.pages[0];
  if (!mainPage) return {};

  return {
    pagesCrawled: crawlResults.pages.length,
    totalLinks: mainPage.links.length,
    internalLinks: mainPage.links.filter(link => !link.isExternal).length,
    externalLinks: mainPage.links.filter(link => link.isExternal).length,
    technologies: {
      scripts: mainPage.scripts.length,
      stylesheets: mainPage.stylesheets.length,
      images: mainPage.images.length
    },
    errors: crawlResults.errors
  };
}

function analyzeHeadingStructure(headings) {
  const structure = {};
  headings.forEach(heading => {
    structure[`h${heading.level}`] = (structure[`h${heading.level}`] || 0) + 1;
  });
  return structure;
}

function generateFallbackAnalysis(url, isAccessible, responseTime) {
  const baseScore = isAccessible ? 70 : 30;
  const performanceScore = responseTime < 2000 ? 80 : responseTime < 4000 ? 60 : 40;
  
  return {
    url,
    timestamp: new Date().toISOString(),
    performance: {
      score: performanceScore,
      grade: getGrade(performanceScore),
      details: {
        loadTime: `${responseTime}ms`,
        accessible: isAccessible,
        issues: isAccessible ? [] : ['Website not accessible']
      }
    },
    seo: {
      score: baseScore,
      grade: getGrade(baseScore),
      details: {
        issues: ['Limited analysis - website crawling failed']
      }
    },
    accessibility: {
      score: baseScore,
      grade: getGrade(baseScore),
      details: {
        issues: ['Limited analysis - website crawling failed']
      }
    },
    security: {
      score: url.startsWith('https://') ? 70 : 30,
      grade: getGrade(url.startsWith('https://') ? 70 : 30),
      details: {
        https: url.startsWith('https://'),
        issues: url.startsWith('https://') ? [] : ['HTTPS not enabled']
      }
    },
    overall: {
      score: Math.round((performanceScore + baseScore + baseScore + (url.startsWith('https://') ? 70 : 30)) / 4),
      grade: getGrade(Math.round((performanceScore + baseScore + baseScore + (url.startsWith('https://') ? 70 : 30)) / 4)),
      compliance: 'limited'
    },
    recommendations: [
      {
        priority: 'high',
        category: 'Analysis',
        title: 'Website Analysis Limited',
        description: 'Full analysis could not be performed. Please check website accessibility.',
        impact: 'Limited insights available'
      }
    ]
  };
}

function getGrade(score) {
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