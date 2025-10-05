import React, { useState } from 'react';
import { CheckCircle, XCircle, Info, ChevronDown, ChevronRight } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  supported: boolean;
  evidence?: string[];
  impact?: 'high' | 'medium' | 'low';
}

interface FeatureSupportProps {
  features: Feature[];
  title?: string;
  showCategories?: boolean;
  className?: string;
}

const FeatureSupport: React.FC<FeatureSupportProps> = ({ 
  features, 
  title = "Feature Support Analysis",
  showCategories = true,
  className = '' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  const categories = showCategories ? 
    ['all', ...Array.from(new Set(features.map(f => f.category)))] : 
    ['all'];

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const supportedCount = filteredFeatures.filter(f => f.supported).length;
  const totalCount = filteredFeatures.length;
  const supportPercentage = totalCount > 0 ? Math.round((supportedCount / totalCount) * 100) : 0;

  const toggleFeatureExpansion = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId);
    } else {
      newExpanded.add(featureId);
    }
    setExpandedFeatures(newExpanded);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      css: 'bg-blue-100 text-blue-800',
      javascript: 'bg-yellow-100 text-yellow-800',
      html: 'bg-green-100 text-green-800',
      webapi: 'bg-purple-100 text-purple-800',
      security: 'bg-red-100 text-red-800',
      performance: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {supportedCount} of {totalCount} features supported
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              supportPercentage >= 80 ? 'bg-green-100 text-green-800' :
              supportPercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {supportPercentage}%
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                supportPercentage >= 80 ? 'bg-green-500' :
                supportPercentage >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${supportPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {showCategories && categories.length > 2 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Features' : category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="space-y-3">
        {filteredFeatures.map(feature => (
          <div
            key={feature.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${
              feature.supported 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* Support Icon */}
                {feature.supported ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}

                {/* Feature Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{feature.name}</h4>
                    
                    {/* Category Badge */}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(feature.category)}`}>
                      {feature.category}
                    </span>

                    {/* Impact Badge */}
                    {feature.impact && !feature.supported && (
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getImpactColor(feature.impact)}`}>
                        {feature.impact} impact
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{feature.description}</p>

                  {/* Evidence */}
                  {feature.evidence && feature.evidence.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleFeatureExpansion(feature.id)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                      >
                        {expandedFeatures.has(feature.id) ? (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-1" />
                        )}
                        {feature.supported ? 'Show Evidence' : 'Show Details'}
                      </button>
                      
                      {expandedFeatures.has(feature.id) && (
                        <div className="mt-2 pl-4 border-l-2 border-blue-200">
                          {feature.evidence.map((evidence, index) => (
                            <div key={index} className="text-sm text-gray-600 mb-1 flex items-start">
                              <Info className="h-3 w-3 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                              {evidence}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeatures.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No features found for the selected category.</p>
        </div>
      )}

      {/* Summary */}
      {filteredFeatures.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {filteredFeatures.filter(f => f.supported).length}
              </div>
              <div className="text-sm text-gray-600">Supported</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {filteredFeatures.filter(f => !f.supported).length}
              </div>
              <div className="text-sm text-gray-600">Missing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {filteredFeatures.filter(f => !f.supported && f.impact === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Impact</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {supportPercentage}%
              </div>
              <div className="text-sm text-gray-600">Compliance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureSupport;