import express from 'express'
import { bugService } from './services/bug.service.js'

const app = express()


app.get('/api/bug', async (req, res) => {
  try {
    const bugs = await bugService.query()
    res.send(bugs)
  } catch (error) {
    res.send(`Could'nt get bugs`)
  }
})


const port = 3030
app.listen(port, () =>
  console.log(`Server listening on port http://127.0.0.1:${port}/`)
)

