import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Manual CORS headers for Next.js v15
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { stateCode = '', districtCode = '', campDate = '', abfhttf = '' } = req.query;
  if (!stateCode || !districtCode || !campDate || !abfhttf) {
    return res.status(400).json({ error: 'Missing required query params' });
  }
  try {
    const url = `https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETNEARBYCAMPS&stateCode=${stateCode}&districtCode=${districtCode}&campDate=${campDate}&abfhttf=${abfhttf}`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error?.response?.status || 500).json({ error: error?.message || 'Failed to fetch nearby camps' });
  }
}
