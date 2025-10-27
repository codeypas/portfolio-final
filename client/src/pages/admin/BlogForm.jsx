import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { blogAPI } from "../../services/api"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

export default function BlogForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const quillRef = useRef(null)
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    tags: "",
    thumbnail: "",
  })
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "font",
    "size",
    "align",
    "blockquote",
    "code-block",
    "list",
    "link",
    "image",
    "video",
  ]

  useEffect(() => {
    if (id) {
      setIsEditMode(true)
      const fetchBlog = async () => {
        try {
          setLoading(true)
          const response = await blogAPI.getBlog(id)
          const blogData = response.data
          setFormData({
            title: blogData.title || "",
            summary: blogData.summary || "",
            content: blogData.content || "",
            category: blogData.category || "",
            tags: (blogData.tags || []).join(", "),
            thumbnail: blogData.thumbnail || "",
          })
        } catch (err) {
          console.error("Error fetching blog for edit:", err)
          setError("Failed to load blog for editing.")
        } finally {
          setLoading(false)
        }
      }
      fetchBlog()
    }
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value })
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedThumbnailFile(file)
      setFormData({ ...formData, thumbnail: URL.createObjectURL(file) })
    } else {
      setSelectedThumbnailFile(null)
      setFormData({ ...formData, thumbnail: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const dataToSend = new FormData()
    for (const key in formData) {
      if (key === "thumbnail" && selectedThumbnailFile) {
        // Skip, the file will be appended separately
      } else if (key === "tags") {
        formData[key]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((tag) => dataToSend.append("tags[]", tag))
      } else {
        dataToSend.append(key, formData[key])
      }
    }

    if (selectedThumbnailFile) {
      dataToSend.append("thumbnail", selectedThumbnailFile)
    }

    try {
      let res
      if (isEditMode) {
        res = await blogAPI.updateBlog(id, dataToSend)
        setSuccess("Blog updated successfully!")
      } else {
        res = await blogAPI.createBlog(dataToSend)
        setSuccess("Blog created successfully!")
        setFormData({
          title: "",
          summary: "",
          content: "",
          category: "",
          tags: "",
          thumbnail: "",
        })
        setSelectedThumbnailFile(null)
      }
      console.log("Operation successful:", res.data)
      setTimeout(() => navigate("/admin"), 1500)
    } catch (err) {
      console.error("Error saving blog:", err)
      setError(err.response?.data?.message || "Failed to save blog. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 my-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
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
              placeholder="Blog Post Title"
              required
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              value={formData.summary}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="A short summary of the blog post"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your blog content here..."
                className="quill-editor dark:text-white"
                style={{ minHeight: "400px" }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Web Development, React, Career"
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
              placeholder="e.g., javascript, frontend, tutorial"
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {(formData.thumbnail || isEditMode) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Current Thumbnail Preview:</p>
                <img
                  src={formData.thumbnail || "/placeholder.svg?height=200&width=300&text=No+Thumbnail"}
                  alt="Thumbnail Preview"
                  className="max-w-xs rounded-lg shadow-md"
                />
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
                {isEditMode ? "Update Blog" : "Create Blog"}
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .quill-editor .ql-toolbar {
          border-color: #d1d5db;
          background-color: #f9fafb;
        }
        .quill-editor .ql-container {
          border-color: #d1d5db;
          font-size: 16px;
        }
        .dark .quill-editor .ql-toolbar {
          border-color: #4b5563;
          background-color: #374151;
        }
        .dark .quill-editor .ql-container {
          border-color: #4b5563;
          background-color: #1f2937;
          color: #f3f4f6;
        }
        .dark .quill-editor .ql-editor {
          color: #f3f4f6;
        }
        .dark .quill-editor .ql-toolbar.ql-snow .ql-picker-label {
          color: #f3f4f6;
        }
        .dark .quill-editor .ql-toolbar.ql-snow .ql-stroke {
          stroke: #9ca3af;
        }
        .dark .quill-editor .ql-toolbar.ql-snow .ql-fill {
          fill: #9ca3af;
        }
      `}</style>
    </div>
  )
}
