import express from "express"
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  incrementProjectVisitor,
} from "../controllers/project.controller.js"
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js"
import multer from "multer"
import { imageUploadOptions } from "../utils/mediaStorage.js"

const router = express.Router()

// Image bytes are stored in MongoDB GridFS, not the temporary Render disk.
const uploadProjectImage = multer({ storage: multer.memoryStorage(), ...imageUploadOptions })

// Public routes
router.get("/", getProjects)
router.get("/:id", getProject)
router.post("/:id/visitor", incrementProjectVisitor) // Route for visitors

// Protected routes
router.post("/", verifyToken, verifyAdmin, uploadProjectImage.single("image"), createProject)
router.put("/:id", verifyToken, verifyAdmin, uploadProjectImage.single("image"), updateProject)
router.delete("/:id", verifyToken, verifyAdmin, deleteProject)

export default router
