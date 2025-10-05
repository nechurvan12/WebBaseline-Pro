import fs from 'fs';
import path from 'path';

export class ReportService {
  constructor() {
    this.reportTypes = ['detailed', 'executive', 'compliance', 'comparison'];
  }

  generateReport(analysisData, type = 'detailed', format = 'json') {
    console.log(`📊 Generating ${type} report in ${format} format`);

    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        type,
        format,
        version: '1.0.0'
      },
      ...this.generateReportContent(analysisData, type)
    };

    switch (format) {
      case 'json':
        return this.generateJSONReport(report);
      case 'html':
        return this.generateHTMLReport(report);
      case 'pdf':
        return this.generatePDFReport(report);
      default:
        return this.generateJSONReport(report);
    }
  }

  generateReportContent(analysisData, type) {
    switch (type) {
      case 'executive':
        return this.generateExecutiveReport(analysisData);
      case 'compliance':
        return this.generateComplianceReport(analysisData);
      case 'comparison':
        return this.generateComparisonReport(analysisData);
      default:
        return this.generateDetailedReport(analysisData);
    }
  }

  generateDetailedReport(data) {
    return {
      summary: {
        url: data.url,
        overallScore: data.overall?.score || 0,
        grade: data.overall?.grade || 'F',
        compliance: data.baseline?.overall?.compliance || 'poor',
        analyzedAt: data.timestamp
      },
      scores: {
        performance: data.performance?.score || 0,
        seo: data.seo?.score || 0,
        accessibility: data.accessibility?.score || 0,
        security: data.security?.score || 0,
        baseline2024: data.baseline?.baseline2024?.score || 0,
        baseline2025: data.baseline?.baseline2025?.score || 0
      },
      baseline: {
        compliance2024: data.baseline?.baseline2024 || {},
        compliance2025: data.baseline?.baseline2025 || {},
        supportedFeatures: data.baseline?.baseline2024?.supported || [],
        missingFeatures: data.baseline?.baseline2024?.missing || [],
        badge: this.generateComplianceBadge(data.baseline?.baseline2024?.score || 0)
      },
      performance: {
        coreWebVitals: data.lighthouse?.performance?.metrics || {},
        opportunities: data.lighthouse?.performance?.opportunities || [],
        diagnostics: data.lighthouse?.performance?.diagnostics || []
      },
      accessibility: {
        issues: data.lighthouse?.accessibility?.issues || [],
        passed: data.lighthouse?.accessibility?.passed || [],
        wcagCompliance: this.assessWCAGCompliance(data.accessibility)
      },
      seo: {
        issues: data.lighthouse?.seo?.issues || [],
        passed: data.lighthouse?.seo?.passed || [],
        technicalSEO: data.seo?.details || {}
      },
      security: {
        https: data.security?.details?.https || {},
        headers: data.security?.details?.headers || {},
        vulnerabilities: data.security?.issues || []
      },
      recommendations: this.generatePrioritizedRecommendations(data),
      technicalDetails: {
        crawledPages: data.crawlResults?.pages?.length || 0,
        totalResources: this.countResources(data.crawlResults),
        errors: data.crawlResults?.errors || []
      }
    };
  }

  generateExecutiveReport(data) {
    return {
      executiveSummary: {
        websiteUrl: data.url,
        overallGrade: data.overall?.grade || 'F',
        complianceLevel: data.baseline?.overall?.compliance || 'poor',
        keyFindings: this.generateKeyFindings(data),
        businessImpact: this.assessBusinessImpact(data),
        recommendedActions: this.getTopRecommendations(data, 5)
      },
      performanceOverview: {
        score: data.performance?.score || 0,
        userExperienceImpact: this.assessUXImpact(data.performance),
        coreWebVitalsStatus: this.getCoreWebVitalsStatus(data.lighthouse?.performance?.metrics)
      },
      complianceOverview: {
        baseline2024Score: data.baseline?.baseline2024?.score || 0,
        modernWebStandards: data.baseline?.baseline2024?.supported?.length || 0,
        missingFeatures: data.baseline?.baseline2024?.missing?.length || 0,
        competitiveAdvantage: this.assessCompetitiveAdvantage(data.baseline)
      },
      riskAssessment: {
        securityRisks: this.assessSecurityRisks(data.security),
        accessibilityRisks: this.assessAccessibilityRisks(data.accessibility),
        seoRisks: this.assessSEORisks(data.seo)
      }
    };
  }

  generateComplianceReport(data) {
    return {
      complianceCertificate: {
        websiteUrl: data.url,
        certificationLevel: this.getCertificationLevel(data.baseline?.baseline2024?.score || 0),
        issuedDate: new Date().toISOString(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        badge: this.generateComplianceBadge(data.baseline?.baseline2024?.score || 0)
      },
      baselineCompliance: {
        baseline2024: {
          score: data.baseline?.baseline2024?.score || 0,
          totalFeatures: (data.baseline?.baseline2024?.supported?.length || 0) + (data.baseline?.baseline2024?.missing?.length || 0),
          supportedFeatures: data.baseline?.baseline2024?.supported || [],
          missingFeatures: data.baseline?.baseline2024?.missing || []
        },
        baseline2025: {
          score: data.baseline?.baseline2025?.score || 0,
          totalFeatures: (data.baseline?.baseline2025?.supported?.length || 0) + (data.baseline?.baseline2025?.missing?.length || 0),
          supportedFeatures: data.baseline?.baseline2025?.supported || [],
          missingFeatures: data.baseline?.baseline2025?.missing || []
        }
      },
      categoryCompliance: {
        css: this.getCategoryCompliance(data.baseline, 'css'),
        javascript: this.getCategoryCompliance(data.baseline, 'javascript'),
        html: this.getCategoryCompliance(data.baseline, 'html'),
        webapi: this.getCategoryCompliance(data.baseline, 'webapi'),
        security: this.getCategoryCompliance(data.baseline, 'security')
      },
      complianceGaps: this.identifyComplianceGaps(data.baseline),
      improvementPlan: this.generateImprovementPlan(data.baseline)
    };
  }

  generateComparisonReport(websites) {
    if (!Array.isArray(websites) || websites.length < 2) {
      throw new Error('Comparison report requires at least 2 websites');
    }

    return {
      comparisonSummary: {
        websitesCompared: websites.length,
        comparedAt: new Date().toISOString(),
        bestPerforming: this.findBestPerforming(websites),
        averageScores: this.calculateAverageScores(websites)
      },
      scoreComparison: {
        overall: websites.map(w => ({ url: w.url, score: w.overall?.score || 0 })),
        performance: websites.map(w => ({ url: w.url, score: w.performance?.score || 0 })),
        seo: websites.map(w => ({ url: w.url, score: w.seo?.score || 0 })),
        accessibility: websites.map(w => ({ url: w.url, score: w.accessibility?.score || 0 })),
        security: websites.map(w => ({ url: w.url, score: w.security?.score || 0 })),
        baseline2024: websites.map(w => ({ url: w.url, score: w.baseline?.baseline2024?.score || 0 }))
      },
      featureComparison: this.compareFeatures(websites),
      recommendations: this.generateComparisonRecommendations(websites)
    };
  }

  generateJSONReport(report) {
    return {
      format: 'json',
      content: JSON.stringify(report, null, 2),
      filename: `baseline-report-${Date.now()}.json`
    };
  }

  generateHTMLReport(report) {
    const html = this.createHTMLTemplate(report);
    return {
      format: 'html',
      content: html,
      filename: `baseline-report-${Date.now()}.html`
    };
  }

  generatePDFReport(report) {
    // PDF generation would require additional libraries like puppeteer or jsPDF
    // For now, return HTML that can be converted to PDF
    return {
      format: 'pdf',
      content: this.createPDFTemplate(report),
      filename: `baseline-report-${Date.now()}.pdf`
    };
  }

  createHTMLTemplate(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baseline Analysis Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .score-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .score-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; }
        .score { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .grade-a { color: #10b981; }
        .grade-b { color: #f59e0b; }
        .grade-c { color: #ef4444; }
        .section { margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
        .badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin: 5px; }
        .badge-platinum { background: #e5e4e2; color: #333; }
        .badge-gold { background: #ffd700; color: #333; }
        .badge-silver { background: #c0c0c0; color: #333; }
        .badge-bronze { background: #cd7f32; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Baseline Analysis Report</h1>
        <p>Website: ${report.summary?.url || 'N/A'}</p>
        <p>Generated: ${new Date(report.metadata.generatedAt).toLocaleString()}</p>
    </div>
    
    <div class="score-grid">
        <div class="score-card">
            <h3>Overall Score</h3>
            <div class="score grade-${this.getGradeClass(report.summary?.grade)}">${report.summary?.overallScore || 0}</div>
            <p>Grade: ${report.summary?.grade || 'F'}</p>
        </div>
        <div class="score-card">
            <h3>Performance</h3>
            <div class="score">${report.scores?.performance || 0}</div>
        </div>
        <div class="score-card">
            <h3>SEO</h3>
            <div class="score">${report.scores?.seo || 0}</div>
        </div>
        <div class="score-card">
            <h3>Accessibility</h3>
            <div class="score">${report.scores?.accessibility || 0}</div>
        </div>
        <div class="score-card">
            <h3>Security</h3>
            <div class="score">${report.scores?.security || 0}</div>
        </div>
        <div class="score-card">
            <h3>Baseline 2024</h3>
            <div class="score">${report.scores?.baseline2024 || 0}</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Compliance Badge</h2>
        <div class="badge badge-${report.baseline?.badge?.level || 'none'}">
            ${report.baseline?.badge?.label || 'Not Certified'}
        </div>
    </div>
    
    <div class="section">
        <h2>Key Recommendations</h2>
        <ul>
            ${(report.recommendations || []).slice(0, 5).map(rec => 
                `<li><strong>${rec.title}</strong>: ${rec.description}</li>`
            ).join('')}
        </ul>
    </div>
</body>
</html>`;
  }

  createPDFTemplate(report) {
    // Simplified PDF template - would need proper PDF generation library
    return this.createHTMLTemplate(report);
  }

  // Helper methods
  generateKeyFindings(data) {
    const findings = [];
    
    if (data.overall?.score >= 90) {
      findings.push('Excellent overall performance with high compliance scores');
    } else if (data.overall?.score >= 70) {
      findings.push('Good performance with room for improvement');
    } else {
      findings.push('Significant improvements needed across multiple areas');
    }

    if (data.baseline?.baseline2024?.score >= 80) {
      findings.push('Strong adoption of modern web standards');
    } else {
      findings.push('Missing critical modern web features');
    }

    return findings;
  }

  assessBusinessImpact(data) {
    const impact = [];
    
    if (data.performance?.score < 70) {
      impact.push('Poor performance may lead to increased bounce rates');
    }
    
    if (data.seo?.score < 70) {
      impact.push('SEO issues may reduce search engine visibility');
    }
    
    if (data.accessibility?.score < 70) {
      impact.push('Accessibility issues may exclude users and create legal risks');
    }

    return impact;
  }

  getTopRecommendations(data, count = 5) {
    return (data.recommendations || [])
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, count);
  }

  generateComplianceBadge(score) {
    if (score >= 95) return { level: 'platinum', color: '#E5E4E2', label: 'Platinum Certified' };
    if (score >= 85) return { level: 'gold', color: '#FFD700', label: 'Gold Certified' };
    if (score >= 75) return { level: 'silver', color: '#C0C0C0', label: 'Silver Certified' };
    if (score >= 65) return { level: 'bronze', color: '#CD7F32', label: 'Bronze Certified' };
    return { level: 'none', color: '#666666', label: 'Not Certified' };
  }

  getCertificationLevel(score) {
    const badge = this.generateComplianceBadge(score);
    return badge.label;
  }

  getGradeClass(grade) {
    if (['A+', 'A', 'A-'].includes(grade)) return 'a';
    if (['B+', 'B', 'B-'].includes(grade)) return 'b';
    return 'c';
  }

  // Additional helper methods would be implemented here...
  assessUXImpact(performance) {
    if (!performance) return 'Unknown';
    if (performance.score >= 90) return 'Excellent user experience';
    if (performance.score >= 70) return 'Good user experience';
    return 'Poor user experience - users likely to abandon';
  }

  getCoreWebVitalsStatus(metrics) {
    if (!metrics) return 'Unknown';
    return 'Needs assessment with real user data';
  }

  assessCompetitiveAdvantage(baseline) {
    if (!baseline) return 'Unknown';
    const score = baseline.baseline2024?.score || 0;
    if (score >= 90) return 'Strong competitive advantage';
    if (score >= 70) return 'Moderate competitive advantage';
    return 'Competitive disadvantage';
  }

  assessSecurityRisks(security) {
    if (!security) return ['Unknown security posture'];
    const risks = [];
    if (security.score < 70) risks.push('High security risk');
    if (!security.details?.https?.enabled) risks.push('No HTTPS encryption');
    return risks.length > 0 ? risks : ['Low security risk'];
  }

  assessAccessibilityRisks(accessibility) {
    if (!accessibility) return ['Unknown accessibility status'];
    const risks = [];
    if (accessibility.score < 70) risks.push('High accessibility risk');
    return risks.length > 0 ? risks : ['Low accessibility risk'];
  }

  assessSEORisks(seo) {
    if (!seo) return ['Unknown SEO status'];
    const risks = [];
    if (seo.score < 70) risks.push('Poor search visibility');
    return risks.length > 0 ? risks : ['Good SEO foundation'];
  }

  getCategoryCompliance(baseline, category) {
    if (!baseline?.categories?.[category]) return { score: 0, supported: 0, missing: 0 };
    
    const categoryData = baseline.categories[category];
    const total = categoryData.supported.length + categoryData.missing.length;
    const score = total > 0 ? Math.round((categoryData.supported.length / total) * 100) : 0;
    
    return {
      score,
      supported: categoryData.supported.length,
      missing: categoryData.missing.length,
      total
    };
  }

  identifyComplianceGaps(baseline) {
    const gaps = [];
    if (!baseline) return gaps;

    Object.entries(baseline.categories || {}).forEach(([category, data]) => {
      if (data.missing.length > 0) {
        gaps.push({
          category,
          missingCount: data.missing.length,
          criticalFeatures: data.missing.filter(f => f.impact === 'high').slice(0, 3)
        });
      }
    });

    return gaps.sort((a, b) => b.missingCount - a.missingCount);
  }

  generateImprovementPlan(baseline) {
    const plan = [];
    if (!baseline) return plan;

    // High priority improvements
    const highPriorityFeatures = [];
    Object.values(baseline.categories || {}).forEach(category => {
      category.missing.forEach(feature => {
        if (feature.impact === 'high') {
          highPriorityFeatures.push(feature);
        }
      });
    });

    if (highPriorityFeatures.length > 0) {
      plan.push({
        phase: 'Immediate (0-30 days)',
        priority: 'High',
        features: highPriorityFeatures.slice(0, 5),
        description: 'Critical features that should be implemented immediately'
      });
    }

    return plan;
  }

  findBestPerforming(websites) {
    return websites.reduce((best, current) => {
      const bestScore = best.overall?.score || 0;
      const currentScore = current.overall?.score || 0;
      return currentScore > bestScore ? current : best;
    });
  }

  calculateAverageScores(websites) {
    const totals = websites.reduce((acc, website) => {
      acc.overall += website.overall?.score || 0;
      acc.performance += website.performance?.score || 0;
      acc.seo += website.seo?.score || 0;
      acc.accessibility += website.accessibility?.score || 0;
      acc.security += website.security?.score || 0;
      acc.baseline2024 += website.baseline?.baseline2024?.score || 0;
      return acc;
    }, { overall: 0, performance: 0, seo: 0, accessibility: 0, security: 0, baseline2024: 0 });

    const count = websites.length;
    return {
      overall: Math.round(totals.overall / count),
      performance: Math.round(totals.performance / count),
      seo: Math.round(totals.seo / count),
      accessibility: Math.round(totals.accessibility / count),
      security: Math.round(totals.security / count),
      baseline2024: Math.round(totals.baseline2024 / count)
    };
  }

  compareFeatures(websites) {
    const allFeatures = new Set();
    websites.forEach(website => {
      website.baseline?.baseline2024?.supported?.forEach(feature => allFeatures.add(feature.id));
      website.baseline?.baseline2024?.missing?.forEach(feature => allFeatures.add(feature.id));
    });

    const comparison = {};
    allFeatures.forEach(featureId => {
      comparison[featureId] = websites.map(website => {
        const supported = website.baseline?.baseline2024?.supported?.find(f => f.id === featureId);
        const missing = website.baseline?.baseline2024?.missing?.find(f => f.id === featureId);
        return {
          url: website.url,
          supported: !!supported,
          feature: supported || missing
        };
      });
    });

    return comparison;
  }

  generateComparisonRecommendations(websites) {
    const recommendations = [];
    
    // Find common weaknesses
    const commonIssues = this.findCommonIssues(websites);
    commonIssues.forEach(issue => {
      recommendations.push({
        type: 'common',
        priority: 'high',
        title: `Address Common Issue: ${issue.category}`,
        description: `All websites show weakness in ${issue.category}`,
        affectedSites: issue.sites
      });
    });

    return recommendations;
  }

  findCommonIssues(websites) {
    const issues = [];
    const categories = ['performance', 'seo', 'accessibility', 'security'];
    
    categories.forEach(category => {
      const lowScoringSites = websites.filter(site => (site[category]?.score || 0) < 70);
      if (lowScoringSites.length >= websites.length * 0.5) { // 50% or more
        issues.push({
          category,
          sites: lowScoringSites.map(site => site.url),
          averageScore: Math.round(lowScoringSites.reduce((sum, site) => sum + (site[category]?.score || 0), 0) / lowScoringSites.length)
        });
      }
    });

    return issues;
  }

  generatePrioritizedRecommendations(data) {
    const recommendations = [];

    // High priority recommendations
    if (data.security?.score < 70) {
      recommendations.push({
        priority: 'high',
        category: 'Security',
        title: 'Implement HTTPS and Security Headers',
        description: 'Critical security improvements needed for user trust and compliance',
        impact: 'High - affects user trust and search rankings',
        effort: 'Medium',
        timeline: '1-2 weeks'
      });
    }

    if (data.performance?.score < 70) {
      recommendations.push({
        priority: 'high',
        category: 'Performance',
        title: 'Optimize Core Web Vitals',
        description: 'Improve loading speed and user experience metrics',
        impact: 'High - directly affects user experience and SEO',
        effort: 'High',
        timeline: '2-4 weeks'
      });
    }

    // Medium priority recommendations
    if (data.accessibility?.score < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'Accessibility',
        title: 'Improve Accessibility Compliance',
        description: 'Add missing alt text, labels, and semantic HTML',
        impact: 'Medium - improves user experience for all users',
        effort: 'Medium',
        timeline: '1-3 weeks'
      });
    }

    if (data.seo?.score < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'SEO',
        title: 'Optimize SEO Elements',
        description: 'Improve title tags, meta descriptions, and content structure',
        impact: 'Medium - improves search visibility',
        effort: 'Low',
        timeline: '1 week'
      });
    }

    // Low priority recommendations
    if (data.baseline?.baseline2024?.score < 85) {
      recommendations.push({
        priority: 'low',
        category: 'Modern Web',
        title: 'Adopt Modern Web Standards',
        description: 'Implement missing Baseline 2024 features',
        impact: 'Low - future-proofs the website',
        effort: 'High',
        timeline: '4-8 weeks'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  countResources(crawlResults) {
    if (!crawlResults?.pages) return 0;
    
    return crawlResults.pages.reduce((total, page) => {
      return total + 
        (page.scripts?.length || 0) + 
        (page.stylesheets?.length || 0) + 
        (page.images?.length || 0) + 
        (page.links?.length || 0);
    }, 0);
  }

  assessWCAGCompliance(accessibility) {
    if (!accessibility) return 'Unknown';
    
    const score = accessibility.score || 0;
    if (score >= 95) return 'WCAG 2.1 AA Compliant';
    if (score >= 80) return 'Mostly WCAG 2.1 AA Compliant';
    if (score >= 60) return 'Partially WCAG 2.1 AA Compliant';
    return 'Not WCAG 2.1 AA Compliant';
  }
}