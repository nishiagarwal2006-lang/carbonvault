import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CarbonScore } from '../components/dashboard/CarbonScore';
import { Charts } from '../components/dashboard/Charts';
import { ActionTracker } from '../components/dashboard/ActionTracker';
import { Insights } from '../components/dashboard/Insights';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { CarbonFootprint, EcoAction, CarbonInsight } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [footprint, setFootprint] = useState<CarbonFootprint | null>(null);
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [insights, setInsights] = useState<CarbonInsight | null>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load latest carbon footprint
      const footprintQuery = query(
        collection(db, 'carbonFootprints'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(1)
      );
      const footprintSnapshot = await getDocs(footprintQuery);
      if (!footprintSnapshot.empty) {
        const data = footprintSnapshot.docs[0].data();
        setFootprint({
          id: footprintSnapshot.docs[0].id,
          ...data,
          date: data.date.toDate(),
        } as CarbonFootprint);
      }

      // Load actions
      const actionsQuery = query(
        collection(db, 'ecoActions'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(10)
      );
      const actionsSnapshot = await getDocs(actionsQuery);
      const actionsData = actionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as EcoAction[];
      setActions(actionsData);

      // Load insights
      const insightsQuery = query(
        collection(db, 'carbonInsights'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(1)
      );
      const insightsSnapshot = await getDocs(insightsQuery);
      if (!insightsSnapshot.empty) {
        const data = insightsSnapshot.docs[0].data();
        setInsights({
          id: insightsSnapshot.docs[0].id,
          ...data,
          date: data.date.toDate(),
        } as CarbonInsight);
      }

      // Load monthly data for charts
      const monthlyQuery = query(
        collection(db, 'carbonFootprints'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(12)
      );
      const monthlySnapshot = await getDocs(monthlyQuery);
      const monthlyData = monthlySnapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));
      setMonthlyData(monthlyData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {footprint && <CarbonScore footprint={footprint} />}
        </div>
        <div>
          {insights && <Insights insights={insights} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Charts monthlyData={monthlyData} footprint={footprint} />
        <ActionTracker actions={actions} onActionAdded={loadDashboardData} />
      </div>
    </div>
  );
};

export default DashboardPage;