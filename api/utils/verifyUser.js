import jwt from "jsonwebtoken"
import { errorHandler } from "./error.js"

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    console.warn("[v0] No token in cookies. Available cookies:", Object.keys(req.cookies))
    return next(errorHandler(401, "Unauthorized: No token provided"))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("[v0] Token verification failed:", err.message)
      return next(errorHandler(403, "Forbidden: Invalid token"))
    }
    req.user = user
    next()
  })
}

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    console.warn("[v0] Admin access denied. User role:", req.user?.role)
    return next(errorHandler(403, "Forbidden: Admin access required"))
  }
}
