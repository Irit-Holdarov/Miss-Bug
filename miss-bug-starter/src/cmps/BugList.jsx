import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { userService } from '../services/user.service'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  const loggedinUser = userService.getLoggedinUser()

  function isOwnedByUser(bug) {
    if (!loggedinUser) return true
    return bug.creator._id === loggedinUser._id || loggedinUser.isAdmin
  }

  const userBugs = bugs.filter(bug => isOwnedByUser(bug))

  return (
    <ul className="bug-list">
      {userBugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            {loggedinUser && isOwnedByUser(bug) && <button onClick={() => { onRemoveBug(bug._id) }}>x</button>}
            {loggedinUser && isOwnedByUser(bug) &&<button onClick={() => { onEditBug(bug) }} >Edit</button>}
          </div>
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
