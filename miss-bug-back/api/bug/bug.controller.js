import { loggerService } from "../../services/logger.service.js"
import { authService } from "../auth/auth.service.js"
import { bugService } from "./bug.service.js"


export async function getBugs(req, res) {
  const { txt, severity, label, sortBy } = req.query
  const filterBy = { txt, severity: +severity, label, sortBy }

  try {
    const bugs = await bugService.query(filterBy)
    res.send(bugs)
  } catch (error) {
    res.status(400).send(`Could'nt get bugs ${error}`)
    loggerService.error(`Could'nt get bugs`, error)
  }
}


export async function getBug(req, res) {
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
      res.status(400).send(`Could'nt get bug ${error}`)
      loggerService.error(`Could'nt get bug`, error)
    }
  }
}

export async function removeBug(req, res) {
  const { bugId } = req.params

  try {
    await bugService.remove(bugId, req.loggedinUser)
    res.send('Deleted OK')
  } catch (error) {
    res.status(400).send(`Could'nt delete bug ${error}`)
    loggerService.error(`Could'nt delete bug`, error)
  }
}


export async function updateBug(req, res) {  //update bug
  const { _id, title, severity, description, labels } = req.body
  let bugToSave = { _id, title, severity: +severity, description, labels }

  try {
    bugToSave = await bugService.save(bugToSave, req.loggedinUser)
    res.send(bugToSave)
  }
  catch (error) {
    res.status(400).send(`Could'nt save bug ${error}`)
    loggerService.error(`Could'nt save bug`, error)
  }
}

export async function addBug(req, res) {
  const { title, severity, description, labels } = req.body
  let bugToSave = { title, severity: +severity, description, labels }

  try {
    bugToSave = await bugService.save(bugToSave, req.loggedinUser)
    res.send(bugToSave)
  }
  catch (error) {
    res.status(400).send(`Could'nt save bug : ${error}`)
    loggerService.error(`Could'nt save bug`, error)
  }
}


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
      bugLimiter.visitedBugs = [bugId] // Reset the array with the new bugId
      bugLimiter.lastVisit = Date.now()
    } else if (!bugLimiter.visitedBugs.includes(bugId)) {
      throw new Error('bugLimit Reached')
    }
  }

  console.log(`User visited the following bugs: ${bugLimiter.visitedBugs} within the past ${timeout / 1000} seconds`)
  return bugLimiter
}
