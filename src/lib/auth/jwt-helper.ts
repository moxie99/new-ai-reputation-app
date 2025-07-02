/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'

export interface DecodedToken {
  userId: string
  email?: string
  name?: string
  [key: string]: any
}

export function extractUserFromRequest(authHeader: string | null): {
  userId: string
  isAuthenticated: boolean
  user?: DecodedToken
} {
  if (!authHeader) {
    console.log('🔓 No auth header provided - using anonymous')
    return { userId: 'anonymous', isAuthenticated: false }
  }

  try {
    const token = authHeader.replace('Bearer ', '')

    if (!process.env.NEXTAUTH_SECRET) {
      console.error('❌ NEXTAUTH_SECRET not configured')
      return { userId: 'anonymous', isAuthenticated: false }
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET) as any
    console.log('✅ JWT verified successfully')

    // Try different possible userId fields
    const userId =
      decoded.userId || decoded.sub || decoded.id || decoded.user?.id

    if (!userId) {
      console.error('❌ No userId found in JWT:', Object.keys(decoded))
      return { userId: 'anonymous', isAuthenticated: false }
    }

    console.log('🔍 Extracted userId:', userId)

    return {
      userId: String(userId),
      isAuthenticated: true,
      user: {
        userId: String(userId),
        email: decoded.email || decoded.user?.email,
        name: decoded.name || decoded.user?.name,
        ...decoded,
      },
    }
  } catch (error: any) {
    console.error('❌ JWT verification failed:', error.message)
    return { userId: 'anonymous', isAuthenticated: false }
  }
}

export function requireAuth(authHeader: string | null): DecodedToken {
  const result = extractUserFromRequest(authHeader)

  if (!result.isAuthenticated) {
    throw new Error('Authentication required')
  }

  return result.user!
}
