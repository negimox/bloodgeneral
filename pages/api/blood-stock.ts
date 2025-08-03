import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { state, district, bloodGroup, bloodComponent } = req.query;
  if (!state || !district || !bloodGroup || !bloodComponent) {
    return res.status(400).json({ error: 'Missing required query params' });
  }
  try {
    const url = `${API_BASE_URL}/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETNEARBYSTOCKDETAILS&stateCode=${state}&districtCode=${district}&bloodGroup=${bloodGroup}&bloodComponent=${bloodComponent}&lang=0&abfhttf=%5Cu0057%5Cu0031%5Cu0030%5Cu003d`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error?.response?.status || 500).json({ error: error?.message || 'Failed to fetch blood stock' });
  }
}
