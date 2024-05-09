
import { NavLink } from 'react-router-dom'
import { LoginSignup } from './LoginSignup'

export function AppHeader() {

    return (
        <header className='app-header container'>

            <div className='header-container'>
                <nav className='app-nav'>
                    <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/user">Users</NavLink> | <NavLink to="/about">About</NavLink>
                </nav>
                <div className='login'>
                    <LoginSignup />
                </div>
                <h1>Bugs are Forever</h1>
            </div>
        </header>
    )
}
