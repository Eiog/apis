/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Router } from 'express'
import douyin from './douyin.ts'

const router = Router()
router.all('/douyin', douyin)
export default router
