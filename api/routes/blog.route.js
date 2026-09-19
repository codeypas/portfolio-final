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
import multer from "multer"
import { imageUploadOptions } from "../utils/mediaStorage.js"

const router = express.Router()

// Image bytes are stored in MongoDB GridFS, not the temporary Render disk.
const uploadBlogThumbnail = multer({ storage: multer.memoryStorage(), ...imageUploadOptions })

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
