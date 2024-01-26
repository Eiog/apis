import { readdirSync } from 'node:fs'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const apis = readdirSync(__dirname).filter(f => !f.startsWith('_')).map(m => m.replace('.ts', ''))
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.send({ statusCode: 200, body: { apis } })
}
