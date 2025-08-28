import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { Plus, Edit, Trash2, Star, FileText, BookOpen, FolderOpen, Mail, CheckCircle } from "lucide-react" // Added CheckCircle
import { blogAPI, contactAPI, studyAPI, projectAPI } from "../services/api"
import * as LucideIcons from "lucide-react" // Import all Lucide icons

// Define the base URL for uploaded files
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || "http://localhost:3000"


// const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL;

// Helper component for dynamic Lucide icons or image URL
const DynamicLucideIcon = ({ name, ...props }) => {
  const imageUrl = name && name.startsWith("/uploads/") ? `${UPLOAD_BASE_URL}${name}` : name
  if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("blob:"))) {
    return <img src={imageUrl || "/placeholder.svg"} alt="Resource Icon" className="w-6 h-6 object-contain" />
  }
  const IconComponent = LucideIcons[name]
  return IconComponent ? <IconComponent {...props} /> : <LucideIcons.FileText {...props} /> // Default to FileText
}

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [blogs, setBlogs] = useState([])
  const [contacts, setContacts] = useState([])
  const [studyResources, setStudyResources] = useState([])
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalContacts: 0,
    totalViews: 0,
    totalComments: 0,
    totalStudyResources: 0,
    totalProjects: 0,
  })

  useEffect(() => {
    if (!loading && !isAdmin()) {
      navigate("/")
      return
    }

    if (isAdmin()) {
      loadDashboardData()
    }
  }, [loading, user, isAdmin, navigate])

  const loadDashboardData = async () => {
    try {
      // Load blogs
      const blogsResponse = await blogAPI.getBlogs()
      setBlogs(blogsResponse.data)
      console.log("Fetched Blogs:", blogsResponse.data)

      // Load contacts
      const contactsResponse = await contactAPI.getMessages()
      setContacts(contactsResponse.data)
      console.log("Fetched Contacts:", contactsResponse.data)

      // Load study resources
      const studyResponse = await studyAPI.getResources()
      setStudyResources(studyResponse.data)
      console.log("Fetched Study Resources:", studyResponse.data)

      // Load projects
      const projectsResponse = await projectAPI.getProjects()
      setProjects(projectsResponse.data)
      console.log("Fetched Projects:", projectsResponse.data)

      // Calculate stats
      const totalViews = blogsResponse.data.reduce((sum, blog) => sum + (blog.views || 0), 0)
      const totalComments = blogsResponse.data.reduce((sum, blog) => sum + (blog.comments?.length || 0), 0)

      const newStats = {
        totalBlogs: blogsResponse.data.length,
        totalContacts: contactsResponse.data.length,
        totalViews,
        totalComments,
        totalStudyResources: studyResponse.data.length,
        totalProjects: projectsResponse.data.length,
      }
      setStats(newStats)
      console.log("Calculated Stats:", newStats)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate("/login")
      }
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await blogAPI.deleteBlog(blogId)
        loadDashboardData()
      } catch (error) {
        console.error("Error deleting blog:", error)
        alert("Failed to delete blog. Check console for details.")
      }
    }
  }

  const handleDeleteStudyResource = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this study resource?")) {
      try {
        await studyAPI.deleteResource(resourceId)
        loadDashboardData()
      } catch (error) {
        console.error("Error deleting study resource:", error)
        alert("Failed to delete study resource. Check console for details.")
      }
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectAPI.deleteProject(projectId)
        loadDashboardData()
      } catch (error) {
        console.error("Error deleting project:", error)
        alert("Failed to delete project. Check console for details.")
      }
    }
  }

  const handleMarkContactAsRead = async (contactId) => {
    try {
      await contactAPI.markAsRead(contactId) // Assuming you add this method to contactAPI
      loadDashboardData()
    } catch (error) {
      console.error("Error marking contact as read:", error)
      alert("Failed to mark message as read. Check console for details.")
    }
  }

  const handleDeleteContactMessage = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      try {
        await contactAPI.deleteMessage(contactId) // Assuming you add this method to contactAPI
        loadDashboardData()
      } catch (error) {
        console.error("Error deleting contact message:", error)
        alert("Failed to delete message. Check console for details.")
      }
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin()) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.username}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/admin/blogs/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus size={20} className="mr-2" />
                New Blog
              </Link>
              <Link
                to="/admin/study/new"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus size={20} className="mr-2" />
                New Study
              </Link>
              <Link
                to="/admin/projects/new"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus size={20} className="mr-2" />
                New Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBlogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Study Resources</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudyResources}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FolderOpen className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Mail className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Contact Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalContacts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: FolderOpen },
                { id: "blogs", label: "Blogs", icon: FileText },
                { id: "study", label: "Study Hub", icon: BookOpen },
                { id: "projects", label: "Projects", icon: FolderOpen },
                { id: "contacts", label: "Messages", icon: Mail },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon size={20} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {blogs.slice(0, 5).map((blog) => (
                    <div
                      key={blog._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{blog.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {blog.views || 0} views • {blog.comments?.length || 0} comments
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{blog.averageRating || 0}</span>
                      </div>
                    </div>
                  ))}
                  {studyResources.slice(0, 5).map((resource) => (
                    <div
                      key={resource._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {resource.downloads || 0} downloads • {resource.likes || 0} likes
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="text-blue-500" size={16} />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{resource.category}</span>
                      </div>
                    </div>
                  ))}
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{project.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {project.visitors || 0} visitors • {project.category}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{project.rating || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "blogs" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Blogs</h3>
                  <Link
                    to="/admin/blogs/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Add New Blog
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {blogs.map((blog) => (
                        <tr key={blog._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{blog.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {blog.views || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="text-yellow-500 mr-1" size={16} />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {blog.averageRating || 0} ({blog.totalRatings || 0})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                to={`/admin/blogs/edit/${blog._id}`}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() => handleDeleteBlog(blog._id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "study" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Study Resources</h3>
                  <Link
                    to="/admin/study/new"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Add New Resource
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {studyResources.map((resource) => (
                        <tr key={resource._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {resource.icon && (
                                <DynamicLucideIcon
                                  name={resource.icon}
                                  className="text-blue-600 dark:text-blue-400 mr-2"
                                  size={20}
                                />
                              )}
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{resource.title}</div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{resource.uploadDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                              {resource.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {resource.downloads || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {resource.likes || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                to={`/admin/study/edit/${resource._id}`}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() => handleDeleteStudyResource(resource._id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Projects</h3>
                  <Link
                    to="/admin/projects/new"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Add New Project
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Visitors
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {projects.map((project) => (
                        <tr key={project._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {project.image && (
                                <img
                                  src={
                                    project.image.startsWith("/uploads/")
                                      ? `${UPLOAD_BASE_URL}${project.image}`
                                      : project.image
                                  }
                                  alt="Project Thumbnail"
                                  className="w-8 h-8 object-cover rounded-md mr-2"
                                />
                              )}
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{project.builtDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full">
                              {project.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {project.visitors || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="text-yellow-500 mr-1" size={16} />
                              <span className="text-sm text-gray-900 dark:text-white">{project.rating || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                to={`/admin/projects/edit/${project._id}`}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "contacts" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Messages</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {contacts.map((contact) => (
                        <tr key={contact._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{contact.email}</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-900 dark:text-white">
                            {contact.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                contact.isRead
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                              }`}
                            >
                              {contact.isRead ? "Read" : "Unread"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {!contact.isRead && (
                                <button
                                  onClick={() => handleMarkContactAsRead(contact._id)}
                                  className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                                  title="Mark as Read"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteContactMessage(contact._id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                title="Delete Message"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
