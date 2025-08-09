"use client"

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
      // No need to check localStorage for token, it's httpOnly cookie
      const response = await authAPI.getProfile() // This call will send the httpOnly cookie
      setUser(response.data.user)
    } catch (error) {
      console.log("Auth check failed (likely no valid cookie):", error.message)
      setUser(null) // Ensure user is null if auth fails
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setError(null)
      const response = await authAPI.login(credentials)
      // Token is set as httpOnly cookie by backend, so we only get user data here
      setUser(response.data.user) // Now expects { user: ... }
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
      // Token is set as httpOnly cookie by backend, so we only get user data here
      setUser(response.data.user) // Now expects { user: ... }
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please check if the server is running."
      setError(message)
      return { success: false, error: message }
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
