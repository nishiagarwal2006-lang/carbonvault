import React from 'react';
import { CarbonFootprint } from '../../types';
import { getCarbonScore, getComparisonToAverage, formatNumber } from '../../utils/helpers';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';

interface CarbonScoreProps {
  footprint: CarbonFootprint;
}

export const CarbonScore: React.FC<CarbonScoreProps> = ({ footprint }) => {
  const score = getCarbonScore(footprint.totalEmissions);
  const comparison = getComparisonToAverage(footprint.totalEmissions);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-primary-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 70) return 'stroke-primary-500';
    if (score >= 40) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const circumference = 2 * Math.PI * 45;
  const progress = (score / 100) * circumference;

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Your Carbon Score</h2>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Score Circle */}
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              className="stroke-gray-700"
              cx="64"
              cy="64"
              r="45"
              fill="none"
              strokeWidth="8"
            />
            <circle
              className={`${getScoreRingColor(score)} transition-all duration-1000`}
              cx="64"
              cy="64"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-sm text-gray-400 block">/ 100</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm text-gray-400">Total Emissions</p>
            <p className="text-2xl font-bold">{formatNumber(footprint.totalEmissions)} kg CO₂e</p>
            <p className="text-sm text-gray-400">per year</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Energy</p>
              <p className="font-semibold">{formatNumber(footprint.categories.energy)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Travel</p>
              <p className="font-semibold">{formatNumber(footprint.categories.travel)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Diet</p>
              <p className="font-semibold">{formatNumber(footprint.categories.diet)}</p>
            </div>
          </div>

          <div className="p-3 bg-dark-200 rounded-lg">
            <div className="flex items-start gap-2">
              {score >= 50 ? (
                <TrendingUp className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-gray-300">{comparison}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
