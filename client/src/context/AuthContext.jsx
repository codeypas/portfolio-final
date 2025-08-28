import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getProfile()
      setUser(response.data.user)
    } catch (error) {
      console.log("Auth check failed (likely no valid cookie):", error.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setError(null)
      setLoading(true) // Add loading state during login
      const response = await authAPI.login(credentials)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      let message = "Login failed. Please try again."

      if (error.code === "NETWORK_ERROR" || error.message.includes("Network Error")) {
        message = "Cannot connect to server. Please check if the backend is running."
      } else if (error.response?.status === 401) {
        message = "Invalid email or password."
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      }

      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false) // Clear loading state
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      setLoading(true) // Add loading state during registration
      const response = await authAPI.register(userData)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      let message = "Registration failed. Please try again."

      if (error.code === "NETWORK_ERROR" || error.message.includes("Network Error")) {
        message = "Cannot connect to server. Please check if the backend is running."
      } else if (error.response?.status === 409) {
        message = "Email already exists. Please use a different email."
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      }

      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false) // Clear loading state
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout() // Call the backend logout endpoint to clear the cookie
    } catch (err) {
      console.error("Error during logout:", err)
    } finally {
      setUser(null) // Clear frontend user state regardless of backend logout success
    }
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
