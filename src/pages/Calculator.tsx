import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { calculateCarbonFootprint } from '../utils/helpers';
import { validateCalculatorInputs } from '../utils/validators';
import { CalculatorInputs, ValidationError } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { 
  Zap, 
  Car, 
  Utensils, 
  TrendingUp, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';

const Calculator: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [inputs, setInputs] = useState<CalculatorInputs>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({
      ...prev,
      [name]: numValue
    }));
    // Clear error for this field
    setErrors(prev => prev.filter(err => err.field !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const validationErrors = validateCalculatorInputs(inputs);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const footprint = calculateCarbonFootprint(inputs);
      
      // Save to Firestore
      await addDoc(collection(db, 'carbonFootprints'), {
        ...footprint,
        userId: user?.uid,
        date: serverTimestamp(),
      });

      setSubmitted(true);
      toast.success('Carbon footprint calculated successfully!');
      
      // Generate insights
      await generateInsights(footprint);
      
    } catch (error) {
      console.error('Error saving footprint:', error);
      toast.error('Failed to save calculation');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (footprint: any) => {
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalEmissions: footprint.totalEmissions,
          categories: footprint.categories,
          actions: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await addDoc(collection(db, 'carbonInsights'), {
            userId: user?.uid,
            insights: data.data.insights || [],
            recommendations: data.data.recommendations || [],
            date: serverTimestamp(),
            score: footprint.totalEmissions,
          });
        }
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };

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
    setSubmitted(false);
    setErrors([]);
  };

  const getFieldError = (fieldName: string) => {
    return errors.find(err => err.field === fieldName)?.message;
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto card text-center">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-primary-500" />
            <h2 className="text-2xl font-bold">Calculation Complete!</h2>
            <p className="text-gray-300">
              Your carbon footprint has been calculated and saved successfully.
            </p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Calculate Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Carbon Footprint Calculator</h1>
        <p className="text-gray-400 mb-8">
          Enter your monthly consumption data to calculate your carbon footprint
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Energy Section */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold">Energy Consumption</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="electricity" className="block text-sm font-medium text-gray-300 mb-1">
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
                  aria-describedby={getFieldError('electricity') ? 'electricity-error' : undefined}
                />
                {getFieldError('electricity') && (
                  <p id="electricity-error" className="text-sm text-red-400 mt-1">
                    {getFieldError('electricity')}
                  </p>
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
                  className={`input-field ${getFieldError('gas') ? 'border-red-500' : ''}`}
                  placeholder="e.g., 40"
                  min="0"
                  step="1"
                />
                {getFieldError('gas') && (
                  <p className="text-sm text-red-400 mt-1">{getFieldError('gas')}</p>
                )}
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
                  className={`input-field ${getFieldError('heating') ? 'border-red-500' : ''}`}
                  placeholder="e.g., 50"
                  min="0"
                  step="1"
                />
                {getFieldError('heating') && (
                  <p className="text-sm text-red-400 mt-1">{getFieldError('heating')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Section */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Car className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold">Travel</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="carMiles" className="block text-sm font-medium text-gray-300 mb-1">
                  Car Miles (miles/month)
                </label>
                <input
                  id="carMiles"
                  type="number"
                  name="carMiles"
                  value={inputs.carMiles || ''}
                  onChange={handleInputChange}
                  className={`input-field ${getFieldError('carMiles') ? 'border-red-500' : ''}`}
                  placeholder="e.g., 500"
                  min="0"
                  step="1"
                />
                {getFieldError('carMiles') && (
                  <p className="text-sm text-red-400 mt-1">{getFieldError('carMiles')}</p>
                )}
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
                  className={`input-field ${getFieldError('flights') ? 'border-red-500' : ''}`}
                  placeholder="e.g., 1000"
                  min="0"
                  step="1"
                />
                {getFieldError('flights') && (
                  <p className="text-sm text-red-400 mt-1">{getFieldError('flights')}</p>
                )}
              </div>

              <div>
                <label htmlFor="publicTransport" className="block text-sm font-medium text-gray-300 mb-1">
                  Public Transport (miles/month)
                </label>
                <input
                  id="publicTransport"
                  type="number"
                  name="publicTransport"
                  value={inputs.publicTransport || ''}
                  onChange={handleInputChange}
                  className={`input-field ${getFieldError('publicTransport') ? 'border-red-500' : ''}`}
                  placeholder="e.g., 100"
                  min="0"
                  step="1"
                />
                {getFieldError('publicTransport') && (
                  <p className="text-sm text-red-400 mt-1">{getFieldError('publicTransport')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Diet Section */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Utensils className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold">Diet</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="meatConsumption" className="block text-sm font-medium text-gray-300 mb-1">
                  Meat Meals (per week)
                </label>
                <input
                  id="meatConsumption"
                  type="number"
                  name="meatConsumption"
                  value={inputs.meatConsumption || ''}
                  onChange={handleInputChange}
                  className={`input-field ${getFieldError('meatConsumption') ? 'border-red-500' : ''}`}
                  placeholder="e.g., 7"
                  min="0"
                  max="21"
                  step="1"
                />
                {getFieldError('meatConsumption') && (
                  <p className="text-sm text-red-400 mt-1">{getFieldError('meatConsumption')}</p>
                )}
              </div>

              <div>
                <label htmlFor="vegetarianMeals" className="block text-sm font-medium text-gray-300 mb-1">
                  Vegetarian Meals (per week)
                </label>
                <input
                  id="vegetarianMeals"
                  type="number"
                  name="vegetarianMeals"
                  value={inputs.vegetarianMeals || ''}
                  onChange={handleInputChange}
                  className={`input-field ${getFieldError('vegetarianMeals') ? 'border-red-500' : ''}`}
                  placeholder="e.g., 7"
                  min="0"
                  max="21"
                  step="1"
                />
                {getFieldError('vegetarianMeals') && (
                  <p className="text-sm text-red-400 mt-1">{getFieldError('vegetarianMeals')}</p>
                )}
              </div>

              <div>
                <label htmlFor="dairyConsumption" className="block text-sm font-medium text-gray-300 mb-1">
                  Dairy Servings (per week)
                </label>
                <input
                  id="dairyConsumption"
                  type="number"
                  name="dairyConsumption"
                  value={inputs.dairyConsumption || ''}
                  onChange={handleInputChange}
                  className={`input-field ${getFieldError('dairyConsumption') ? 'border-red-500' : ''}`}
                  placeholder="e.g., 14"
                  min="0"
                  max="28"
                  step="1"
                />
                {getFieldError('dairyConsumption') && (
                  <p className="text-sm text-red-400 mt-1">{getFieldError('dairyConsumption')}</p>
                )}
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

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Calculating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Calculate Footprint
                </>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Calculator;