import StudyResource from "../models/study.model.js"
import { errorHandler } from "../utils/error.js"

export const createStudyResource = async (req, res, next) => {
  try {
    const resourceData = req.body
    if (req.file) {
      resourceData.icon = `/uploads/study-icons/${req.file.filename}` // Path where it's served
    } else if (!resourceData.icon) {
      // If no file uploaded and no URL provided, use default Lucide icon name
      resourceData.icon = "FileText"
    }

    const newResource = await StudyResource.create(resourceData)
    res.status(201).json(newResource)
  } catch (error) {
    next(errorHandler(500, "Failed to create study resource"))
  }
}

export const getStudyResources = async (req, res, next) => {
  try {
    const resources = await StudyResource.find()
    res.status(200).json(resources)
  } catch (error) {
    next(errorHandler(500, "Failed to fetch study resources"))
  }
}

export const getStudyResource = async (req, res, next) => {
  try {
    const resource = await StudyResource.findById(req.params.id)
    if (!resource) return next(errorHandler(404, "Study resource not found"))
    res.status(200).json(resource)
  } catch (error) {
    next(errorHandler(500, "Failed to fetch study resource"))
  }
}

export const updateStudyResource = async (req, res, next) => {
  try {
    const resourceData = req.body
    if (req.file) {
      resourceData.icon = `/uploads/study-icons/${req.file.filename}`
    } else if (!resourceData.icon && req.body.icon === "") {
      // If icon is explicitly cleared and no new file, set to default
      resourceData.icon = "FileText"
    }

    const updatedResource = await StudyResource.findByIdAndUpdate(req.params.id, resourceData, { new: true })
    if (!updatedResource) return next(errorHandler(404, "Study resource not found"))
    res.status(200).json(updatedResource)
  } catch (error) {
    next(errorHandler(500, "Failed to update study resource"))
  }
}

export const deleteStudyResource = async (req, res, next) => {
  try {
    await StudyResource.findByIdAndDelete(req.params.id)
    res.status(200).json("Study resource deleted successfully")
  } catch (error) {
    next(errorHandler(500, "Failed to delete study resource"))
  }
}

// New controller function for downloads
export const incrementStudyDownload = async (req, res, next) => {
  try {
    const resource = await StudyResource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } }, // Increment downloads by 1
      { new: true },
    )
    if (!resource) return next(errorHandler(404, "Study resource not found"))
    res.status(200).json({ downloads: resource.downloads })
  } catch (error) {
    next(errorHandler(500, "Failed to increment download count"))
  }
}

// New controller function for likes
export const incrementStudyLike = async (req, res, next) => {
  try {
    const resource = await StudyResource.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }, // Increment likes by 1
      { new: true },
    )
    if (!resource) return next(errorHandler(404, "Study resource not found"))
    res.status(200).json({ likes: resource.likes })
  } catch (error) {
    next(errorHandler(500, "Failed to increment like count"))
  }
}
