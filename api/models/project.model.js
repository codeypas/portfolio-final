import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL to the project image
      default: "/placeholder.svg?height=300&width=500&text=Project+Image",
    },
    techStack: {
      type: [String], // Array of strings
      default: [],
    },
    features: {
      type: [String], // Array of strings
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    builtDate: {
      type: String, // Storing as string for simplicity, e.g., "June 2025"
      default: () => new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    },
    visitors: {
      type: String, // Storing as string, e.g., "1.2K"
      default: "0",
    },
    rating: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String, // e.g., Personal, Academic, Open Source
      trim: true,
    },
    tags: {
      type: [String], // Array of strings
      default: [],
    },
  },
  { timestamps: true },
)

const Project = mongoose.model("Project", projectSchema)

export default Project
