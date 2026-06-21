import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { CarbonScore } from '../components/dashboard/CarbonScore';
import { Charts } from '../components/dashboard/Charts';
import { ActionTracker } from '../components/dashboard/ActionTracker';
import { Insights } from '../components/dashboard/Insights';
import { Leaf, TrendingUp, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const DashboardPage: React.FC = () => {
  const { latestFootprint, footprints, actions, insights, loading, refreshData } = useData();

  // Refresh data when dashboard is mounted
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Show empty state if no data
  if (!loading && !latestFootprint) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="card text-center py-16">
          <Leaf className="w-20 h-20 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Welcome to CarbonVault!</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start tracking your carbon footprint by calculating your first emissions data.
          </p>
          <Link to="/calculator">
            <button className="btn-primary inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors">
              <TrendingUp className="w-5 h-5" />
              Calculate Your Footprint
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={refreshData} variant="secondary" disabled={loading}>
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {latestFootprint && <CarbonScore footprint={latestFootprint} />}
        </div>
        <div>{insights && <Insights insights={insights} />}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Charts monthlyData={footprints} footprint={latestFootprint} />
        <ActionTracker actions={actions} onActionAdded={refreshData} />
      </div>
    </div>
  );
};

export default DashboardPage;

// Made with Bob
