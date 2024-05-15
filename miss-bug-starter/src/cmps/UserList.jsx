import { Link } from 'react-router-dom'

export function UserList({ users, onRemoveUser }) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li className="user-preview" key={user._id}>
          <button
            onClick={() => {
              onRemoveUser(user._id)
            }}
          >
            x
          </button>
          <h4>UserName: {user.username}</h4>
          <Link to={`/user/${user._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
