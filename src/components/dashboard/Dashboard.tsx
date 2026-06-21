import React, { useState, useMemo, useCallback, memo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCarbonData } from '../../hooks/useCarbonData';
import { CarbonScore } from './CarbonScore';
import { Charts } from './Charts';
import { ActionTracker } from './ActionTracker';
import { Insights } from './Insights';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Card } from '../common/Card';
import {
  TrendingUp,
  Award,
  Leaf,
  Calendar,
  ChevronRight,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Car,
  Utensils
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber, getCarbonScore, getEmissionCategory } from '../../utils/helpers';
import { EcoAction } from '../../types';

interface DashboardProps {
  onActionAdded?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = memo(({ onActionAdded }) => {
  const { user } = useAuth();
  const {
    loading,
    footprint,
    actions,
    insights,
    monthlyData,
    refetch
  } = useCarbonData();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [showAllActions, setShowAllActions] = useState(false);

  // Memoized calculations for performance
  const stats = useMemo(() => {
    const totalPoints = actions.reduce((sum, action) => sum + (action.points || 0), 0);
    const totalCarbonSaved = actions.reduce((sum, action) => sum + (action.carbonSaved || 0), 0);
    const completedActions = actions.filter(a => a.completed).length;
    const carbonScore = footprint ? getCarbonScore(footprint.totalEmissions) : 0;
    const emissionCategory = footprint ? getEmissionCategory(footprint.totalEmissions) : 'medium';
    
    return { totalPoints, totalCarbonSaved, completedActions, carbonScore, emissionCategory };
  }, [actions, footprint]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'low': return 'text-primary-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'low': return 'Low Impact';
      case 'medium': return 'Medium Impact';
      case 'high': return 'High Impact';
      default: return 'Unknown';
    }
  };

  const handleActionAdded = () => {
    refetch();
    if (onActionAdded) {
      onActionAdded();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Here's your carbon footprint overview for {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/calculator" className="btn-primary">
            <Zap className="w-4 h-4" />
            New Calculation
          </Link>
          <Link to="/reports" className="btn-secondary">
            <BarChart3 className="w-4 h-4" />
            Reports
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Carbon Score</span>
            <Target className={`w-5 h-5 ${getCategoryColor(stats.emissionCategory)}`} />
          </div>
          <div className="text-3xl font-bold text-primary-500">{stats.carbonScore}</div>
          <div className="text-sm text-gray-400">/ 100</div>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400">
            {getCategoryLabel(stats.emissionCategory)}
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Emissions</span>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-white">
            {footprint ? formatNumber(footprint.totalEmissions) : '0'}
          </div>
          <div className="text-sm text-gray-400">kg CO₂e / year</div>
          {footprint && (
            <div className="mt-2 w-full bg-dark-200 rounded-full h-1.5">
              <div
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((footprint.totalEmissions / 20000) * 100, 100)}%`
                }}
              />
            </div>
          )}
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Actions Taken</span>
            <Award className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.completedActions}</div>
          <div className="text-sm text-gray-400">Total Actions</div>
          <div className="mt-2 text-sm text-primary-400">
            +{stats.totalPoints} points earned
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Carbon Saved</span>
            <Leaf className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-white">
            {stats.totalCarbonSaved.toFixed(1)}
          </div>
          <div className="text-sm text-gray-400">kg CO₂e saved</div>
          <div className="mt-2 text-sm text-primary-400">
            🌱 Making a difference!
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Carbon Score and Charts */}
        <div className="lg:col-span-2 space-y-6">
          {footprint && <CarbonScore footprint={footprint} />}
          
          {/* Period Selector */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Trend Analysis</h3>
            <div className="flex gap-2" role="group" aria-label="Time period selection">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[40px] ${
                    selectedPeriod === period
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-100 text-gray-400 hover:text-white'
                  }`}
                  aria-pressed={selectedPeriod === period}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Charts monthlyData={monthlyData} footprint={footprint} />
        </div>

        {/* Right Column - Insights and Actions */}
        <div className="space-y-6">
          {insights && <Insights insights={insights} />}
          
          <ActionTracker 
            actions={actions.slice(0, showAllActions ? undefined : 5)} 
            onActionAdded={handleActionAdded}
          />
          
          {actions.length > 5 && (
            <button
              onClick={() => setShowAllActions(!showAllActions)}
              className="flex items-center justify-center gap-2 w-full py-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              {showAllActions ? 'Show Less' : `View All ${actions.length} Actions`}
              <ChevronRight className={`w-4 h-4 transition-transform ${showAllActions ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      {footprint && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Footprint Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-dark-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary-500" />
                <h4 className="font-medium">Energy</h4>
              </div>
              <div className="text-2xl font-bold">{formatNumber(footprint.categories.energy)}</div>
              <div className="text-sm text-gray-400">kg CO₂e</div>
              <div className="mt-2 w-full bg-dark-100 rounded-full h-1.5">
                <div 
                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((footprint.categories.energy / footprint.totalEmissions) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-dark-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-5 h-5 text-primary-500" />
                <h4 className="font-medium">Travel</h4>
              </div>
              <div className="text-2xl font-bold">{formatNumber(footprint.categories.travel)}</div>
              <div className="text-sm text-gray-400">kg CO₂e</div>
              <div className="mt-2 w-full bg-dark-100 rounded-full h-1.5">
                <div 
                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((footprint.categories.travel / footprint.totalEmissions) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            <div className="p-4 bg-dark-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="w-5 h-5 text-primary-500" />
                <h4 className="font-medium">Diet</h4>
              </div>
              <div className="text-2xl font-bold">{formatNumber(footprint.categories.diet)}</div>
              <div className="text-sm text-gray-400">kg CO₂e</div>
              <div className="mt-2 w-full bg-dark-100 rounded-full h-1.5">
                <div 
                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min((footprint.categories.diet / footprint.totalEmissions) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/calculator"
            className="flex flex-col items-center gap-2 p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors"
          >
            <Zap className="w-6 h-6 text-primary-500" />
            <span className="text-sm font-medium">New Calculation</span>
          </Link>
          <Link
            to="/reports"
            className="flex flex-col items-center gap-2 p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-primary-500" />
            <span className="text-sm font-medium">View Reports</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center gap-2 p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors"
          >
            <Award className="w-6 h-6 text-primary-500" />
            <span className="text-sm font-medium">My Profile</span>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex flex-col items-center gap-2 p-4 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors"
          >
            <Calendar className="w-6 h-6 text-primary-500" />
            <span className="text-sm font-medium">Refresh Data</span>
          </button>
        </div>
      </Card>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;