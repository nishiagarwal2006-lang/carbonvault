import { CarbonFootprint, CalculatorInputs } from '../types';
import { EMISSION_FACTORS, NATIONAL_AVERAGE } from './constants';

/**
 * Calculates the total carbon footprint based on user inputs
 * @param inputs - User's energy, travel, and diet consumption data
 * @returns Complete carbon footprint breakdown by category
 * @example
 * const footprint = calculateCarbonFootprint({
 *   electricity: 100,
 *   gas: 50,
 *   carMiles: 200,
 *   meatConsumption: 5
 * });
 */
export function calculateCarbonFootprint(inputs: CalculatorInputs): CarbonFootprint {
  const energyEmissions = 
    (inputs.electricity * EMISSION_FACTORS.energy.electricity) +
    (inputs.gas * EMISSION_FACTORS.energy.gas) +
    (inputs.heating * EMISSION_FACTORS.energy.heating);

  const travelEmissions =
    (inputs.carMiles * EMISSION_FACTORS.travel.car) +
    (inputs.flights * EMISSION_FACTORS.travel.flight) +
    (inputs.publicTransport * EMISSION_FACTORS.travel.publicTransport);

  const dietEmissions =
    (inputs.meatConsumption * EMISSION_FACTORS.diet.meat * 4) + // Weekly to monthly
    (inputs.vegetarianMeals * EMISSION_FACTORS.diet.vegetarian * 4) +
    (inputs.dairyConsumption * EMISSION_FACTORS.diet.dairy * 4);

  const totalEmissions = energyEmissions + travelEmissions + dietEmissions;

  return {
    userId: '',
    date: new Date(),
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
    totalEmissions,
    categories: {
      energy: energyEmissions,
      travel: travelEmissions,
      diet: dietEmissions,
    },
  };
}

/**
 * Calculates a carbon score (0-100) based on total emissions
 * Higher score indicates lower emissions (better performance)
 * @param totalEmissions - Total annual emissions in kg CO2e
 * @returns Score from 0 (worst) to 100 (best)
 */
export function getCarbonScore(totalEmissions: number): number {
  const maxScore = 100;
  const minEmissions = 1000; // kg CO2e per year (ideal)
  const maxEmissions = 20000; // kg CO2e per year (high)

  if (totalEmissions <= minEmissions) return maxScore;
  if (totalEmissions >= maxEmissions) return 0;

  const score = maxScore - ((totalEmissions - minEmissions) / (maxEmissions - minEmissions)) * maxScore;
  return Math.round(score);
}

/**
 * Categorizes emissions into low, medium, or high
 * @param totalEmissions - Total annual emissions in kg CO2e
 * @returns Emission category
 */
export function getEmissionCategory(totalEmissions: number): 'low' | 'medium' | 'high' {
  if (totalEmissions < 6000) return 'low';
  if (totalEmissions < 12000) return 'medium';
  return 'high';
}

/**
 * Compares user's emissions to national average and provides feedback
 * @param totalEmissions - Total annual emissions in kg CO2e
 * @returns Comparison message
 */
export function getComparisonToAverage(totalEmissions: number): string {
  const diff = ((totalEmissions - NATIONAL_AVERAGE.total) / NATIONAL_AVERAGE.total) * 100;
  if (diff < -20) return 'You\'re doing great! Your carbon footprint is significantly below average.';
  if (diff < -5) return 'Good job! Your carbon footprint is below average.';
  if (diff < 5) return 'Your carbon footprint is around the national average.';
  if (diff < 20) return 'Your carbon footprint is above average. Consider reducing your emissions.';
  return 'Your carbon footprint is well above average. You can make significant improvements.';
}

/**
 * Formats a number with commas and specified decimal places
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 * @example formatNumber(1234.567, 2) // "1,234.57"
 */
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Generates an array of month labels for charts
 * @param months - Number of months to generate (default: 12)
 * @returns Array of month labels (e.g., ["Jan", "Feb", ...])
 */
export function getMonthLabels(months: number = 12): string[] {
  const labels = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(date.toLocaleString('default', { month: 'short' }));
  }
  return labels;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}