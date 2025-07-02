/* eslint-disable @typescript-eslint/no-explicit-any */
import vision from '@google-cloud/vision'
import { adminStorage } from '@/lib/firebase-admin'
import { PhotoMatch, RawDataItem } from '../../../../types'

// Add debugging for credentials
function createVisionClient() {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

  if (!credentialsJson) {
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set'
    )
  }

  try {
    const credentials = JSON.parse(credentialsJson)

    // Check for required fields
    const requiredFields = ['client_email', 'private_key', 'project_id']
    for (const field of requiredFields) {
      if (!credentials[field]) {
        throw new Error(`Missing required field in credentials: ${field}`)
      }
    }

    console.log('✅ Google Cloud credentials validated successfully')

    return new vision.ImageAnnotatorClient({ credentials })
  } catch (parseError: any) {
    console.error('❌ Failed to parse Google Cloud credentials:', parseError)
    throw new Error(
      `Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON: ${parseError.message}`
    )
  }
}

const visionClient = createVisionClient()

export async function uploadPhoto(file: File, userId: string) {
  const bucket = adminStorage.bucket()
  const filename = `photos/${userId}/${Date.now()}-${file.name}`
  const blob = bucket.file(filename)

  const buffer = Buffer.from(await file.arrayBuffer())

  await blob.save(buffer, {
    metadata: {
      contentType: file.type,
    },
  })

  // Generate a signed URL that expires in 1 hour
  const [signedUrl] = await blob.getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour from now
  })

  console.log(';;;;', signedUrl)
  console.log('✅ Generated signed URL:', signedUrl.substring(0, 100) + '...')

  return {
    url: signedUrl,
    filename,
    // Also return the gs:// path for potential future use
    gsPath: `gs://${bucket.name}/${filename}`,
  }
}

// Alternative: Make file public and return public URL
export async function uploadPhotoPublic(file: File, userId: string) {
  const bucket = adminStorage.bucket()
  const filename = `photos/${userId}/${Date.now()}-${file.name}`
  const blob = bucket.file(filename)

  const buffer = Buffer.from(await file.arrayBuffer())

  await blob.save(buffer, {
    metadata: {
      contentType: file.type,
    },
  })

  // Make the file publicly readable
  await blob.makePublic()

  // Generate the public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

  console.log('✅ Made file public:', publicUrl)

  return {
    url: publicUrl,
    filename,
    gsPath: `gs://${bucket.name}/${filename}`,
  }
}

// Alternative: Use Firebase Storage download URLs
export async function uploadPhotoWithDownloadURL(file: File, userId: string) {
  const bucket = adminStorage.bucket()
  const filename = `photos/${userId}/${Date.now()}-${file.name}`
  const blob = bucket.file(filename)

  const buffer = Buffer.from(await file.arrayBuffer())

  // Upload with public read access
  await blob.save(buffer, {
    metadata: {
      contentType: file.type,
      // Add metadata for Firebase download URLs
      metadata: {
        firebaseStorageDownloadTokens: generateDownloadToken(),
      },
    },
    public: true, // Make it publicly readable
  })

  // Get the Firebase download URL
  const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(filename)}?alt=media`

  console.log('✅ Generated Firebase download URL:', downloadURL)

  return {
    url: downloadURL,
    filename,
    gsPath: `gs://${bucket.name}/${filename}`,
  }
}

// Helper function to generate download token
function generateDownloadToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

