import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [serverStatus, setServerStatus] = useState("checking")

  const { login, register, error } = useAuth()
  const navigate = useNavigate()

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus()
  }, [])

  const checkServerStatus = async () => {
    try {
      const response = await fetch("https://portfolio-final-2u9l.onrender.com/api/health", {
        // Changed port to 3000
        method: "GET",
        mode: "cors",
      })
      if (response.ok) {
        setServerStatus("online")
      } else {
        setServerStatus("offline")
      }
    } catch (error) {
      setServerStatus("offline")
    }
  }



//   const checkServerStatus = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/health`, {
//       method: "GET",
//       mode: "cors",
//     });
//     if (response.ok) {
//       setServerStatus("online");
//     } else {
//       setServerStatus("offline");
//     }
//   } catch (error) {
//     setServerStatus("offline");
//   }
// };


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setMessage(null)
  }

  const validateForm = () => {
    if (!isLogin && !formData.name.trim()) {
      setMessage({ type: "error", text: "Name is required" })
      return false
    }
    if (!formData.email.trim()) {
      setMessage({ type: "error", text: "Email is required" })
      return false
    }
    if (!formData.password.trim()) {
      setMessage({ type: "error", text: "Password is required" })
      return false
    }
    if (!isLogin && formData.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (serverStatus === "offline") {
      setMessage({
        type: "error",
        text: "Backend server is not running. Please start the server first.",
      })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      let result
      if (isLogin) {
        result = await login({ email: formData.email, password: formData.password })
      } else {
        // Pass username for registration
        result = await register({ username: formData.name, email: formData.email, password: formData.password })
      }

      if (result.success) {
        setMessage({
          type: "success",
          text: `${isLogin ? "Login" : "Registration"} successful! Redirecting...`,
        })
        setTimeout(() => {
          navigate("/")
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.error })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please check if the server is running.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Server Status Indicator */}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {isLogin ? "Sign in to your account" : "Join the community"}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true)
                setMessage(null)
                setFormData({ name: "", email: "", password: "" })
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false)
                setMessage(null)
                setFormData({ name: "", email: "", password: "" })
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error/Success Message */}
            {(message || error) && (
              <div
                className={`p-4 rounded-lg flex items-center ${
                  message?.type === "error" || error
                    ? "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                    : "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                }`}
              >
                {message?.type === "error" || error ? (
                  <AlertCircle className="mr-3 flex-shrink-0" size={20} />
                ) : (
                  <CheckCircle className="mr-3 flex-shrink-0" size={20} />
                )}
                <span>{message?.text || error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || serverStatus === "offline"}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
