import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { calculateCarbonFootprint, getCarbonScore, getEmissionCategory } from '../utils/helpers';
import { validateCalculatorInputs } from '../utils/validators';
import { sanitizeNumber } from '../utils/security';
import { INPUT_BOUNDS, UI_TIMING } from '../utils/constants';
import { CalculatorInputs, ValidationError } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Zap, Car, Utensils, TrendingUp, AlertCircle, Leaf, Award, BarChart3 } from 'lucide-react';

const STORAGE_KEY = 'calculator_inputs';
const RESULTS_KEY = 'calculator_results';

const Calculator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showResults, setShowResults] = useState(() => {
    const saved = localStorage.getItem(RESULTS_KEY);
    return saved ? JSON.parse(saved).show : false;
  });
  const [results, setResults] = useState<any>(() => {
    const saved = localStorage.getItem(RESULTS_KEY);
    return saved ? JSON.parse(saved).data : null;
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          electricity: 0,
          gas: 0,
          heating: 0,
          carMiles: 0,
          flights: 0,
          publicTransport: 0,
          meatConsumption: 0,
          vegetarianMeals: 0,
          dairyConsumption: 0,
        };
  });

  // Save inputs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(RESULTS_KEY, JSON.stringify({ show: showResults, data: results }));
  }, [showResults, results]);

  // Debounced input handler for better performance
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Sanitize numeric input with defined bounds
    const sanitized = sanitizeNumber(value, INPUT_BOUNDS.MIN_VALUE, INPUT_BOUNDS.MAX_VALUE);
    const numValue = sanitized !== null ? sanitized : INPUT_BOUNDS.MIN_VALUE;

    setInputs((prev) => ({
      ...prev,
      [name]: numValue,
    }));
    setErrors((prev) => prev.filter((err) => err.field !== name));
    setShowResults(false);
  }, []);

  // Memoized calculation handler
  const handleCalculate = useCallback(() => {
    // Validate inputs
    const validationErrors = validateCalculatorInputs(inputs);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before calculating');
      return;
    }

    // Calculate immediately - NO LOADING
    const footprint = calculateCarbonFootprint(inputs);
    const score = getCarbonScore(footprint.totalEmissions);
    const category = getEmissionCategory(footprint.totalEmissions);

    setResults({
      ...footprint,
      score,
      category,
    });
    setShowResults(true);
    toast.success('Carbon footprint calculated!');
  }, [inputs]);

  // Memoized save handler
  const handleSave = useCallback(async () => {
    if (!results) return;

    setSaving(true);
    try {
      // Save complete footprint data to Firestore
      const footprintData = {
        userId: user?.uid,
        date: serverTimestamp(),
        energy: {
          electricity: inputs.electricity,
          gas: inputs.gas,
          heating: inputs.heating,
        },
        travel: {
          carMiles: inputs.carMiles,
          flights: inputs.flights,
          publicTransport: inputs.publicTransport,
        },
        diet: {
          meatConsumption: inputs.meatConsumption,
          vegetarianMeals: inputs.vegetarianMeals,
          dairyConsumption: inputs.dairyConsumption,
        },
        totalEmissions: results.totalEmissions,
        categories: {
          energy: results.categories.energy,
          travel: results.categories.travel,
          diet: results.categories.diet,
        },
        score: results.score,
        category: results.category,
      };

      // Save to Firestore (don't wait for refresh)
      await addDoc(collection(db, 'carbonFootprints'), footprintData);

      // Clear saved state
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(RESULTS_KEY);

      // Show success immediately
      setSaving(false);
      toast.success('Saved successfully! Redirecting to dashboard...');

      // Navigate after short delay to show toast
      setTimeout(() => {
        navigate('/dashboard');
      }, UI_TIMING.SAVE_DELAY);
    } catch (error) {
      console.error('Error saving:', error);
      setSaving(false);
      toast.error('Failed to save. Please try again.');
    }
  }, [results, user, navigate]);

  const resetForm = () => {
    setInputs({
      electricity: 0,
      gas: 0,
      heating: 0,
      carMiles: 0,
      flights: 0,
      publicTransport: 0,
      meatConsumption: 0,
      vegetarianMeals: 0,
      dairyConsumption: 0,
    });
    setShowResults(false);
    setResults(null);
    setErrors([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RESULTS_KEY);
  };

  const getFieldError = (fieldName: string) => {
    return errors.find((err) => err.field === fieldName)?.message;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Carbon Footprint Calculator</h1>
        <p className="text-gray-400 mb-8">
          Enter your monthly consumption data to calculate your carbon footprint instantly
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Energy Section */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-semibold">Energy Consumption</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="electricity"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Electricity (kWh/month)
                  </label>
                  <input
                    id="electricity"
                    type="number"
                    name="electricity"
                    value={inputs.electricity || ''}
                    onChange={handleInputChange}
                    className={`input-field ${getFieldError('electricity') ? 'border-red-500' : ''}`}
                    placeholder="e.g., 500"
                    min="0"
                    step="1"
                  />
                  {getFieldError('electricity') && (
                    <p className="text-sm text-red-400 mt-1">{getFieldError('electricity')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gas" className="block text-sm font-medium text-gray-300 mb-1">
                    Natural Gas (therms/month)
                  </label>
                  <input
                    id="gas"
                    type="number"
                    name="gas"
                    value={inputs.gas || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 40"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label htmlFor="heating" className="block text-sm font-medium text-gray-300 mb-1">
                    Heating Oil (gallons/month)
                  </label>
                  <input
                    id="heating"
                    type="number"
                    name="heating"
                    value={inputs.heating || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 50"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
            </div>

            {/* Travel Section */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Car className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-semibold">Travel</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="carMiles"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Car Miles (miles/month)
                  </label>
                  <input
                    id="carMiles"
                    type="number"
                    name="carMiles"
                    value={inputs.carMiles || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 500"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label htmlFor="flights" className="block text-sm font-medium text-gray-300 mb-1">
                    Flights (miles/month)
                  </label>
                  <input
                    id="flights"
                    type="number"
                    name="flights"
                    value={inputs.flights || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 1000"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="publicTransport"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Public Transport (miles/month)
                  </label>
                  <input
                    id="publicTransport"
                    type="number"
                    name="publicTransport"
                    value={inputs.publicTransport || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 100"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
            </div>

            {/* Diet Section */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-semibold">Diet</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="meatConsumption"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Meat Meals (per week)
                  </label>
                  <input
                    id="meatConsumption"
                    type="number"
                    name="meatConsumption"
                    value={inputs.meatConsumption || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 7"
                    min="0"
                    max="21"
                    step="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="vegetarianMeals"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Vegetarian Meals (per week)
                  </label>
                  <input
                    id="vegetarianMeals"
                    type="number"
                    name="vegetarianMeals"
                    value={inputs.vegetarianMeals || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 7"
                    min="0"
                    max="21"
                    step="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dairyConsumption"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Dairy Servings (per week)
                  </label>
                  <input
                    id="dairyConsumption"
                    type="number"
                    name="dairyConsumption"
                    value={inputs.dairyConsumption || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 14"
                    min="0"
                    max="28"
                    step="1"
                  />
                </div>
              </div>
            </div>

            {/* Error Summary */}
            {errors.length > 0 && (
              <div className="card border-red-500/20 bg-red-500/5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-400">Please fix the following errors:</h3>
                    <ul className="mt-2 space-y-1 text-sm text-red-300">
                      {errors.map((error, index) => (
                        <li key={index}>• {error.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleCalculate} fullWidth>
                <TrendingUp className="w-5 h-5" />
                Calculate Now
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {showResults && results ? (
              <>
                {/* Carbon Score */}
                <div className="card text-center">
                  <h3 className="text-lg font-semibold mb-4">Your Carbon Score</h3>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-dark-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - results.score / 100)}`}
                        className="text-primary-500 transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{results.score}</span>
                    </div>
                  </div>
                  <p className="text-gray-400">
                    {results.category === 'low' && '🌟 Excellent! Low emissions'}
                    {results.category === 'medium' && '⚠️ Moderate emissions'}
                    {results.category === 'high' && '🔴 High emissions - room for improvement'}
                  </p>
                </div>

                {/* Total Emissions */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Total Emissions</h3>
                    <Leaf className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="text-4xl font-bold text-primary-500 mb-2">
                    {results.totalEmissions.toFixed(1)}{' '}
                    <span className="text-xl text-gray-400">kg CO₂e</span>
                  </div>
                  <p className="text-sm text-gray-400">per month</p>
                </div>

                {/* Category Breakdown */}
                <div className="card">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-primary-500" />
                    <h3 className="text-lg font-semibold">Breakdown</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Energy</span>
                        <span className="font-semibold">
                          {results.categories.energy.toFixed(1)} kg
                        </span>
                      </div>
                      <div className="w-full bg-dark-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(results.categories.energy / results.totalEmissions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Travel</span>
                        <span className="font-semibold">
                          {results.categories.travel.toFixed(1)} kg
                        </span>
                      </div>
                      <div className="w-full bg-dark-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(results.categories.travel / results.totalEmissions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Diet</span>
                        <span className="font-semibold">
                          {results.categories.diet.toFixed(1)} kg
                        </span>
                      </div>
                      <div className="w-full bg-dark-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(results.categories.diet / results.totalEmissions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="card bg-primary-500/10 border-primary-500/20">
                  <h3 className="text-lg font-semibold mb-3">💡 Quick Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    {results.categories.energy > results.categories.travel &&
                      results.categories.energy > results.categories.diet && (
                        <li>• Consider switching to renewable energy sources</li>
                      )}
                    {results.categories.travel > results.categories.energy &&
                      results.categories.travel > results.categories.diet && (
                        <li>• Try carpooling or using public transport more often</li>
                      )}
                    {results.categories.diet > results.categories.energy &&
                      results.categories.diet > results.categories.travel && (
                        <li>• Reduce meat consumption and try more plant-based meals</li>
                      )}
                    <li>• Track your progress monthly to see improvements</li>
                    <li>• Small changes add up to big impact over time</li>
                  </ul>
                </div>

                {/* Save Button */}
                <Button onClick={handleSave} fullWidth disabled={saving}>
                  {saving ? 'Saving...' : 'Save to Dashboard'}
                </Button>
              </>
            ) : (
              <div className="card text-center py-12">
                <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Calculate?</h3>
                <p className="text-gray-400">
                  Enter your consumption data on the left and click "Calculate Now" to see your
                  carbon footprint instantly!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

// Made with Bob
