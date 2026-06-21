import React, { useState } from 'react';
import { EcoAction } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '../common/Button';
import { Award, Leaf, Bike, Utensils, Bus, Trash2, Zap, Plus, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { ACTION_POINTS, ACTION_CARBON_SAVINGS } from '../../utils/constants';

interface ActionTrackerProps {
  actions: EcoAction[];
  onActionAdded: () => void;
}

const ACTION_TYPES = [
  { id: 'renewable_energy', label: 'Use Renewable Energy', icon: Zap, category: 'energy' },
  { id: 'cycling', label: 'Cycle Instead of Drive', icon: Bike, category: 'travel' },
  { id: 'plant_based_meal', label: 'Plant-Based Meal', icon: Utensils, category: 'diet' },
  { id: 'public_transport', label: 'Use Public Transport', icon: Bus, category: 'travel' },
  { id: 'reduce_waste', label: 'Reduce Waste', icon: Trash2, category: 'waste' },
  { id: 'energy_efficient', label: 'Energy Efficient Upgrade', icon: Zap, category: 'energy' },
];

export const ActionTracker: React.FC<ActionTrackerProps> = ({ actions, onActionAdded }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  const totalPoints = actions.reduce((sum, action) => sum + action.points, 0);
  const totalCarbonSaved = actions.reduce((sum, action) => sum + action.carbonSaved, 0);

  const handleAddAction = async () => {
    if (!selectedAction || !user) return;

    setLoading(true);
    try {
      const actionData: Omit<EcoAction, 'id'> = {
        userId: user.uid,
        action: selectedAction,
        category: (ACTION_TYPES.find((a) => a.id === selectedAction)?.category as any) || 'other',
        date: new Date(),
        points: ACTION_POINTS[selectedAction as keyof typeof ACTION_POINTS] || 10,
        carbonSaved:
          ACTION_CARBON_SAVINGS[selectedAction as keyof typeof ACTION_CARBON_SAVINGS] || 1,
        completed: true,
      };

      await addDoc(collection(db, 'ecoActions'), {
        ...actionData,
        date: serverTimestamp(),
      });

      toast.success('Action logged successfully! 🌱');
      onActionAdded();
      setSelectedAction('');
    } catch (error) {
      console.error('Error adding action:', error);
      toast.error('Failed to log action');
    } finally {
      setLoading(false);
    }
  };

  const completedActions = actions.filter((a) => a.completed);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Action Tracker</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-dark-200 rounded-lg text-center">
          <Award className="w-6 h-6 text-primary-500 mx-auto mb-1" />
          <p className="text-sm text-gray-400">Points</p>
          <p className="text-xl font-bold">{totalPoints}</p>
        </div>
        <div className="p-3 bg-dark-200 rounded-lg text-center">
          <Leaf className="w-6 h-6 text-primary-500 mx-auto mb-1" />
          <p className="text-sm text-gray-400">Carbon Saved</p>
          <p className="text-xl font-bold">{totalCarbonSaved.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Add Action */}
      <div className="space-y-3 mb-6">
        <label htmlFor="action-select" className="block text-sm font-medium text-gray-300">
          Log a New Action
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            id="action-select"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="input-field flex-1"
            aria-label="Select an eco-friendly action"
          >
            <option value="">Choose an action...</option>
            {ACTION_TYPES.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
          <Button
            onClick={handleAddAction}
            disabled={!selectedAction || loading}
            className="flex-1 sm:flex-none"
          >
            <Plus className="w-5 h-5" />
            {loading ? 'Logging...' : 'Log Action'}
          </Button>
        </div>
      </div>

      {/* Recent Actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Actions</h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {completedActions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              No actions logged yet. Start your eco-journey today!
            </p>
          ) : (
            completedActions.slice(0, 5).map((action) => {
              const ActionIcon = ACTION_TYPES.find((a) => a.id === action.action)?.icon || Leaf;
              return (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-dark-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500/10 rounded-full flex items-center justify-center">
                      <ActionIcon className="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {ACTION_TYPES.find((a) => a.id === action.action)?.label || action.action}
                      </p>
                      <p className="text-xs text-gray-400">{action.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-primary-500">+{action.points} pts</span>
                    <Check className="w-4 h-4 text-primary-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
