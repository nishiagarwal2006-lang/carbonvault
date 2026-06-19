import { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateCarbonFootprint } from '../src/utils/helpers';
import { validateCalculatorInputs } from '../src/utils/validators';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const inputs = req.body;

    // Validate inputs
    const errors = validateCalculatorInputs(inputs);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    // Calculate footprint
    const footprint = calculateCarbonFootprint(inputs);

    return res.status(200).json({
      success: true,
      data: footprint,
    });
  } catch (error) {
    console.error('Error calculating carbon footprint:', error);
    return res.status(500).json({
      error: 'Failed to calculate carbon footprint',
    });
  }
}