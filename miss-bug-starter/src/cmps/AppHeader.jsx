
import { NavLink } from 'react-router-dom'
import { LoginSignup } from './LoginSignup'
import { useState } from 'react'
import { userService } from '../services/user.service'
import { showErrorMsg, showSuccessMsg  } from '../services/event-bus.service.js'

export function AppHeader() {
    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

    
    async function onLogin(credentials) {
        try {
            const user = await userService.login(credentials)
            setLoggedinUser(user)
            showSuccessMsg(`Welcome ${user.fullname}`)
        } catch (err) {
            showErrorMsg(`Cannot login`)
        }
    }

    async function onSignup(credentials) {     // add signup
        try {
            const user = await userService.signup(credentials)
            setLoggedinUser(user)
            showSuccessMsg(`Welcome ${user.fullname}`)
        } catch (err) {
            console.log('Cannot signup :', err)
            showErrorMsg(`Cannot signup`)
        }
    }

    async function onLogout() {      // add logout
        console.log('logout')
        try {
            await userService.logout()
            setLoggedinUser(null)
        } catch (err) {
            console.log('can not logout')
        }
    }

    function isAllowed() {
        return loggedinUser?.isAdmin
    }


    return (
        <header className='app-header container'>

            <div className='header-container'>
                <nav className='app-nav'>
                    <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> 
                   { isAllowed() && <NavLink to="/user">Users</NavLink> } {isAllowed() &&<NavLink to="/about">About</NavLink>}
                </nav>

                <section className="login-signup-container">
                    {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

                    {loggedinUser && <div className="user-preview">
                        <h3>Hello {loggedinUser.fullname}
                            <button onClick={onLogout}>Logout</button>
                        </h3>
                    </div>}
                </section>
                <h1>Bugs are Forever</h1>
            </div>
        </header>
    )
}
