import Blog from "../models/blog.model.js"
import { errorHandler } from "../utils/error.js"
import { deleteStoredImage, storeImage } from "../utils/mediaStorage.js"

export const createBlog = async (req, res, next) => {
  try {
    const blogData = req.body
    if (req.file) {
      blogData.thumbnail = await storeImage(req.file, "blogs")
    } else if (!blogData.thumbnail) {
      // If no file uploaded and no URL provided, use default placeholder
      blogData.thumbnail = "/placeholder.svg?height=200&width=300&text=Blog+Thumbnail"
    }

    // Ensure tags are parsed from comma-separated string to array
    if (typeof blogData.tags === "string") {
      blogData.tags = blogData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    }

    const newBlog = await Blog.create(blogData)
    res.status(201).json(newBlog)
  } catch (error) {
    next(error)
  }
}

export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
    res.status(200).json(blogs)
  } catch (error) {
    next(errorHandler(500, "Failed to fetch blogs"))
  }
}

export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return next(errorHandler(404, "Blog not found"))
    res.status(200).json(blog)
  } catch (error) {
    next(errorHandler(500, "Failed to fetch blog"))
  }
}

export const updateBlog = async (req, res, next) => {
  try {
    const blogData = req.body
    const existingBlog = await Blog.findById(req.params.id)
    if (!existingBlog) return next(errorHandler(404, "Blog not found"))

    if (req.file) {
      blogData.thumbnail = await storeImage(req.file, "blogs")
    } else if (!blogData.thumbnail && req.body.thumbnail === "") {
      // If thumbnail is explicitly cleared and no new file, set to default
      blogData.thumbnail = "/placeholder.svg?height=200&width=300&text=Blog+Thumbnail"
    }

    // Ensure tags are parsed from comma-separated string to array
    if (typeof blogData.tags === "string") {
      blogData.tags = blogData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogData, { new: true, runValidators: true })
    if (req.file && existingBlog.thumbnail !== updatedBlog.thumbnail) {
      await deleteStoredImage(existingBlog.thumbnail)
    }
    res.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
}

export const deleteBlog = async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
    if (!deletedBlog) return next(errorHandler(404, "Blog not found"))
    await deleteStoredImage(deletedBlog.thumbnail)
    res.status(200).json("Blog deleted successfully")
  } catch (error) {
    next(errorHandler(500, "Failed to delete blog"))
  }
}

// New controller function for views
export const incrementBlogView = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // Increment views by 1
      { new: true },
    )
    if (!blog) return next(errorHandler(404, "Blog not found"))
    res.status(200).json({ views: blog.views })
  } catch (error) {
    next(errorHandler(500, "Failed to increment blog view"))
  }
}
