import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { getUserWebsites, getWebsiteAnalyses } from '../lib/api';
import { Website, Analysis } from '../lib/supabase';
import AnalysisChart from '../components/AnalysisChart';
import ScoreCard from '../components/ScoreCard';
import { 
  BarChart3, 
  Download, 
  Share2, 
  Filter, 
  Calendar,
  ExternalLink,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { format } from 'date-fns';
import { Zap, Search, Users, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<string>('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    loadWebsites();
  }, [user]);

  useEffect(() => {
    const websiteId = searchParams.get('website');
    if (websiteId && websites.length > 0) {
      setSelectedWebsite(websiteId);
    } else if (websites.length > 0 && !selectedWebsite) {
      setSelectedWebsite(websites[0].id);
    }
  }, [searchParams, websites]);

  useEffect(() => {
    if (selectedWebsite) {
      loadAnalyses();
    }
  }, [selectedWebsite]);

  const loadWebsites = async () => {
    if (!user) return;
    
    try {
      const data = await getUserWebsites(user.id);
      setWebsites(data);
    } catch (error) {
      toast.error('Failed to load websites');
      console.error('Error loading websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyses = async () => {
    if (!selectedWebsite) return;
    
    try {
      const data = await getWebsiteAnalyses(selectedWebsite);
      setAnalyses(data);
    } catch (error) {
      toast.error('Failed to load analyses');
      console.error('Error loading analyses:', error);
    }
  };

  const getCurrentWebsite = () => {
    return websites.find(w => w.id === selectedWebsite);
  };

  const getLatestAnalysis = () => {
    return analyses.length > 0 ? analyses[0] : null;
  };

  const getPreviousAnalysis = () => {
    return analyses.length > 1 ? analyses[1] : null;
  };

  const generateQRCode = async () => {
    try {
      const reportUrl = `${window.location.origin}/reports?website=${selectedWebsite}`;
      const qrCodeDataUrl = await QRCode.toDataURL(reportUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const downloadReport = () => {
    const website = getCurrentWebsite();
    const analysis = getLatestAnalysis();
    
    if (!website || !analysis) return;

    const reportData = {
      website: {
        url: website.url,
        title: website.title,
        analyzed_at: analysis.created_at
      },
      scores: {
        overall: analysis.overall_score,
        performance: analysis.performance_score,
        seo: analysis.seo_score,
        accessibility: analysis.accessibility_score,
        security: analysis.security_score
      },
      details: {
        performance: analysis.performance_details,
        seo: analysis.seo_details,
        accessibility: analysis.accessibility_details,
        security: analysis.security_details
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-report-${website.url.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Report downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Reports Available</h2>
          <p className="text-gray-600 mb-6">You haven't analyzed any websites yet.</p>
          <a
            href="/analyze"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Analyze Your First Website
          </a>
        </div>
      </div>
    );
  }

  const currentWebsite = getCurrentWebsite();
  const latestAnalysis = getLatestAnalysis();
  const previousAnalysis = getPreviousAnalysis();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Reports</h1>
        <p className="text-gray-600">
          Detailed analysis reports and performance trends for your websites
        </p>
      </div>

      {/* Website Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="website-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Website
            </label>
            <select
              id="website-select"
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {websites.map((website) => (
                <option key={website.id} value={website.id}>
                  {website.title || website.url}
                </option>
              ))}
            </select>
          </div>

          {currentWebsite && latestAnalysis && (
            <div className="flex items-center space-x-3">
              <button
                onClick={generateQRCode}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={downloadReport}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          )}
        </div>
      </div>

      {currentWebsite && latestAnalysis ? (
        <div className="space-y-8">
          {/* Website Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {currentWebsite.title || 'Untitled Website'}
                </h2>
                <div className="flex items-center space-x-2">
                  <a
                    href={currentWebsite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    {currentWebsite.url}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Last analyzed</div>
                <div className="font-medium">
                  {format(new Date(latestAnalysis.created_at), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-full text-lg font-bold ${
                  latestAnalysis.overall_score >= 80
                    ? 'bg-green-100 text-green-800'
                    : latestAnalysis.overall_score >= 60
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {latestAnalysis.overall_score}/100
                </div>
                {previousAnalysis && (
                  <div className="flex items-center space-x-2">
                    {latestAnalysis.overall_score > previousAnalysis.overall_score ? (
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          +{latestAnalysis.overall_score - previousAnalysis.overall_score}
                        </span>
                      </div>
                    ) : latestAnalysis.overall_score < previousAnalysis.overall_score ? (
                      <div className="flex items-center text-red-600">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {latestAnalysis.overall_score - previousAnalysis.overall_score}
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'} total
              </div>
            </div>
          </div>

          {/* Score Cards */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Scores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScoreCard
                title="Performance"
                score={latestAnalysis.performance_score}
                previousScore={previousAnalysis?.performance_score}
                icon={<Zap className="h-6 w-6" />}
                color="bg-green-100"
              />
              <ScoreCard
                title="SEO"
                score={latestAnalysis.seo_score}
                previousScore={previousAnalysis?.seo_score}
                icon={<Search className="h-6 w-6" />}
                color="bg-yellow-100"
              />
              <ScoreCard
                title="Accessibility"
                score={latestAnalysis.accessibility_score}
                previousScore={previousAnalysis?.accessibility_score}
                icon={<Users className="h-6 w-6" />}
                color="bg-purple-100"
              />
              <ScoreCard
                title="Security"
                score={latestAnalysis.security_score}
                previousScore={previousAnalysis?.security_score}
                icon={<Shield className="h-6 w-6" />}
                color="bg-red-100"
              />
            </div>
          </div>

          {/* Trend Chart */}
          {analyses.length > 1 && (
            <AnalysisChart data={analyses} />
          )}

          {/* Analysis History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Overall</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Performance</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">SEO</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Accessibility</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Security</th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.slice(0, 10).map((analysis, index) => (
                    <tr key={analysis.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {format(new Date(analysis.created_at), 'MMM dd, yyyy')}
                          <br />
                          <span className="text-gray-500 text-xs">
                            {format(new Date(analysis.created_at), 'HH:mm')}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysis.overall_score >= 80
                            ? 'bg-green-100 text-green-800'
                            : analysis.overall_score >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {analysis.overall_score}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 font-medium">{analysis.performance_score}</td>
                      <td className="text-center py-3 px-4 font-medium">{analysis.seo_score}</td>
                      <td className="text-center py-3 px-4 font-medium">{analysis.accessibility_score}</td>
                      <td className="text-center py-3 px-4 font-medium">{analysis.security_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
          <p className="text-gray-600 mb-6">This website hasn't been analyzed yet.</p>
          <a
            href="/analyze"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Run Analysis
          </a>
        </div>
      )}

      {/* QR Code Modal */}
      {qrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Report</h3>
            <div className="text-center mb-4">
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Scan this QR code to share the report
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setQrCodeUrl('')}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = 'report-qr-code.png';
                  link.href = qrCodeUrl;
                  link.click();
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;