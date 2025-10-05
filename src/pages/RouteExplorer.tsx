import React, { useState } from 'react';
import { discoverRoutes } from '../lib/api';
import { 
  Globe, 
  Search, 
  ExternalLink, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Route,
  Server
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RouteInfo {
  route: string;
  method: string;
  status_code: number;
  response_time: number;
  security_headers: Record<string, string>;
  content_type: string;
  accessible: boolean;
  error?: string;
}

interface RouteAnalysis {
  totalRoutes: number;
  accessibleRoutes: number;
  secureRoutes: number;
  averageResponseTime: number;
  statusCodes: Record<string, number>;
  securityIssues: Array<{
    route: string;
    issue: string;
    severity: string;
  }>;
}

const RouteExplorer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [analysis, setAnalysis] = useState<RouteAnalysis | null>(null);
  const [summary, setSummary] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || loading) return;

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    setRoutes([]);
    setAnalysis(null);
    setSummary(null);

    try {
      const response = await discoverRoutes(url);
      setRoutes(response.routes);
      setAnalysis(response.analysis);
      setSummary(response.summary);
      toast.success(`Discovered ${response.routes.length} routes!`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to discover routes');
      console.error('Route discovery error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600 bg-green-50';
    if (statusCode >= 300 && statusCode < 400) return 'text-yellow-600 bg-yellow-50';
    if (statusCode >= 400 && statusCode < 500) return 'text-orange-600 bg-orange-50';
    if (statusCode >= 500) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
          <Route className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Route Explorer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover and analyze website routes, endpoints, and security configurations
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Enter the website URL to discover its routes and endpoints
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !url}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {loading ? (
              <>
                <Search className="animate-spin h-5 w-5 mr-2" />
                Discovering Routes...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Discover Routes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovering Routes</h3>
            <p className="text-gray-600">
              Scanning website for routes, endpoints, and security configurations...
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalRoutes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accessible</p>
                <p className="text-2xl font-bold text-gray-900">{summary.accessibleRoutes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Secure</p>
                <p className="text-2xl font-bold text-gray-900">{summary.secureRoutes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Route Analysis */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Discovered Routes</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Route</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Response Time</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Security</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="font-mono text-sm">{route.route}</span>
                            {route.accessible && (
                              <ExternalLink className="h-4 w-4 text-gray-400 ml-2" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {route.method} • {route.content_type}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(route.status_code)}`}>
                            {route.status_code}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="text-sm font-medium">
                            {route.response_time}ms
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center">
                            {Object.keys(route.security_headers).length > 0 ? (
                              <Shield className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="ml-1 text-xs">
                              {Object.keys(route.security_headers).length}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Security Issues */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Analysis</h3>
            
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Response Time</span>
                  <span className="font-medium">{Math.round(analysis.averageResponseTime)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accessible Routes</span>
                  <span className="font-medium">{analysis.accessibleRoutes}/{analysis.totalRoutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Secure Routes</span>
                  <span className="font-medium">{analysis.secureRoutes}/{analysis.totalRoutes}</span>
                </div>
              </div>
            </div>

            {/* Status Codes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Status Codes</h4>
              <div className="space-y-2">
                {Object.entries(analysis.statusCodes).map(([code, count]) => (
                  <div key={code} className="flex justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(parseInt(code))}`}>
                      {code}
                    </span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Issues */}
            {analysis.securityIssues.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-medium text-gray-900 mb-3">Security Issues</h4>
                <div className="space-y-3">
                  {analysis.securityIssues.map((issue, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                      <div className="font-medium text-sm">{issue.route}</div>
                      <div className="text-xs mt-1">{issue.issue}</div>
                      <div className="text-xs mt-1 capitalize">Severity: {issue.severity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {routes.length === 0 && !loading && url && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No routes discovered</h3>
          <p className="text-gray-600">
            Try a different URL or check if the website is accessible.
          </p>
        </div>
      )}

      {/* Features */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Explorer Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Search className="h-5 w-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Automatic Discovery</h4>
              <p className="text-sm text-gray-600">Finds common routes and API endpoints</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Security Analysis</h4>
              <p className="text-sm text-gray-600">Checks security headers and configurations</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Performance Metrics</h4>
              <p className="text-sm text-gray-600">Measures response times for each route</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Route className="h-5 w-5 text-orange-600 mt-1" />
            <div>
              <h4 className="font-medium text-gray-900">Route Mapping</h4>
              <p className="text-sm text-gray-600">Maps website structure and endpoints</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteExplorer;