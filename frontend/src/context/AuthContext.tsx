import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, TOKEN_STORAGE_KEY } from '../api/client'
import type { Usuario } from '../api/types'

interface AuthContextValue {
  usuario: Usuario | null
  roles: string[]
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  registrarInmobiliaria: (data: {
    inmobiliaria_nombre: string
    admin_name: string
    admin_username: string
    admin_password: string
  }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthResponse {
  access_token: string
  user: Usuario
  roles: string[]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get<Usuario>('/auth/me')
      .then((res) => {
        setUsuario(res.data)
        setRoles(res.data.roles ?? [])
      })
      .catch(() => localStorage.removeItem(TOKEN_STORAGE_KEY))
      .finally(() => setLoading(false))
  }, [])

  function aplicarSesion(data: AuthResponse) {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token)
    setUsuario(data.user)
    setRoles(data.roles)
  }

  async function login(username: string, password: string) {
    const res = await api.post<AuthResponse>('/auth/login', { username, password })
    aplicarSesion(res.data)
  }

  async function registrarInmobiliaria(data: {
    inmobiliaria_nombre: string
    admin_name: string
    admin_username: string
    admin_password: string
  }) {
    const res = await api.post<AuthResponse>('/auth/registro', data)
    aplicarSesion(res.data)
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      setUsuario(null)
      setRoles([])
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, roles, loading, login, registrarInmobiliaria, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
