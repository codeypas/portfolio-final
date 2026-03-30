import axios from "axios"
import { API_BASE_URL, API_TIMEOUT_MS, isAuthError } from "../config/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      console.error("Backend server is not running or unreachable. Please start the server.")
    }

    if (isAuthError(error)) {
      if (!error.config?.meta?.silentAuthFailure) {
        console.warn("Authentication or authorization error:", error.response?.data?.message || error.message)
      }
      return Promise.reject(error)
    }

    if (error.code === "ECONNABORTED") {
      console.error(`Request timed out after ${API_TIMEOUT_MS}ms:`, error.config?.url)
    }

    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/signin", credentials),
  register: (userData) => api.post("/auth/signup", userData),
  getProfile: (options = {}) =>
    api.get("/auth/profile", {
      meta: {
        silentAuthFailure: options.silentAuthFailure ?? false,
      },
    }),
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
