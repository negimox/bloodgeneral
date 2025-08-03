
import type { NextApiRequest, NextApiResponse } from 'next';
// Manual CORS headers for Next.js v15
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || "";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { stateCode } = req.query;
  if (!stateCode) {
    return res.status(400).json({ error: 'Missing stateCode' });
  }
  try {
    const url = `${API_BASE_URL}/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETDISTRICTLIST&abfhttf=%5Cu0057%5Cu0031%5Cu0030%5Cu003d&selectedStateCode=${stateCode}`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(error?.response?.status || 500).json({
      error: error?.message || 'Failed to fetch districts',
      apiBaseUrl: API_BASE_URL,
      stack: error?.stack || null,
      urlAttempted: `${API_BASE_URL}/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETDISTRICTLIST&abfhttf=%5Cu0057%5Cu0031%5Cu0030%5Cu003d&selectedStateCode=${stateCode}`
    });
  }
}
