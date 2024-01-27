import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getInfo } from 'ytdl-core'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const url = request.query.url || request.body.url
    if (!url) {
      return response.status(400).json({
        statusCode: 400,
        body: 'url is required',
      })
    }
    const info = await getInfo(url)
    response.send({ statusCode: 200, body: { info } })
  }
  catch (error: any) {
    response.send({ statusCode: 200, body: { error: error.toString() } })
  }
}
