import React from 'react';
import Papa from 'papaparse';
import { CarbonFootprint } from '../../types';
import { Button } from '../common/Button';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';

interface CSVExportProps {
  footprints: CarbonFootprint[];
}

export const CSVExport: React.FC<CSVExportProps> = ({ footprints }) => {
  const exportCSV = () => {
    try {
      if (footprints.length === 0) {
        toast.warning('No data to export');
        return;
      }

      // Prepare data for CSV
      const data = footprints.map((footprint) => ({
        Date: footprint.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        'Total Emissions (kg CO₂e)': footprint.totalEmissions,
        'Energy (kg CO₂e)': footprint.categories.energy,
        'Travel (kg CO₂e)': footprint.categories.travel,
        'Diet (kg CO₂e)': footprint.categories.diet,
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

      // Generate CSV
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `carbonvault-data-${new Date().toISOString().split('T')[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  return (
    <Button onClick={exportCSV} variant="secondary" className="min-w-[150px]">
      <Download className="w-5 h-5" />
      Export CSV
    </Button>
  );
};
