import crypto from "node:crypto"
import { finished } from "node:stream/promises"
import mongoose from "mongoose"

const BUCKET_NAME = "portfolioUploads"
const IMAGE_MIME_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/gif", "gif"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
])

const getBucket = () => {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    const error = new Error("Database is not ready for uploads")
    error.statusCode = 503
    throw error
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME })
}

export const imageUploadOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (IMAGE_MIME_TYPES.has(file.mimetype)) {
      callback(null, true)
      return
    }

    const error = new Error("Only JPG, PNG, GIF, WebP, and AVIF images are allowed")
    error.statusCode = 400
    callback(error)
  },
}

export const storeImage = async (file, folder) => {
  const extension = IMAGE_MIME_TYPES.get(file.mimetype)
  if (!extension) {
    const error = new Error("Unsupported image type")
    error.statusCode = 400
    throw error
  }

  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const uploadStream = getBucket().openUploadStream(filename, {
    contentType: file.mimetype,
    metadata: { folder },
  })

  uploadStream.end(file.buffer)
  await finished(uploadStream)

  return `/uploads/${folder}/${filename}`
}

export const findStoredImage = async (folder, filename) =>
  getBucket()
    .find({ filename, "metadata.folder": folder })
    .sort({ uploadDate: -1 })
    .next()

export const openStoredImageStream = (fileId) => getBucket().openDownloadStream(fileId)

export const deleteStoredImage = async (imageUrl) => {
  const match = imageUrl?.match(/^\/uploads\/([^/]+)\/([^/]+)$/)
  if (!match) return

  const [, folder, filename] = match
  const file = await findStoredImage(folder, filename)
  if (file) {
    await getBucket().delete(file._id)
  }
}
