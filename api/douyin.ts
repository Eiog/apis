import { format, getInfo, validateUrl } from 'douyin-dl'
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
    const info = await getInfo(url)
    return response.json({ code: 200, info, format: format(info) })
  }
  catch (error: any) {
    response.json({ code: 400, data: error })
  }
}
