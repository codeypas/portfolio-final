import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { studyAPI } from "../../services/api"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

export default function StudyForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    title: "",
    category: "", // This will hold the final category value
    description: "",
    format: "",
    fileUrl: "",
    icon: "", // Can be Lucide icon name or image URL
  })
  const [selectedIconFile, setSelectedIconFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // State for category selection
  const [existingCategories, setExistingCategories] = useState([])
  const [selectedCategoryOption, setSelectedCategoryOption] = useState("") // Tracks dropdown selection
  const [newCategoryName, setNewCategoryName] = useState("") // For new category input

  useEffect(() => {
    const fetchCategoriesAndResource = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch all resources to get existing categories
        const allResourcesResponse = await studyAPI.getResources()
        const categories = [...new Set(allResourcesResponse.data.map((res) => res.category).filter(Boolean))]
        setExistingCategories(categories)

        if (id) {
          setIsEditMode(true)
          const resourceResponse = await studyAPI.getResource(id)
          const resourceData = resourceResponse.data

          setFormData({
            title: resourceData.title || "",
            category: resourceData.category || "",
            description: resourceData.description || "",
            format: resourceData.format || "",
            fileUrl: resourceData.fileUrl || "",
            icon: resourceData.icon || "",
          })

          // Set the selected option in the dropdown based on fetched data
          if (resourceData.category) {
            if (categories.includes(resourceData.category)) {
              setSelectedCategoryOption(resourceData.category)
            } else {
              // If the category from the resource is not in the existing list, it's a new one
              setSelectedCategoryOption("new")
              setNewCategoryName(resourceData.category)
            }
          } else {
            setSelectedCategoryOption("")
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchCategoriesAndResource()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleIconFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedIconFile(file)
      setFormData({ ...formData, icon: URL.createObjectURL(file) }) // For instant preview
    } else {
      setSelectedIconFile(null)
      setFormData({ ...formData, icon: "" }) // Clear preview if no file selected
    }
  }

  const handleCategoryOptionChange = (e) => {
    const value = e.target.value
    setSelectedCategoryOption(value)
    if (value === "new") {
      setFormData({ ...formData, category: "" }) // Clear category in formData for new input
      setNewCategoryName("") // Clear new category input
    } else {
      setFormData({ ...formData, category: value }) // Set selected category
      setNewCategoryName("") // Clear new category input
    }
  }

  const handleNewCategoryNameChange = (e) => {
    setNewCategoryName(e.target.value)
    setFormData({ ...formData, category: e.target.value }) // Update formData directly with new category
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Basic validation for category
    if (!formData.category.trim()) {
      setError("Please select or enter a category.")
      setLoading(false)
      return
    }

    const dataToSend = new FormData()
    for (const key in formData) {
      if (key === "icon" && selectedIconFile) {
        // Skip, the file will be appended separately
      } else {
        dataToSend.append(key, formData[key])
      }
    }

    if (selectedIconFile) {
      dataToSend.append("iconFile", selectedIconFile) // 'iconFile' matches the multer field name
    }

    try {
      let res
      if (isEditMode) {
        res = await studyAPI.updateResource(id, dataToSend)
        setSuccess("Study resource updated successfully!")
      } else {
        res = await studyAPI.createResource(dataToSend)
        setSuccess("Study resource created successfully!")
        // Reset form after successful creation
        setFormData({
          title: "",
          category: "",
          description: "",
          format: "",
          fileUrl: "",
          icon: "",
        })
        setSelectedIconFile(null)
        setSelectedCategoryOption("")
        setNewCategoryName("")
      }
      console.log("Operation successful:", res.data)
      setTimeout(() => navigate("/admin"), 1500)
    } catch (err) {
      console.error("Error saving study resource:", err)
      setError(err.response?.data?.message || "Failed to save study resource. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 my-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Study Resource" : "Create New Study Resource"}
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
              placeholder="Resource Title"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={selectedCategoryOption}
              onChange={handleCategoryOptionChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="new">Add New Category</option>
            </select>
            {selectedCategoryOption === "new" && (
              <input
                type="text"
                id="newCategoryName"
                name="newCategoryName"
                value={newCategoryName}
                onChange={handleNewCategoryNameChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                placeholder="Enter new category name"
                required
              />
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Detailed description of the resource"
              required
            />
          </div>

          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format (e.g., PDF, PPT, Code)
            </label>
            <input
              type="text"
              id="format"
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., PDF, PPT, Code"
              required
            />
          </div>

          <div>
            <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File URL (for download)
            </label>
            <input
              type="text"
              id="fileUrl"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="URL to the downloadable file"
              required
            />
          </div>

          <div>
            <label htmlFor="iconFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon Image (or Lucide icon name)
            </label>
            <input
              type="file"
              id="iconFile"
              name="iconFile" // This name must match the multer field name
              accept="image/*"
              onChange={handleIconFileChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upload an image for the icon, or type a Lucide icon name (e.g., "FileText", "Video", "Code") if no image
              is uploaded.
            </p>
            {(formData.icon || isEditMode) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Current Icon Preview:</p>
                {formData.icon.startsWith("/uploads/") || formData.icon.startsWith("blob:") ? (
                  <img
                    src={formData.icon || "/placeholder.svg"}
                    alt="Icon Preview"
                    className="max-w-[64px] max-h-[64px] rounded-lg shadow-md"
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Using Lucide icon: {formData.icon}</span>
                )}
              </div>
            )}
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
                {isEditMode ? "Update Resource" : "Create Resource"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
