import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { projectAPI } from "../../services/api"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

export default function ProjectForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    image: "", // Will store URL or base64 for preview
    techStack: "",
    features: "",
    githubUrl: "",
    liveUrl: "",
    category: "",
    type: "",
    tags: "",
  })
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (id) {
      setIsEditMode(true)
      const fetchProject = async () => {
        try {
          setLoading(true)
          const response = await projectAPI.getProject(id)
          const projectData = response.data
          setFormData({
            title: projectData.title || "",
            description: projectData.description || "",
            longDescription: projectData.longDescription || "",
            image: projectData.image || "",
            techStack: (projectData.techStack || []).join(", "),
            features: (projectData.features || []).join(", "),
            githubUrl: projectData.githubUrl || "",
            liveUrl: projectData.liveUrl || "",
            category: projectData.category || "",
            type: projectData.type || "",
            tags: (projectData.tags || []).join(", "),
          })
        } catch (err) {
          console.error("Error fetching project for edit:", err)
          setError("Failed to load project for editing.")
        } finally {
          setLoading(false)
        }
      }
      fetchProject()
    }
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImageFile(file)
      setFormData({ ...formData, image: URL.createObjectURL(file) })
    } else {
      setSelectedImageFile(null)
      setFormData({ ...formData, image: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const dataToSend = new FormData()
    for (const key in formData) {
      if (key === "image" && selectedImageFile) {
        // Do nothing, the file will be appended below
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => dataToSend.append(key, item))
      } else if (typeof formData[key] === "string" && (key === "techStack" || key === "features" || key === "tags")) {
        formData[key]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((item) => dataToSend.append(key, item))
      } else {
        dataToSend.append(key, formData[key])
      }
    }

    if (selectedImageFile) {
      dataToSend.append("image", selectedImageFile)
    }

    try {
      let res
      if (isEditMode) {
        res = await projectAPI.updateProject(id, dataToSend)
        setSuccess("Project updated successfully!")
      } else {
        res = await projectAPI.createProject(dataToSend)
        setSuccess("Project created successfully!")
        setFormData({
          title: "",
          description: "",
          longDescription: "",
          image: "",
          techStack: "",
          features: "",
          githubUrl: "",
          liveUrl: "",
          category: "",
          type: "",
          tags: "",
        })
        setSelectedImageFile(null)
      }
      console.log("Operation successful:", res.data)
      setTimeout(() => navigate("/admin"), 1500)
    } catch (err) {
      console.error("Error saving project:", err)
      setError(err.response?.data?.message || "Failed to save project. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 my-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Project Title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="A brief description of the project"
            />
          </div>

          <div>
            <label
              htmlFor="longDescription"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Long Description
            </label>
            <textarea
              id="longDescription"
              name="longDescription"
              rows={5}
              value={formData.longDescription}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Detailed description of the project"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {(formData.image || isEditMode) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Current Image Preview:</p>
                <img
                  src={formData.image || "/placeholder.svg?height=300&width=500&text=No+Image"}
                  alt="Project Preview"
                  className="max-w-xs rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., User Authentication, Payment Integration"
            />
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/your-repo"
            />
          </div>

          <div>
            <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Live Demo URL
            </label>
            <input
              type="url"
              id="liveUrl"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-live-demo.vercel.app"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category (e.g., Web App, Mobile, Blockchain)
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Web App"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type (e.g., Personal, Academic, Open Source)
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Personal"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., MERN, React, E-commerce"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                {isEditMode ? "Update Project" : "Create Project"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
