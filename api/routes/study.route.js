import express from "express"
import {
  createStudyResource,
  getStudyResources,
  getStudyResource,
  updateStudyResource,
  deleteStudyResource,
  incrementStudyDownload, // New import
  incrementStudyLike, // New import
} from "../controllers/study.controller.js"
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js"
import multer from "multer" // Import multer
import path from "path" // Import path
import { fileURLToPath } from "url" // For ES Modules

const router = express.Router()

// Get __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for study resource icon uploads
const studyIconStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/study-icons")) // Store in api/uploads/study-icons
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname) // Unique filename
  },
})

const uploadStudyIcon = multer({ storage: studyIconStorage })

// Public routes
router.get("/", getStudyResources)
router.get("/:id", getStudyResource)

// Protected routes
router.post("/", verifyToken, verifyAdmin, uploadStudyIcon.single("iconFile"), createStudyResource) // 'iconFile' is the field name for the file input
router.put("/:id", verifyToken, verifyAdmin, uploadStudyIcon.single("iconFile"), updateStudyResource)
router.delete("/:id", verifyToken, verifyAdmin, deleteStudyResource)

// New routes for reactions/feedback
router.post("/:id/download", incrementStudyDownload)
router.post("/:id/like", incrementStudyLike)

export default router
