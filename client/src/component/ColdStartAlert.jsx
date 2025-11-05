"use client"

import { useState, useEffect } from "react"
import { X, AlertTriangle } from "lucide-react"

export default function ColdStartAlert() {
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed this alert in this session
    const alertDismissed = sessionStorage.getItem("coldStartAlertDismissed")

    if (!alertDismissed) {
      setTimeout(() => {
        const checkBackendHealth = async () => {
          try {
            const apiBase = (import.meta.env.VITE_API_URL || "https://portfolio-backend-ohp9.onrender.com/api").replace(/\/+$/, "")
            const healthUrl = `${apiBase}/health`

            console.log("[v0] ColdStartAlert: Checking health endpoint:", healthUrl)

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 8000)

            const response = await fetch(healthUrl, {
              method: "GET",
              signal: controller.signal,
              credentials: "include",
            })

            clearTimeout(timeoutId)

            if (response.ok) {
              console.log("[v0] Backend is healthy, not showing cold start alert")
              return
            }

            console.log("[v0] Backend health check failed with status:", response.status)
            setIsVisible(true)
          } catch (error) {
            console.log("[v0] Backend health check failed (expected on cold start):", error.message)
            setIsVisible(true)
          }
        }

        checkBackendHealth()
      }, 500) // Wait 500ms for CORS to initialize
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    setIsVisible(false)
    sessionStorage.setItem("coldStartAlertDismissed", "true")
  }

  if (!isVisible || dismissed) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 border-l-4 border-orange-500">
        <div className="flex items-start">
          <AlertTriangle className="text-orange-500 mr-4 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Server Starting</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The backend is hosted on Render's free tier, which puts it to sleep when inactive. Please refresh the page
              — it may take around 40–50 seconds for the server to start.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Thank you for your patience! The server will be ready shortly.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
          <button onClick={handleDismiss} className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
