import express from "express"
import {
  createContactMessage,
  getContactMessages,
  markContactAsRead,
  deleteContactMessage,
} from "../controllers/contact.controller.js"
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js"

const router = express.Router()

// Public route for sending a contact message
router.post("/", createContactMessage)

// Protected routes for admin to manage messages
router.get("/", verifyToken, verifyAdmin, getContactMessages)
router.put("/:id/read", verifyToken, verifyAdmin, markContactAsRead)
router.delete("/:id", verifyToken, verifyAdmin, deleteContactMessage)

export default router
