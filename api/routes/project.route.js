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
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for project image uploads
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/projects")) // Store in api/uploads/projects
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname) // Unique filename
  },
})

const uploadProjectImage = multer({ storage: projectStorage })

// Public routes
router.get("/", getProjects)
router.get("/:id", getProject)
router.post("/:id/visitor", incrementProjectVisitor) // Route for visitors

// Protected routes
router.post("/", verifyToken, verifyAdmin, uploadProjectImage.single("image"), createProject)
router.put("/:id", verifyToken, verifyAdmin, uploadProjectImage.single("image"), updateProject)
router.delete("/:id", verifyToken, verifyAdmin, deleteProject)

export default router
