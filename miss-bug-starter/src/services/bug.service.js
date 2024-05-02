import axios from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = 'http://localhost:3030/api/bug/'
const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
}

async function query() {
    let { data: bugs } = await axios.get(BASE_URL)
    return bugs
}

async function getById(bugId) {
    let { data: bug } = await axios.get(BASE_URL + bugId)
    return bug
}

async function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
}

async function save(bug) {
    const queryParams = `?_id=${bug._id || ''}&title=${bug.title}&severity=${bug.severity}&description=${bug.description || ''}&createdAt=${bug.createdAt || ''}`
    const { data: savedBug } = await axios.get(BASE_URL + 'save' + queryParams)
    return savedBug
}