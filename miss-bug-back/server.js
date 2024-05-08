import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'

const app = express()

const corsOptions = {
  origin: [
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}

app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

import { bugRoutes } from './api/bug/bug.routes.js'
app.use('/api/bug', bugRoutes)

import { userRoutes } from './api/user/user.routes.js'
app.use('/api/user', userRoutes)

const port = 3030
app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}`)
)

app.get('/', (req, res) => res.send('Hello'))

app.get('/api/logs', async (req, res) => {
  res.sendFile(process.cwd() + '/logs/backend.log')
})
 
app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})
