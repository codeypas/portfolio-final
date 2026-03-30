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
      const response = await authAPI.getProfile({ silentAuthFailure: true })
      setUser(response.data.user)
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Auth check failed:", error.message)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setError(null)
      const response = await authAPI.login(credentials)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check if the server is running."
      setError(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      const response = await authAPI.register(userData)
      setUser(response.data.user)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please check if the server is running."
      setError(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error("Error during logout:", err)
    } finally {
      setUser(null)
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
