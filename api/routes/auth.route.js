import express from "express"
import {
  googleSignin,
  requestPasswordReset,
  resetPassword,
  signin,
  signout,
  signup,
  verifyEmail,
  getUserProfile,
} from "../controllers/auth.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", googleSignin)
router.get("/verify-email", verifyEmail)
router.post("/forgot-password", requestPasswordReset)
router.post("/reset-password", resetPassword)
router.get("/profile", verifyToken, getUserProfile)
router.post("/signout", signout)

export default router
