import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Plus, 
  BarChart3, 
  Bell, 
  Shield, 
  MessageCircle, 
  Route,
  Settings,
  User,
  TrendingUp,
  Globe,
  Zap,
  Search,
  Users,
  Award,
  BookOpen,
  HelpCircle,
  Star,
  Target,
  Activity,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Monitor,
  Code,
  Smartphone,
  Eye,
  Lock,
  Gauge,
  FileText,
  Layers,
  Wifi,
  Database,
  Cloud,
  Cpu,
  Server,
  GitBranch,
  Briefcase,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home,
      description: 'Overview & Analytics',
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      name: 'Analyze Website', 
      href: '/analyze', 
      icon: Plus,
      description: 'Scan & Analyze Sites',
      gradient: 'from-green-500 to-blue-600'
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: BarChart3,
      description: 'Detailed Reports',
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      name: 'Comparison', 
      href: '/comparison', 
      icon: TrendingUp,
      description: 'Compare Websites',
      gradient: 'from-orange-500 to-red-600'
    },
    { 
      name: 'Performance', 
      href: '/performance', 
      icon: Zap,
      description: 'Speed & Optimization',
      gradient: 'from-yellow-500 to-orange-600'
    },
    { 
      name: 'SEO Center', 
      href: '/seo', 
      icon: Search,
      description: 'SEO Analysis',
      gradient: 'from-green-500 to-teal-600'
    },
    { 
      name: 'Accessibility', 
      href: '/accessibility', 
      icon: Users,
      description: 'WCAG Compliance',
      gradient: 'from-purple-500 to-indigo-600'
    },
    { 
      name: 'Security Center', 
      href: '/security', 
      icon: Shield,
      description: 'Security Analysis',
      gradient: 'from-red-500 to-pink-600'
    },
    { 
      name: 'Route Explorer', 
      href: '/routes', 
      icon: Route,
      description: 'Discover Routes',
      gradient: 'from-indigo-500 to-purple-600'
    },
    { 
      name: 'Baseline Assistant', 
      href: '/chatbot', 
      icon: MessageCircle,
      description: 'AI Helper',
      gradient: 'from-cyan-500 to-blue-600'
    },
    { 
      name: 'Monitoring', 
      href: '/monitoring', 
      icon: Activity,
      description: 'Real-time Monitoring',
      gradient: 'from-emerald-500 to-green-600'
    },
    { 
      name: 'Benchmarks', 
      href: '/benchmarks', 
      icon: Target,
      description: 'Industry Standards',
      gradient: 'from-violet-500 to-purple-600'
    },
    { 
      name: 'Learning Hub', 
      href: '/learning', 
      icon: BookOpen,
      description: 'Tutorials & Guides',
      gradient: 'from-amber-500 to-orange-600'
    },
    { 
      name: 'Certifications', 
      href: '/certifications', 
      icon: Award,
      description: 'Compliance Badges',
      gradient: 'from-yellow-500 to-amber-600'
    },
    { 
      name: 'API Explorer', 
      href: '/api-explorer', 
      icon: Code,
      description: 'Test APIs',
      gradient: 'from-slate-500 to-gray-600'
    },
    { 
      name: 'Mobile Insights', 
      href: '/mobile', 
      icon: Smartphone,
      description: 'Mobile Performance',
      gradient: 'from-pink-500 to-rose-600'
    },
    { 
      name: 'Visual Testing', 
      href: '/visual', 
      icon: Eye,
      description: 'Visual Regression',
      gradient: 'from-teal-500 to-cyan-600'
    },
    { 
      name: 'Privacy Audit', 
      href: '/privacy', 
      icon: Lock,
      description: 'GDPR Compliance',
      gradient: 'from-red-500 to-orange-600'
    },
    { 
      name: 'Speed Lab', 
      href: '/speed-lab', 
      icon: Gauge,
      description: 'Performance Lab',
      gradient: 'from-blue-500 to-indigo-600'
    },
    { 
      name: 'Content Audit', 
      href: '/content', 
      icon: FileText,
      description: 'Content Analysis',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  const bottomNavigation = [
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: User,
      description: 'Account Settings'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      description: 'Preferences'
    },
    { 
      name: 'Help & Support', 
      href: '/help', 
      icon: HelpCircle,
      description: 'Get Help'
    },
    { 
      name: 'Notifications', 
      href: '/notifications', 
      icon: Bell,
      description: 'Alerts & Updates'
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl transition-all duration-300 z-50 ${
      collapsed ? 'w-20' : 'w-80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Baseline Pro
              </h1>
              <p className="text-slate-400 text-sm">Web Analysis Platform</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-110"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-base truncate">
                {user.email?.split('@')[0]}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-slate-400 text-sm">Pro Member</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <nav className="space-y-2 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl shadow-blue-500/25`
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`flex-shrink-0 w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors duration-200`} />
                {!collapsed && (
                  <div className="ml-4 flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs opacity-75 mt-0.5">{item.description}</div>
                  </div>
                )}
                {!collapsed && isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-700/50 p-4">
        <nav className="space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="flex-shrink-0 w-4 h-4" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-4 py-3 mt-4 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all duration-200"
        >
          <LogOut className="flex-shrink-0 w-4 h-4" />
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;