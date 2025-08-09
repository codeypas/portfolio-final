import express from "express"
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  incrementBlogView,
} from "../controllers/blog.controller.js"
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js"
import multer from "multer" // Import multer
import path from "path" // Import path
import { fileURLToPath } from "url" // For ES Modules

const router = express.Router()

// Get __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for blog thumbnail uploads
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/blogs")) // Store in api/uploads/blogs
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname) // Unique filename
  },
})

const uploadBlogThumbnail = multer({ storage: blogStorage })

// Public routes (anyone can view)
router.get("/", getBlogs)
router.get("/:id", getBlog)

// Protected routes (only admins can create, update, delete)
router.post("/", verifyToken, verifyAdmin, uploadBlogThumbnail.single("thumbnail"), createBlog)
router.put("/:id", verifyToken, verifyAdmin, uploadBlogThumbnail.single("thumbnail"), updateBlog)
router.delete("/:id", verifyToken, verifyAdmin, deleteBlog)

// Route for incrementing blog views
router.post("/:id/view", incrementBlogView)

export default router
