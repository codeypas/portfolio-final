import mongoose from "mongoose"

const studyResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String, // e.g., PDF, PPT, Code
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String, // URL to the downloadable file
      required: true,
    },
    icon: {
      type: String, // Lucide icon name or URL
      default: "FileText", // Default icon
    },
    uploadDate: {
      type: String, // Storing as string for simplicity, e.g., "July 2025"
      default: () => new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    },
    downloads: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

const StudyResource = mongoose.model("StudyResource", studyResourceSchema)

export default StudyResource
