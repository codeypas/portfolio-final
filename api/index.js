import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import blogRoutes from "./routes/blog.route.js"
import studyRoutes from "./routes/study.route.js"
import projectRoutes from "./routes/project.route.js"
import contactRoutes from "./routes/contact.route.js"
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

const parseOrigins = () => {
  const origins = ["http://localhost:5173"]
  if (process.env.FRONTEND_ORIGIN) {
    const envOrigins = process.env.FRONTEND_ORIGIN.split(",").map((o) => o.trim())
    origins.push(...envOrigins)
  }
  return origins
}

const allowedOrigins = parseOrigins()
console.log("[v0] Allowed CORS origins:", allowedOrigins)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.warn(`[v0] CORS blocked origin: ${origin}`)
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/uploads/blogs", express.static(path.join(__dirname, "uploads/blogs")))
app.use("/uploads/study-icons", express.static(path.join(__dirname, "uploads/study-icons")))
app.use("/uploads/study-files", express.static(path.join(__dirname, "uploads/study-files")))
app.use("/uploads/projects", express.static(path.join(__dirname, "uploads/projects")))

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}....!`)
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
app.use("/api/contact", contactRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
