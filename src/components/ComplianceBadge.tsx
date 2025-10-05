import React from 'react';
import { Award, Star, Shield, Trophy } from 'lucide-react';

interface ComplianceBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  showLabel?: boolean;
  className?: string;
}

const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ 
  score, 
  size = 'md', 
  showScore = true, 
  showLabel = true,
  className = '' 
}) => {
  const getBadgeInfo = (score: number) => {
    if (score >= 95) return { 
      level: 'platinum', 
      color: 'from-gray-200 to-gray-300', 
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300',
      label: 'Platinum Certified', 
      icon: Trophy,
      glow: 'shadow-gray-200'
    };
    if (score >= 85) return { 
      level: 'gold', 
      color: 'from-yellow-300 to-yellow-500', 
      textColor: 'text-yellow-900',
      borderColor: 'border-yellow-400',
      label: 'Gold Certified', 
      icon: Award,
      glow: 'shadow-yellow-200'
    };
    if (score >= 75) return { 
      level: 'silver', 
      color: 'from-gray-300 to-gray-400', 
      textColor: 'text-gray-800',
      borderColor: 'border-gray-400',
      label: 'Silver Certified', 
      icon: Star,
      glow: 'shadow-gray-200'
    };
    if (score >= 65) return { 
      level: 'bronze', 
      color: 'from-orange-400 to-orange-600', 
      textColor: 'text-orange-900',
      borderColor: 'border-orange-500',
      label: 'Bronze Certified', 
      icon: Shield,
      glow: 'shadow-orange-200'
    };
    return { 
      level: 'none', 
      color: 'from-gray-400 to-gray-500', 
      textColor: 'text-gray-100',
      borderColor: 'border-gray-500',
      label: 'Not Certified', 
      icon: Shield,
      glow: 'shadow-gray-300'
    };
  };

  const badge = getBadgeInfo(score);
  const Icon = badge.icon;

  const sizeClasses = {
    sm: {
      container: 'px-3 py-2 text-xs',
      icon: 'h-3 w-3',
      score: 'text-xs font-bold',
      label: 'text-xs'
    },
    md: {
      container: 'px-4 py-3 text-sm',
      icon: 'h-4 w-4',
      score: 'text-sm font-bold',
      label: 'text-sm'
    },
    lg: {
      container: 'px-6 py-4 text-base',
      icon: 'h-6 w-6',
      score: 'text-lg font-bold',
      label: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`
      inline-flex items-center space-x-2 rounded-full
      bg-gradient-to-r ${badge.color}
      border-2 ${badge.borderColor}
      ${badge.textColor}
      ${classes.container}
      shadow-lg ${badge.glow}
      transition-all duration-300 hover:scale-105
      ${className}
    `}>
      <Icon className={`${classes.icon} flex-shrink-0`} />
      
      {showScore && (
        <span className={classes.score}>
          {score}
        </span>
      )}
      
      {showLabel && (
        <span className={`${classes.label} font-medium whitespace-nowrap`}>
          {badge.label}
        </span>
      )}
    </div>
  );
};

export default ComplianceBadge;