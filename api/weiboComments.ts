import { comments } from 'weibo-dl'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const id: number = request.query.id || request.body.id
    const uid: number = request.query.uid || request.body.uid
    const count: number = request.query.count || request.body.count
    if (!id || !uid) {
      return response.status(400).json({
        code: 400,
        msg: 'invalid id or uid',
      })
    }
    const data = await comments({ id, uid, count })
    return response.json({ code: 200, data })
  }
  catch (error: any) {
    response.json({ code: 400, data: error })
  }
}
