const DEFAULT_API_ORIGIN = "https://portfolio-backend-ohp9.onrender.com"

const sanitizeEnvValue = (value = "") => String(value).trim().replace(/^['"]|['"]$/g, "")
const trimTrailingSlash = (value = "") => sanitizeEnvValue(value).replace(/\/+$/, "")

const withApiSuffix = (value) => {
  const normalized = trimTrailingSlash(value)
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`
}

export const API_BASE_URL = withApiSuffix(import.meta.env.VITE_API_URL || `${DEFAULT_API_ORIGIN}/api`)
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "")
export const UPLOAD_BASE_URL = trimTrailingSlash(import.meta.env.VITE_UPLOAD_BASE_URL || API_ORIGIN)
export const HEALTHCHECK_URL = `${API_BASE_URL}/health`

// A free Render web service can need about a minute to wake after it has slept.
// Keep API requests alive long enough for that first request to succeed.
export const API_TIMEOUT_MS = 70000

export const isAuthError = (error) => {
  const status = error?.response?.status
  return status === 401 || status === 403
}

export const isTimeoutError = (error) =>
  error?.code === "ECONNABORTED" || error?.message?.toLowerCase().includes("timeout")
