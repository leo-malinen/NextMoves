const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api"
const TOKEN_KEY = "nextmoves_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const config = { ...options }
  const headers = { ...(options.headers || {}) }
  const token = getToken()
  if (token) {
    headers["Authorization"] = "Bearer " + token
  }
  if (config.body && !(config.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
    config.body = JSON.stringify(config.body)
  }
  config.headers = headers
  const response = await fetch(API_BASE + path, config)
  const text = await response.text()
  const data = text ? JSON.parse(text) : {}
  if (!response.ok) {
    throw new Error(data.error || "Request failed")
  }
  return data
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/me"),
  listStudies: (category) =>
    request("/studies?category=" + encodeURIComponent(category)),
  createStudy: (payload) =>
    request("/studies", { method: "POST", body: payload }),
  updateStudy: (id, payload) =>
    request("/studies/" + id, { method: "PATCH", body: payload }),
  deleteStudy: (id) => request("/studies/" + id, { method: "DELETE" }),
  openingUrl: (title) =>
    request("/openings/chesscom-url?title=" + encodeURIComponent(title)),
  bookMoves: (type) =>
    request("/book-moves?type=" + encodeURIComponent(type)),
  uploads: () => request("/uploads"),
  uploadBoard: (formData) =>
    request("/uploads", { method: "POST", body: formData }),
}

export const API_ORIGIN = API_BASE.replace(/\/api$/, "")
