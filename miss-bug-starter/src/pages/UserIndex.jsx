import { useEffect, useState } from 'react'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { UserList } from '../cmps/UserList.jsx'

export function UserIndex() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const users = await userService.query()
      setUsers(users)
    } catch (err) {
      console.log('err:', err)
    }
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId)
      console.log('Deleted Succesfully!')
      setUsers(prevUsers => prevUsers.filter((user) => user._id !== userId))
      showSuccessMsg('user removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove user')
    }
  }

  async function onAddUser() {
    const user = {
      fullname: prompt('Enter user fullname?'),
      username: prompt('Enter username?'),
      password: prompt('Enter password?'),
      score: +prompt('Enter score?'),
    }
    try {
      const savedUser = await userService.save(user)
      console.log('Added user', savedUser)
      setUsers(prevUsers => [...prevUsers, savedUser])
      showSuccessMsg('User added')
    } catch (err) {
      console.log('Error from onAddUser ->', err)
      showErrorMsg('Cannot add user')
    }
  }

  async function onEditUser(user) {
    const score = +prompt('New score?')
    const userToSave = { ...user, score }
    try {

      const savedUser = await userService.save(userToSave)
      console.log('Updated user:', savedUser)
      setUsers(prevUsers => prevUsers.map((currUser) =>
        currUser._id === savedUser._id ? savedUser : currUser
      ))
      showSuccessMsg('User updated')
    } catch (err) {
      console.log('Error from onEditUser ->', err)
      showErrorMsg('Cannot update user')
    }
  }

  return (
    <main className="user-index">
      <h3>Users App</h3>
      <main>
        <button className='add-btn' onClick={onAddUser}>Add user</button>
        <UserList users={users} onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
      </main>
    </main>
  )
}
