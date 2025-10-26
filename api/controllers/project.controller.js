import Project from "../models/project.model.js"
import { errorHandler } from "../utils/error.js"

export const createProject = async (req, res, next) => {
  try {
    const projectData = req.body
    // If a file was uploaded, set the image URL to the path where it's served
    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}` // Corrected path for projects
    } else if (!projectData.image) {
      // If no file uploaded and no URL provided, use default placeholder
      projectData.image = "/placeholder.svg?height=300&width=500&text=Project+Image"
    }

    // Parse array fields from comma-separated strings if they exist
    if (typeof projectData.techStack === "string") {
      projectData.techStack = projectData.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (typeof projectData.features === "string") {
      projectData.features = projectData.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (typeof projectData.tags === "string") {
      projectData.tags = projectData.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }

    const newProject = await Project.create(projectData)
    res.status(201).json(newProject)
  } catch (error) {
    next(errorHandler(500, "Failed to create project"))
  }
}

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
    res.status(200).json(projects)
  } catch (error) {
    next(errorHandler(500, "Failed to fetch projects"))
  }
}

export const getProject = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id || id === "undefined") {
      return next(errorHandler(400, "Invalid project ID provided"))
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(errorHandler(400, "Invalid project ID format"))
    }

    const project = await Project.findById(id)
    if (!project) return next(errorHandler(404, "Project not found"))
    res.status(200).json(project)
  } catch (error) {
    next(errorHandler(500, "Failed to fetch project"))
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const projectData = req.body
    // If a new file was uploaded, update the image URL
    if (req.file) {
      projectData.image = `/uploads/projects/${req.file.filename}` // Corrected path for projects
    } else if (!projectData.image && req.body.image === "") {
      // If image is explicitly cleared and no new file, set to default
      projectData.image = "/placeholder.svg?height=300&width=500&text=Project+Image"
    }

    // Parse array fields from comma-separated strings if they exist
    if (typeof projectData.techStack === "string") {
      projectData.techStack = projectData.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (typeof projectData.features === "string") {
      projectData.features = projectData.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (typeof projectData.tags === "string") {
      projectData.tags = projectData.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true })
    if (!updatedProject) return next(errorHandler(404, "Project not found"))
    res.status(200).json(updatedProject)
  } catch (error) {
    next(errorHandler(500, "Failed to update project"))
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.status(200).json("Project deleted successfully")
  } catch (error) {
    next(errorHandler(500, "Failed to delete project"))
  }
}

// New controller function for visitor count
export const incrementProjectVisitor = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return next(errorHandler(404, "Project not found"))

    // Convert "1.2K" to 1200, increment, then convert back
    let currentVisitors = 0
    if (typeof project.visitors === "string" && project.visitors.endsWith("K")) {
      currentVisitors = Number.parseFloat(project.visitors) * 1000
    } else {
      currentVisitors = Number.parseInt(project.visitors, 10) || 0 // Ensure it's a number, default to 0
    }

    currentVisitors += 1
    project.visitors = currentVisitors >= 1000 ? `${(currentVisitors / 1000).toFixed(1)}K` : String(currentVisitors)

    await project.save()
    res.status(200).json({ visitors: project.visitors })
  } catch (error) {
    next(errorHandler(500, "Failed to increment project visitor count"))
  }
}