export async function extractFaceEmbedding(imageUrl: string) {
  try {
    console.log(
      '🔍 Extracting face embedding from:',
      imageUrl.substring(0, 100) + '...'
    )

    // Handle different URL formats
    let processUrl = imageUrl

    // If it's a gs:// URL, convert it to a signed URL
    if (imageUrl.startsWith('gs://')) {
      const bucket = adminStorage.bucket()
      const filename = imageUrl.replace(`gs://${bucket.name}/`, '')
      const file = bucket.file(filename)

      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      })

      processUrl = signedUrl
      console.log('🔄 Converted gs:// URL to signed URL')
    }

    const [result] = await visionClient.faceDetection(processUrl)

    console.log('++++++++', result)
    const faces = result.faceAnnotations

    if (!faces || faces.length === 0) {
      console.log('❌ No faces detected in image')
      return null
    }

    console.log(`✅ Found ${faces.length} face(s) in image`)

    // Use the most prominent face
    const mainFace = faces[0]

    return {
      boundingPoly: mainFace.boundingPoly,
      landmarks: mainFace.landmarks,
      rollAngle: mainFace.rollAngle,
      panAngle: mainFace.panAngle,
      tiltAngle: mainFace.tiltAngle,
      detectionConfidence: mainFace.detectionConfidence,
    }
  } catch (error: any) {
    console.error('❌ Face extraction error:', error)

    // More detailed error logging
    if (error.message?.includes('client_email')) {
      console.error(
        '🚨 This appears to be a credentials issue. Check your GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable.'
      )
    } else if (
      error.message?.includes('403') ||
      error.message?.includes('Forbidden')
    ) {
      console.error(
        '🚨 Access denied. The image URL might not be publicly accessible.'
      )
    } else if (
      error.message?.includes('404') ||
      error.message?.includes('Not Found')
    ) {
      console.error('🚨 Image not found. Check if the URL is correct.')
    }

    return null
  }
}

export async function findPhotoMatches(
  userEmbedding: any,
  searchResults: RawDataItem[]
): Promise<PhotoMatch[]> {
  const matches: PhotoMatch[] = []

  // Extract image URLs from search results
  const imageUrls = searchResults
    .filter((item) => item.raw?.thumbnail || item.raw?.profile_image_url)
    .map((item) => ({
      url: item.raw?.thumbnail || item.raw?.profile_image_url,
      source: item.source,
      originalUrl: item.url,
    }))

  console.log(`🔍 Processing ${imageUrls.length} images for photo matching`)

  // Process in batches to avoid rate limits
  const batchSize = 5
  for (let i = 0; i < Math.min(imageUrls.length, 20); i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize)

    const batchPromises = batch.map(async (image) => {
      try {
        const embedding = await extractFaceEmbedding(image.url)
        if (embedding) {
          const similarity = calculateSimilarity(userEmbedding, embedding)

          if (similarity > 0.7) {
            return {
              url: image.originalUrl,
              platform: image.source,
              confidence: similarity,
              matchedImageUrl: image.url,
            }
          }
        }
        return null
      } catch (error) {
        console.error('❌ Photo matching error for', image.url, ':', error)
        return null
      }
    })

    const batchResults = await Promise.allSettled(batchPromises)

    batchResults.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        matches.push(result.value)
      }
    })

    // Add small delay between batches to avoid rate limits
    if (i + batchSize < Math.min(imageUrls.length, 20)) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  console.log(`✅ Found ${matches.length} photo matches`)
  return matches.sort((a, b) => b.confidence - a.confidence)
}

function calculateSimilarity(embedding1: any, embedding2: any): number {
  if (!embedding1 || !embedding2) return 0

  // Simplified similarity calculation
  let score = 0
  const weights = {
    angles: 0.3,
    confidence: 0.2,
    landmarks: 0.5,
  }

  // Compare angles
  const angleDiff =
    Math.abs((embedding1.rollAngle || 0) - (embedding2.rollAngle || 0)) +
    Math.abs((embedding1.panAngle || 0) - (embedding2.panAngle || 0)) +
    Math.abs((embedding1.tiltAngle || 0) - (embedding2.tiltAngle || 0))

  const angleScore = Math.max(0, 1 - angleDiff / 180)
  score += angleScore * weights.angles

  // Compare confidence
  const confScore =
    ((embedding1.detectionConfidence || 0) +
      (embedding2.detectionConfidence || 0)) /
    2
  score += confScore * weights.confidence

  // Landmark comparison would go here
  score += 0.5 * weights.landmarks // Placeholder

  return score
}
