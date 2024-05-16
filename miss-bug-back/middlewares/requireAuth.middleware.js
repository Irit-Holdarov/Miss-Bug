import { authService } from "../api/auth/auth.service.js";


export function requireUser(req, res, next) {
	const loggedinUser = authService.validateToken(req.cookies.loginToken)
	if (!loggedinUser) return res.status(401).send('Not authenticated')

	req.loggedinUser = loggedinUser
	next()
}
