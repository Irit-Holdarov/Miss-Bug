import { useState, useEffect } from 'react'
import { userService } from '../services/user.service'

export function LoginSignup() {
  const [users, setUsers] = useState([])
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
  const [isSignup, setIsSignup] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const users = await userService.query()
      setUsers(users)
    } catch (err) {
      console.log('err:', err)
    }
  }

  function handleChange({ target }) {
    const field = target.name
    let type = target.type
    let value = target.value

    if (type === 'number') {
      value = +value || ''
    }

    setCredentials(prevCredentials => ({ ...prevCredentials, [field]: value }))
  }


  function toggleSignup() {
    setIsSignup(prevIsSignup => !prevIsSignup)
  }

  async function onAddUser() {
    const user = {
      fullname: credentials.fullname,
      username: credentials.username,
      password: credentials.password,
      score: credentials.score,
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



  return (
    <div className="login-page">
      <p>
        <button className="btn-link" onClick={toggleSignup}>{!isSignup ? 'Signup' : 'Login'}</button>
      </p>

      {!isSignup && (
        <>
          <select
            name="fullname" // Update the name attribute
            value={credentials.fullname} // Set value to credentials.fullname
            onChange={handleChange}
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user.fullname}>
                {user.fullname}
              </option>
            ))}
          </select>
          <button>Login!</button>
        </>
      )}



      <div className="signup-section">
        {isSignup && <form className="signup-form" onSubmit={onAddUser}>
          <input
            type="text"
            name="fullname"
            value={credentials.fullname}
            placeholder="Fullname"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            value={credentials.username}
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="score"
            value={credentials.score}
            placeholder="Score"
            onChange={handleChange}
            required
          />
          <button >Signup!</button>
        </form>}
      </div>
    </div>
  )
}