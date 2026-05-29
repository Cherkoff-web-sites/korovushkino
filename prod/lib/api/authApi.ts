export type AuthUser = {
  id: number
  login: string
  email: string | null
  role: string
  surname: string
  firstName: string
  phone: string
  createdAt: string | null
  updatedAt: string | null
}

const TOKEN_KEY = 'accessToken'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL !== undefined &&
  String(process.env.NEXT_PUBLIC_API_BASE_URL).trim() !== ''
    ? String(process.env.NEXT_PUBLIC_API_BASE_URL).trim()
    : ''

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  let data: { error?: string } | null = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || `Ошибка запроса (${res.status})`)
  }

  return data as T
}

export async function apiLoginRequestCode(email: string) {
  return request<{ ok: true }>('/api/auth/login/request-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function apiLoginConfirmCode(email: string, code: string) {
  const data = await request<{ user: AuthUser; accessToken: string }>(
    '/api/auth/login/confirm-code',
    {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }
  )
  setToken(data.accessToken)
  return data.user
}

export async function apiGetMe() {
  const data = await request<{ user: AuthUser }>('/api/auth/me')
  return data.user
}

export async function apiUpdateProfile(payload: {
  surname?: string
  firstName?: string
  phone?: string
}) {
  const data = await request<{ user: AuthUser }>('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return data.user
}

export function apiLogout() {
  setToken(null)
}
