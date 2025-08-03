import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stateCode } = req.query;
  if (!stateCode) {
    return res.status(400).json({ error: 'Missing stateCode' });
  }
  try {
    const url = `${API_BASE_URL}/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETDISTRICTLIST&abfhttf=%5Cu0057%5Cu0031%5Cu0030%5Cu003d&selectedStateCode=${stateCode}`;
    // Log the env variable and URL for debugging
    
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error: any) {
    // Log the error stack for debugging
    console.error('API Error:', error);
    res.status(error?.response?.status || 500).json({
      error: error?.message || 'Failed to fetch districts',
      apiBaseUrl: API_BASE_URL,
      stack: error?.stack || null,
      urlAttempted: `${API_BASE_URL}/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETDISTRICTLIST&abfhttf=%5Cu0057%5Cu0031%5Cu0030%5Cu003d&selectedStateCode=${stateCode}`
    });
  }
}
