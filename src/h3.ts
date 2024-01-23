/* eslint-disable no-console */

import { createServer } from 'node:http'
import { createApp, createRouter, eventHandler, toNodeListener } from 'h3'

const PORT = process.env.PORT || 5632

const app = createApp()
const server = createServer(toNodeListener(app))
const router = createRouter()
router.get('/h3', eventHandler(() => {
  return 'H3 Is Started'
}))
app.use(router)

server.listen(PORT, () => {
  console.log(`server is running at http://127.0.0.1:${PORT}/`)
})
