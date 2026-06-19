import { VercelRequest, VercelResponse } from '@vercel/node';
import { getGroqInsights } from '../src/lib/groq';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { totalEmissions, categories, actions } = req.body;

    if (!totalEmissions || !categories) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are a carbon footprint expert providing personalized insights and recommendations. 
        Provide actionable, specific advice based on the user's carbon footprint data. 
        Format your response as JSON with two arrays: "insights" and "recommendations".`,
      },
      {
        role: 'user' as const,
        content: `
        Total annual emissions: ${totalEmissions} kg CO₂e
        Category breakdown:
        - Energy: ${categories.energy} kg CO₂e
        - Travel: ${categories.travel} kg CO₂e
        - Diet: ${categories.diet} kg CO₂e
        
        Actions taken: ${actions.length}
        
        Provide 3-4 personalized insights and 3-4 specific recommendations to help reduce carbon footprint.
        `,
      },
    ];

    const response = await getGroqInsights(messages);
    
    // Parse the response (assuming JSON format)
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      // If not JSON, create structured response
      const lines = response.split('\n').filter(line => line.trim());
      const insights = lines.filter(line => line.includes('insight') || line.includes('Insight'));
      const recommendations = lines.filter(line => line.includes('recommend') || line.includes('Recommend'));
      parsed = {
        insights: insights.length > 0 ? insights : ['Your carbon footprint shows potential for improvement in all categories.'],
        recommendations: recommendations.length > 0 ? recommendations : ['Consider reducing car usage and adopting more plant-based meals.'],
      };
    }

    return res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return res.status(500).json({
      error: 'Failed to generate insights',
    });
  }
}