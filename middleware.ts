/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const publicEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/search/start',
    ]
    if (
      publicEndpoints.some((endpoint) =>
        request.nextUrl.pathname.startsWith(endpoint)
      )
    ) {
      return NextResponse.next()
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      if (
        request.nextUrl.pathname.startsWith('/api/search/') ||
        request.nextUrl.pathname.startsWith('/api/report/')
      ) {
        return NextResponse.next()
      }

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token')

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
}
