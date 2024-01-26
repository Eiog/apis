import type { VercelRequest, VercelResponse } from '@vercel/node'
import find from '../public/phone-query.js'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const phone: string = request.query.phone || request.body.phone
    if (!phone) {
      return response.status(400).json({
        statusCode: 400,
        body: 'phone is required',
      })
    }
    const result = find(phone)

    response.send({ statusCode: 200, body: { result } })
  }
  catch (error: any) {
    response.send({ statusCode: 200, body: { error: error.toString() } })
  }
}
