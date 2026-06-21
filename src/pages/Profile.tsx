import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { User, Mail, Award, Leaf, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserStats {
  totalFootprints: number;
  totalActions: number;
  totalPoints: number;
  totalCarbonSaved: number;
  averageEmissions: number;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalFootprints: 0,
    totalActions: 0,
    totalPoints: 0,
    totalCarbonSaved: 0,
    averageEmissions: 0,
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Load data in parallel
      const [footprintSnapshot, actionsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'carbonFootprints'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'ecoActions'), where('userId', '==', user.uid), where('completed', '==', true)))
      ]);

      const footprints = footprintSnapshot.docs.map(doc => doc.data());
      const actions = actionsSnapshot.docs.map(doc => doc.data());

      // Calculate stats
      const totalPoints = actions.reduce((sum, action) => sum + (action.points || 0), 0);
      const totalCarbonSaved = actions.reduce((sum, action) => sum + (action.carbonSaved || 0), 0);
      const totalEmissions = footprints.reduce((sum, f) => sum + (f.totalEmissions || 0), 0);
      const averageEmissions = footprints.length > 0 ? totalEmissions / footprints.length : 0;

      setStats({
        totalFootprints: footprints.length,
        totalActions: actions.length,
        totalPoints,
        totalCarbonSaved,
        averageEmissions,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {/* User Info Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.displayName || user?.email?.split('@')[0] || 'User'}</h2>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <Calendar className="w-4 h-4 inline mr-1" />
              Member since {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats.totalFootprints > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary-500">{stats.totalFootprints}</div>
                <div className="text-sm text-gray-400">Calculations</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-primary-500">{stats.totalActions}</div>
                <div className="text-sm text-gray-400">Actions Taken</div>
              </div>
              <div className="card text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary-500">
                  <Award className="w-6 h-6" />
                  {stats.totalPoints}
                </div>
                <div className="text-sm text-gray-400">Total Points</div>
              </div>
              <div className="card text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary-500">
                  <Leaf className="w-6 h-6" />
                  {stats.totalCarbonSaved.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">kg CO₂ Saved</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Environmental Impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Average Carbon Footprint</span>
                    <span className="font-semibold">{stats.averageEmissions.toFixed(1)} kg CO₂e</span>
                  </div>
                  <div className="w-full bg-dark-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((stats.averageEmissions / 20000) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Actions Completed</span>
                    <span className="font-semibold">{stats.totalActions}</span>
                  </div>
                  <div className="w-full bg-dark-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((stats.totalActions / 100) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Carbon Saved</span>
                    <span className="font-semibold">{stats.totalCarbonSaved.toFixed(1)} kg CO₂e</span>
                  </div>
                  <div className="w-full bg-dark-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((stats.totalCarbonSaved / 1000) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="card text-center py-12 mb-6">
            <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Your Journey</h3>
            <p className="text-gray-400 mb-6">
              Calculate your first carbon footprint to see your environmental impact stats here.
            </p>
            <Link to="/calculator">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-semibold transition-colors">
                <TrendingUp className="w-5 h-5" />
                Calculate Now
              </button>
            </Link>
          </div>
        )}

        {/* Logout Section */}
        <div className="flex gap-4">
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="w-full md:w-auto"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// Made with Bob
