/**
 * Time conversion constants
 * Used for converting weekly/monthly data to annual values
 */
export const TIME_PERIODS = {
  WEEKS_PER_YEAR: 52,
  MONTHS_PER_YEAR: 12,
  DAYS_PER_WEEK: 7,
  DAYS_PER_YEAR: 365,
} as const;

/**
 * Carbon emission factors (kg CO2e per unit)
 * Based on EPA and IPCC data for US averages
 */
export const EMISSION_FACTORS = {
  energy: {
    electricity: 0.233, // per kWh (US grid average)
    gas: 5.3, // per therm
    heating: 10.15, // per gallon of heating oil
  },
  travel: {
    car: 0.191, // per mile (average passenger vehicle)
    flight: 0.235, // per mile (economy class)
    publicTransport: 0.087, // per mile (bus/train average)
  },
  diet: {
    meat: 6.61, // per meal (beef-heavy)
    vegetarian: 1.37, // per meal (plant-based)
    dairy: 1.2, // per serving
  },
} as const;

/**
 * National average carbon emissions (kg CO2e per year)
 * US average values for comparison
 */
export const NATIONAL_AVERAGE = {
  total: 16000, // Total annual emissions
  energy: 6000, // Home energy use
  travel: 5000, // Transportation
  diet: 3000, // Food consumption
} as const;

/**
 * Carbon score calculation thresholds
 * Used to determine emission categories and scores
 */
export const CARBON_SCORE = {
  MIN_EMISSIONS: 1000, // Ideal annual emissions (kg CO2e)
  MAX_EMISSIONS: 20000, // High annual emissions (kg CO2e)
  MAX_SCORE: 100, // Perfect score
  MIN_SCORE: 0, // Worst score
  LOW_THRESHOLD: 6000, // Below this is "low" emissions
  MEDIUM_THRESHOLD: 12000, // Below this is "medium" emissions
} as const;

/**
 * Input validation bounds
 * Reasonable limits for user inputs
 */
export const INPUT_BOUNDS = {
  MIN_VALUE: 0,
  MAX_VALUE: 1000000,
  MAX_STRING_LENGTH: 1000,
} as const;

/**
 * UI timing constants (milliseconds)
 */
export const UI_TIMING = {
  SAVE_DELAY: 800, // Delay before navigation after save
  TOAST_DURATION: 5000, // Toast notification duration
  DEBOUNCE_DELAY: 300, // Input debounce delay
  THROTTLE_DELAY: 1000, // Scroll/resize throttle delay
} as const;

export const ACTION_POINTS = {
  renewable_energy: 50,
  cycling: 30,
  plant_based_meal: 20,
  public_transport: 25,
  reduce_waste: 15,
  energy_efficient: 35,
};

export const ACTION_CARBON_SAVINGS = {
  renewable_energy: 2.5, // kg CO2e per day
  cycling: 1.8, // kg CO2e per day
  plant_based_meal: 1.2, // kg CO2e per meal
  public_transport: 1.5, // kg CO2e per day
  reduce_waste: 0.8, // kg CO2e per day
  energy_efficient: 2.0, // kg CO2e per day
};
