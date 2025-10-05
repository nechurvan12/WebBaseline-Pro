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
  RefreshCw
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600">
              Monitor and improve your website's health and performance
            </p>
          </div>
          <button
            onClick={loadWebsites}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Websites</p>
              <p className="text-2xl font-bold text-gray-900">{websites.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold text-gray-900">
                {websites.reduce((sum, site) => sum + (site.totalAnalyses || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {websites.filter(site => 
                  site.created_at && 
                  new Date(site.created_at).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageScores?.overall || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Average Scores */}
      {averageScores && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Average Scores Across All Websites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScoreCard
                title="Performance"
                score={averageScores.performance}
                icon={<Zap className="h-6 w-6" />}
                color="bg-green-100"
              />
              <ScoreCard
                title="SEO"
                score={averageScores.seo}
                icon={<Search className="h-6 w-6" />}
                color="bg-yellow-100"
              />
              <ScoreCard
                title="Accessibility"
                score={averageScores.accessibility}
                icon={<Users className="h-6 w-6" />}
                color="bg-purple-100"
              />
              <ScoreCard
                title="Security"
                score={averageScores.security}
                icon={<Shield className="h-6 w-6" />}
                color="bg-red-100"
              />
            </div>
          </div>
        </>
      )}

      {/* Recent Websites */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Websites</h2>
          <Link
            to="/analyze"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Analyze New Site
          </Link>
        </div>

        {websites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No websites yet</h3>
            <p className="text-gray-600 mb-6">Start by analyzing your first website</p>
            <Link
              to="/analyze"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Analyze Your First Website
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {websites.slice(0, 6).map((website) => (
              <div
                key={website.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {website.title || 'Untitled Website'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                      >
                        {website.url.replace(/^https?:\/\//, '')}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                  {website.latestAnalysis && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      website.latestAnalysis.overall_score >= 80
                        ? 'bg-green-100 text-green-800'
                        : website.latestAnalysis.overall_score >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {website.latestAnalysis.overall_score}/100
                    </div>
                  )}
                </div>

                {website.latestAnalysis ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-600">Performance</div>
                        <div className="font-medium">{website.latestAnalysis.performance_score}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">SEO</div>
                        <div className="font-medium">{website.latestAnalysis.seo_score}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Access.</div>
                        <div className="font-medium">{website.latestAnalysis.accessibility_score}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Security</div>
                        <div className="font-medium">{website.latestAnalysis.security_score}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last analyzed: {format(new Date(website.latestAnalysis.created_at), 'MMM dd, yyyy')}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No analysis data available
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-gray-500">
                      {website.totalAnalyses} {website.totalAnalyses === 1 ? 'analysis' : 'analyses'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/reports?website=${website.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Report
                      </Link>
                      <button
                        onClick={() => handleDeleteWebsite(website.id, website.url)}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete website"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/analyze"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Plus className="h-8 w-8 mr-4" />
            <div>
              <h3 className="font-semibold mb-1">Analyze Website</h3>
              <p className="text-blue-100 text-sm">Add a new website to monitor</p>
            </div>
          </div>
        </Link>

        <Link
          to="/reports"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 mr-4" />
            <div>
              <h3 className="font-semibold mb-1">View Reports</h3>
              <p className="text-green-100 text-sm">Detailed analysis reports</p>
            </div>
          </div>
        </Link>

        <Link
          to="/notifications"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-4" />
            <div>
              <h3 className="font-semibold mb-1">Notifications</h3>
              <p className="text-purple-100 text-sm">Monitor alerts & updates</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;