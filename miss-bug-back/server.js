import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hello there')
})

app.get('/api/bug', async (req, res) => {
  try {
    const bugs = await bugService.query()
    res.send(bugs)
  } catch (error) {
    console.log('error: ', error)
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
    loggerService.error(`Couldnt save bug`, error)
    res.status(400).send(`Could'nt save bug`)
    loggerService.error(`Could'nt save bug`, error)
  }
})

app.get('/api/bug/:bugId', async (req, res) => {
  try {
    const bugId = req.params.bugId
    const bug = await bugService.getById(bugId)
    res.send(bug)
  } catch (error) {
    console.log('error: ', error)
    res.status(400).send(`Could'nt get bug`)
    loggerService.error(`Could'nt get bug`, error)
  }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
  try {
    const bugId = req.params.bugId
    await bugService.remove(bugId)
    res.send('deleted')
  } catch (error) {
    console.log('error: ', error)
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

