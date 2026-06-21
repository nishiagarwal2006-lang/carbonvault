import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { PDFExport } from '../components/reports/PDFExport';
import { CSVExport } from '../components/reports/CSVExport';
import { FileText, Download, TrendingUp, Leaf, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { footprints, actions, loading, refreshData } = useData();

  // Refresh data when reports page is mounted
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Calculate summary stats
  const totalEmissions = footprints.reduce((sum, f) => sum + (f.totalEmissions || 0), 0);
  const averageEmissions = footprints.length > 0 ? totalEmissions / footprints.length : 0;
  const totalCarbonSaved = actions.reduce((sum, a) => sum + (a.carbonSaved || 0), 0);

  // Show empty state if no data
  if (!loading && footprints.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Reports</h1>

        <div className="card text-center py-16">
          <FileText className="w-20 h-20 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">No Data Yet</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start calculating your carbon footprint to generate reports and track your progress over
            time.
          </p>
          <Link to="/calculator">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors">
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-gray-400">Export and analyze your carbon footprint data</p>
          </div>
          <Button onClick={refreshData} variant="secondary" disabled={loading}>
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-500">{footprints.length}</div>
            <div className="text-sm text-gray-400">Total Calculations</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-500">{averageEmissions.toFixed(1)}</div>
            <div className="text-sm text-gray-400">Avg. Emissions (kg CO₂e)</div>
          </div>
          <div className="card text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary-500">
              <Leaf className="w-6 h-6" />
              {totalCarbonSaved.toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Carbon Saved (kg)</div>
          </div>
        </div>

        {/* Export Options */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Download className="w-6 h-6 text-primary-500" />
            Export Your Data
          </h2>
          <p className="text-gray-400 mb-6">
            Download your carbon footprint data in different formats for analysis or record-keeping.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PDFExport
              reportData={{
                user: {
                  name: user?.displayName || user?.email?.split('@')[0] || 'User',
                  email: user?.email || '',
                },
                date: new Date(),
                totalEmissions,
                categories: {
                  energy: footprints.reduce((sum, f) => sum + (f.categories?.energy || 0), 0),
                  travel: footprints.reduce((sum, f) => sum + (f.categories?.travel || 0), 0),
                  diet: footprints.reduce((sum, f) => sum + (f.categories?.diet || 0), 0),
                },
                actionsCompleted: actions.length,
                totalPoints: actions.reduce((sum, a) => sum + (a.points || 0), 0),
                insights: [],
                recommendations: [],
                monthlyTrend: {
                  labels: footprints.map((f) =>
                    f.date.toLocaleDateString('en-US', { month: 'short' })
                  ),
                  data: footprints.map((f) => f.totalEmissions || 0),
                },
              }}
            />
            <CSVExport footprints={footprints} />
          </div>
        </div>

        {/* Recent Data Table */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Calculations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Energy</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Travel</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Diet</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Total</th>
                </tr>
              </thead>
              <tbody>
                {footprints.slice(0, 10).map((footprint, index) => (
                  <tr
                    key={index}
                    className="border-b border-dark-200/50 hover:bg-dark-100/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm">{footprint.date.toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      {footprint.categories?.energy?.toFixed(1) || '0.0'} kg
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      {footprint.categories?.travel?.toFixed(1) || '0.0'} kg
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      {footprint.categories?.diet?.toFixed(1) || '0.0'} kg
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-primary-500">
                      {footprint.totalEmissions?.toFixed(1) || '0.0'} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

// Made with Bob
