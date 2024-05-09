import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = (process.env.NODE_ENV == 'production') ? '/api/user/' : 'http://localhost:3030/api/user/'

export const userService = {
    query,
    getById,
    save,
    remove,
    getEmptyUser
}

async function query() {
    let { data: users } = await axios.get(BASE_URL)
    return users
}

async function getById(userId) {
    let { data: user } = await axios.get(BASE_URL + userId)
    return user
}

async function remove(userId) {
    return axios.delete(BASE_URL + userId)
}

async function save(user) {
    const method = user._id ? 'put' : 'post'
    const { data: savedUser } = await axios[method](BASE_URL + (user._id || ''), user)
    return savedUser
}

function getEmptyUser() {
	return {
		username: '',
		fullname: '',
		password: '',
		score: '',
	}
}

