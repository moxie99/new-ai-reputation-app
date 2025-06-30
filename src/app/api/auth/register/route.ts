import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { adminDb } from '@/lib/firebase-admin'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = registerSchema.parse(body)

    const existingUser = await adminDb
      .collection('users')
      .where('email', '==', email)
      .get()

    if (!existingUser.empty) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userRef = adminDb.collection('users').doc()
    const userData = {
      id: userRef.id,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      connectedAccounts: {},
    }

    await userRef.set(userData)

    const token = jwt.sign(
      { userId: userRef.id, email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      token,
      user: {
        id: userRef.id,
        email,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
