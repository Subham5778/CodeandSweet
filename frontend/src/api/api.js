// api.js - helper to make API requests with JWT token

// api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://codeandsweet.onrender.com/api";


export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // JWT from localStorage

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // If body is JSON, set Content-Type
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "API request failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
