/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'
import { adminDb } from '@/lib/firebase-admin'
import { DataRetrievalOrchestrator } from '@/lib/services/data-retrieval'
import { AIAnalysisService } from '@/lib/services/ai-analysis'
import { ReportGenerationService } from '@/lib/services/report-generation'

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchId, targetPerson, photoEmbedding, userId } = body

    console.log('🔄 Processing search job:', searchId)
    const searchRef = adminDb.collection('searches').doc(searchId)

    try {
      await searchRef.update({
        status: 'processing',
        currentStep: 'Retrieving public data',
        progress: 10,
      })

      const dataRetrieval = new DataRetrievalOrchestrator()
      const aiAnalysis = new AIAnalysisService()
      const reportGeneration = new ReportGenerationService()

      console.log('🔍 Retrieving data for:', targetPerson.name)

      // Create progress callback function
      const progressCallback = async (progress: number, step: string) => {
        console.log(`📊 Progress: ${progress}% - ${step}`)
        await searchRef.update({
          currentStep: step,
          progress: Math.max(progress, 10), // Ensure progress doesn't go below 10%
        })
      }
      const allResults = await dataRetrieval.retrieveAllData(
        targetPerson, // ✅ Correct: targetPerson first
        progressCallback // ✅ Correct: progressCallback second
      )

      await searchRef.update({
        status: 'analyzing',
        currentStep: 'Analyzing content with AI',
        progress: 70,
      })
      console.log('🤖 Analyzing results with AI...')
      console.log(
        `📊 Analyzing ${allResults.length} results for: ${targetPerson.name}`
      )

      // // Option 2: If targetPerson is needed, include it in allResults
      // const allResultsWithTarget = {
      //   ...allResults,
      //   targetPerson,
      // }
      // const analysis = await aiAnalysis.analyzeAllCategories(
      //   searchId,
      //   allResultsWithTarget
      // )

      // const analysis = await aiAnalysis.analyzeAllCategories(
      //   searchId,
      //   allResults
      // )

      // Fix: Pass parameters in correct order
      const analysis = await aiAnalysis.analyzeAllCategories(
        allResults, // ✅ First: RawDataItem[]
        targetPerson // ✅ Second: target person object
      )
      await searchRef.update({
        currentStep: 'Generating final report',
        progress: 90,
      })

      console.log('📄 Generating final report...')
      const report = await reportGeneration.generateReport(
        searchId,
        targetPerson,
        allResults,
        analysis,
        photoEmbedding
      )

      await searchRef.update({
        status: 'completed',
        currentStep: 'Report ready',
        progress: 100,
        completedAt: new Date().toISOString(),
        reportId: report.id,
      })

      console.log('✅ Search job completed successfully:', searchId)
      return NextResponse.json({ success: true, reportId: report.id })
    } catch (error: any) {
      console.error('❌ Processing error:', error)

      await searchRef.update({
        status: 'failed',
        error: error.message || 'Processing failed',
        completedAt: new Date().toISOString(),
      })

      throw error
    }
  } catch (error) {
    console.error('❌ Job handler error:', error)
    return NextResponse.json(
      { error: 'Job processing failed' },
      { status: 500 }
    )
  }
}

// Skip signature verification in development
const isDevelopment = process.env.NODE_ENV === 'development'

export const POST = isDevelopment ? handler : verifySignatureAppRouter(handler)