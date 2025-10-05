import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWebsites } from '../lib/api';
import { Website } from '../lib/supabase';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  Image, 
  FileText, 
  Wifi,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Gauge
} from 'lucide-react';

const Performance: React.FC = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWebsites();
  }, [user]);

  const loadWebsites = async () => {
    if (!user) return;
    
    try {
      const data = await getUserWebsites(user.id);
      setWebsites(data.filter(w => w.latestAnalysis));
      if (data.length > 0) {
        setSelectedWebsite(data[0].id);
      }
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedSite = websites.find(w => w.id === selectedWebsite);
  const analysis = selectedSite?.latestAnalysis;

  const coreWebVitals = [
    {
      name: 'Largest Contentful Paint (LCP)',
      value: '2.1s',
      target: '< 2.5s',
      status: 'good',
      description: 'Measures loading performance',
      icon: Clock
    },
    {
      name: 'First Input Delay (FID)',
      value: '85ms',
      target: '< 100ms',
      status: 'good',
      description: 'Measures interactivity',
      icon: Zap
    },
    {
      name: 'Cumulative Layout Shift (CLS)',
      value: '0.08',
      target: '< 0.1',
      status: 'good',
      description: 'Measures visual stability',
      icon: Target
    }
  ];

  const performanceMetrics = [
    { name: 'First Contentful Paint', value: '1.2s', status: 'good' },
    { name: 'Speed Index', value: '2.8s', status: 'needs-improvement' },
    { name: 'Time to Interactive', value: '3.1s', status: 'needs-improvement' },
    { name: 'Total Blocking Time', value: '180ms', status: 'poor' }
  ];

  const opportunities = [
    {
      title: 'Eliminate render-blocking resources',
      description: 'Resources are blocking the first paint of your page',
      savings: '1.2s',
      priority: 'high'
    },
    {
      title: 'Properly size images',
      description: 'Serve images that are appropriately-sized',
      savings: '0.8s',
      priority: 'medium'
    },
    {
      title: 'Enable text compression',
      description: 'Text-based resources should be served with compression',
      savings: '0.5s',
      priority: 'medium'
    },
    {
      title: 'Remove unused CSS',
      description: 'Remove dead rules from stylesheets',
      savings: '0.3s',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Zap className="w-8 h-8 mr-3 text-yellow-500" />
          Performance Center
        </h1>
        <p className="text-gray-600">
          Analyze and optimize your website's performance with Core Web Vitals
        </p>
      </div>

      {websites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No performance data available</h3>
          <p className="text-gray-600 mb-6">Analyze some websites to see performance insights</p>
          <a
            href="/analyze"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Analyze Your First Website
          </a>
        </div>
      ) : (
        <>
          {/* Website Selector */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <label htmlFor="website-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Website
            </label>
            <select
              id="website-select"
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {websites.map((website) => (
                <option key={website.id} value={website.id}>
                  {website.title || website.url}
                </option>
              ))}
            </select>
          </div>

          {selectedSite && analysis && (
            <>
              {/* Performance Score */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 text-white mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Performance Score</h2>
                    <p className="text-yellow-100">
                      Overall performance rating for {selectedSite.title || selectedSite.url}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">{analysis.performance_score}</div>
                    <div className="text-yellow-100">out of 100</div>
                  </div>
                </div>
              </div>

              {/* Core Web Vitals */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Gauge className="w-6 h-6 mr-3 text-blue-600" />
                  Core Web Vitals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {coreWebVitals.map((vital, index) => {
                    const Icon = vital.icon;
                    return (
                      <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <Icon className="w-8 h-8 text-blue-600" />
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(vital.status)}`}>
                            {vital.status === 'good' ? 'Good' : vital.status === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{vital.name}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-gray-900">{vital.value}</span>
                          <span className="text-sm text-gray-600">{vital.target}</span>
                        </div>
                        <p className="text-sm text-gray-600">{vital.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    {performanceMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{metric.value}</span>
                          <span className={`w-3 h-3 rounded-full ${
                            metric.status === 'good' ? 'bg-green-500' :
                            metric.status === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Analysis */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Resource Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Image className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Images</span>
                      </div>
                      <span className="font-semibold text-gray-900">24 files</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">CSS Files</span>
                      </div>
                      <span className="font-semibold text-gray-900">8 files</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-700">JS Files</span>
                      </div>
                      <span className="font-semibold text-gray-900">12 files</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Total Size</span>
                      </div>
                      <span className="font-semibold text-gray-900">2.4 MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimization Opportunities */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
                  Optimization Opportunities
                </h3>
                <div className="space-y-4">
                  {opportunities.map((opportunity, index) => (
                    <div key={index} className={`p-6 rounded-xl border ${getPriorityColor(opportunity.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(opportunity.priority)}`}>
                              {opportunity.priority}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{opportunity.description}</p>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Potential savings:</span>
                            <span className="font-semibold text-green-600">{opportunity.savings}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {opportunity.priority === 'high' ? (
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                          ) : (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Performance;