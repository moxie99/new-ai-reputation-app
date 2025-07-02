/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { requireAuth } from '@/lib/auth/jwt-helper'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    // Use the unified JWT helper
    const user = requireAuth(authHeader)

    console.log('🔍 Fetching search history for user:', user.userId)

    // Get user's search history
    const searchesSnapshot = await adminDb
      .collection('searches')
      .where('userId', '==', user.userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()

    console.log(`📋 Found ${searchesSnapshot.docs.length} searches`)

    const searches = searchesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({
      searches,
      total: searches.length,
      user: {
        userId: user.userId,
        isAuthenticated: true,
      },
    })
  } catch (error: any) {
    console.error('❌ Search history error:', error)
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    )
  }
}
