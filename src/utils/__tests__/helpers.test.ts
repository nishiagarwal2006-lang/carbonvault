import {
  calculateCarbonFootprint,
  getCarbonScore,
  getEmissionCategory,
  formatNumber,
  getMonthLabels,
  debounce
} from '../helpers';

describe('Helpers', () => {
  test('calculateCarbonFootprint calculates correctly', () => {
    const inputs = {
      electricity: 100,
      gas: 10,
      heating: 5,
      carMiles: 50,
      flights: 100,
      publicTransport: 20,
      meatConsumption: 7,
      vegetarianMeals: 7,
      dairyConsumption: 14,
    };

    const result = calculateCarbonFootprint(inputs);
    
    expect(result.totalEmissions).toBeGreaterThan(0);
    expect(result.categories.energy).toBeDefined();
    expect(result.categories.travel).toBeDefined();
    expect(result.categories.diet).toBeDefined();
  });

  test('getCarbonScore returns value between 0 and 100', () => {
    expect(getCarbonScore(5000)).toBeGreaterThanOrEqual(0);
    expect(getCarbonScore(5000)).toBeLessThanOrEqual(100);
    expect(getCarbonScore(1000)).toBe(100);
    expect(getCarbonScore(20000)).toBe(0);
  });

  test('getEmissionCategory returns correct category', () => {
    expect(getEmissionCategory(5000)).toBe('low');
    expect(getEmissionCategory(9000)).toBe('medium');
    expect(getEmissionCategory(15000)).toBe('high');
  });

  test('formatNumber formats numbers with commas', () => {
    expect(formatNumber(1234)).toBe('1,234.0');
    expect(formatNumber(1234.56, 2)).toBe('1,234.56');
  });

  test('getMonthLabels returns 12 months', () => {
    const labels = getMonthLabels(12);
    expect(labels).toHaveLength(12);
    expect(labels[0]).toBeDefined();
  });

  test('debounce delays function execution', (done) => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    debouncedFn();
    debouncedFn();
    
    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    }, 150);
  });
});