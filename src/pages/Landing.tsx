import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Zap, 
  Shield, 
  Search, 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle,
  ArrowRight,
  BarChart3,
  Eye,
  Smartphone
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Performance Analysis",
      description: "Comprehensive Core Web Vitals assessment with LCP, FID, and CLS metrics aligned with Google's baseline standards."
    },
    {
      icon: <Search className="w-8 h-8 text-green-500" />,
      title: "SEO Optimization",
      description: "Advanced SEO analysis following Google's E-A-T guidelines and baseline SEO requirements for better rankings."
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-500" />,
      title: "Accessibility Compliance",
      description: "WCAG 2.1 AA compliance checking with automated accessibility testing against baseline accessibility standards."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Security Assessment",
      description: "Comprehensive security analysis including HTTPS, CSP, and vulnerability scanning based on baseline security practices."
    }
  ];

  const stats = [
    { number: "98%", label: "Accuracy Rate", icon: <Award className="w-6 h-6" /> },
    { number: "50K+", label: "Sites Analyzed", icon: <Globe className="w-6 h-6" /> },
    { number: "15s", label: "Average Analysis", icon: <Zap className="w-6 h-6" /> },
    { number: "24/7", label: "Monitoring", icon: <BarChart3 className="w-6 h-6" /> }
  ];

  const baselineFeatures = [
    "Google Core Web Vitals Integration",
    "Real Google Baseline 2024/2025 Compliance",
    "Advanced Web Features Detection",
    "Lighthouse Integration for Accurate Metrics",
    "Real-time Monitoring Dashboard",
    "Automated Improvement Suggestions",
    "Historical Performance Tracking",
    "Mobile & Desktop Analysis",
    "Professional Compliance Certificates"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WebBaseline Pro
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth" 
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth" 
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Award className="w-4 h-4 mr-2" />
              Google Baseline Hackathon 2025 - Production Ready
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Professional
              </span>
              <br />
              <span className="text-gray-900">Baseline Analyzer</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Production-ready web analysis platform built on Google's Baseline 2024/2025 standards. 
              Get comprehensive insights with real Lighthouse integration, advanced crawling, 
              and professional compliance certificates for your websites.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/auth" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                Live Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* Google Baseline Integration */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built on Google Baseline Standards</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Our platform uses the official web-features package and Google's Baseline dataset to provide 
              accurate, industry-standard web performance analysis and recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Professional Features</h3>
              <div className="space-y-4">
                {baselineFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h4 className="text-xl font-semibold mb-4">Real Lighthouse Integration</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Largest Contentful Paint (LCP)</span>
                  <span className="text-green-400 font-semibold">≤ 2.5s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>First Input Delay (FID)</span>
                  <span className="text-green-400 font-semibold">≤ 100ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cumulative Layout Shift (CLS)</span>
                  <span className="text-green-400 font-semibold">≤ 0.1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Baseline 2024 Compliance</span>
                  <span className="text-green-400 font-semibold">✓ Certified</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Professional Reports</span>
                  <span className="text-green-400 font-semibold">✓ Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Production-Ready Analysis Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade analysis tools with real Google Baseline integration,
              Lighthouse metrics, and compliance certification for enterprise use.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Analytics Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade dashboard with real-time insights, compliance tracking,
              professional reports, and certification badges for your websites.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div className="text-3xl font-bold text-green-600 mb-2">94</div>
                <div className="text-green-800 font-semibold">Baseline Score</div>
                <div className="text-sm text-green-600 mt-1">Gold Certified</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">87</div>
                <div className="text-blue-800 font-semibold">Lighthouse Score</div>
                <div className="text-sm text-blue-600 mt-1">Real Metrics</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">91</div>
                <div className="text-purple-800 font-semibold">Compliance</div>
                <div className="text-sm text-purple-600 mt-1">Certified</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-gray-500">
              <Award className="w-5 h-5" />
              <span>Professional Certification</span>
              <span>•</span>
              <TrendingUp className="w-5 h-5" />
              <span>Real Lighthouse Data</span>
              <span>•</span>
              <Shield className="w-5 h-5" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready for Professional Analysis?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join developers and businesses using Baseline Analyzer Pro 
            for professional web analysis with real Google Baseline compliance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/auth" 
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Start Professional Analysis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Enterprise Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Globe className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Baseline Analyzer Pro</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                Built for Google Baseline Hackathon 2025
              </p>
              <p className="text-sm text-gray-500">
                Powered by Real Google Baseline Data & Lighthouse Integration
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;