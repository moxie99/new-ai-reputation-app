import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

interface Params {
  params: {
    searchId: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { searchId } = params

    const doc = await adminDb.collection('searches').doc(searchId).get()

    if (!doc.exists) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 })
    }

    const data = doc.data()!

    return NextResponse.json({
      id: searchId,
      status: data.status,
      progress: data.progress || 0,
      currentStep: data.currentStep || 'Initializing',
      completedAt: data.completedAt,
      error: data.error,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
