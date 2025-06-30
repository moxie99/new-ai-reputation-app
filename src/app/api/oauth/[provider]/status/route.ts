/* eslint-disable @typescript-eslint/no-require-imports */
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
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

    const userDoc = await adminDb.collection('users').doc(decoded.userId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()!
    const connectedAccounts = userData.connectedAccounts || {}

    return NextResponse.json({
      google: connectedAccounts.google?.connected || false,
      twitter: connectedAccounts.twitter?.connected || false,
      linkedin: connectedAccounts.linkedin?.connected || false,
      reddit: connectedAccounts.reddit?.connected || false,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
