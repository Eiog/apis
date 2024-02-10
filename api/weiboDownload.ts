import { download } from 'weibo-dl'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const pid: string = request.query.pid || request.body.pid
    if (!pid) {
      return response.status(400).json({
        code: 400,
        msg: 'invalid pid',
      })
    }
    const stream = download(pid)
    response.setHeader('Content-Type', 'image/jpeg')
    stream.pipe(response)
  }
  catch (error: any) {
    response.json({ code: 400, data: error })
  }
}
