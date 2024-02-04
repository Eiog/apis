import ytdl, { validateURL } from 'ytdl-core'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { HttpsProxyAgent } from 'https-proxy-agent'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const agent = process.env.mode === 'dev' ? new HttpsProxyAgent('http://127.0.0.1:7890') : undefined
  try {
    const url = request.query.url || request.body.url
    if (!url || !validateURL(url)) {
      return response.status(400).json({
        code: 400,
        msg: 'invalid url',
      })
    }
    const stream = ytdl(url, { requestOptions: { agent } })
    response.setHeader('Content-Type', 'video/mp4')
    stream.pipe(response)
  }
  catch (error: any) {
    response.send({ code: 400, error })
  }
}
