import { getList, validateUrl } from 'weibo-dl'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const url: string = request.query.url || request.body.url
    const page: string = request.query.page || request.body.page
    if (!url || !validateUrl(url)) {
      return response.status(400).json({
        code: 400,
        msg: 'invalid url',
      })
    }
    const data = await getList(url, Number(page))
    return response.json({ code: 200, data })
  }
  catch (error: any) {
    response.json({ code: 400, data: error })
  }
}
