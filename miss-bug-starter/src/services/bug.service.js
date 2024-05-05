import Axios from 'axios'
import { parsePath } from 'react-router'

var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = 'http://localhost:3030/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}

async function query(filterBy = {}) {
    let { data: bugs } = await axios.get(BASE_URL, { params: filterBy })
    
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugs = bugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }

    if (filterBy.severity) {
        bugs = bugs.filter(bug => bug.severity === filterBy.severity)
    }

    if (filterBy.label) {
        bugs = bugs.filter(bug => bug.labels.includes(filterBy.label))
    }

    return bugs
}

async function getById(bugId) {
    let { data: bug } = await axios.get(BASE_URL + bugId)
    return bug
}

async function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

async function save(bug) {
    const method = bug._id ? 'put' : 'post'
    const { data: savedBug } = await axios[method](BASE_URL + (bug._id || ''), bug)
    return savedBug
}

function getDefaultFilter() {
    return {
        txt: '',
        severity: '',
        label: ''
    }
}