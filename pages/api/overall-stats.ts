import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = process.env.API_BASE_URL + '/eRaktkoshUtilities/eraktkosh/overAllStats';
const AUTH_TOKEN = process.env.API_AUTH_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await axios.post(API_URL, req.body, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'User-Agent': 'Mozilla/5.0',
        'Referer': process.env.API_BASE_URL,
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json',
      }
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('API Error:', error?.response?.data || error);
    res.status(error?.response?.status || 500).json({
      error: error?.message || 'Failed to fetch overall stats',
      details: error?.response?.data || null
    });
  }
}
