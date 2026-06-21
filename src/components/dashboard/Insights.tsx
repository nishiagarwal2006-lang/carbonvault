import React, { useState } from 'react';
import { CarbonInsight } from '../../types';
import { Lightbulb, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface InsightsProps {
  insights: CarbonInsight;
}

export const Insights: React.FC<InsightsProps> = ({ insights }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="card">
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-semibold">Personalized Insights</h2>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {insights?.insights && insights.insights.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Insights
              </h3>
              <ul className="space-y-2">
                {insights.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-300 bg-dark-200 p-3 rounded-lg">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights?.recommendations && insights.recommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {insights.recommendations.map((recommendation, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-300 bg-primary-500/10 p-3 rounded-lg border border-primary-500/20"
                  >
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
