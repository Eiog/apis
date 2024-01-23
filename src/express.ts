/* eslint-disable no-console */
import { createServer } from 'node:http'
import express, { Router } from 'express'

const PORT = process.env.PORT || 5631

const app = express()
app.use(express.json())
const server = createServer(app)
const router = Router()
router.get('/express', (req, res) => {
  res.send('Express Is Started')
})
app.use(router)

server.listen(PORT, () => {
  console.log(`server is running at http://127.0.0.1:${PORT}/`)
})
