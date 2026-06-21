import { ReportData, CarbonFootprint, EcoAction } from '../types';
import { formatNumber } from '../utils/helpers';

export class ReportService {
  static generateReportData(
    footprints: CarbonFootprint[],
    actions: EcoAction[],
    user: { name: string; email: string }
  ): ReportData {
    const latestFootprint = footprints[0];

    return {
      user: {
        name: user.name || 'User',
        email: user.email || '',
      },
      date: new Date(),
      totalEmissions: latestFootprint?.totalEmissions || 0,
      categories: latestFootprint?.categories || { energy: 0, travel: 0, diet: 0 },
      monthlyTrend: {
        labels: footprints
          .map((f) => f.date.toLocaleDateString('default', { month: 'short' }))
          .reverse(),
        data: footprints.map((f) => f.totalEmissions).reverse(),
      },
      actionsCompleted: actions.filter((a) => a.completed).length,
      totalPoints: actions.reduce((sum, a) => sum + (a.points || 0), 0),
      insights: [],
      recommendations: [],
    };
  }

  static formatReportForCSV(footprints: CarbonFootprint[]): any[] {
    return footprints.map((footprint) => ({
      Date: footprint.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      'Total Emissions (kg CO₂e)': formatNumber(footprint.totalEmissions),
      'Energy (kg CO₂e)': formatNumber(footprint.categories.energy),
      'Travel (kg CO₂e)': formatNumber(footprint.categories.travel),
      'Diet (kg CO₂e)': formatNumber(footprint.categories.diet),
      'Electricity (kWh)': footprint.energy.electricity,
      'Gas (therms)': footprint.energy.gas,
      'Heating (gallons)': footprint.energy.heating,
      'Car Miles': footprint.travel.carMiles,
      'Flights (miles)': footprint.travel.flights,
      'Public Transport (miles)': footprint.travel.publicTransport,
      'Meat Meals/Week': footprint.diet.meatConsumption,
      'Vegetarian Meals/Week': footprint.diet.vegetarianMeals,
      'Dairy Servings/Week': footprint.diet.dairyConsumption,
    }));
  }
}
