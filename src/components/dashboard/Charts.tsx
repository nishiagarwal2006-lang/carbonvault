import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { CarbonFootprint } from '../../types';
import { getMonthLabels } from '../../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface ChartsProps {
  monthlyData: any[];
  footprint: CarbonFootprint | null;
}

export const Charts: React.FC<ChartsProps> = ({ monthlyData, footprint }) => {
  const months = getMonthLabels(12);

  // Prepare monthly trend data
  const trendData = {
    labels: months,
    datasets: [
      {
        label: 'Carbon Footprint',
        data: monthlyData.map(d => d.totalEmissions || 0).reverse(),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: 'Monthly Carbon Footprint Trend',
        color: '#F3F4F6',
        font: { size: 16, weight: 'bold' as const },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(75, 85, 99, 0.2)' },
        ticks: { color: '#9CA3AF' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF' },
      },
    },
  };

  // Category breakdown data
  const categoryData = footprint ? {
    labels: ['Energy', 'Travel', 'Diet'],
    datasets: [
      {
        data: [
          footprint.categories.energy,
          footprint.categories.travel,
          footprint.categories.diet,
        ],
        backgroundColor: ['#10B981', '#34D399', '#6EE7B7'],
        borderColor: ['#047857', '#059669', '#10B981'],
        borderWidth: 2,
      },
    ],
  } : {
    labels: ['Energy', 'Travel', 'Diet'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#10B981', '#34D399', '#6EE7B7'] }],
  };

  const categoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          font: { size: 12 },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Footprint Breakdown by Category',
        color: '#F3F4F6',
        font: { size: 16, weight: 'bold' as const },
      },
    },
  };

  return (
    <div className="card">
      <div className="grid grid-cols-1 gap-8">
        {/* Trend Chart */}
        <div className="h-[300px]">
          <Line data={trendData} options={trendOptions} />
        </div>

        {/* Category Breakdown */}
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-full max-w-[300px]">
            <Doughnut data={categoryData} options={categoryOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};