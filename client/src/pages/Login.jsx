/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { authAPI } from "../services/api"
import GoogleAuthButton from "../component/GoogleAuthButton"

const emptyForm = { name: "", email: "", password: "", confirmPassword: "" }

export default function Login() {
  const [mode, setMode] = useState("login")
  const [formData, setFormData] = useState(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { login, register, googleSignin, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const token = searchParams.get("token")
  const action = searchParams.get("action")

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setFormData(emptyForm)
    setMessage(null)
  }

  useEffect(() => {
    if (action !== "verify-email" || !token) return undefined
    let active = true
    authAPI.verifyEmail(token)
      .then(({ data }) => active && setMessage({ type: "success", text: data.message }))
      .catch((requestError) => active && setMessage({ type: "error", text: requestError.response?.data?.message || "Email verification failed." }))
      .finally(() => active && setSearchParams({}))
    return () => { active = false }
  }, [action, token, setSearchParams])

  useEffect(() => {
    if (action === "reset-password" && token) setMode("reset")
  }, [action, token])

  const onChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
    setMessage(null)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (mode === "register" && !formData.name.trim()) return setMessage({ type: "error", text: "Name is required." })
    if (mode !== "reset" && !formData.email.trim()) return setMessage({ type: "error", text: "Email is required." })
    if (mode !== "forgot" && (!formData.password || ((mode === "register" || mode === "reset") && formData.password.length < 6))) return setMessage({ type: "error", text: "Use a password of at least 6 characters." })
    if (mode === "reset" && formData.password !== formData.confirmPassword) return setMessage({ type: "error", text: "Passwords do not match." })

    setIsSubmitting(true)
    setMessage(null)
    try {
      if (mode === "forgot") {
        const { data } = await authAPI.requestPasswordReset(formData.email)
        setMessage({ type: "success", text: data.message })
      } else if (mode === "reset") {
        const { data } = await authAPI.resetPassword(token, formData.password)
        setMessage({ type: "success", text: data.message })
        setSearchParams({})
        setMode("login")
      } else {
        const result = mode === "login" ? await login(formData) : await register({ username: formData.name, email: formData.email, password: formData.password })
        if (!result.success) setMessage({ type: "error", text: result.error })
        else if (mode === "register") {
          setMessage({ type: "success", text: "Check your email to verify your account before signing in." })
          setMode("login")
          setFormData(emptyForm)
        } else navigate(location.state?.from?.pathname || "/", { replace: true })
      }
    } catch (requestError) {
      setMessage({ type: "error", text: requestError.response?.data?.message || "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onGoogleCredential = useCallback(async (credential) => {
    setIsSubmitting(true)
    setMessage(null)
    const result = await googleSignin(credential)
    if (result.success) navigate(location.state?.from?.pathname || "/", { replace: true })
    else setMessage({ type: "error", text: result.error })
    setIsSubmitting(false)
  }, [googleSignin, location.state?.from?.pathname, navigate])

  const title = mode === "register" ? "Create Account" : mode === "forgot" ? "Reset Password" : mode === "reset" ? "Choose a New Password" : "Welcome Back"
  const isGoogleMode = mode === "login" || mode === "register"

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full"><div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8"><h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2><p className="text-gray-600 dark:text-gray-300 mt-2">{mode === "register" ? "Verify an email you can access to activate your account." : mode === "forgot" ? "We will send a secure reset link if this email has an account." : ""}</p></div>

        {isGoogleMode && <><GoogleAuthButton onCredential={onGoogleCredential} disabled={isSubmitting} /><div className="flex items-center gap-3 my-6 text-sm text-gray-500"><span className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />or continue with email<span className="h-px flex-1 bg-gray-200 dark:bg-gray-600" /></div></>}

        {isGoogleMode && <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6"><button type="button" onClick={() => changeMode("login")} className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === "login" ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300"}`}>Login</button><button type="button" onClick={() => changeMode("register")} className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === "register" ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300"}`}>Register</button></div>}

        <form onSubmit={submit} className="space-y-6">
          {mode === "register" && <Input icon={<User size={20} />} label="Full Name" name="name" value={formData.name} onChange={onChange} placeholder="Your full name" />}
          {mode !== "reset" && <Input icon={<Mail size={20} />} label="Email Address" name="email" type="email" value={formData.email} onChange={onChange} placeholder="you@example.com" />}
          {mode !== "forgot" && <PasswordInput label={mode === "reset" ? "New Password" : "Password"} name="password" value={formData.password} onChange={onChange} show={showPassword} setShow={setShowPassword} />}
          {mode === "reset" && <PasswordInput label="Confirm New Password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} show={showPassword} setShow={setShowPassword} />}
          {(message || error) && <Status type={message?.type || "error"} text={message?.text || error} />}
          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">{isSubmitting ? "Please wait..." : mode === "register" ? "Create Account" : mode === "forgot" ? "Email Reset Link" : mode === "reset" ? "Reset Password" : "Sign In"}</button>
        </form>
        {mode === "login" && <button type="button" onClick={() => changeMode("forgot")} className="mt-5 w-full text-sm text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</button>}
        {(mode === "forgot" || mode === "reset") && <button type="button" onClick={() => { setSearchParams({}); changeMode("login") }} className="mt-5 w-full text-sm text-blue-600 dark:text-blue-400 hover:underline">Back to login</button>}
        <div className="mt-6 text-center"><Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">← Back to Home</Link></div>
      </div></div>
    </div>
  )
}

function Input({ icon, label, name, type = "text", value, onChange, placeholder }) {
  return <div><label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span><input id={name} name={name} type={type} value={value} onChange={onChange} required placeholder={placeholder} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div></div>
}

function PasswordInput({ label, name, value, onChange, show, setShow }) {
  return <div><label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input id={name} name={name} type={show ? "text" : "password"} value={value} onChange={onChange} required placeholder="At least 6 characters" className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></div>
}

function Status({ type, text }) {
  const success = type === "success"
  return <div className={`p-4 rounded-lg flex items-center ${success ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200" : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200"}`}>{success ? <CheckCircle className="mr-3" size={20} /> : <AlertCircle className="mr-3" size={20} />}<span>{text}</span></div>
}
