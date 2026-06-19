export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface CarbonFootprint {
  id?: string;
  userId: string;
  date: Date;
  energy: {
    electricity: number; // kWh
    gas: number; // therms
    heating: number; // gallons
  };
  travel: {
    carMiles: number;
    flights: number; // miles
    publicTransport: number; // miles
  };
  diet: {
    meatConsumption: number; // meals per week
    vegetarianMeals: number; // meals per week
    dairyConsumption: number; // servings per week
  };
  totalEmissions: number; // CO2e in kg
  categories: {
    energy: number;
    travel: number;
    diet: number;
  };
}

export interface EcoAction {
  id?: string;
  userId: string;
  action: string;
  category: 'energy' | 'travel' | 'diet' | 'waste' | 'other';
  date: Date;
  points: number;
  carbonSaved: number; // kg CO2e
  completed: boolean;
}

export interface CarbonInsight {
  id?: string;
  userId: string;
  date: Date;
  insights: string[];
  recommendations: string[];
  score: number;
}

export interface ReportData {
  user: {
    name: string;
    email: string;
  };
  date: Date;
  totalEmissions: number;
  categories: {
    energy: number;
    travel: number;
    diet: number;
  };
  monthlyTrend: {
    labels: string[];
    data: number[];
  };
  actionsCompleted: number;
  totalPoints: number;
  insights: string[];
  recommendations: string[];
}

export interface CalculatorInputs {
  electricity: number;
  gas: number;
  heating: number;
  carMiles: number;
  flights: number;
  publicTransport: number;
  meatConsumption: number;
  vegetarianMeals: number;
  dairyConsumption: number;
}

export interface ValidationError {
  field: string;
  message: string;
}