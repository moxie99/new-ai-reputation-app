/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

const OAUTH_CONFIGS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'profile email https://www.googleapis.com/auth/youtube.readonly',
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scope: 'tweet.read users.read offline.access',
    clientId: process.env.TWITTER_CONSUMER_KEY,
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scope: 'r_liteprofile r_emailaddress',
    clientId: process.env.LINKEDIN_CLIENT_ID,
  },
  reddit: {
    authUrl: 'https://www.reddit.com/api/v1/authorize',
    scope: 'identity read',
    clientId: process.env.REDDIT_CLIENT_ID,
  },
}

interface RouteParams {
  params: Promise<{
    provider: string
  }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  // Await the params object
  const params = await context.params
  const { provider } = params

  try {
    const config = OAUTH_CONFIGS[provider as keyof typeof OAUTH_CONFIGS]

    if (!config) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    // Get user ID from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!)

    // Generate state token
    const state = Buffer.from(
      JSON.stringify({
        userId: decoded.userId,
        provider,
        timestamp: Date.now(),
      })
    ).toString('base64')

    // Build OAuth URL
    const params: any = new URLSearchParams({
      client_id: config.clientId!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/oauth/callback/${provider}`,
      response_type: 'code',
      scope: config.scope,
      state,
    })

    const authUrl = `${config.authUrl}?${params.toString()}`

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.json(
      { error: 'OAuth initialization failed' },
      { status: 500 }
    )
  }
}
