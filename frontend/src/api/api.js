// frontend/src/api/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://codeandsweet.onrender.com/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // JWT from localStorage

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Only stringify if body is an object, avoiding double stringification of pre-stringified strings
  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  } else if (options.body && typeof options.body === "string") {
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
      } catch {} // ignore JSON parse errors
      throw new Error(errorMessage);
    }

    // If response has content, parse JSON, otherwise return empty object
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    } else {
      return {}; // for DELETE, PUT with FormData, etc.
    }
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}
