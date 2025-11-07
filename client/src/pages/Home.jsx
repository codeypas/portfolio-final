import resumee from "../component/resumee.pdf"
import ppsize from "./ppsize.jpg"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Download, ExternalLink, Github, Linkedin, Mail, ArrowRight, Code, Database, Globe, Wrench } from "lucide-react"
import { blogAPI, studyAPI, projectAPI } from "../services/api"
import * as LucideIcons from "lucide-react"

const DynamicLucideIcon = ({ name, ...props }) => {
  const IconComponent = LucideIcons[name]
  if (!IconComponent) {
    return <LucideIcons.FileText {...props} />
  }
  return <IconComponent {...props} />
}

// Define the base URL for uploaded files
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || "https://portfolio-backend-ohp9.onrender.com"

// const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL;  s

export default function Home() {
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  // const texts = ["Full-Stack Developer", "Blockchain Enthusiast", "Problem Solver", "Innovation Builder"]
  const texts = ["Full-Stack Developer","Software Developer","Blockchain Enthusiast","Problem Solver", "Innovation Builder", "Lifelong Learner"]

  const [recentProjects, setRecentProjects] = useState([])
  const [recentStudyResources, setRecentStudyResources] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setCurrentText(texts[currentIndex])
  }, [currentIndex])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null) // Reset error state on retry

        const [projectsRes, studyRes, blogsRes] = await Promise.allSettled([
          projectAPI.getProjects(),
          studyAPI.getResources(),
          blogAPI.getBlogs(),
        ])

        if (projectsRes.status === "fulfilled") {
          setRecentProjects(
            projectsRes.value.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
          )
        } else {
          console.error("Failed to fetch projects:", projectsRes.reason)
          setRecentProjects([]) // Use empty array as fallback
        }

        if (studyRes.status === "fulfilled") {
          setRecentStudyResources(
            studyRes.value.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
          )
        } else {
          console.error("Failed to fetch study resources:", studyRes.reason)
          setRecentStudyResources([]) // Use empty array as fallback
        }

        if (blogsRes.status === "fulfilled") {
          setRecentBlogs(blogsRes.value.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3))
        } else {
          console.error("Failed to fetch blogs:", blogsRes.reason)
          setRecentBlogs([]) // Use empty array as fallback
        }

        if (projectsRes.status === "rejected" && studyRes.status === "rejected" && blogsRes.status === "rejected") {
          setError("Unable to connect to server. Please check your internet connection or try again later.")
        }
      } catch (err) {
        console.error("Unexpected error during data fetch:", err)
        setError("An unexpected error occurred. Please refresh the page.")
        setRecentProjects([])
        setRecentStudyResources([])
        setRecentBlogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const techStacks = {
    Languages: [
      { name: "C", icon: "https://skillicons.dev/icons?i=c" },
      { name: "C++", icon: "https://skillicons.dev/icons?i=cpp" },
      { name: "Python", icon: "https://skillicons.dev/icons?i=python" },
      { name: "JavaScript", icon: "https://skillicons.dev/icons?i=js" },
    ],
    Frontend: [
      { name: "React", icon: "https://skillicons.dev/icons?i=react" },
      { name: "Bootstrap", icon: "https://skillicons.dev/icons?i=bootstrap" },
      { name: "Tailwind", icon: "https://skillicons.dev/icons?i=tailwind" },
      { name: "HTML/CSS", icon: "https://skillicons.dev/icons?i=html,css" },
    ],
    Backend: [
      { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs" },
      { name: "Express", icon: "https://skillicons.dev/icons?i=express" },
      { name: "MongoDB", icon: "https://skillicons.dev/icons?i=mongodb" },
      { name: "Firebase", icon: "https://skillicons.dev/icons?i=firebase" },
    ],
    Others: [
      { name: "Git", icon: "https://skillicons.dev/icons?i=git" },
      { name: "GitHub", icon: "https://skillicons.dev/icons?i=github" },
      { name: "Linux", icon: "https://skillicons.dev/icons?i=linux" },
      { name: "VScode", icon: "https://skillicons.dev/icons?i=vscode" },
    ],
  }

  const stats = [
    { number: "10+", label: "Projects Completed" },
    { number: "3+", label: "Web Apps Deployed" },
    { number: "5+", label: "Students Helped" },
    { number: "2+", label: "Years Experience" },
  ]

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        {/* Hero Section with loading state */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-8 max-w-md mx-auto"></div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pt-16">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error} Some content may not be available.</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Hi, I'm{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Bijay Adhikari
                </span>
              </h1>

              <div className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4 h-8">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{currentText}</span>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                I build ideas, believe in innovation, and love to create real-world projects. From React to Web3 —
                crafting clean, scalable code that makes a difference.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <a
                  href={resumee}
                  target="_blank"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  rel="noreferrer"
                >
                  <Download className="mr-2" size={20} />
                  View Resume
                </a>
                <Link
                  to="/project"
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold"
                >
                  <Code className="mr-2" size={20} />
                  Explore Projects
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  <Mail className="mr-2" size={20} />
                  Contact Me
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center lg:justify-start">
                <a
                  href="https://www.linkedin.com/in/bijay-adhikari-656122327/"
                  target="_blank"
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  rel="noreferrer"
                >
                  <Linkedin className="text-blue-600" size={24} />
                </a>
                <a
                  href="https://github.com/codeypas?tab=repositories"
                  target="_blank"
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  rel="noreferrer"
                >
                  <Github className="text-gray-800 dark:text-white" size={24} />
                </a>
                <a
                  href="mailto:bjbestintheworld@gmail.com"
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <Mail className="text-red-600" size={24} />
                </a>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-96 h-96 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out">
                  <img src={ppsize || "/placeholder.svg"} alt="Bijay Adhikari" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Tech Stack</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Technologies I work with</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(techStacks).map(([category, techs]) => (
              <div key={category} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {category === "Languages" && <Code className="text-blue-600 mr-2" size={24} />}
                  {category === "Frontend" && <Globe className="text-green-600 mr-2" size={24} />}
                  {category === "Backend" && <Database className="text-purple-600 mr-2" size={24} />}
                  {category === "Others" && <Wrench className="text-orange-600 mr-2" size={24} />}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {techs.map((tech, index) => (
                    <div
                      key={index}
                      className="group flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      title={tech.name}
                    >
                      <img
                        src={tech.icon || "/placeholder.svg"}
                        alt={tech.name}
                        className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-300 text-center">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Recent Projects</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">My latest work</p>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No recent projects found. Add some from the admin dashboard!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={
                        project.image && project.image.startsWith("/uploads")
                          ? `${UPLOAD_BASE_URL}${project.image}`
                          : project.image || "/placeholder.svg?height=200&width=300&text=Project+Image"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-4 font-medium">
                      {project.techStack && project.techStack.join(" • ")}
                    </p>
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          className="flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors text-sm"
                          rel="noreferrer"
                        >
                          <Github className="mr-2" size={16} />
                          Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                          rel="noreferrer"
                        >
                          <ExternalLink className="mr-2" size={16} />
                          Demo
                        </a>
                      )}
                      <Link
                        to={`/project/${project._id}`}
                        className="flex items-center px-4 py-2 border border-gray-400 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        Read More
                        <ArrowRight className="ml-2" size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/project"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              View All Projects
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blogs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Recent Blogs</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">My latest thoughts and articles</p>
          </div>

          {recentBlogs.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No recent blogs found. Add some from the admin dashboard!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={
                        blog.thumbnail && blog.thumbnail.startsWith("/uploads")
                          ? `${UPLOAD_BASE_URL}${blog.thumbnail}`
                          : blog.thumbnail || "/placeholder.svg?height=200&width=300&text=Blog+Thumbnail"
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{blog.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{blog.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString()} • {blog.views || 0} views
                      </span>
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Explore All Blogs
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Study Hub Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Study Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Latest resources and learning materials</p>
          </div>

          {recentStudyResources.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              No recent study resources found. Add some from the admin dashboard!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentStudyResources.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                      {resource.category}
                    </span>
                    {resource.icon && resource.icon.startsWith("/uploads/") ? (
                      <img
                        src={`${UPLOAD_BASE_URL}${resource.icon}` || "/placeholder.svg"}
                        alt="Resource Icon"
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <DynamicLucideIcon name={resource.icon} className="text-red-500" size={24} />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {resource.downloads || 0} downloads
                    </span>
                    <Link
                      to="/studyhub" // Link to the main study hub page for now
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/studyhub"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Explore Study Hub
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">"Build. Learn. Repeat."</h2>
          <p className="text-xl opacity-90">My motto for continuous growth and innovation</p>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Let's Connect</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Have a project in mind? Let's discuss how we can work together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="mailto:bjbestintheworld@gmail.com"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Mail className="mr-2" size={20} />
              Email Me
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold"
            >
              Contact Form
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>

          <div className="flex gap-6 justify-center">
            <a
              href="https://www.linkedin.com/in/bijay-adhikari-656122327/"
              target="_blank"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              rel="noreferrer"
            >
              <Linkedin size={32} />
            </a>
            <a
              href="https://github.com/codeypas?tab=repositories"
              target="_blank"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              rel="noreferrer"
            >
              <Github size={32} />
            </a>
            <a
              href="mailto:bjbestintheworld@gmail.com"
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Mail size={32} />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
