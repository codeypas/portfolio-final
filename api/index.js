import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import blogRoutes from "./routes/blog.route.js"
import studyRoutes from "./routes/study.route.js"
import projectRoutes from "./routes/project.route.js"
import contactRoutes from "./routes/contact.route.js" // Import new contact routes
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

// Serve static files from the 'uploads' directory and its subdirectories
// Ensure these directories exist in your 'api' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/uploads/blogs", express.static(path.join(__dirname, "uploads/blogs")))
app.use("/uploads/study-icons", express.static(path.join(__dirname, "uploads/study-icons")))
app.use("/uploads/study-files", express.static(path.join(__dirname, "uploads/study-files"))) // Added for study resource files
app.use("/uploads/projects", express.static(path.join(__dirname, "uploads/projects")))

app.listen(3000, () => {
  console.log("Server is running on port 3000....!")
})

app.get("/test", (req, res) => {
  res.json({ message: "API is working" })
})

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is healthy" })
})

app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/study", studyRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/contact", contactRoutes) // Use new contact routes

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
