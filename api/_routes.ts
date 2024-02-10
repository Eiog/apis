/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Router } from 'express'
import douyin from './douyin.ts'
import douyinStream from './douyinStream.ts'
import index from './index.ts'
import ip2region from './ip2region.ts'
import phone2region from './phone2region.ts'
import weibo from './weibo.ts'
import weiboComments from './weiboComments.ts'
import weiboDownload from './weiboDownload.ts'
import youtube from './youtube.ts'
import youtubeStream from './youtubeStream.ts'

const router = Router()
router.all('/douyin', douyin)
router.all('/douyinStream', douyinStream)
router.all('/index', index)
router.all('/ip2region', ip2region)
router.all('/phone2region', phone2region)
router.all('/weibo', weibo)
router.all('/weiboComments', weiboComments)
router.all('/weiboDownload', weiboDownload)
router.all('/youtube', youtube)
router.all('/youtubeStream', youtubeStream)
export default router
