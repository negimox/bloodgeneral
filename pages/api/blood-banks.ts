import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { stateCode, districtCode } = req.query
  if (!stateCode || !districtCode) {
    res.status(400).json({ error: 'Missing stateCode or districtCode' })
    return
  }

  const apiUrl = `https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/portalThalassemiaLogin.cnt?hmode=GETBBLIST&selectedStateCode=${stateCode}&selectedDistrictCode=${districtCode}&hospitalType=1`

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch blood banks')
    }
    const data = await response.json()
    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
