/* eslint-disable no-console */
import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'
import { validateUrl } from 'doydl'
import type { VercelRequest, VercelResponse } from '@vercel/node'

interface ListenerData {
  status: 'success' | 'error'
  data?: any
  msg?: string
}
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const url: string = request.query.url || request.body.url
    if (!url || !validateUrl(url)) {
      return response.status(400).json({
        statusCode: 400,
        body: 'invalid url',
      })
    }
    const worker = new Worker(resolve(__dirname, '../public/worker.js'), { workerData: { event: 'douyin', data: { url } } })
    worker.on('message', ({ status, data }: ListenerData) => {
      return response.send({ statusCode: 200, status, body: data })
    })
    worker.on('exit', (code) => {
      console.log(`worker stopped with code ${code}`)
    })
  }
  catch (error: any) {
    response.send({ statusCode: 200, body: { error: error.toString() } })
  }
}
