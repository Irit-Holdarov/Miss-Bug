
import { utilService } from '../../services/util.service.js'
import fs from 'fs'
const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
  query,
  getById,
  remove,
  save
}

async function query(filterBy = {}) {
  let filteredBugs = [...bugs]
  try {
    if (filterBy.txt || filterBy.severity || filterBy.label) {
      filteredBugs = bugs.filter(bug => {
        const matchesTxt = !filterBy.txt || new RegExp(filterBy.txt, 'i').test(bug.title)
        const matchesSeverity = !filterBy.severity || bug.severity >= filterBy.severity
        const matchesLabel = !filterBy.label || bug.labels.includes(filterBy.label)

        return matchesTxt && matchesSeverity && matchesLabel
      })
    }

    if (filterBy.sortBy) {
      if (filterBy.sortBy === 'Title') {
        filteredBugs.sort((a, b) => a.title.localeCompare(b.title))
      } else if (filterBy.sortBy === 'Severity') {
        filteredBugs.sort((a, b) => a.severity - b.severity)
      } else if (filterBy.sortBy === 'CreatedAt') {
        if (filterBy.sortDir === '-1') {
          filteredBugs.sort((a, b) => b.createdAt - a.createdAt)
        } else {
          filteredBugs.sort((a, b) => a.createdAt - b.createdAt)
        }
      }
    }

    return filteredBugs
  } catch (error) {
    loggerService.error(`Could'nt get bugs`, error)
    throw error
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find(bug => bug._id === bugId)
    return bug
  } catch (error) {
    loggerService.error(`Could'nt get bug ID`, error)
    throw error
  }
}

async function remove(bugId) {
  try {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    _saveBugsToFile()
  } catch (error) {
    loggerService.error(`Could'nt remove bug`, error)
    throw error
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
      bugToSave.editAt = Date.now()
      if (idx < 0) throw `Cant find bug with _id ${bugToSave._id}`
      bugs[idx] = bugToSave
    } else {
      bugToSave._id = utilService.makeId()
      bugToSave.createdAt = Date.now()
      bugs.push(bugToSave)
    }
    await _saveBugsToFile()
    return bugToSave
  } catch (error) {
    loggerService.error(`Could'nt save bug`, error)
    throw error
  }
}

function _saveBugsToFile(path = './data/bug.json') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4)
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
