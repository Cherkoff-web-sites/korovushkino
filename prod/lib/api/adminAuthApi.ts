import { setToken, type AuthUser } from '@/lib/api/authApi'
import { request } from '@/lib/api/httpClient'

export async function apiAdminRequestCode(email: string) {
  const data = await request<{
    ok: true
    emailCodeRequired?: boolean
    emergency?: boolean
    user?: AuthUser
    accessToken?: string
  }>('/api/auth/admin/request-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })

  if (data.accessToken) {
    setToken(data.accessToken)
  }

  return data
}

export async function apiAdminConfirmCode(email: string, code: string) {
  const data = await request<{ user: AuthUser; accessToken: string }>('/api/auth/admin/confirm-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  })
  setToken(data.accessToken)
  return data.user
}
