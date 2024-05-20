import fs from 'fs'
import { utilService } from "../../services/util.service.js"
import { loggerService } from "../../services/logger.service.js"

const users = utilService.readJsonFile('data/user.json')

export const userService = {
  query,
  getById,
  remove,
  save,
  getByUserName
}

async function query() {
  try {
    return users
  } catch (error) {
    loggerService.error(`Could'nt get users`, error)
    throw error
  }
}

async function getById(userId) {
  try {
    const user = users.find(user => user._id === userId)
    return user
  } catch (error) {
    loggerService.error(`Could'nt get user ID`, error)
    throw error
  }
}


async function remove(userId) {
  try {
    const userIdx = users.findIndex(user => user._id === userId)
    users.splice(userIdx, 1)
    _saveUsersToFile()
  } catch (error) {
    loggerService.error(`Could'nt remove user`, error)
    throw error
  }
}


async function save(userToSave) {
  try {
    if (userToSave._id) {
      const idx = users.findIndex(user => user._id === userToSave._id)
      if (idx < 0) throw `Cant find user with _id ${userToSave._id}`
      users[idx] = userToSave
    } else {
      userToSave._id = utilService.makeId()
      userToSave.score = utilService.generateRandomScore()
      userToSave.creatAt = Date.now()
      users.push(userToSave)
    }
    await _saveUsersToFile()
    return userToSave
  } catch (error) {
    loggerService.error(`Could'nt save user`, error)
    throw error
  }
}

async function getByUserName(username) {
  const user = users.find(user => user.username === username)
  return user
}


function _saveUsersToFile(path = './data/user.json') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4)
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}