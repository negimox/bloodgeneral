// Helper to Unicode-escape a string
function unicodeEscape(str: string): string {
  return str.split('').map(char => {
    const code = char.charCodeAt(0).toString(16).padStart(4, '0');
    return `\\u${code}`;
  }).join('');
}

// Generate abfhttf dynamically
function generateAbfhttf({ stateCode, districtCode, campDate }: { stateCode: string, districtCode: string, campDate: string }) {
  const arr = [
    { name: "stateCode", value: stateCode },
    { name: "districtCode", value: districtCode },
    { name: "campDate", value: campDate }
  ];
  const jsonStr = JSON.stringify(arr);
  // Step 1: Base64 encode the JSON string
  const base64Str = typeof window === 'undefined'
    ? Buffer.from(jsonStr).toString('base64')
    : btoa(jsonStr);
  // Step 2: Unicode-escape each character of the base64 string
  const unicodeStr = base64Str.split('').map(char => {
    const code = char.charCodeAt(0).toString(16).padStart(4, '0');
    return `\\u${code}`;
  }).join('');
  // Step 3: URL-encode the result
  return encodeURIComponent(unicodeStr);
}

// Fetch nearby camps
export async function fetchNearbyCamps({ stateCode, districtCode, campDate }: { stateCode: string, districtCode: string, campDate: string }) {
  const abfhttf = generateAbfhttf({ stateCode, districtCode, campDate });
  const response = await axios.get(`/api/nearby-camps?stateCode=${stateCode}&districtCode=${districtCode}&campDate=${campDate}&abfhttf=${abfhttf}`);
  return response.data;
}
// lib/api.ts
import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || "";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Generic request handler
async function requestHandler(config: AxiosRequestConfig) {
  try {
    const response = await axiosInstance.request(config);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message || 'API request failed');
  }
}

export async function fetchOverallStats() {
  const response = await axios.post('/api/overall-stats', { stateCode: 0 });
  return response.data;
}

export async function fetchAllStates() {
  const response = await axios.post('/api/all-states', {});
  return response.data;
}

export async function fetchBloodCollectionStats(stateCode: number, month: number, year: number) {
  const response = await axios.post('/api/blood-collection-stats', {
    stateCode,
    gdtMonth: month,
    gdtYear: year,
  });
  return response.data;
}

export async function fetchDistricts(stateCode: number) {
  // Call local API route to avoid CORS
  const response = await axios.get(`/api/districts?stateCode=${stateCode}`);
  return response.data;
}


// New: Blood stock endpoint
export async function fetchBloodStock({ state, district, bloodGroup, bloodComponent }: { state: string, district: string, bloodGroup: string, bloodComponent: string }) {
  // Call local API route to avoid CORS
  const response = await axios.get(`/api/blood-stock?state=${state}&district=${district}&bloodGroup=${bloodGroup}&bloodComponent=${bloodComponent}`);
  return response.data;

}
