import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
  query,
}

async function query() {
  try {
    return bugs
  } catch (error) {
    throw error
  }
}