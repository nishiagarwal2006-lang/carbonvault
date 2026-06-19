import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reportData, format } = req.body;

    if (!reportData) {
      return res.status(400).json({ error: 'Report data is required' });
    }

    // Different report formats
    if (format === 'json') {
      return res.status(200).json({
        success: true,
        data: reportData,
      });
    }

    // For PDF and CSV, the client handles the generation
    return res.status(200).json({
      success: true,
      message: 'Report data ready',
      data: reportData,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({
      error: 'Failed to generate report',
    });
  }
}