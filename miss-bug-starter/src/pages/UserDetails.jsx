import { useState } from 'react'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bugService } from '../services/bug.service.js'
import { BugPreview } from '../cmps/BugPreview.jsx'


export function UserDetails() {

    const [user, setUser] = useState(null)
    const { userId } = useParams()
    const [bugs, setBugs] = useState(null)

    useEffect(() => {
        loadUser()
        loadBugs()
    }, [])

    async function loadUser() {
        try {
            const user = await userService.getById(userId)
            setUser(user)
        } catch (err) {
            showErrorMsg('Cannot load user')

        }
    }

    async function loadBugs() {
        try {
            const bugs = await bugService.query()
            setBugs(bugs)
        } catch (err) {
            showErrorMsg('Cannot load user')
        }
    }

    if (!user || !bugs) return <h1>loadings....</h1>

    return (
        <div className="user-details container">
            <h3>User Details</h3>
            <h4>{user.username}</h4>
            <p>Fullname: <span>{user.fullname}</span></p>
            <p>Score: <span>{user.score}</span></p>

            <h3>User Bugs:</h3>
            <ul className="bug-list">
                {bugs
                    .filter(bug => bug.creator._id === user._id || user.isAdmin)
                    .map(filteredBug => (
                        <li className="bug-preview" key={filteredBug._id}>
                            <BugPreview bug={filteredBug} />
                        </li>
                    ))}
            </ul>

            <Link to="/user">Back to List</Link>
        </div>
    )
}

