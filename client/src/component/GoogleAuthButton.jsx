/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react"

const SCRIPT_ID = "google-identity-services"
const SCRIPT_URL = "https://accounts.google.com/gsi/client"

// Google Identity Services is a page-wide singleton. Keeping the latest React
// callback here lets the component rerender without repeatedly initializing
// the singleton (which produces the GSI_LOGGER warning).
let initializedClientId = null
let credentialHandler = null
let scriptPromise = null

const loadGoogleIdentityScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true })
      existingScript.addEventListener("error", reject, { once: true })
      return
    }

    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = SCRIPT_URL
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
  return scriptPromise
}

export default function GoogleAuthButton({ onCredential, disabled = false }) {
  const buttonRef = useRef(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!clientId || disabled) return undefined

    let cancelled = false
    credentialHandler = onCredential
    const renderButton = () => {
      if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return
      if (initializedClientId !== clientId) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => credentialHandler?.(credential),
        })
        initializedClientId = clientId
      }
      buttonRef.current.innerHTML = ""
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: buttonRef.current.offsetWidth || 360,
      })
    }

    loadGoogleIdentityScript().then(renderButton).catch(() => {
      // The Google button remains unavailable when its external script cannot load.
    })

    return () => {
      cancelled = true
      if (credentialHandler === onCredential) credentialHandler = null
    }
  }, [clientId, disabled, onCredential])

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        title="Set VITE_GOOGLE_CLIENT_ID in the frontend Render service to enable Google sign-in"
      >
        Continue with Google
      </button>
    )
  }

  return <div ref={buttonRef} className={disabled ? "pointer-events-none opacity-50" : "w-full"} />
}
