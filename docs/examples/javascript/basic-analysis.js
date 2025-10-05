/**
 * WebBaseline Pro API - Basic Analysis Example
 * 
 * This example demonstrates how to analyze a website using the WebBaseline Pro API.
 * 
 * Usage:
 * 1. Set your API key in the WEBBASELINE_API_KEY environment variable
 * 2. Run: node basic-analysis.js
 */

// Import required modules
const https = require('https');

// Configuration
const API_KEY = process.env.WEBBASELINE_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'api.webbaseline.pro';
const API_VERSION = 'v1';

/**
 * Analyze a website using the WebBaseline Pro API
 * @param {string} url - The URL to analyze
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeWebsite(url) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      url: url,
      options: {
        performance: true,
        seo: true,
        accessibility: true,
        security: true,
        baseline: true
      }
    });

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: `/${API_VERSION}/analyze`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Format and display analysis results
 * @param {Object} analysis - Analysis results from the API
 */
function displayResults(analysis) {
  console.log('='.repeat(50));
  console.log('WEBBASELINE PRO ANALYSIS RESULTS');
  console.log('='.repeat(50));
  
  console.log(`\n🌐 Website: ${analysis.url}`);
  console.log(`📅 Date: ${new Date(analysis.timestamp).toLocaleString()}`);
  console.log(`⭐ Overall Score: ${analysis.overallScore}/100 (${analysis.grade})`);
  
  console.log('\n📊 Category Scores:');
  console.log(`  Performance: ${analysis.performance.score}/100`);
  console.log(`  SEO: ${analysis.seo.score}/100`);
  console.log(`  Accessibility: ${analysis.accessibility.score}/100`);
  console.log(`  Security: ${analysis.security.score}/100`);
  console.log(`  Baseline Compliance: ${analysis.baseline.score}/100`);
  
  if (analysis.baseline.compliance) {
    console.log(`\n🏆 Baseline Certification: ${analysis.baseline.compliance.toUpperCase()}`);
  }
  
  console.log('\n⚡ Performance Metrics:');
  if (analysis.performance.metrics) {
    console.log(`  LCP: ${analysis.performance.metrics.lcp}ms`);
    console.log(`  FID: ${analysis.performance.metrics.fid}ms`);
    console.log(`  CLS: ${analysis.performance.metrics.cls}`);
  }
  
  console.log('\n💡 Key Recommendations:');
  if (analysis.recommendations && analysis.recommendations.length > 0) {
    analysis.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
    });
    
    if (analysis.recommendations.length > 3) {
      console.log(`  ... and ${analysis.recommendations.length - 3} more recommendations`);
    }
  } else {
    console.log('  No recommendations at this time. Great job!');
  }
  
  console.log('\n' + '='.repeat(50));
}

/**
 * Main function
 */
async function main() {
  try {
    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
      console.log('⚠️  Please set your WEBBASELINE_API_KEY environment variable');
      console.log('   export WEBBASELINE_API_KEY=your_actual_api_key');
      return;
    }
    
    const websiteUrl = process.argv[2] || 'https://example.com';
    console.log(`🔍 Analyzing ${websiteUrl}...`);
    
    const analysis = await analyzeWebsite(websiteUrl);
    
    if (analysis.error) {
      console.error('❌ Analysis failed:', analysis.error.message);
      process.exit(1);
    }
    
    displayResults(analysis);
    
    console.log('\n✅ Analysis completed successfully!');
    console.log(`🔗 View full report at: https://webbaseline.pro/analysis/${analysis.id}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the main function if this script is executed directly
if (require.main === module) {
  main();
}

// Export functions for use in other modules
module.exports = {
  analyzeWebsite,
  displayResults
};