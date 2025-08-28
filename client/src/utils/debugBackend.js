export const debugBackend = async () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mybio-backend.onrender.com/api"
  const results = {
    baseUrl: API_BASE_URL,
    tests: [],
  }

  console.log("[v0] Starting backend debugging...")
  console.log("[v0] Testing backend URL:", API_BASE_URL)

  // Test 1: Basic connectivity
  try {
    const response = await fetch(API_BASE_URL.replace("/api", "") + "/api/health", {
      method: "GET",
      mode: "cors",
    })
    results.tests.push({
      name: "Health Check",
      status: response.ok ? "PASS" : "FAIL",
      details: `Status: ${response.status}`,
    })
  } catch (error) {
    results.tests.push({
      name: "Health Check",
      status: "FAIL",
      details: error.message,
    })
  }

  // Test 2: CORS preflight
  try {
    const response = await fetch(API_BASE_URL + "/auth/test", {
      method: "OPTIONS",
      mode: "cors",
    })
    results.tests.push({
      name: "CORS Preflight",
      status: response.ok ? "PASS" : "FAIL",
      details: `Status: ${response.status}`,
    })
  } catch (error) {
    results.tests.push({
      name: "CORS Preflight",
      status: "FAIL",
      details: error.message,
    })
  }

  // Test 3: API endpoints
  const endpoints = ["/blogs", "/projects", "/study"]
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(API_BASE_URL + endpoint, {
        method: "GET",
        mode: "cors",
      })
      results.tests.push({
        name: `Endpoint ${endpoint}`,
        status: response.ok ? "PASS" : "FAIL",
        details: `Status: ${response.status}`,
      })
    } catch (error) {
      results.tests.push({
        name: `Endpoint ${endpoint}`,
        status: "FAIL",
        details: error.message,
      })
    }
  }

  console.log("[v0] Backend debug results:", results)
  return results
}
