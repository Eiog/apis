/* eslint-disable no-console */
import { Worker } from 'node:worker_threads'
import { resolve } from 'node:path'
import { validateURL } from 'ytdl-core'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const url = request.query.url || request.body.url
    if (!url || !validateURL(url)) {
      return response.status(400).json({
        statusCode: 400,
        body: 'invalid url',
      })
    }

    const worker = new Worker(resolve(__dirname, '../public/worker.js'), { workerData: { event: 'youtube', data: { url } } })
    worker.on('message', ({ status, data }) => {
      return response.send({ statusCode: 200, status, body: JSON.parse(data) })
    })
    worker.on('exit', (code) => {
      console.log(`worker stopped with code ${code}`)
    })
  }
  catch (error: any) {
    response.send({ statusCode: 200, body: { error: error.toString() } })
  }
}
