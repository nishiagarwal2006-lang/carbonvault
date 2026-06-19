// Carbon emission factors (kg CO2e per unit)
export const EMISSION_FACTORS = {
  energy: {
    electricity: 0.233, // per kWh (US average)
    gas: 5.3, // per therm
    heating: 10.15, // per gallon of heating oil
  },
  travel: {
    car: 0.191, // per mile (US average)
    flight: 0.235, // per mile (economy class)
    publicTransport: 0.087, // per mile (US average)
  },
  diet: {
    meat: 6.61, // per meal (beef-heavy)
    vegetarian: 1.37, // per meal (plant-based)
    dairy: 1.2, // per serving
  },
};

export const NATIONAL_AVERAGE = {
  total: 16000, // kg CO2e per year (US average)
  energy: 6000,
  travel: 5000,
  diet: 3000,
};

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