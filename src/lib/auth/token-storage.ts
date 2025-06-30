const TOKEN_KEY = 'auth-token'
const TOKEN_EXPIRY_KEY = 'auth-token-expiry'

export const tokenStorage = {
  setToken: (token: string, expiresIn: string = '7d') => {
    // Store in sessionStorage (more secure than localStorage)
    // In production, use httpOnly cookies via API
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEY, token)

      // Calculate expiry
      const expiryMs = expiresIn.includes('d')
        ? parseInt(expiresIn) * 24 * 60 * 60 * 1000
        : parseInt(expiresIn) * 1000

      const expiryDate = new Date(Date.now() + expiryMs)
      sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString())
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null

    const token = sessionStorage.getItem(TOKEN_KEY)
    const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY)

    if (!token || !expiry) return null

    // Check if token is expired
    if (new Date(expiry) < new Date()) {
      tokenStorage.removeToken()
      return null
    }

    return token
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY)
    }
  },

  isAuthenticated: (): boolean => {
    return tokenStorage.getToken() !== null
  },
}
