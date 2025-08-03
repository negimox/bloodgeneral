import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stateCode = '', districtCode = '', campDate = '' } = req.query;

  // abfhttf param must be the raw unicode escape string, not base64 or JSON
  const abfhttf = "%5Cu0057%5Cu0033%5Cu0073%5Cu0069%5Cu0062%5Cu006d%5Cu0046%5Cu0074%5Cu005a%5Cu0053%5Cu0049%5Cu0036%5Cu0049%5Cu006e%5Cu004e%5Cu0030%5Cu0059%5Cu0058%5Cu0052%5Cu006c%5Cu0051%5Cu0032%5Cu0039%5Cu006b%5Cu005a%5Cu0053%5Cu0049%5Cu0073%5Cu0049%5Cu006e%5Cu005a%5Cu0068%5Cu0062%5Cu0048%5Cu0056%5Cu006c%5Cu0049%5Cu006a%5Cu006f%5Cu0069%5Cu004f%5Cu0054%5Cu0055%5Cu0069%5Cu0066%5Cu0053%5Cu0078%5Cu0037%5Cu0049%5Cu006d%5Cu0035%5Cu0068%5Cu0062%5Cu0057%5Cu0055%5Cu0069%5Cu004f%5Cu0069%5Cu004a%5Cu006b%5Cu0061%5Cu0058%5Cu004e%5Cu0030%5Cu0063%5Cu006d%5Cu006c%5Cu006a%5Cu0064%5Cu0045%5Cu004e%5Cu0076%5Cu005a%5Cu0047%5Cu0055%5Cu0069%5Cu004c%5Cu0043%5Cu004a%5Cu0032%5Cu0059%5Cu0057%5Cu0078%5Cu0031%5Cu005a%5Cu0053%5Cu0049%5Cu0036%5Cu0049%5Cu006a%5Cu0059%5Cu0077%5Cu0049%5Cu006e%5Cu0030%5Cu0073%5Cu0065%5Cu0079%5Cu004a%5Cu0075%5Cu0059%5Cu0057%5Cu0031%5Cu006c%5Cu0049%5Cu006a%5Cu006f%5Cu0069%5Cu0059%5Cu0032%5Cu0046%5Cu0074%5Cu0063%5Cu0045%5Cu0052%5Cu0068%5Cu0064%5Cu0047%5Cu0055%5Cu0069%5Cu004c%5Cu0043%5Cu004a%5Cu0032%5Cu0059%5Cu0057%5Cu0078%5Cu0031%5Cu005a%5Cu0053%5Cu0049%5Cu0036%5Cu0049%5Cu006a%5Cu0049%5Cu0077%5Cu004d%5Cu006a%5Cu0055%5Cu0074%5Cu004d%5Cu0044%5Cu0067%5Cu0074%5Cu004d%5Cu0044%5Cu004d%5Cu0069%5Cu0066%5Cu0056%5Cu0030%5Cu003d";
  const timestamp = Date.now();
  const url = `https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETNEARBYCAMPS&stateCode=${stateCode}&districtCode=${districtCode}&campDate=${campDate}&abfhttf=${abfhttf}&_=${timestamp}`;

  // IMPORTANT: Copy the full cookie string from your browser's DevTools and paste below
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "Referer": "https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/campSchedule.cnt",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Host": "eraktkosh.mohfw.gov.in",
    "Origin": "https://eraktkosh.mohfw.gov.in",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "x-requested-with": "XMLHttpRequest"
  };

  try {
    const response = await axios.get(url, { headers });
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error?.response?.status || 500).json({ error: error?.message || 'Proxy request failed' });
  }
}
