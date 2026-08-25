import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'inmobiliario_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

/** Construye la URL de una imagen de plano incluyendo el JWT como query param para poder usarla en <img src>. */
export function imagenPlanoUrl(planoId: number): string {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  return `${import.meta.env.VITE_API_URL}/planos/${planoId}/imagen?token=${encodeURIComponent(token ?? '')}`
}
