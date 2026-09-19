import { useState, useEffect, useRef } from "react"
import { X, AlertTriangle } from "lucide-react"
import { HEALTHCHECK_URL, API_TIMEOUT_MS } from "../config/api"

const ALERT_DELAY_MS = 2500
const RETRY_DELAY_MS = 3000
const DISMISSED_KEY = "coldStartAlertDismissed"

export default function ColdStartAlert() {
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const dismissedRef = useRef(false)
  const hadColdStartRef = useRef(false)

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return undefined

    let cancelled = false
    let controller
    let retryTimeoutId

    const showAlert = () => {
      if (!cancelled && !dismissedRef.current) {
        hadColdStartRef.current = true
        setIsVisible(true)
      }
    }

    // Show helpful feedback quickly, but do not give up before Render has had
    // enough time to wake the backend.
    const alertTimeoutId = window.setTimeout(showAlert, ALERT_DELAY_MS)

    const checkBackendHealth = async () => {
      controller = new AbortController()
      const requestTimeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS)

      try {
        console.log("[v0] ColdStartAlert: Checking health endpoint:", HEALTHCHECK_URL)
        const response = await fetch(HEALTHCHECK_URL, {
          method: "GET",
          signal: controller.signal,
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Health endpoint returned ${response.status}`)
        }

        if (!cancelled) {
          window.clearTimeout(alertTimeoutId)
          setIsVisible(false)
          console.log("[v0] Backend is healthy")

          // Other API calls may have failed while the backend was waking. A
          // single automatic reload retries them with the now-healthy server.
          if (hadColdStartRef.current && !dismissedRef.current) {
            window.location.reload()
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.log("[v0] Backend is still starting; retrying:", error.message)
          showAlert()
          retryTimeoutId = window.setTimeout(checkBackendHealth, RETRY_DELAY_MS)
        }
      } finally {
        window.clearTimeout(requestTimeoutId)
      }
    }

    checkBackendHealth()

    return () => {
      cancelled = true
      window.clearTimeout(alertTimeoutId)
      window.clearTimeout(retryTimeoutId)
      controller?.abort()
    }
  }, [])

  const handleDismiss = () => {
    dismissedRef.current = true
    setDismissed(true)
    setIsVisible(false)
    sessionStorage.setItem(DISMISSED_KEY, "true")
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
              The backend is waking from Render&apos;s free tier. This page will continue automatically when it is ready, which can take up to a minute.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Thank you for your patience. You do not need to refresh the page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Retry now
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
