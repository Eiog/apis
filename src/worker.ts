import { parentPort, workerData } from 'node:worker_threads'
import { resolve } from 'node:path'
import type { Readable } from 'node:stream'
import qiniu from 'qiniu'
import { Config, JsonDB } from 'node-json-db'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { downloadFromInfo, format, getDouyinVideoDataByVideoId, getDouyinVideoIdByRealUrl, getRealUrlByShortUrl, getShortUrlByShareUrl } from 'doydl'
import { getInfo, getURLVideoID, downloadFromInfo as ytdlDownloadFromInfo } from 'ytdl-core'

interface DBSchema {
  url: string
  status: 'pending' | 'success' | 'error'
  id: ReturnType<typeof format>['vid']
  data: ReturnType<typeof format>
  oss?: string
}
const isDev = process.env.mode === 'dev'
const db = new JsonDB(new Config(resolve(__dirname, 'json-db'), true, true, '/'))

const { accessKey, secretKey, bucket } = {
  accessKey: 'RKErW4JfD83EmAKGxNe3ycXhklqxbpzVmDO7WMi5',
  secretKey: 'Lr4P6QNNtm5krT3BUUBeqYcwT6X1TawjdonHqYcH',
  bucket: 'video-download-temp',
}
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket })
const uploadToken = putPolicy.uploadToken(mac)
const formUploader = new qiniu.form_up.FormUploader({ scope: bucket })
const putExtra = new qiniu.form_up.PutExtra()
const bucketManager = new qiniu.rs.BucketManager(mac)
const publicBucketDomain = 'http://s89qdedec.bkt.gdipper.com'
interface EventMap {
  douyin: {
    url: string
  }
  youtube: {
    url: string
  }
}
interface WorkerData {
  event: keyof EventMap
  data: EventMap[keyof EventMap]
  isDev: boolean
}
const dataFromMainThread: WorkerData = workerData
const eventMap = {
  douyin,
  youtube,
}
function run({ event, data }: WorkerData) {
  if (eventMap[event])
    return eventMap[event](data)
  parentPort?.postMessage({ status: 'error', msg: 'event notfound' })
}
run(dataFromMainThread)

async function douyin({ url }: EventMap['douyin']) {
  try {
    const shortUrl = getShortUrlByShareUrl(url)
    const realUrl = await getRealUrlByShortUrl(shortUrl!)
    const videoId = getDouyinVideoIdByRealUrl(realUrl)
    const path = `/douyin/${videoId}`
    if (await db.exists(path)) {
      const dbRes = await db.getObject<DBSchema>(path)
      return parentPort?.postMessage({ status: 'success', data: dbRes })
    }

    const info = await getDouyinVideoDataByVideoId(videoId!)
    const stream = downloadFromInfo(info)
    await putOss(`douyin/${videoId}.mp4`, stream)
    const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, `douyin/${videoId}.mp4`)
    const dbSaveData = { url, status: 'success', id: format(info).vid, publicDownloadUrl, data: format(info) }
    await db.push(path, dbSaveData)
    parentPort?.postMessage({ status: 'success', data: dbSaveData })
  }
  catch (error) {
    parentPort?.postMessage({ status: 'error', msg: error })
  }
}
async function youtube({ url }: EventMap['youtube']) {
  try {
    const agent = isDev ? new HttpsProxyAgent('http://127.0.0.1:7890') : undefined
    const videoId = getURLVideoID(url)
    const info = await getInfo(url, { requestOptions: { agent } })
    const path = `/youtube/${videoId}`
    const stream = ytdlDownloadFromInfo(info, { requestOptions: { agent } })

    await putOss(`youtube/${videoId}.mp4`, stream)
    const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, `youtube/${videoId}.mp4`)
    const dbSaveData = { url, status: 'success', id: videoId, publicDownloadUrl, data: info }
    await db.push(path, dbSaveData)
    parentPort?.postMessage({ status: 'success', data: dbSaveData })
  }
  catch (error) {
    parentPort?.postMessage({ status: 'error', msg: error })
  }
}
function putOss(path: string, stream: Readable) {
  return new Promise((resolve, reject) => {
    formUploader.putStream(uploadToken, path, stream, putExtra, (respErr,
      respBody, respInfo) => {
      if (respErr)
        return reject(respErr)

      if (respInfo.statusCode === 200)
        return resolve(respInfo)

      else
        return reject(respInfo)
    })
  })
}
