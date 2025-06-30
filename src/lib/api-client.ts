import { tokenStorage } from '@/lib/auth/token-storage'

interface ApiOptions extends RequestInit {
  auth?: boolean
}

export async function apiClient(url: string, options: ApiOptions = {}) {
  const { auth = true, ...fetchOptions } = options

  // Option 1: Type headers as Record<string, string>
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  }

  if (auth) {
    const token = tokenStorage.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401) {
    // Token expired or invalid
    tokenStorage.removeToken()
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  return response
}
