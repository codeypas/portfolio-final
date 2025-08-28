import { useState } from "react"
import { debugBackend } from "../utils/debugBackend"

const DebugPanel = () => {
  const [debugResults, setDebugResults] = useState(null)
  const [isDebugging, setIsDebugging] = useState(false)

  const runDebug = async () => {
    setIsDebugging(true)
    try {
      const results = await debugBackend()
      setDebugResults(results)
    } catch (error) {
      console.error("[v0] Debug failed:", error)
    }
    setIsDebugging(false)
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">Backend Debug Panel</h3>
      <button
        onClick={runDebug}
        disabled={isDebugging}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
      >
        {isDebugging ? "Testing..." : "Test Backend"}
      </button>

      {debugResults && (
        <div className="mt-3 text-xs">
          <p>
            <strong>URL:</strong> {debugResults.baseUrl}
          </p>
          {debugResults.tests.map((test, index) => (
            <div key={index} className="flex justify-between mt-1">
              <span>{test.name}:</span>
              <span className={test.status === "PASS" ? "text-green-600" : "text-red-600"}>{test.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DebugPanel
