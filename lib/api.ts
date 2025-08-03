// Fetch nearby camps
export async function fetchNearbyCamps({ stateCode, districtCode, campDate }: { stateCode: string, districtCode: string, campDate: string }) {
  // abfhttf param is required and static for now
  const abfhttf = "\u0057\u0033\u0073\u0069\u0062\u006d\u0046\u0074\u005a\u0053\u0049\u0036\u0049\u006e\u004e\u0030\u0059\u0058\u0052\u006c\u0051\u0032\u0039\u006b\u005a\u0053\u0049\u0073\u0049\u006e\u005a\u0068\u0062\u0048\u0056\u006c\u0049\u006a\u006f\u0069\u004f\u0054\u0055\u0069\u0066\u0053\u0078\u0037\u0049\u006d\u0035\u0068\u0062\u0057\u0055\u0069\u004f\u0069\u004a\u006b\u0061\u0058\u004e\u0030\u0063\u006d\u006c\u006a\u0064\u0045\u004e\u0076\u005a\u0047\u0055\u0069\u004c\u0043\u004a\u0032\u0059\u0057\u0078\u0031\u005a\u0053\u0049\u0036\u0049\u0069\u0030\u0078\u0049\u006e\u0030\u0073\u0065\u0079\u004a\u0075\u0059\u0057\u0031\u006c\u0049\u006a\u006f\u0069\u0059\u0032\u0046\u0074\u0063\u0045\u0052\u0068\u0064\u0047\u0055\u0069\u004c\u0043\u004a\u0032\u0059\u0057\u0078\u0031\u005a\u0053\u0049\u0036\u0049\u006a\u0049\u0077\u004d\u006a\u0055\u0074\u004d\u0044\u0067\u0074\u004d\u0044\u004d\u0069\u0066\u0056\u0030\u003d"
  const url = `https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETNEARBYCAMPS&stateCode=${stateCode}&districtCode=${districtCode}&campDate=${campDate}&abfhttf=${abfhttf}`
  const response = await axios.get(url)
  return response.data
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
  return requestHandler({
    url: "/eRaktkoshUtilities/eraktkosh/overAllStats",
    method: "POST",
    data: { stateCode: 0 },
  });
}

export async function fetchAllStates() {
  return requestHandler({
    url: "/eRaktkoshUtilities/eraktkosh/getallstates",
    method: "POST",
    data: {},
  });
}

export async function fetchBloodCollectionStats(stateCode: number, month: number, year: number) {
  return requestHandler({
    url: "/eRaktkoshUtilities/eraktkosh/bloodCollectionStats",
    method: "POST",
    data: {
      stateCode,
      gdtMonth: month,
      gdtYear: year,
    },
  });
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
