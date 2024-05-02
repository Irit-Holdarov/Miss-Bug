import axios from 'axios'

const BASE_URL = 'http://localhost:3030/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}

async function query(filterBy = {}) {
    let { data: bugs } = await axios.get(BASE_URL)

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugs = bugs.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.severity) {
        bugs = bugs.filter(bug => bug.severity === filterBy.severity)
    }

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

function getDefaultFilter() {
    return { txt: '', severity: '' }
}