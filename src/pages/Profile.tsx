import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { User, Mail, Award, Leaf, Calendar, Edit2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface UserStats {
  totalFootprints: number;
  totalActions: number;
  totalPoints: number;
  totalCarbonSaved: number;
  averageEmissions: number;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [stats, setStats] = useState<UserStats>({
    totalFootprints: 0,
    totalActions: 0,
    totalPoints: 0,
    totalCarbonSaved: 0,
    averageEmissions: 0,
  });

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      setLoading(true);

      // Get footprints count
      const footprintQuery = query(
        collection(db, 'carbonFootprints'),
        where('userId', '==', user?.uid)
      );
      const footprintSnapshot = await getDocs(footprintQuery);
      const footprints = footprintSnapshot.docs.map(doc => doc.data());
      
      // Get actions
      const actionsQuery = query(
        collection(db, 'ecoActions'),
        where('userId', '==', user?.uid),
        where('completed', '==', true)
      );
      const actionsSnapshot = await getDocs(actionsQuery);
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
      toast.error('Failed to load user statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      // Update display name in Firebase Auth
      // Note: This would require additional Firebase Auth operations
      // For simplicity, we'll update Firestore user document
      
      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          displayName,
          updatedAt: new Date(),
        });
      }

      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

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
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input-field text-lg font-semibold"
                      placeholder="Enter your name"
                    />
                    <Button onClick={handleUpdateProfile} className="min-w-[48px] p-2">
                      <Save className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        setEditing(false);
                        setDisplayName(user?.displayName || '');
                      }}
                      className="min-w-[48px] p-2"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{displayName || 'User'}</h2>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-2 rounded-lg hover:bg-dark-100 transition-colors"
                      aria-label="Edit profile"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}
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
        <div className="card">
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

        {/* Logout Section */}
        <div className="mt-6">
          <Button 
            variant="secondary" 
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                window.location.href = '/logout';
              }
            }}
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