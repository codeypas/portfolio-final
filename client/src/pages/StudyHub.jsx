import { useState, useEffect } from "react"
import { Download, Eye, Calendar, Heart, Search, FileText, Video, Code, BookOpen, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { studyAPI } from "../services/api"

// Define the base URL for uploaded files
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || "https://portfolio-final-7jgp.onrender.com"

export default function StudyHub() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const { isAdmin } = useAuth()
  const [studyResources, setStudyResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const sampleStudyResources = [
    {
      id: "sample1",
      title: "React Complete Cheat Sheet",
      category: "Web Development",
      description: "Comprehensive React cheat sheet covering hooks, components, state management, and best practices.",
      format: "PDF",
      icon: "FileText", // Lucide icon name
      uploadDate: "July 2025",
      downloads: 1250,
      likes: 89,
      fileUrl: "/resources/react-cheat-sheet.pdf",
    },
    {
      id: "sample2",
      title: "OS Unit 5 Notes - Process Scheduling",
      category: "Operating Systems",
      description:
        "Includes scheduling algorithms with diagrams and examples. FCFS, SJF, Round Robin, and Priority scheduling.",
      format: "PDF",
      icon: "FileText",
      uploadDate: "July 2025",
      downloads: 890,
      likes: 67,
      fileUrl: "/resources/os-unit5-notes.pdf",
    },
    {
      id: "sample3",
      title: "DSA Interview Questions",
      category: "DSA",
      description: "Top 100 data structures and algorithms questions asked in technical interviews with solutions.",
      format: "PDF",
      icon: "FileText",
      uploadDate: "June 2025",
      downloads: 2100,
      likes: 156,
      fileUrl: "/resources/dsa-interview-questions.pdf",
    },
    {
      id: "sample4",
      title: "Database Management System Notes",
      category: "Database",
      description:
        "Complete DBMS notes covering normalization, SQL queries, transactions, and database design principles.",
      format: "PDF",
      icon: "FileText",
      uploadDate: "June 2025",
      downloads: 1650,
      likes: 98,
      fileUrl: "/resources/dbms-complete-notes.pdf",
    },
    {
      id: "sample5",
      title: "Cybersecurity Fundamentals",
      category: "Cybersecurity",
      description: "Introduction to cybersecurity concepts, threats, vulnerabilities, and protection mechanisms.",
      format: "PPT",
      icon: "Video",
      uploadDate: "May 2025",
      downloads: 750,
      likes: 45,
      fileUrl: "/resources/cybersecurity-fundamentals.pptx",
    },
    {
      id: "sample6",
      title: "JavaScript ES6+ Features",
      category: "Web Development",
      description:
        "Modern JavaScript features including arrow functions, destructuring, promises, async/await, and modules.",
      format: "PDF",
      icon: "FileText",
      uploadDate: "May 2025",
      downloads: 1850,
      likes: 134,
      fileUrl: "/resources/javascript-es6-features.pdf",
    },
    {
      id: "sample7",
      title: "Placement Preparation Guide",
      category: "Placement",
      description:
        "Complete guide for placement preparation including resume tips, interview strategies, and company-wise questions.",
      format: "PDF",
      icon: "FileText",
      uploadDate: "April 2025",
      downloads: 3200,
      likes: 245,
      fileUrl: "/resources/placement-preparation-guide.pdf",
    },
    {
      id: "sample8",
      title: "Node.js Backend Development",
      category: "Web Development",
      description: "Learn backend development with Node.js, Express, MongoDB, and RESTful API design patterns.",
      format: "Code",
      icon: "Code",
      uploadDate: "April 2025",
      downloads: 980,
      likes: 72,
      fileUrl: "/resources/nodejs-backend-code.zip",
    },
  ]

  // Helper component to render Lucide icons or image URLs
  const ResourceIcon = ({ iconNameOrUrl, ...props }) => {
    const imageUrl =
      iconNameOrUrl && iconNameOrUrl.startsWith("/uploads/") ? `${UPLOAD_BASE_URL}${iconNameOrUrl}` : iconNameOrUrl
    if (
      imageUrl &&
      (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("blob:"))
    ) {
      return <img src={imageUrl || "/placeholder.svg"} alt="Resource Icon" className="w-6 h-6 object-contain" />
    }
    const IconComponent = {
      FileText: FileText,
      Video: Video,
      Code: Code,
      BookOpen: BookOpen,
      // Add more mappings for other Lucide icons you might use
    }[iconNameOrUrl]
    return IconComponent ? <IconComponent {...props} /> : <FileText {...props} /> // Default to FileText if not found
  }

  const categories = ["All", "DSA", "Web Development", "1st SEM", "2nd SEM", "3rd SEM", "4th SEM", "5th SEM", "6th SEM", "7th SEM", "8th SEM","Placement"];

  useEffect(() => {
    const fetchStudyResources = async () => {
      try {
        setLoading(true)
        const response = await studyAPI.getResources()
        setStudyResources(response.data)
      } catch (err) {
        console.error("Failed to fetch study resources:", err)
        setError("Failed to load study resources. Please try again later.")
        setStudyResources([])
      } finally {
        setLoading(false)
      }
    }
    fetchStudyResources()
  }, [])

  const resourcesToDisplay = studyResources.length > 0 ? studyResources : sampleStudyResources

  const filteredResources = resourcesToDisplay.filter((resource) => {
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDownload = async (resourceId, fileUrl) => {
    try {
      // Increment download count via API
      await studyAPI.downloadResource(resourceId)
      console.log(`Incremented download count for: ${resourceId}`)

      // Construct full URL for download if it's a local upload
      const fullFileUrl = fileUrl.startsWith("/uploads/") ? `${UPLOAD_BASE_URL}${fileUrl}` : fileUrl

      // Initiate file download by opening in a new tab
      window.open(fullFileUrl, "_blank")

      // Refetch resources to update download count on UI
      const response = await studyAPI.getResources()
      setStudyResources(response.data)
    } catch (error) {
      console.error("Error during download or increment:", error)
      alert("Failed to download resource or record download. Please try again.")
    }
  }

  const handleLike = async (resourceId) => {
    try {
      await studyAPI.likeResource(resourceId)
      console.log(`Liked resource: ${resourceId}`)
      // Refetch resources to update like count on UI
      const response = await studyAPI.getResources()
      setStudyResources(response.data)
    } catch (error) {
      console.error("Error liking resource:", error)
      alert("Failed to like resource. Please try again.")
    }
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Study Hub</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Free study materials, notes, and resources to help you excel in your academic journey. All content is freely
            available for learning.
          </p>
          {isAdmin() && (
            <div className="mt-8">
              <Link
                to="/admin/study/new"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Plus size={20} className="mr-2" />
                Add New Resource
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
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

      {/* Resources Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <div
                key={resource._id || resource.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <ResourceIcon iconNameOrUrl={resource.icon} className="text-red-500" size={24} />
                    <div>
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium">
                        {resource.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {resource.format}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{resource.description}</p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {resource.uploadDate}
                    </span>
                    <button
                      onClick={() => handleLike(resource._id || resource.id)}
                      className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Heart size={14} className="mr-1" />
                      {resource.likes}
                    </button>
                  </div>
                  <span className="flex items-center">
                    <Download size={14} className="mr-1" />
                    {(resource.downloads || 0).toLocaleString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(resource._id || resource.id, resource.fileUrl)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No resources found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {resourcesToDisplay.length}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Resources Available</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {resourcesToDisplay.reduce((sum, resource) => sum + (resource.downloads || 0), 0).toLocaleString()}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Total Downloads</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Students Helped</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {categories.length - 1}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">Subject Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Need Something Specific?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Can't find what you're looking for? Request a specific topic or resource, and I'll try to create or upload
            it to the Study Hub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="What topic do you need help with?"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Request
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
