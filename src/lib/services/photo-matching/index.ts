/* eslint-disable @typescript-eslint/no-explicit-any */
import vision from '@google-cloud/vision'
import { adminStorage } from '@/lib/firebase-admin'
import { PhotoMatch, RawDataItem } from '../../../../types'

const visionClient = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}'
  ),
})

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

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

  return {
    url: publicUrl,
    filename,
  }
}

export async function extractFaceEmbedding(imageUrl: string) {
  try {
    const [result] = await visionClient.faceDetection(imageUrl)
    const faces = result.faceAnnotations

    if (!faces || faces.length === 0) {
      return null
    }

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
  } catch (error) {
    console.error('Face extraction error:', error)
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

  // Process in batches
  for (const image of imageUrls.slice(0, 20)) {
    // Limit to 20 for performance
    try {
      const embedding = await extractFaceEmbedding(image.url)
      if (embedding) {
        const similarity = calculateSimilarity(userEmbedding, embedding)

        if (similarity > 0.7) {
          matches.push({
            url: image.originalUrl,
            platform: image.source,
            confidence: similarity,
            matchedImageUrl: image.url,
          })
        }
      }
    } catch (error) {
      console.error('Photo matching error:', error)
    }
  }

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
    Math.abs(embedding1.rollAngle - embedding2.rollAngle) +
    Math.abs(embedding1.panAngle - embedding2.panAngle) +
    Math.abs(embedding1.tiltAngle - embedding2.tiltAngle)

  const angleScore = Math.max(0, 1 - angleDiff / 180)
  score += angleScore * weights.angles

  // Compare confidence
  const confScore =
    (embedding1.detectionConfidence + embedding2.detectionConfidence) / 2
  score += confScore * weights.confidence

  // Landmark comparison would go here
  score += 0.5 * weights.landmarks // Placeholder

  return score
}
