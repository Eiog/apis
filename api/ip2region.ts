import { resolve } from 'node:path'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Searcher from '../public/Searcher.js'

interface result {
  region: string
  ioCount: number
  took: number
}
interface address {
  country?: string
  region?: string
  province?: string
  city?: string
  ISP?: string
}
const dbPath = resolve(__dirname, '../public/ip2region.xdb')
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const ip: string = request.query.ip || request.body.ip
    if (!ip) {
      return response.status(400).json({
        statusCode: 400,
        body: 'ip is required',
      })
    }
    const searcher = Searcher.newWithFileOnly(dbPath)
    const data = (await searcher.search(ip)) as result
    const ipData: address = {
      country: data.region.split('|')[0],
      region: data.region.split('|')[1],
      province: data.region.split('|')[2],
      city: data.region.split('|')[3],
      ISP: data.region.split('|')[4],
    }
    response.send({ statusCode: 200, body: { ipData, dbPath } })
  }
  catch (error: any) {
    response.send({ statusCode: 200, body: { error: error.toString() } })
  }
}
