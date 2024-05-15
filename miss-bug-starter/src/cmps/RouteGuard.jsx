import { Navigate } from "react-router"
import { userService } from "../services/user.service"

export function RouteGuard({ children }) {
  const loggedinUser = userService.getLoggedinUser()

  function isAllowed() {
      return loggedinUser?.isAdmin
  }

  if (!isAllowed()) return <Navigate to="/" />
  return children
}