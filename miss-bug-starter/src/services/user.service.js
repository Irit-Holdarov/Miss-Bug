import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

const BASE_URL = (process.env.NODE_ENV == 'production') ? '/api/' : 'http://localhost:3030/api/'

const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'

export const userService = {
    login,
    logout,
    signup,
    query,
    getById,
    update,
    remove,
    save,
    getEmptyUser,
    saveLocalUser,
    getLoggedinUser
}

async function query() {
    let { data: users } = await axios.get(BASE_USER_URL)
    return users
}

async function getById(userId) {
    let { data: user } = await axios.get(BASE_USER_URL + userId)
    return user
}

async function remove(userId) {
    return axios.delete(BASE_USER_URL + userId)
}

async function update(userToUpdate) {
    const updatedUser = await axios.put(BASE_USER_URL, userToUpdate)
    if (getLoggedinUser().id === updatedUser.id) saveLocalUser(updatedUser)
    return updatedUser
}

async function save(user) {
    if (user._id) {
        return update(user)
    } else {
        const { data: newUser } = await axios.post(BASE_USER_URL, user)
        return newUser
    }
}

async function login(credentials) {
    const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(credentials) {

    const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
    return saveLocalUser(user)
}

async function logout() {
    await axios.post(BASE_AUTH_URL + 'logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
    }
}


function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
