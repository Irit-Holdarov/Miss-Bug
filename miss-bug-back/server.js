import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
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

app.get('/', (req, res) => {
  res.send('Hello there')
})

app.get('/api/bug', async (req, res) => {
  try {
    const bugs = await bugService.query()
    res.send(bugs)
  } catch (error) {
    res.status(400).send(`Could'nt get bugs`)
    loggerService.error(`Could'nt get bugs`, error)
  }
})

app.get('/api/bug/save', async (req, res) => {
  try {
    let bugToSave = {
      _id: req.query._id,
      title: req.query.title,
      severity: +req.query.severity,
      description: req.query.description
    }
    bugToSave = await bugService.save(bugToSave)
    res.send(bugToSave)
  }
  catch (error) {
    res.status(400).send(`Could'nt save bug`)
    loggerService.error(`Could'nt save bug`, error)
  }
})

app.get('/api/bug/:bugId', async (req, res) => {
  try {
    const bugId = req.params.bugId

    let bugLimiter = req.cookies.bugLimiter
    bugLimiter = updateVisitedBugs(bugId, bugLimiter)
    console.log('updateVisitedBugs-bugLimiter', bugLimiter)
    res.cookie('bugLimiter', bugLimiter)

    const bug = await bugService.getById(bugId)
    res.send(bug)
  } catch (error) {
    if (error.message === 'bugLimit Reached') {
      res.status(401).send('Wait for a bit')
    } else {
      res.status(400).send(`Could'nt get bug`)
      loggerService.error(`Could'nt get bug`, error)
    }
  }
})


app.get('/api/bug/:bugId/remove', async (req, res) => {
  try {
    const bugId = req.params.bugId
    await bugService.remove(bugId)
    res.send('deleted')
  } catch (error) {
    res.status(400).send(`Could'nt delete bug`)
    loggerService.error(`Could'nt delete bug`, error)
  }
})


app.get('/api/logs', async (req, res) => {
  res.sendFile(process.cwd() + '/logs/backend.log')
})

const port = 3030
app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}`)
)


const updateVisitedBugs = (bugId, bugLimiter) => {
  const timeout = 7 * 1000

  if (!bugLimiter) {
    bugLimiter = {
      visitedBugs: [],
      lastVisit: Date.now()
    }
  }

  if (bugLimiter.visitedBugs.length < 3) {
    if (!bugLimiter.visitedBugs.includes(bugId)) {
      bugLimiter.visitedBugs.push(bugId)
    }
    if (bugLimiter.visitedBugs.length === 3) {
      bugLimiter.lastVisit = Date.now()
    }
  } else {
    if (Date.now() - bugLimiter.lastVisit > timeout) {
      bugLimiter.visitedBugs = [bugId]; // Reset the array with the new bugId
      bugLimiter.lastVisit = Date.now()
    } else if (!bugLimiter.visitedBugs.includes(bugId)) {
      throw new Error('bugLimit Reached')
    }
  }

  console.log(`User visited the following bugs: ${bugLimiter.visitedBugs} within the past ${timeout / 1000} seconds`)
  return bugLimiter
};

