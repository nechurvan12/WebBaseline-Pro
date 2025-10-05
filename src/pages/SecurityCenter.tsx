import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getSecurityRecommendations, 
  getSecurityTips, 
  updateSecurityRecommendation 
} from '../lib/api';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Zap,
  Lock,
  Eye,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SecurityRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  websites: {
    url: string;
    title?: string;
  };
  created_at: string;
}

interface SecurityTip {
  category: string;
  title: string;
  description: string;
  difficulty: string;
  impact: string;
}

const SecurityCenter: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>([]);
  const [tips, setTips] = useState<SecurityTip[]>([]);
  const [checklist, setChecklist] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = async () => {
    try {
      const [recommendationsData, tipsData] = await Promise.all([
        getSecurityRecommendations(user!.id),
        getSecurityTips()
      ]);

      setRecommendations(recommendationsData);
      setTips(tipsData.tips);
      setChecklist(tipsData.checklist);
    } catch (error) {
      toast.error('Failed to load security data');
      console.error('Security data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (recommendationId: string, status: string) => {
    try {
      await updateSecurityRecommendation(recommendationId, status);
      setRecommendations(recommendations.map(rec => 
        rec.id === recommendationId ? { ...rec, status } : rec
      ));
      toast.success('Recommendation status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  const filteredRecommendations = recommendations.filter(rec => 
    filter === 'all' || rec.priority === filter
  );

  const stats = {
    total: recommendations.length,
    high: recommendations.filter(r => r.priority === 'high').length,
    completed: recommendations.filter(r => r.status === 'completed').length,
    pending: recommendations.filter(r => r.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
        </div>
        <p className="text-gray-600">
          Monitor and improve your website security with actionable recommendations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All Issues', count: stats.total },
            { key: 'high', label: 'High Priority', count: stats.high },
            { key: 'medium', label: 'Medium Priority', count: recommendations.filter(r => r.priority === 'medium').length },
            { key: 'low', label: 'Low Priority', count: recommendations.filter(r => r.priority === 'low').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                filter === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  filter === tab.key
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendations */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Recommendations</h2>
          
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No security issues found</h3>
              <p className="text-gray-600">Great job! Your websites are following security best practices.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(recommendation.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(recommendation.priority)}`}>
                            {recommendation.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{recommendation.category}</p>
                        <p className="text-gray-700 mb-3">{recommendation.description}</p>
                        
                        {recommendation.websites && (
                          <div className="flex items-center text-sm text-blue-600">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span>{recommendation.websites.title || recommendation.websites.url}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(recommendation.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex space-x-2">
                      {recommendation.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(recommendation.id, 'in-progress')}
                          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                          Start Working
                        </button>
                      )}
                      {recommendation.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(recommendation.id, 'completed')}
                          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Tips & Checklist */}
        <div className="space-y-8">
          {/* Security Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
            <div className="space-y-4">
              {tips.slice(0, 5).map((tip, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-500">Difficulty: {tip.difficulty}</span>
                    <span className="text-gray-500">Impact: {tip.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Checklist</h3>
            
            {Object.entries(checklist).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2 capitalize flex items-center">
                  {category === 'gdpr' && <Users className="h-4 w-4 mr-2" />}
                  {category === 'accessibility' && <Eye className="h-4 w-4 mr-2" />}
                  {category === 'security' && <Lock className="h-4 w-4 mr-2" />}
                  {category.toUpperCase()}
                </h4>
                <ul className="space-y-1">
                  {(items as string[]).map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCenter;