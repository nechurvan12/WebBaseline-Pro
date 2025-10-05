import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyzeWebsite, bulkAnalyzeWebsites } from '../lib/api';
import { Globe, Loader, CheckCircle, AlertCircle, Plus, Minus, Zap } from 'lucide-react';
import ScoreCard from '../components/ScoreCard';
import { Search, Users, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import ComplianceBadge from '../components/ComplianceBadge';
import FeatureSupport from '../components/FeatureSupport';


const Analyze: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [bulkResults, setBulkResults] = useState<any>(null);

  const addUrlField = () => {
    if (urls.length < 10) {
      setUrls([...urls, '']);
    }
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !user) return;

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    setResult(null);
    setBulkResults(null);

    try {
      const response = await analyzeWebsite(url, user.id);
      setResult(response);
      toast.success('Website analyzed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to analyze website');
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const validUrls = urls.filter(u => u.trim()).map(u => u.trim());
    if (validUrls.length === 0) {
      toast.error('Please enter at least one valid URL');
      return;
    }

    // Validate URLs
    const urlPattern = /^https?:\/\/.+/;
    const invalidUrls = validUrls.filter(u => !urlPattern.test(u));
    if (invalidUrls.length > 0) {
      toast.error('All URLs must start with http:// or https://');
      return;
    }

    setLoading(true);
    setResult(null);
    setBulkResults(null);

    try {
      const response = await bulkAnalyzeWebsites(validUrls, user.id);
      setBulkResults(response);
      toast.success(`Analyzed ${response.summary.successful}/${response.summary.total} websites successfully!`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to analyze websites');
      console.error('Bulk analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Globe className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyze Website</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get comprehensive analysis with Google Baseline 2024 compliance checking, 
          Core Web Vitals, SEO, accessibility, and security assessment
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={() => setMode('single')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              mode === 'single'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Single Website
          </button>
          <button
            onClick={() => setMode('bulk')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              mode === 'bulk'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bulk Analysis (up to 10)
          </button>
        </div>
      </div>

      {/* Analysis Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        {mode === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the full URL including http:// or https://
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Analyzing Website...
                </>
              ) : (
                <>
                  <Globe className="h-5 w-5 mr-2" />
                  Analyze Website
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URLs (up to 10)
              </label>
              {urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder={`https://example${index + 1}.com`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {urls.length < 10 && (
                <button
                  type="button"
                  onClick={addUrlField}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add URL
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || urls.filter(u => u.trim()).length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Analyzing Websites...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Analyze All Websites
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Website</h3>
            <p className="text-gray-600">
              Running comprehensive analysis with Google Baseline 2024 compliance checking...
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Checking website accessibility
              </div>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Loader className="animate-spin h-4 w-4 text-blue-500 mr-2" />
                Analyzing performance metrics
              </div>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Loader className="animate-spin h-4 w-4 text-blue-500 mr-2" />
                Scanning SEO elements
              </div>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Loader className="animate-spin h-4 w-4 text-blue-500 mr-2" />
                Evaluating Google Baseline compliance
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Analysis Results */}
      {result && (
        <div className="space-y-8">
          {/* Overall Score */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Overall Health Score</h2>
            <div className="text-sm text-gray-600 mb-4">
              Google Baseline 2024: {result.analysis.baseline?.overall?.compliance || 'N/A'}
            </div>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.analysis.overall.score)}`}>
              {result.analysis.overall.score}
            </div>
            <p className="text-gray-600">out of 100</p>
            <div className="text-lg font-semibold text-gray-700 mt-2">
              Grade: {result.analysis.overall.grade}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4 max-w-md mx-auto">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  result.analysis.overall.score >= 80 ? 'bg-green-500' : 
                  result.analysis.overall.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.analysis.overall.score}%` }}
              />
            </div>
          </div>

          {/* Google Baseline Compliance */}
          {result.analysis.baseline && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-6 w-6 text-blue-600 mr-2" />
                Google Baseline 2024 Compliance
              </h2>
              
              {/* Compliance Badge */}
              <div className="mb-6 flex justify-center">
                <ComplianceBadge 
                  score={result.analysis.baseline?.baseline2024?.score || 0} 
                  size="lg"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    result.analysis.baseline.performance?.baseline2024 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.analysis.baseline.performance?.baseline2024 ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    result.analysis.baseline.seo?.baseline2024 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.analysis.baseline.seo?.baseline2024 ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">SEO</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    result.analysis.baseline.accessibility?.baseline2024 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.analysis.baseline.accessibility?.baseline2024 ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Accessibility</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    result.analysis.baseline.security?.baseline2024 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.analysis.baseline.security?.baseline2024 ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Security</div>
                </div>
              </div>
            </div>
          )}

          {/* Web Features Analysis */}
          {result.analysis.webFeatures && (
            <FeatureSupport
              features={[
                ...(result.analysis.webFeatures.baseline2024?.supported || []).map(f => ({
                  ...f,
                  supported: true
                })),
                ...(result.analysis.webFeatures.baseline2024?.missing || []).map(f => ({
                  ...f,
                  supported: false
                }))
              ]}
              title="Google Baseline 2024 Features"
              showCategories={true}
            />
          )}

          {/* Score Breakdown */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScoreCard
                title="Performance"
                score={result.analysis.performance?.score || 0}
                icon={<Zap className="h-6 w-6" />}
                color="bg-green-100"
              />
              <ScoreCard
                title="SEO"
                score={result.analysis.seo?.score || 0}
                icon={<Search className="h-6 w-6" />}
                color="bg-yellow-100"
              />
              <ScoreCard
                title="Accessibility"
                score={result.analysis.accessibility?.score || 0}
                icon={<Users className="h-6 w-6" />}
                color="bg-purple-100"
              />
              <ScoreCard
                title="Security"
                score={result.analysis.security?.score || 0}
                icon={<Shield className="h-6 w-6" />}
                color="bg-red-100"
              />
            </div>
          </div>

          {/* Recommendations */}
          {result.analysis.recommendations && result.analysis.recommendations.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
              <div className="space-y-4">
                {result.analysis.recommendations.map((rec: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                        <p className="text-gray-700 mt-1">{rec.description}</p>
                        <p className="text-sm text-gray-600 mt-2">{rec.impact}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lighthouse Performance Opportunities */}
          {result.analysis.lighthouse?.performance?.opportunities?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Opportunities</h3>
              <div className="space-y-4">
                {result.analysis.lighthouse.performance.opportunities.slice(0, 5).map((opportunity: any, index: number) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h4>
                        <p className="text-gray-700 text-sm mb-2">{opportunity.description}</p>
                        {opportunity.displayValue && (
                          <p className="text-blue-600 text-sm font-medium">
                            Potential savings: {opportunity.displayValue}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        opportunity.score >= 90 ? 'bg-green-100 text-green-800' :
                        opportunity.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Score: {opportunity.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Load Time</span>
                  <span className="font-medium">{result.analysis.performance?.details?.loadTime || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">LCP (Largest Contentful Paint)</span>
                  <span className="font-medium">{result.analysis.performance?.details?.lcp || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">FID (First Input Delay)</span>
                  <span className="font-medium">{result.analysis.performance?.details?.fid || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CLS (Cumulative Layout Shift)</span>
                  <span className="font-medium">{result.analysis.performance?.details?.cls || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">FCP (First Contentful Paint)</span>
                  <span className="font-medium">{result.analysis.performance?.details?.fcp || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Speed Index</span>
                  <span className="font-medium">{result.analysis.performance?.details?.si || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time to Interactive</span>
                  <span className="font-medium">{result.analysis.performance?.details?.tti || 'N/A'}</span>
                </div>
                {result.analysis.performance?.details?.issues?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Found</h4>
                    {result.analysis.performance.details.issues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-center text-sm text-red-600 mb-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SEO Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <Search className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">SEO</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title Tag</span>
                  <span className="font-medium">{result.analysis.seo?.details?.title?.present ? 'Present' : 'Missing'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meta Description</span>
                  <span className="font-medium">{result.analysis.seo?.details?.metaDescription?.present ? 'Present' : 'Missing'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">H1 Tags</span>
                  <span className="font-medium">{result.analysis.seo?.details?.headings?.h1Count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alt Text Coverage</span>
                  <span className="font-medium">{result.analysis.seo?.details?.images?.altCoverage || 'N/A'}</span>
                </div>
                {result.analysis.seo?.issues?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Found</h4>
                    {result.analysis.seo.issues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-center text-sm text-red-600 mb-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Accessibility Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Accessibility</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Alt Text Coverage</span>
                  <span className="font-medium">{result.analysis.accessibility?.details?.altText?.coverage || 'N/A'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Form Labels</span>
                  <span className="font-medium">{result.analysis.accessibility?.details?.forms?.labelCoverage || 'N/A'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Landmarks</span>
                  <span className="font-medium">{result.analysis.accessibility?.details?.navigation?.landmarks ? 'Present' : 'Missing'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skip Links</span>
                  <span className="font-medium">{result.analysis.accessibility?.details?.navigation?.skipLinks ? 'Present' : 'Missing'}</span>
                </div>
                {result.analysis.accessibility?.issues?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Found</h4>
                    {result.analysis.accessibility.issues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-center text-sm text-red-600 mb-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Security Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">HTTPS</span>
                  <span className="font-medium">{result.analysis.security?.details?.https?.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HSTS</span>
                  <span className="font-medium">{result.analysis.security?.details?.headers?.hsts ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CSP</span>
                  <span className="font-medium">{result.analysis.security?.details?.headers?.csp ? 'Present' : 'Missing'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mixed Content</span>
                  <span className="font-medium">{result.analysis.security?.details?.https?.mixedContent ? 'Detected' : 'None'}</span>
                </div>
                {result.analysis.security?.issues?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Found</h4>
                    {result.analysis.security.issues.map((issue: string, index: number) => (
                      <div key={index} className="flex items-center text-sm text-red-600 mb-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Complete!</h3>
              <p className="text-gray-600 mb-4">
                Your website has been analyzed with Google Baseline 2024 standards and saved to your dashboard.
              </p>
              
              {/* Show compliance badge */}
              {result.analysis.overall?.badge && (
                <div className="mb-4">
                  <ComplianceBadge 
                    score={result.analysis.overall.score} 
                    size="md"
                  />
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setUrl('');
                    setResult(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Analyze Another Website
                </button>
                <a
                  href="/dashboard"
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Dashboard
                </a>
              </div>
              
              {/* Report Generation Options */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Generate detailed reports:</p>
                <div className="flex justify-center space-x-2 text-sm">
                  <button className="text-blue-600 hover:text-blue-700">Executive Summary</button>
                  <span className="text-gray-400">•</span>
                  <button className="text-blue-600 hover:text-blue-700">Technical Report</button>
                  <span className="text-gray-400">•</span>
                  <button className="text-blue-600 hover:text-blue-700">Compliance Certificate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Analysis Results */}
      {bulkResults && (
        <div className="space-y-8">
          {/* Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Analysis Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{bulkResults.summary.total}</div>
                <div className="text-sm text-gray-600">Total Websites</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{bulkResults.summary.successful}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{bulkResults.summary.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </div>

          {/* Individual Results */}
          <div className="space-y-6">
            {bulkResults.results.map((result: any, index: number) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{result.url}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                </div>

                {result.success ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className={`text-xl font-bold ${getScoreColor(result.analysis.overall.score)}`}>
                        {result.analysis.overall.score}
                      </div>
                      <div className="text-xs text-gray-600">Overall</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {result.analysis.performance?.score || 0}
                      </div>
                      <div className="text-xs text-gray-600">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {result.analysis.seo?.score || 0}
                      </div>
                      <div className="text-xs text-gray-600">SEO</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {result.analysis.accessibility?.score || 0}
                      </div>
                      <div className="text-xs text-gray-600">Accessibility</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {result.analysis.security?.score || 0}
                      </div>
                      <div className="text-xs text-gray-600">Security</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600 text-sm">
                    Error: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Analysis Complete!</h3>
              <p className="text-gray-600 mb-4">
                All websites have been analyzed and results saved to your dashboard.
              </p>
              
              {/* Bulk Analysis Summary */}
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg font-bold text-green-600">{bulkResults.summary.successful}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg font-bold text-red-600">{bulkResults.summary.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round((bulkResults.summary.successful / bulkResults.summary.total) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setUrls(['']);
                    setBulkResults(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Analyze More Websites
                </button>
                <a
                  href="/dashboard"
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;