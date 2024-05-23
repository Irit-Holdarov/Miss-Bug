import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'

import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
// import { reviewRoutes } from './api/review/review.routes.js'

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
      origin: [   'http://127.0.0.1:3000',
                  'http://localhost:3000',
                  'http://127.0.0.1:5173',
                  'http://localhost:5173'
              ],
      credentials: true
  }
  app.use(cors(corsOptions))
}

app.use(cookieParser())
app.use(express.json())

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
// app.use('./api/review', reviewRoutes)

const port = process.env.PORT || 3030
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
