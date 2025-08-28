import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { projectAPI } from "../services/api"
import { Calendar, Eye, Star, Github, ExternalLink, ArrowLeft, CheckCircle } from "lucide-react"

// Define the base URL for uploaded files
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || "http://localhost:3000"


// const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL;

export default function ProjectDetails() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await projectAPI.getProject(id)
        setProject(response.data)
        // Increment visitor count only if successfully fetched from API
        await projectAPI.incrementVisitor(id)
      } catch (err) {
        console.error("Failed to fetch project details:", err)
        setError("Failed to load project details. It might not exist or there was a server error.")
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id]) // Re-run effect if ID changes

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
        <Link to="/project" className="mt-4 text-blue-600 hover:underline">
          Go back to Projects
        </Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">Project not found.</p>
        <Link to="/project" className="mt-4 text-blue-600 hover:underline">
          Go back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg my-8">
        <Link
          to="/project"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to all Projects
        </Link>

        {project.image && (
          <div className="w-full max-w-2xl mx-auto mb-8 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-2">
            <div className="aspect-video flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={project.image.startsWith("/uploads/") ? `${UPLOAD_BASE_URL}${project.image}` : project.image}
                alt={project.title}
                className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{project.description}</p>

        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-8 space-x-4">
          <span className="flex items-center">
            <Calendar size={16} className="mr-1" />
            Built: {project.builtDate}
          </span>
          <span className="flex items-center">
            <Eye size={16} className="mr-1" />
            Visitors: {(project.visitors || 0).toLocaleString()}
          </span>
          <span className="flex items-center">
            <Star className="text-yellow-500 mr-1" size={16} />
            {project.rating}/5
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.type === "Personal"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : project.type === "Academic"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
            }`}
          >
            {project.type}
          </span>
        </div>

        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
          <p>{project.longDescription}</p>
        </div>

        {project.techStack && project.techStack.length > 0 && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tech Stack:</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-wrap gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <ExternalLink className="mr-2" size={20} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              <Github className="mr-2" size={20} />
              GitHub Repository
            </a>
          )}
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
