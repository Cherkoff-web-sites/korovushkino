const TOKEN_KEY = 'accessToken'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL !== undefined &&
  String(process.env.NEXT_PUBLIC_API_BASE_URL).trim() !== ''
    ? String(process.env.NEXT_PUBLIC_API_BASE_URL).trim()
    : ''

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
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
