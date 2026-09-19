/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react"

const SCRIPT_ID = "google-identity-services"
const SCRIPT_URL = "https://accounts.google.com/gsi/client"

export default function GoogleAuthButton({ onCredential, disabled = false }) {
  const buttonRef = useRef(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId || disabled) return undefined

    let cancelled = false
    const renderButton = () => {
      if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return
      window.google.accounts.id.initialize({ client_id: clientId, callback: ({ credential }) => onCredential(credential) })
      buttonRef.current.innerHTML = ""
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: buttonRef.current.offsetWidth || 360,
      })
    }

    const existingScript = document.getElementById(SCRIPT_ID)
    if (existingScript) {
      renderButton()
    } else {
      const script = document.createElement("script")
      script.id = SCRIPT_ID
      script.src = SCRIPT_URL
      script.async = true
      script.defer = true
      script.onload = renderButton
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
    }
  }, [clientId, disabled, onCredential])

  if (!clientId) {
    return <p className="text-center text-sm text-gray-500 dark:text-gray-400">Google sign-in is not configured.</p>
  }

  return <div ref={buttonRef} className={disabled ? "pointer-events-none opacity-50" : "w-full"} />
}
