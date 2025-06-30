/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import {
  uploadPhoto,
  extractFaceEmbedding,
} from '@/lib/services/photo-matching'
import { QueueService } from '@/lib/services/queue'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { SearchRequest } from '../../../../../types'

const searchSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  socialHandles: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      reddit: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Fix: Handle null values properly
    const emailValue = formData.get('email')
    const socialHandlesValue = formData.get('socialHandles')
    const searchData = {
      name: formData.get('name') as string,
      email: emailValue ? String(emailValue) : undefined,
      socialHandles: socialHandlesValue
        ? JSON.parse(String(socialHandlesValue))
        : undefined,
    }

    const validatedData = searchSchema.parse(searchData)

    const searchId = uuidv4()
    const photo = formData.get('photo') as File | null

    const authHeader = request.headers.get('authorization')
    let userId = 'anonymous'

    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const jwt = require('jsonwebtoken')
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
        userId = decoded.userId
      } catch (error) {
        // Continue as anonymous
      }
    }

    const searchRecord: SearchRequest = {
      id: searchId,
      userId,
      targetPerson: validatedData,
      status: 'queued',
      progress: 0,
      currentStep: 'Initializing',
      createdAt: new Date().toISOString(),
    }

    let photoEmbedding = null
    if (photo) {
      const photoData = await uploadPhoto(photo, userId)
      searchRecord.photoUrl = photoData.url

      photoEmbedding = await extractFaceEmbedding(photoData.url)
      if (photoEmbedding) {
        searchRecord.photoEmbedding = photoEmbedding
      }
    }

    await adminDb.collection('searches').doc(searchId).set(searchRecord)

    const queueService = new QueueService()
    await queueService.enqueueSearch(
      searchId,
      validatedData,
      photoEmbedding,
      userId
    )

    return NextResponse.json({
      searchId,
      status: 'queued',
      message: 'Search initiated. Processing will begin shortly.',
    })
  } catch (error) {
    console.error('Search start error:', error)
    // Better error handling for Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid form data',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to start search' },
      { status: 500 }
    )
  }
}
