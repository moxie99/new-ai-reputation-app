/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import jwt from 'jsonwebtoken'

interface Params {
  params: Promise<{
    reportId: string
  }>
}

export async function GET(request: NextRequest, context: Params) {
  try {
    // Await the params
    const params = await context.params
    const { reportId } = params

    const reportDoc = await adminDb.collection('reports').doc(reportId).get()

    if (!reportDoc.exists) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const report = reportDoc.data()!

    const searchDoc = await adminDb.collection('searches').doc(reportId).get()
    if (searchDoc.exists) {
      const search = searchDoc.data()!

      const authHeader = request.headers.get('authorization')
      if (search.userId !== 'anonymous') {
        if (!authHeader) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          )
        }

        try {
          const token = authHeader.replace('Bearer ', '')
          const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any

          if (decoded.userId !== search.userId) {
            return NextResponse.json(
              { error: 'Access denied' },
              { status: 403 }
            )
          }
        } catch (error) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }
      }
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Report fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
