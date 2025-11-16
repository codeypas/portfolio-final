import { useState, useEffect } from "react"
import { Calendar, Clock, Eye, Tag, ArrowRight, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { blogAPI } from "../services/api"

// Define the base URL for uploaded files
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || "https://portfolio-backend-ohp9.onrender.com"

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { isAdmin } = useAuth()
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sample data (fallback if no data from backend)
  const sampleBlogPosts = [
    {
      id: "sample1", // Use string IDs for samples to avoid conflicts with MongoDB _id
      title: "My Journey into Web3 Development",
      summary:
        "I share how I built a blockchain project and what I learned along the way. From smart contracts to DApp development.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Web3+Journey",
      tags: ["Web3", "Solidity", "Ethereum", "Blockchain"],
      date: "July 20, 2025",
      readTime: "3 min read",
      views: 1250,
      category: "Web3",
    },
    {
      id: "sample2",
      title: "How I Built My Portfolio with React",
      summary:
        "A complete guide on building a modern portfolio website using React, Tailwind CSS, and best practices for performance.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=React+Portfolio",
      tags: ["React", "Tailwind", "Portfolio", "Frontend"],
      date: "July 15, 2025",
      readTime: "5 min read",
      views: 2100,
      category: "React",
    },
    {
      id: "sample3",
      title: "Landing My First Tech Internship",
      summary:
        "Tips and strategies that helped me secure my first internship in tech. From resume building to interview preparation.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Tech+Internship",
      tags: ["Career", "Internship", "Tips", "Interview"],
      date: "July 10, 2025",
      readTime: "4 min read",
      views: 1800,
      category: "Career",
    },
    {
      id: "sample4",
      title: "Building Responsive Web Apps",
      summary:
        "Essential techniques for creating responsive web applications that work seamlessly across all devices and screen sizes.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Responsive+Design",
      tags: ["CSS", "Responsive", "Mobile", "Design"],
      date: "July 5, 2025",
      readTime: "6 min read",
      views: 1650,
      category: "Web Development",
    },
    {
      id: "sample5",
      title: "10 React Hooks You Should Know",
      summary:
        "Explore the most useful React hooks that can improve your development workflow and make your code more efficient.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=React+Hooks",
      tags: ["React", "Hooks", "JavaScript", "Frontend"],
      date: "June 30, 2025",
      readTime: "7 min read",
      views: 2850,
      category: "React",
    },
    {
      id: "sample6",
      title: "Getting Started with Node.js",
      summary:
        "A beginner-friendly guide to Node.js development, covering the basics and building your first server application.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Node.js+Guide",
      tags: ["Node.js", "Backend", "JavaScript", "Server"],
      date: "June 25, 2025",
      readTime: "8 min read",
      views: 1950,
      category: "Web Development",
    },
  ]

  const categories = ["All", "Web Development", "React", "Web3", "Career", "Tips"]

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await blogAPI.getBlogs()
        setBlogPosts(response.data)
      } catch (err) {
        console.error("Failed to fetch blogs:", err)
        setError("Failed to load blogs. Please try again later.")
        setBlogPosts([]) // Clear posts on error
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  // Determine which posts to display: fetched posts if available, otherwise sample posts
  const postsToDisplay = blogPosts.length > 0 ? blogPosts : sampleBlogPosts

  const filteredPosts =
    selectedCategory === "All" ? postsToDisplay : postsToDisplay.filter((post) => post.category === selectedCategory)

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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Sharing my journey, learnings, and insights about web development, technology, and career growth.
          </p>
          {isAdmin() && (
            <div className="mt-8">
              <Link
                to="/admin/blogs/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Plus size={20} className="mr-2" />
                Add New Blog Post
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

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const thumbnailUrl = post.thumbnail
                ? post.thumbnail.startsWith("http")
                  ? post.thumbnail // Use as-is if it's already a full URL
                  : post.thumbnail.startsWith("/uploads/")
                    ? `${UPLOAD_BASE_URL}${post.thumbnail}` // Prepend base URL for relative paths
                    : post.thumbnail // Use as-is for placeholder URLs
                : "/placeholder.svg"

              return (
                <article
                  key={post._id || post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Thumbnail */}
                  <Link to={`/blog/${post._id || post.id}`}>
                    <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={thumbnailUrl || "/placeholder.svg"}
                        alt={post.title}
                        onError={(e) => {
                          console.log("[v0] Image failed to load, using fallback:", thumbnailUrl)
                          e.target.src = "/placeholder.svg?height=200&width=300&text=Blog+Post"
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(post.tags || []).slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium"
                        >
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <Link to={`/blog/${post._id || post.id}`}>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Summary */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.summary}</p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(post.createdAt || post.date).toLocaleDateString()}{" "}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {post.readTime || "N/A"}
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {(post.views || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Read More Button */}
                    <Link
                      to={`/blog/${post._id || post.id}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group-hover:translate-x-1 transition-transform"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to get notified about new blog posts and resources.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
