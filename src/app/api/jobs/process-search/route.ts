/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@upstash/qstash/nextjs'
import { adminDb } from '@/lib/firebase-admin'
import { DataRetrievalOrchestrator } from '@/lib/services/data-retrieval'
import { AIAnalysisService } from '@/lib/services/ai-analysis'
import { ReportGenerationService } from '@/lib/services/report-generation'

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchId, targetPerson, photoEmbedding, userId } = body

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

      const allResults = await dataRetrieval.retrieveAllData(
        searchId,
        targetPerson,
        async (progress: number, step: string) => {
          await searchRef.update({ progress, currentStep: step })
        }
      )

      await searchRef.update({
        status: 'analyzing',
        currentStep: 'Analyzing content with AI',
        progress: 70,
      })

      const analysis = await aiAnalysis.analyzeAllCategories(
        searchId,
        allResults,
        targetPerson
      )

      await searchRef.update({
        currentStep: 'Generating final report',
        progress: 90,
      })

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

      return NextResponse.json({ success: true, reportId: report.id })
    } catch (error: any) {
      console.error('Processing error:', error)

      await searchRef.update({
        status: 'failed',
        error: error.message || 'Processing failed',
        completedAt: new Date().toISOString(),
      })

      throw error
    }
  } catch (error) {
    console.error('Job handler error:', error)
    return NextResponse.json(
      { error: 'Job processing failed' },
      { status: 500 }
    )
  }
}

export const POST = verifySignature(handler)
