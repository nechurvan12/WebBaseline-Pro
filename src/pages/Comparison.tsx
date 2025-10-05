import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWebsites, compareWebsites } from '../lib/api';
import { Website } from '../lib/supabase';
import { 
  TrendingUp, 
  Plus, 
  X, 
  BarChart3, 
  Award, 
  Zap,
  Search,
  Users,
  Shield,
  ExternalLink,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

const Comparison: React.FC = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWebsites();
  }, [user]);

  const loadWebsites = async () => {
    if (!user) return;
    
    try {
      const data = await getUserWebsites(user.id);
      setWebsites(data.filter(w => w.latestAnalysis)); // Only websites with analysis
    } catch (error) {
      toast.error('Failed to load websites');
    }
  };

  const handleWebsiteToggle = (websiteId: string) => {
    if (selectedWebsites.includes(websiteId)) {
      setSelectedWebsites(selectedWebsites.filter(id => id !== websiteId));
    } else if (selectedWebsites.length < 5) {
      setSelectedWebsites([...selectedWebsites, websiteId]);
    } else {
      toast.error('You can compare up to 5 websites at once');
    }
  };

  const handleCompare = async () => {
    if (selectedWebsites.length < 2) {
      toast.error('Please select at least 2 websites to compare');
      return;
    }

    setLoading(true);
    try {
      const result = await compareWebsites(selectedWebsites);
      setComparison(result);
      toast.success('Comparison completed!');
    } catch (error) {
      toast.error('Failed to compare websites');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getBestScore = (scores: number[]) => {
    return Math.max(...scores);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <TrendingUp className="w-8 h-8 mr-3 text-blue-600" />
          Website Comparison
        </h1>
        <p className="text-gray-600">
          Compare performance, SEO, accessibility, and security across your websites
        </p>
      </div>

      {/* Website Selection */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Select Websites to Compare</h2>
          <div className="text-sm text-gray-600">
            {selectedWebsites.length}/5 selected
          </div>
        </div>

        {websites.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No websites available</h3>
            <p className="text-gray-600 mb-6">You need to analyze some websites first</p>
            <a
              href="/analyze"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Analyze Websites
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {websites.map((website) => (
                <div
                  key={website.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedWebsites.includes(website.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleWebsiteToggle(website.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {website.title || website.url}
                    </h3>
                    {selectedWebsites.includes(website.id) && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 truncate">{website.url}</p>
                  {website.latestAnalysis && (
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        getScoreColor(website.latestAnalysis.overall_score)
                      }`}>
                        {website.latestAnalysis.overall_score}/100
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(website.latestAnalysis.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleCompare}
                disabled={selectedWebsites.length < 2 || loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Comparing...' : `Compare ${selectedWebsites.length} Websites`}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-8">
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Award className="w-6 h-6 mr-3" />
              Comparison Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {comparison.summary.bestOverall.title || comparison.summary.bestOverall.url}
                </div>
                <div className="text-blue-100">Best Overall Performance</div>
                <div className="text-2xl font-semibold mt-2">
                  {comparison.summary.bestOverall.scores?.overall || 0}/100
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {comparison.summary.averageScores.overall}
                </div>
                <div className="text-blue-100">Average Score</div>
                <div className="text-sm mt-2 opacity-90">
                  Across all {comparison.comparison.length} websites
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {comparison.comparison.filter(w => w.scores?.overall >= 80).length}
                </div>
                <div className="text-blue-100">High Performers</div>
                <div className="text-sm mt-2 opacity-90">
                  Websites scoring 80+
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Comparison */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Detailed Comparison
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Website</th>
                    <th className="text-center py-4 px-4 font-medium text-gray-600">Overall</th>
                    <th className="text-center py-4 px-4 font-medium text-gray-600">Performance</th>
                    <th className="text-center py-4 px-4 font-medium text-gray-600">SEO</th>
                    <th className="text-center py-4 px-4 font-medium text-gray-600">Accessibility</th>
                    <th className="text-center py-4 px-4 font-medium text-gray-600">Security</th>
                    <th className="text-center py-4 px-4 font-medium text-gray-600">Last Analyzed</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.comparison.map((website: any, index: number) => (
                    <tr key={website.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">
                            {website.title || 'Untitled'}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center">
                            {website.url}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getScoreColor(website.scores?.overall || 0)
                        }`}>
                          {website.scores?.overall || 0}
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex items-center justify-center">
                          <span className="font-medium">{website.scores?.performance || 0}</span>
                          {website.scores?.performance === getBestScore(comparison.comparison.map((w: any) => w.scores?.performance || 0)) && (
                            <Zap className="w-4 h-4 ml-1 text-green-600" />
                          )}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex items-center justify-center">
                          <span className="font-medium">{website.scores?.seo || 0}</span>
                          {website.scores?.seo === getBestScore(comparison.comparison.map((w: any) => w.scores?.seo || 0)) && (
                            <Search className="w-4 h-4 ml-1 text-green-600" />
                          )}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex items-center justify-center">
                          <span className="font-medium">{website.scores?.accessibility || 0}</span>
                          {website.scores?.accessibility === getBestScore(comparison.comparison.map((w: any) => w.scores?.accessibility || 0)) && (
                            <Users className="w-4 h-4 ml-1 text-green-600" />
                          )}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex items-center justify-center">
                          <span className="font-medium">{website.scores?.security || 0}</span>
                          {website.scores?.security === getBestScore(comparison.comparison.map((w: any) => w.scores?.security || 0)) && (
                            <Shield className="w-4 h-4 ml-1 text-green-600" />
                          )}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4 text-sm text-gray-600">
                        {website.lastAnalyzed ? new Date(website.lastAnalyzed).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Best Practices */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Best Practices
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Top Performer</h4>
                  <p className="text-sm text-green-700">
                    {comparison.summary.bestOverall.title || comparison.summary.bestOverall.url} leads with {comparison.summary.bestOverall.scores?.overall || 0}/100 overall score
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Average Performance</h4>
                  <p className="text-sm text-blue-700">
                    Overall average: {comparison.summary.averageScores.overall}/100 across all websites
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                Recommendations
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">Focus Areas</h4>
                  <p className="text-sm text-yellow-700">
                    {comparison.summary.averageScores.performance < 70 && 'Improve performance optimization. '}
                    {comparison.summary.averageScores.seo < 70 && 'Enhance SEO practices. '}
                    {comparison.summary.averageScores.accessibility < 70 && 'Address accessibility issues. '}
                    {comparison.summary.averageScores.security < 70 && 'Strengthen security measures.'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Next Steps</h4>
                  <p className="text-sm text-purple-700">
                    Analyze the best performing website's implementation and apply similar optimizations to others.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparison;