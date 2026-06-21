import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { CarbonFootprint, EcoAction, CarbonInsight } from '../types';

interface DataContextType {
  footprints: CarbonFootprint[];
  latestFootprint: CarbonFootprint | null;
  actions: EcoAction[];
  insights: CarbonInsight | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  lastRefresh: Date | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [footprints, setFootprints] = useState<CarbonFootprint[]>([]);
  const [latestFootprint, setLatestFootprint] = useState<CarbonFootprint | null>(null);
  const [actions, setActions] = useState<EcoAction[]>([]);
  const [insights, setInsights] = useState<CarbonInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refreshData = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Load all data in parallel
      const [footprintSnapshot, actionsSnapshot, insightsSnapshot] = await Promise.all([
        getDocs(
          query(
            collection(db, 'carbonFootprints'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(12)
          )
        ),
        getDocs(
          query(
            collection(db, 'ecoActions'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(10)
          )
        ),
        getDocs(
          query(
            collection(db, 'carbonInsights'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(1)
          )
        ),
      ]);

      // Process footprints
      const footprintsData = footprintSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as CarbonFootprint[];
      setFootprints(footprintsData);
      setLatestFootprint(footprintsData[0] || null);

      // Process actions
      const actionsData = actionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as EcoAction[];
      setActions(actionsData);

      // Process insights
      if (!insightsSnapshot.empty) {
        const data = insightsSnapshot.docs[0].data();
        setInsights({
          id: insightsSnapshot.docs[0].id,
          ...data,
          date: data.date?.toDate() || new Date(),
        } as CarbonInsight);
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load data once when user logs in
  useEffect(() => {
    if (user && !lastRefresh) {
      refreshData();
    }
  }, [user, lastRefresh, refreshData]);

  return (
    <DataContext.Provider
      value={{
        footprints,
        latestFootprint,
        actions,
        insights,
        loading,
        refreshData,
        lastRefresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Made with Bob
