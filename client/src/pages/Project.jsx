import { useState, useEffect } from "react"
import { Github, ExternalLink, Calendar, Eye, Star, Plus, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { projectAPI } from "../services/api"

// Define the base URL for uploaded files
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || "http://localhost:3000"

export default function Project() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Sample data (fallback if no data from backend)
  const sampleProjects = [
    {
      _id: "sample1", // Changed to _id for consistency with fetched data
      title: "ScanPOS – Mobile-First POS Web App",
      description:
        "A comprehensive point-of-sale web application with UPI integration, inventory management, and automated daily audit reports via WhatsApp.",
      longDescription:
        "ScanPOS is a modern, mobile-first point-of-sale system designed for small to medium businesses. It features real-time inventory tracking, multiple payment methods including UPI QR codes, and automated reporting system that sends daily sales reports via WhatsApp.",
      image: "/placeholder.svg?height=300&width=500&text=ScanPOS+Dashboard",
      techStack: ["React", "Node.js", "MongoDB", "Tailwind CSS", "Express", "WhatsApp API"],
      features: [
        "UPI QR Code Payments",
        "Real-time Stock Alerts",
        "WhatsApp Daily Reports",
        "Mobile-Responsive Design",
        "Inventory Management",
        "Sales Analytics",
      ],
      githubUrl: "https://github.com/codeypas/scanpos",
      liveUrl: "https://scanpos-demo.vercel.app",
      builtDate: "June 2025",
      visitors: "1.2K",
      rating: 4.7,
      category: "Web App",
      type: "Personal",
      tags: ["WebApp", "RetailTech", "UPI", "MERN"],
      createdAt: "2025-06-01T10:00:00Z", // Added for sorting consistency
    },
    {
      _id: "sample2",
      title: "V-ICB Branch Website",
      description:
        "Dynamic branch website project showcasing diverse visual content with responsive design and interactive features.",
      longDescription:
        "A comprehensive website for V-ICB branch featuring modern design principles, interactive galleries, event management system, and responsive layout optimized for all devices.",
      image: "/placeholder.svg?height=300&width=500&text=V-ICB+Website",
      techStack: ["React", "Redux", "Firebase", "CSS3", "JavaScript"],
      features: [
        "Responsive Design",
        "Interactive Galleries",
        "Event Management",
        "Contact Forms",
        "SEO Optimized",
        "Fast Loading",
      ],
      githubUrl: "https://github.com/codeypas/V-ICB-secondYear-FullStack-Project-",
      liveUrl: "https://v-icb-demo.netlify.app",
      builtDate: "May 2025",
      visitors: "850",
      rating: 4.5,
      category: "Full Stack",
      type: "Academic",
      tags: ["React", "Firebase", "Responsive", "Educational"],
      createdAt: "2025-05-01T10:00:00Z",
    },
    {
      _id: "sample3",
      title: "RockRoads E-commerce Platform",
      description:
        "Full-fledged e-commerce system for clothing with shopping cart, payment integration, and user management.",
      longDescription:
        "RockRoads is a complete e-commerce solution built for fashion retailers. It includes user authentication, product catalog management, shopping cart functionality, secure payment processing through Stripe, and order tracking system.",
      image: "/placeholder.svg?height=300&width=500&text=RockRoads+E-commerce",
      techStack: ["React", "Node.js", "MongoDB", "Redux", "Stripe API", "Express"],
      features: [
        "User Authentication",
        "Product Catalog",
        "Shopping Cart",
        "Stripe Payment Integration",
        "Order Tracking",
        "Admin Dashboard",
      ],
      githubUrl: "https://github.com/codeypas/e-commerce-html-css",
      liveUrl: "https://rockroads-demo.vercel.app",
      builtDate: "April 2025",
      visitors: "2.1K",
      rating: 4.8,
      category: "Full Stack",
      type: "Personal",
      tags: ["E-commerce", "MERN", "Stripe", "Fashion"],
      createdAt: "2025-04-01T10:00:00Z",
    },
    {
      _id: "sample4",
      title: "CryptoTracker DApp",
      description:
        "Decentralized application for tracking cryptocurrency portfolios with Web3 integration and real-time price updates.",
      longDescription:
        "A modern decentralized application that allows users to connect their crypto wallets, track portfolio performance, and get real-time market data. Built with Web3 technologies and smart contract integration.",
      image: "/placeholder.svg?height=300&width=500&text=CryptoTracker+DApp",
      techStack: ["React", "Web3.js", "Solidity", "Ethereum", "MetaMask", "Chart.js"],
      features: [
        "Wallet Integration",
        "Portfolio Tracking",
        "Real-time Price Data",
        "Smart Contracts",
        "Transaction History",
        "Price Alerts",
      ],
      githubUrl: "https://github.com/codeypas/crypto-tracker-dapp",
      liveUrl: "https://cryptotracker-dapp.vercel.app",
      builtDate: "March 2025",
      visitors: "950",
      rating: 4.6,
      category: "Blockchain",
      type: "Personal",
      tags: ["Web3", "DApp", "Crypto", "Blockchain"],
      createdAt: "2025-03-01T10:00:00Z",
    },
    {
      _id: "sample5",
      title: "TaskFlow Mobile App",
      description:
        "React Native mobile application for task management with offline support and team collaboration features.",
      longDescription:
        "TaskFlow is a comprehensive task management mobile app built with React Native. It features offline synchronization, team collaboration tools, project management, and cross-platform compatibility.",
      image: "/placeholder.svg?height=300&width=500&text=TaskFlow+Mobile+App",
      techStack: ["React Native", "Redux", "SQLite", "Node.js", "Socket.io"],
      features: [
        "Offline Support",
        "Team Collaboration",
        "Push Notifications",
        "Cross-platform",
        "Real-time Sync",
        "Project Management",
      ],
      githubUrl: "https://github.com/codeypas/taskflow-mobile",
      liveUrl: "https://play.google.com/store/apps/taskflow",
      builtDate: "February 2025",
      visitors: "1.5K",
      rating: 4.9,
      category: "Mobile",
      type: "Personal",
      tags: ["Mobile", "ReactNative", "Productivity", "Offline"],
      createdAt: "2025-02-01T10:00:00Z",
    },
    {
      _id: "sample6",
      title: "DevPortfolio Template",
      description:
        "Modern, responsive portfolio template for developers with dark mode, animations, and customizable components.",
      longDescription:
        "A beautiful, modern portfolio template designed specifically for developers. Features include dark/light mode toggle, smooth animations, responsive design, and easily customizable components.",
      image: "/placeholder.svg?height=300&width=500&text=Portfolio+Template",
      techStack: ["React", "Tailwind CSS", "Framer Motion", "Next.js"],
      features: [
        "Dark/Light Mode",
        "Smooth Animations",
        "Responsive Design",
        "SEO Optimized",
        "Easy Customization",
        "Modern UI/UX",
      ],
      githubUrl: "https://github.com/codeypas/dev-portfolio-template",
      liveUrl: "https://devportfolio-template.vercel.app",
      builtDate: "January 2025",
      visitors: "3.2K",
      rating: 4.8,
      category: "Frontend",
      type: "Open Source",
      tags: ["Template", "Portfolio", "React", "Tailwind"],
      createdAt: "2025-01-01T10:00:00Z",
    },
  ]

  const categories = ["All", "Mobile", "Blockchain", "Full Stack", "Frontend", "Backend", "Web App", "Browser Extension", "Open Source"]

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await projectAPI.getProjects()
        // Sort projects by createdAt date in descending order (newest first)
        const sortedProjects = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setProjects(sortedProjects)
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        setError("Failed to load projects. Please try again later.")
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const projectsToDisplay = projects.length > 0 ? projects : sampleProjects

  const filteredProjects =
    selectedCategory === "All"
      ? projectsToDisplay
      : projectsToDisplay.filter((project) => project.category === selectedCategory)

  // Function to handle navigation to project details
  const handleViewDetails = (projectId) => {
    navigate(`/project/${projectId}`)
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Projects</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A showcase of my work, from web applications to mobile apps and blockchain projects. Each project represents
            a learning journey and problem-solving experience.
          </p>
          {isAdmin() && (
            <div className="mt-8">
              <Link
                to="/admin/projects/new"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                <Plus size={20} className="mr-2" />
                Add New Project
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {" "}
            {/* Changed to lg:grid-cols-2 for larger cards */}
            {filteredProjects.map((project) => (
              <article
                key={project._id || project.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Project Image */}
                <Link to={`/project/${project._id || project.id}`}>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={
                        project.image?.startsWith("/uploads/")
                          ? `${UPLOAD_BASE_URL}${project.image}`
                          : project.image || "/placeholder.svg"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Project Content */}
                <div className="p-6">
                  {/* Type Badge and Rating */}
                  <div className="flex items-center justify-between mb-3">
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
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Star className="text-yellow-500 mr-1" size={16} />
                      {project.rating}/5
                    </div>
                  </div>

                  {/* Title */}
                  <Link to={`/project/${project._id || project.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h2>
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {(project.techStack || []).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Built: {project.builtDate}
                      </span>
                      <span className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        Visitors: {project.visitors}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="mr-2" size={16} />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <Github className="mr-2" size={16} />
                        GitHub
                      </a>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {(project.tags || []).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More Button */}
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => handleViewDetails(project._id || project.id)}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group-hover:translate-x-1 transition-transform"
                    >
                      View Details
                      <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore More on GitHub</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Check out my GitHub profile for more projects, contributions, and open-source work.
          </p>

          <a
            href="https://github.com/codeypas?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors font-semibold"
          >
            <Github className="mr-2" size={20} />
            View GitHub Profile
          </a>
        </div>
      </section>
    </div>
  )
}
