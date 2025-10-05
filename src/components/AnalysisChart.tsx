import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface AnalysisData {
  created_at: string;
  performance_score: number;
  seo_score: number;
  accessibility_score: number;
  security_score: number;
  overall_score: number;
}

interface AnalysisChartProps {
  data: AnalysisData[];
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ data }) => {
  const chartData = data
    .slice(-10) // Last 10 analyses
    .reverse()
    .map((analysis) => ({
      date: format(new Date(analysis.created_at), 'MMM dd'),
      Performance: analysis.performance_score,
      SEO: analysis.seo_score,
      Accessibility: analysis.accessibility_score,
      Security: analysis.security_score,
      Overall: analysis.overall_score,
    }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trends</h3>
      
      {chartData.length > 1 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Overall"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Performance"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="SEO"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Accessibility"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Security"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p>No trend data available yet</p>
            <p className="text-sm">Run multiple analyses to see trends</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisChart;