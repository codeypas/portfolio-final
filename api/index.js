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
import { findStoredImage, openStoredImageStream } from "./utils/mediaStorage.js"

dotenv.config()

mongoose.set("bufferCommands", false)

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const normalizeOrigin = (value = "") => String(value).trim().replace(/^['"]|['"]$/g, "").replace(/\/$/, "")

const parseOrigins = () => {
  const origins = ["http://localhost:5173", "https://portfolio-final-p9fi.onrender.com"]
  const rawOrigins =
    process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || process.env.CLIENT_URL || process.env.FRONTEND_URL || ""

  if (rawOrigins) {
    const envOrigins = rawOrigins
      .split(",")
      .map(normalizeOrigin)
      .filter(Boolean)

    origins.push(...envOrigins)
  }
  return origins
}

const allowedOrigins = parseOrigins()
console.log("[v0] Allowed CORS origins:", allowedOrigins)

const isAllowedOrigin = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin)

  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === "*") {
      return true
    }

    if (allowedOrigin.includes("*")) {
      const pattern = new RegExp(`^${allowedOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*")}$`)
      return pattern.test(normalizedOrigin)
    }

    return allowedOrigin === normalizedOrigin
  })
}

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true)
      } else {
        console.warn(`[v0] CORS blocked origin: ${origin}`)
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }),
)

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[v0] ${req.method} ${req.path} - Cookie names:`, Object.keys(req.cookies))
  }
  next()
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/uploads/blogs", express.static(path.join(__dirname, "uploads/blogs")))
app.use("/uploads/study-icons", express.static(path.join(__dirname, "uploads/study-icons")))
app.use("/uploads/study-files", express.static(path.join(__dirname, "uploads/study-files")))
app.use("/uploads/projects", express.static(path.join(__dirname, "uploads/projects")))

// Keep legacy disk uploads working when present, then serve all new uploads
// from MongoDB GridFS so they survive Render restarts and redeploys.
app.get("/uploads/:folder/:filename", async (req, res, next) => {
  try {
    const file = await findStoredImage(req.params.folder, req.params.filename)
    if (!file) return next()

    res.set({
      "Content-Type": file.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    })

    const downloadStream = openStoredImageStream(file._id)
    downloadStream.on("error", next)
    downloadStream.pipe(res)
  } catch (error) {
    next(error)
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}....!`)
})

app.get("/test", (req, res) => {
  res.json({ message: "API is working" })
})

app.get("/api/health", (req, res) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1

  res.status(isDatabaseConnected ? 200 : 503).json({
    status: isDatabaseConnected ? "ok" : "degraded",
    message: isDatabaseConnected ? "Backend and database are healthy" : "Backend is running but database is not connected",
    database: {
      connected: isDatabaseConnected,
      readyState: mongoose.connection.readyState,
    },
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/study", studyRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/contact", contactRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || (err.code === "LIMIT_FILE_SIZE" ? 413 : 500)
  const message = err.message || "Internal Server Error"
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
