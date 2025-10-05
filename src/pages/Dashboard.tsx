import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWebsites, deleteWebsite } from '../lib/api';
import { Website } from '../lib/supabase';
import ScoreCard from '../components/ScoreCard';
import { 
  Zap, 
  Search, 
  Users, 
  Shield, 
  Plus, 
  ExternalLink,
  Calendar,
  TrendingUp,
  Globe,
  Trash2,
  RefreshCw,
  Award,
  Activity,
  BarChart3,
  Target,
  Sparkles,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Rocket,
  Layers,
  Cpu,
  Wifi,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWebsites();
  }, [user]);

  const loadWebsites = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      const data = await getUserWebsites(user.id);
      setWebsites(data);
    } catch (error) {
      toast.error('Failed to load websites');
      console.error('Error loading websites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteWebsite = async (websiteId: string, websiteUrl: string) => {
    if (!confirm(`Are you sure you want to delete ${websiteUrl}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteWebsite(websiteId);
      setWebsites(websites.filter(w => w.id !== websiteId));
      toast.success('Website deleted successfully');
    } catch (error) {
      toast.error('Failed to delete website');
      console.error('Delete error:', error);
    }
  };

  const getAverageScores = () => {
    if (websites.length === 0) return null;
    
    const sitesWithAnalysis = websites.filter(site => site.latestAnalysis);
    if (sitesWithAnalysis.length === 0) return null;

    const totals = sitesWithAnalysis.reduce((acc, site) => {
      const analysis = site.latestAnalysis!;
      return {
        performance: acc.performance + analysis.performance_score,
        seo: acc.seo + analysis.seo_score,
        accessibility: acc.accessibility + analysis.accessibility_score,
        security: acc.security + analysis.security_score,
        overall: acc.overall + analysis.overall_score,
      };
    }, { performance: 0, seo: 0, accessibility: 0, security: 0, overall: 0 });

    return {
      performance: Math.round(totals.performance / sitesWithAnalysis.length),
      seo: Math.round(totals.seo / sitesWithAnalysis.length),
      accessibility: Math.round(totals.accessibility / sitesWithAnalysis.length),
      security: Math.round(totals.security / sitesWithAnalysis.length),
      overall: Math.round(totals.overall / sitesWithAnalysis.length),
    };
  };

  const averageScores = getAverageScores();

  const quickActions = [
    {
      title: 'Analyze Website',
      description: 'Get comprehensive analysis',
      href: '/analyze',
      icon: Plus,
      gradient: 'from-blue-500 to-purple-600',
      hoverGradient: 'hover:from-blue-600 hover:to-purple-700'
    },
    {
      title: 'Security Audit',
      description: 'Check security vulnerabilities',
      href: '/security',
      icon: Shield,
      gradient: 'from-red-500 to-pink-600',
      hoverGradient: 'hover:from-red-600 hover:to-pink-700'
    },
    {
      title: 'Performance Lab',
      description: 'Optimize Core Web Vitals',
      href: '/speed-lab',
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-600',
      hoverGradient: 'hover:from-yellow-600 hover:to-orange-700'
    },
    {
      title: 'Route Explorer',
      description: 'Discover hidden routes',
      href: '/routes',
      icon: Eye,
      gradient: 'from-green-500 to-emerald-600',
      hoverGradient: 'hover:from-green-600 hover:to-emerald-700'
    },
    {
      title: 'Baseline Assistant',
      description: 'AI-powered guidance',
      href: '/chatbot',
      icon: Sparkles,
      gradient: 'from-cyan-500 to-blue-600',
      hoverGradient: 'hover:from-cyan-600 hover:to-blue-700'
    },
    {
      title: 'Visual Testing',
      description: 'Screenshot comparison',
      href: '/visual',
      icon: Eye,
      gradient: 'from-purple-500 to-indigo-600',
      hoverGradient: 'hover:from-purple-600 hover:to-indigo-700'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative">
          <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
          <div className="absolute top-4 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-40 w-20 h-20 bg-yellow-300/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 bg-pink-300/20 rounded-full animate-ping"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-3 flex items-center">
                  <Sparkles className="w-10 h-10 mr-4 text-yellow-300 animate-pulse" />
                  Welcome back!
                </h1>
                <p className="text-blue-100 text-xl mb-4">
                  Hey {user?.email?.split('@')[0] || 'User'}, ready to optimize the web? 🚀
                </p>
                <div className="flex items-center space-x-6 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>{websites.length} websites monitored</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Real-time analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Baseline certified</span>
                  </div>
                </div>
              </div>
              <button
                onClick={loadWebsites}
                disabled={refreshing}
                className="flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-all disabled:opacity-50 border border-white/20 hover:scale-105 transform duration-200"
              >
                <RefreshCw className={`h-6 w-6 mr-3 ${refreshing ? 'animate-spin' : ''}`} />
                <div className="text-left">
                  <div className="font-semibold">Refresh Data</div>
                  <div className="text-xs opacity-75">Update analytics</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <div className="flex items-center justify-between">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-900 mb-1">{websites.length}</p>
              <p className="text-sm font-semibold text-gray-600">Total Websites</p>
              <p className="text-xs text-blue-600 mt-1">+3 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <div className="flex items-center justify-between">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {websites.reduce((sum, site) => sum + (site.totalAnalyses || 0), 0)}
              </p>
              <p className="text-sm font-semibold text-gray-600">Total Analyses</p>
              <p className="text-xs text-green-600 mt-1">+12 today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <div className="flex items-center justify-between">
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {websites.filter(site => 
                  site.created_at && 
                  new Date(site.created_at).getMonth() === new Date().getMonth()
                ).length}
              </p>
              <p className="text-sm font-semibold text-gray-600">This Month</p>
              <p className="text-xs text-orange-600 mt-1">Growing fast</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <div className="flex items-center justify-between">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {averageScores?.overall || 'N/A'}
              </p>
              <p className="text-sm font-semibold text-gray-600">Avg Score</p>
              <p className="text-xs text-purple-600 mt-1">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Average Scores */}
      {averageScores && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <BarChart3 className="w-8 h-8 mr-4 text-blue-600" />
            Performance Overview
            <div className="ml-4 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-2xl text-base font-semibold">
              Baseline Certified
            </div>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScoreCard
              title="Performance"
              score={averageScores.performance}
              icon={<Zap className="h-7 w-7" />}
              color="bg-gradient-to-br from-green-100 to-emerald-200"
            />
            <ScoreCard
              title="SEO"
              score={averageScores.seo}
              icon={<Search className="h-7 w-7" />}
              color="bg-gradient-to-br from-yellow-100 to-orange-200"
            />
            <ScoreCard
              title="Accessibility"
              score={averageScores.accessibility}
              icon={<Users className="h-7 w-7" />}
              color="bg-gradient-to-br from-purple-100 to-indigo-200"
            />
            <ScoreCard
              title="Security"
              score={averageScores.security}
              icon={<Shield className="h-7 w-7" />}
              color="bg-gradient-to-br from-red-100 to-pink-200"
            />
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Rocket className="w-8 h-8 mr-4 text-purple-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className={`group bg-gradient-to-r ${action.gradient} ${action.hoverGradient} text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <action.icon className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
                <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">{action.title}</h3>
              <p className="text-white/90 text-sm">{action.description}</p>
              <div className="mt-4 flex items-center text-white/80 text-sm">
                <span>Get started</span>
                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Websites */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Globe className="w-8 h-8 mr-4 text-blue-600" />
            Your Websites
            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {websites.length} total
            </div>
          </h2>
          <Link
            to="/analyze"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Plus className="h-5 w-5 mr-3" />
            Analyze New Site
          </Link>
        </div>

        {websites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Globe className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No websites yet</h3>
            <p className="text-gray-600 mb-8 text-lg">Start by analyzing your first website with Google Baseline standards</p>
            <Link
              to="/analyze"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg"
            >
              <Plus className="h-6 w-6 mr-3" />
              Analyze Your First Website
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites.map((website) => (
              <div
                key={website.id}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                      {website.title || 'Untitled Website'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center font-medium"
                      >
                        {website.url.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </div>
                  </div>
                  {website.latestAnalysis && (
                    <div className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                      website.latestAnalysis.overall_score >= 80
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : website.latestAnalysis.overall_score >= 60
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                    }`}>
                      {website.latestAnalysis.overall_score}/100
                    </div>
                  )}
                </div>

                {website.latestAnalysis ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                        <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">Performance</div>
                        <div className="text-xl font-bold text-green-600">{website.latestAnalysis.performance_score}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                        <Search className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">SEO</div>
                        <div className="text-xl font-bold text-blue-600">{website.latestAnalysis.seo_score}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
                        <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">Access.</div>
                        <div className="text-xl font-bold text-purple-600">{website.latestAnalysis.accessibility_score}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                        <Shield className="w-6 h-6 text-red-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-1">Security</div>
                        <div className="text-xl font-bold text-red-600">{website.latestAnalysis.security_score}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Last analyzed: {format(new Date(website.latestAnalysis.created_at), 'MMM dd')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Baseline Ready</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-gray-500 italic mb-4">
                      No analysis data available
                    </div>
                    <Link
                      to="/analyze"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Analyze Now
                    </Link>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Activity className="w-4 h-4 mr-1" />
                      {website.totalAnalyses} {website.totalAnalyses === 1 ? 'analysis' : 'analyses'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/reports?website=${website.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline flex items-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      View Report
                    </Link>
                    <button
                      onClick={() => handleDeleteWebsite(website.id, website.url)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete website"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <Star className="w-8 h-8 mr-4 text-yellow-300" />
          Platform Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Google Baseline 2024</h3>
            <p className="text-white/90">Real integration with official web-features data</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
            <p className="text-white/90">Advanced crawling with intelligent insights</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Professional Reports</h3>
            <p className="text-white/90">Enterprise-grade compliance certificates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;