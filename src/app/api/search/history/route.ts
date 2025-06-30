/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import jwt from 'jsonwebtoken'

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
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any

    // Get user's search history
    const searchesSnapshot = await adminDb
      .collection('searches')
      .where('userId', '==', decoded.userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()

    const searches = searchesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(searches)
  } catch (error) {
    console.error('Search history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    )
  }
}
