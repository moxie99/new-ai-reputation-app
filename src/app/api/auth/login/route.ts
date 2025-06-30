import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { adminDb } from '@/lib/firebase-admin'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const userSnapshot = await adminDb
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get()

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const userDoc = userSnapshot.docs[0]
    const userData = userDoc.data()

    const validPassword = await bcrypt.compare(password, userData.password)
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      token,
      user: {
        id: userData.id,
        email: userData.email,
        connectedAccounts: userData.connectedAccounts || {},
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
