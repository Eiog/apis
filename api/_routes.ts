/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Router } from 'express'
import douyin from './douyin.ts'
import index from './index.ts'
import ip2region from './ip2region.ts'
import phone2region from './phone2region.ts'

const router = Router()
router.all('/douyin', douyin)
router.all('/index', index)
router.all('/ip2region', ip2region)
router.all('/phone2region', phone2region)
export default router
