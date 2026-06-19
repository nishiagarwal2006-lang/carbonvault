import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PDFExport } from '../components/reports/PDFExport';
import { CSVExport } from '../components/reports/CSVExport';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { CarbonFootprint, EcoAction, CarbonInsight, ReportData } from '../types';
import { FileText, Download, Calendar, User } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [footprints, setFootprints] = useState<CarbonFootprint[]>([]);

  useEffect(() => {
    if (user) {
      loadReportData();
    }
  }, [user]);

  const loadReportData = async () => {
    try {
      setLoading(true);

      // Load footprints
      const footprintQuery = query(
        collection(db, 'carbonFootprints'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(12)
      );
      const footprintSnapshot = await getDocs(footprintQuery);
      const footprintsData = footprintSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as CarbonFootprint[];
      setFootprints(footprintsData);

      // Load actions
      const actionsQuery = query(
        collection(db, 'ecoActions'),
        where('userId', '==', user?.uid),
        where('completed', '==', true)
      );
      const actionsSnapshot = await getDocs(actionsQuery);
      const actions = actionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as EcoAction[];

      // Load insights
      const insightsQuery = query(
        collection(db, 'carbonInsights'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(1)
      );
      const insightsSnapshot = await getDocs(insightsQuery);
      let insights: CarbonInsight | null = null;
      if (!insightsSnapshot.empty) {
        const data = insightsSnapshot.docs[0].data();
        insights = {
          id: insightsSnapshot.docs[0].id,
          ...data,
          date: data.date.toDate(),
        } as CarbonInsight;
      }

      // Build report data
      const latestFootprint = footprintsData[0];
      if (latestFootprint) {
        const report: ReportData = {
          user: {
            name: user?.displayName || user?.email?.split('@')[0] || 'User',
            email: user?.email || '',
          },
          date: new Date(),
          totalEmissions: latestFootprint.totalEmissions,
          categories: latestFootprint.categories,
          monthlyTrend: {
            labels: footprintsData.map(f => f.date.toLocaleDateString('default', { month: 'short' })).reverse(),
            data: footprintsData.map(f => f.totalEmissions).reverse(),
          },
          actionsCompleted: actions.length,
          totalPoints: actions.reduce((sum, a) => sum + a.points, 0),
          insights: insights?.insights || [],
          recommendations: insights?.recommendations || [],
        };
        setReportData(report);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!reportData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Report Data</h2>
        <p className="text-gray-400">
          Complete your carbon footprint calculation to generate reports.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-primary-500" />
            <h3 className="font-medium">User</h3>
          </div>
          <p className="text-lg font-semibold">{reportData.user.name}</p>
          <p className="text-sm text-gray-400">{reportData.user.email}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            <h3 className="font-medium">Report Date</h3>
          </div>
          <p className="text-lg font-semibold">
            {reportData.date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-primary-500" />
            <h3 className="font-medium">Total Footprint</h3>
          </div>
          <p className="text-2xl font-bold text-primary-500">
            {formatNumber(reportData.totalEmissions)} kg CO₂e
          </p>
          <p className="text-sm text-gray-400">per year</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <PDFExport reportData={reportData} />
        <CSVExport footprints={footprints} />
      </div>

      {/* Report Preview */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Category Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(reportData.categories).map(([category, value]) => (
                <div key={category} className="flex items-center justify-between p-2 bg-dark-200 rounded-lg">
                  <span className="capitalize">{category}</span>
                  <span className="font-semibold">{formatNumber(value)} kg</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Achievements</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-dark-200 rounded-lg">
                <span>Actions Completed</span>
                <span className="font-semibold">{reportData.actionsCompleted}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-dark-200 rounded-lg">
                <span>Total Points</span>
                <span className="font-semibold">{reportData.totalPoints}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Preview */}
        {reportData.insights.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Key Insights</h3>
            <ul className="space-y-2">
              {reportData.insights.slice(0, 3).map((insight, index) => (
                <li key={index} className="text-sm text-gray-300 bg-dark-200 p-3 rounded-lg">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;