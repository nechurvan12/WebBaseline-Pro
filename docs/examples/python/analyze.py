"""
WebBaseline Pro API - Python Analysis Example

This example demonstrates how to analyze a website using the WebBaseline Pro API.

Usage:
1. Set your API key in the WEBBASELINE_API_KEY environment variable
2. Run: python analyze.py

Requirements:
- Python 3.6+
- requests library (pip install requests)
"""

import os
import sys
import json
import requests
from datetime import datetime

# Configuration
API_KEY = os.environ.get('WEBBASELINE_API_KEY', 'YOUR_API_KEY_HERE')
BASE_URL = 'https://api.webbaseline.pro'
API_VERSION = 'v1'

def analyze_website(url):
    """
    Analyze a website using the WebBaseline Pro API
    
    Args:
        url (str): The URL to analyze
        
    Returns:
        dict: Analysis results
        
    Raises:
        Exception: If the API request fails
    """
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'url': url,
        'options': {
            'performance': True,
            'seo': True,
            'accessibility': True,
            'security': True,
            'baseline': True
        }
    }
    
    try:
        response = requests.post(
            f'{BASE_URL}/{API_VERSION}/analyze',
            headers=headers,
            json=data,
            timeout=60
        )
        
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.RequestException as e:
        raise Exception(f'API request failed: {str(e)}')

def display_results(analysis):
    """
    Format and display analysis results
    
    Args:
        analysis (dict): Analysis results from the API
    """
    print('=' * 50)
    print('WEBBASELINE PRO ANALYSIS RESULTS')
    print('=' * 50)
    
    print(f'\n🌐 Website: {analysis["url"]}')
    print(f'📅 Date: {datetime.fromisoformat(analysis["timestamp"].replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M:%S")}')
    print(f'⭐ Overall Score: {analysis["overallScore"]}/100 ({analysis["grade"]})')
    
    print('\n📊 Category Scores:')
    print(f'  Performance: {analysis["performance"]["score"]}/100')
    print(f'  SEO: {analysis["seo"]["score"]}/100')
    print(f'  Accessibility: {analysis["accessibility"]["score"]}/100')
    print(f'  Security: {analysis["security"]["score"]}/100')
    print(f'  Baseline Compliance: {analysis["baseline"]["score"]}/100')
    
    if 'compliance' in analysis['baseline']:
        print(f'\n🏆 Baseline Certification: {analysis["baseline"]["compliance"].upper()}')
    
    print('\n⚡ Performance Metrics:')
    if 'metrics' in analysis['performance']:
        metrics = analysis['performance']['metrics']
        print(f'  LCP: {metrics["lcp"]}ms')
        print(f'  FID: {metrics["fid"]}ms')
        print(f'  CLS: {metrics["cls"]}')
    
    print('\n💡 Key Recommendations:')
    if 'recommendations' in analysis and analysis['recommendations']:
        recommendations = analysis['recommendations'][:3]
        for i, rec in enumerate(recommendations, 1):
            print(f'  {i}. [{rec["priority"].upper()}] {rec["title"]}')
        
        if len(analysis['recommendations']) > 3:
            print(f'  ... and {len(analysis["recommendations"]) - 3} more recommendations')
    else:
        print('  No recommendations at this time. Great job!')
    
    print('\n' + '=' * 50)

def main():
    """Main function"""
    try:
        # Check if API key is set
        if API_KEY == 'YOUR_API_KEY_HERE':
            print('⚠️  Please set your WEBBASELINE_API_KEY environment variable')
            print('   export WEBBASELINE_API_KEY=your_actual_api_key')
            return
        
        # Get URL from command line or use default
        website_url = sys.argv[1] if len(sys.argv) > 1 else 'https://example.com'
        print(f'🔍 Analyzing {website_url}...')
        
        # Perform analysis
        analysis = analyze_website(website_url)
        
        # Check for API errors
        if 'error' in analysis:
            print(f'❌ Analysis failed: {analysis["error"]["message"]}')
            sys.exit(1)
        
        # Display results
        display_results(analysis)
        
        print('\n✅ Analysis completed successfully!')
        print(f'🔗 View full report at: https://webbaseline.pro/analysis/{analysis["id"]}')
        
    except Exception as e:
        print(f'❌ Error: {str(e)}')
        sys.exit(1)

if __name__ == '__main__':
    main()