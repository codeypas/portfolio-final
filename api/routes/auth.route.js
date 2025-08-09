import express from "express"
import { signin, signup, getUserProfile, signout } from "../controllers/auth.controller.js" // Import getUserProfile and signout
import { verifyToken } from "../utils/verifyUser.js" // Import verifyToken

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.get("/profile", verifyToken, getUserProfile) // New route to get user profile
router.post("/signout", signout) // New route for logout

export default router
