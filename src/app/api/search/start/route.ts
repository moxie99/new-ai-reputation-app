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
import jwt from 'jsonwebtoken'
import { extractUserFromRequest } from '@/lib/auth/jwt-helper'
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
    console.log('🚀 Starting search request...')
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
    console.log('✅ Search data validated')

    const searchId = uuidv4()
    const photo = formData.get('photo') as File | null

    const authHeader = request.headers.get('authorization')
    const { userId, isAuthenticated, user } = extractUserFromRequest(authHeader)

    console.log('👤 User context:', { userId, isAuthenticated })
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
      console.log('📸 Processing uploaded photo...')
      console.log('Photo details:', {
        name: photo.name,
        size: photo.size,
        type: photo.type,
      })

      try {
        // Upload photo and get signed URL
        const photoData = await uploadPhoto(photo, userId)
        searchRecord.photoUrl = photoData.url
        console.log('✅ Photo uploaded successfully')

        // Extract face embedding using the signed URL
        photoEmbedding = await extractFaceEmbedding(photoData.url)
        if (photoEmbedding) {
          searchRecord.photoEmbedding = photoEmbedding
          console.log('✅ Face embedding extracted successfully')
          console.log(
            'Face detection confidence:',
            photoEmbedding.detectionConfidence
          )
        } else {
          console.log('⚠️ No face detected in uploaded photo')
          // You might want to return an error here if face detection is required
          return NextResponse.json(
            {
              error:
                'No face detected in the uploaded photo. Please upload a clear photo with a visible face.',
              searchId: null,
            },
            { status: 400 }
          )
        }
      } catch (photoError: any) {
        console.error('❌ Photo processing failed:', photoError)
        return NextResponse.json(
          {
            error:
              'Failed to process uploaded photo. Please try again with a different image.',
            details: photoError.message,
          },
          { status: 400 }
        )
      }
    }

    // Save search record to database
    await adminDb.collection('searches').doc(searchId).set(searchRecord)
    console.log('✅ Search record saved to database')

    // Queue the search for processing
    const queueService = new QueueService()
    await queueService.enqueueSearch(
      searchId,
      validatedData,
      photoEmbedding,
      userId
    )
    console.log('✅ Search queued for processing')

    return NextResponse.json({
      searchId,
      status: 'queued',
      message: 'Search initiated. Processing will begin shortly.',
      hasPhoto: !!photo,
      hasFaceEmbedding: !!photoEmbedding,
      user: {
        userId,
        isAuthenticated,
      },
    })
  } catch (error: any) {
    console.error('❌ Search start error:', error)

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

    // Handle specific Google Cloud errors
    if (error.message?.includes('client_email')) {
      return NextResponse.json(
        {
          error: 'Service configuration error. Please contact support.',
          code: 'CREDENTIALS_ERROR',
        },
        { status: 500 }
      )
    }

    if (error.message?.includes('Vision API')) {
      return NextResponse.json(
        {
          error:
            'Image processing service unavailable. Please try again later.',
          code: 'VISION_API_ERROR',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to start search. Please try again.',
        code: 'UNKNOWN_ERROR',
      },
      { status: 500 }
    )
  }
}
