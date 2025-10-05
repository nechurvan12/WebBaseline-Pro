import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  previousScore?: number;
  icon: React.ReactNode;
  color: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score, 
  previousScore, 
  icon, 
  color 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrend = () => {
    if (!previousScore) return null;
    const diff = score - previousScore;
    if (Math.abs(diff) < 2) return { icon: Minus, text: 'No change', color: 'text-gray-500' };
    if (diff > 0) return { icon: TrendingUp, text: `+${diff}`, color: 'text-green-500' };
    return { icon: TrendingDown, text: `${diff}`, color: 'text-red-500' };
  };

  const trend = getTrend();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend.color}`}>
            <trend.icon className="h-4 w-4" />
            <span>{trend.text}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      
      <div className="flex items-end space-x-2">
        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className="text-gray-500 text-sm mb-1">/100</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            score >= 80 ? 'bg-green-500' : 
            score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreCard;