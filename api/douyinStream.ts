import { download, validateUrl } from 'doydl'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const url: string = request.query.url || request.body.url
    if (!url || !validateUrl(url)) {
      return response.status(400).json({
        code: 400,
        msg: 'invalid url',
      })
    }
    const stream = await download(url)
    stream.pipe(response)
  }
  catch (error: any) {
    response.json({ code: 200, data: error })
  }
}
