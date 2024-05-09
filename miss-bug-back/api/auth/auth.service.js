import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'

export const authService = {
  signup,
  login,
  getLoginToken,
  validateToken
}

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(username, password) {
  loggerService.debug(`auth.service - login with username: ${username}`)

  const user = await userService.getByUserName(username)
  if (!user) throw new Error('Invalid username or password')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid username or password')

  // delete user
  const minUser = {
    _id: user._id,
    fullname: user.fullname,

    isAdmin: user.isAdmin
  }
  return minUser
}

async function signup({ username, password, fullname }) {
  loggerService.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
  if (!username || !password || !fullname) throw new Error('Missing details')

  const userExist = await userService.getByUserName(username)
  if (userExist) throw 'Username already taken'

  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  return userService.save({ username, password: hash, fullname })
}

function getLoginToken(user) {
  const str = JSON.stringify(user)
  const encryptedStr = cryptr.encrypt(str)
  return encryptedStr
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}