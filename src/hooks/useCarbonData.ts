import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { CarbonFootprint, EcoAction, CarbonInsight } from '../types';

export const useCarbonData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [footprint, setFootprint] = useState<CarbonFootprint | null>(null);
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [insights, setInsights] = useState<CarbonInsight | null>(null);
  const [monthlyData, setMonthlyData] = useState<CarbonFootprint[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load latest footprint
      const footprintQuery = query(
        collection(db, 'carbonFootprints'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(1)
      );
      const footprintSnap = await getDocs(footprintQuery);
      if (!footprintSnap.empty) {
        const data = footprintSnap.docs[0].data();
        setFootprint({
          id: footprintSnap.docs[0].id,
          ...data,
          date: data.date.toDate(),
        } as CarbonFootprint);
      }

      // Load actions
      const actionsQuery = query(
        collection(db, 'ecoActions'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(20)
      );
      const actionsSnap = await getDocs(actionsQuery);
      const actionsData = actionsSnap.docs.map((doc) => ({
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
      const insightsSnap = await getDocs(insightsQuery);
      if (!insightsSnap.empty) {
        const data = insightsSnap.docs[0].data();
        setInsights({
          id: insightsSnap.docs[0].id,
          ...data,
          date: data.date.toDate(),
        } as CarbonInsight);
      }

      // Load monthly data
      const monthlyQuery = query(
        collection(db, 'carbonFootprints'),
        where('userId', '==', user?.uid),
        orderBy('date', 'desc'),
        limit(12)
      );
      const monthlySnap = await getDocs(monthlyQuery);
      const monthlyData = monthlySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      })) as CarbonFootprint[];
      setMonthlyData(monthlyData);
    } catch (error) {
      console.error('Error loading carbon data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (user) {
      loadData();
    }
  };

  return {
    loading,
    footprint,
    actions,
    insights,
    monthlyData,
    refetch,
  };
};
