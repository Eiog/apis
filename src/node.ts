/* eslint-disable no-console */
import { createServer } from 'node:http'

const PORT = process.env.PORT || 5630

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Node Server Started\n')
})
server.listen(PORT, () => {
  console.log(`server is running at http://127.0.0.1:${PORT}/`)
})
