import { createServer } from 'node:http'
import express from 'express'
import routes from '../api/_routes'

const PORT = process.env.PORT || 5631

const app = express()
app.use(express.json())
// app.use(createProxyMiddleware('*', { target: 'http://127.0.0.1:7980' }))
app.use('/api', routes)

const server = createServer(app)

server.listen(PORT, () => {
  console.log(`server is running at http://127.0.0.1:${PORT}/api/`)
})
