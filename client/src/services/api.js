import axios from "axios"
// import API_URL from "./config";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      console.error("Backend server is not running or unreachable. Please start the server.")
    }
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Authentication or Authorization error:", error.response.data.message)
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/signin", credentials),
  register: (userData) => api.post("/auth/signup", userData),
  getProfile: () => api.get("/auth/profile"), 
  logout: () => api.post("/auth/signout"), 
}

// Contact API
export const contactAPI = {
  sendMessage: (data) => api.post("/contact", data),
  getMessages: () => api.get("/contact"),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/${id}`), 
}

// Blog API
export const blogAPI = {
  getBlogs: (params) => api.get("/blogs", { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  createBlog: (data) => api.post("/blogs", data), 
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data), 
  deleteBlog: (id) => api.delete(`/blogs/${id}`), 
  addComment: (id, data) => api.post(`/blogs/${id}/comment`, data),
  addRating: (id, data) => api.post(`/blogs/${id}/rating`, data),
  incrementView: (id) => api.post(`/blogs/${id}/view`), 
}

// Study Hub API
export const studyAPI = {
  getResources: (params) => api.get("/study", { params }),
  getResource: (id) => api.get(`/study/${id}`),
  createResource: (data) => api.post("/study", data), 
  updateResource: (id, data) => api.put(`/study/${id}`, data), 
  deleteResource: (id) => api.delete(`/study/${id}`), 
  addComment: (id, data) => api.post(`/study/${id}/comment`, data),
  addRating: (id, data) => api.post(`/study/${id}/rating`, data),
  downloadResource: (id) => api.post(`/study/${id}/download`),
  likeResource: (id) => api.post(`/study/${id}/like`),
}

// Project API
export const projectAPI = {
  getProjects: (params) => api.get("/projects", { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post("/projects", data), 
  updateProject: (id, data) => api.put(`/projects/${id}`, data), 
  deleteProject: (id) => api.delete(`/projects/${id}`), 
  addComment: (id, data) => api.post(`/projects/${id}/comment`, data),
  incrementVisitor: (id) => api.post(`/projects/${id}/visitor`),
}

export default api
