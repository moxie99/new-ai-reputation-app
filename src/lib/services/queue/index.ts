/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@upstash/qstash'
import { SearchRequest } from '../../../../types'
import { adminDb } from '@/lib/firebase-admin'
import { DataRetrievalOrchestrator } from '@/lib/services/data-retrieval'
import { AIAnalysisService } from '@/lib/services/ai-analysis'
import { ReportGenerationService } from '@/lib/services/report-generation'

export class QueueService {
  private client: Client | null = null
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'

    if (!this.isDevelopment && process.env.QSTASH_TOKEN) {
      this.client = new Client({
        token: process.env.QSTASH_TOKEN!,
      })
    }
  }

  async enqueueSearch(
    searchId: string,
    targetPerson: SearchRequest['targetPerson'],
    photoEmbedding: any,
    userId: string
  ) {
    if (this.isDevelopment || !this.client) {
      console.log('🔄 Development mode: Processing search directly')

      // Process immediately in development
      this.processSearchDirectly(
        searchId,
        targetPerson,
        photoEmbedding,
        userId
      ).catch((error) => {
        console.error('❌ Direct processing error:', error)
        // Update search status to failed
        adminDb.collection('searches').doc(searchId).update({
          status: 'failed',
          error: error.message,
          completedAt: new Date().toISOString(),
        })
      })

      return `direct_${searchId}` // Return a mock message ID
    }

    // Production: Use QStash
    console.log('🚀 Production mode: Using QStash queue')
    const response = await this.client.publishJSON({
      url: `${process.env.NEXTAUTH_URL}/api/jobs/process-search`,
      body: {
        searchId,
        targetPerson,
        photoEmbedding,
        userId,
        timestamp: new Date().toISOString(),
      },
      retries: 3,
      delay: '5s',
    })

    return response.messageId
  }

  private async processSearchDirectly(
    searchId: string,
    targetPerson: SearchRequest['targetPerson'],
    photoEmbedding: any,
    userId: string
  ) {
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

      console.log('🔍 Starting data retrieval...')

      // Create progress callback for direct processing
      const progressCallback = async (progress: number, step: string) => {
        console.log(`📊 Progress: ${progress}% - ${step}`)
        await searchRef.update({
          currentStep: step,
          progress: Math.max(progress, 10),
        })
      }

      const allResults = await dataRetrieval.retrieveAllData(
        targetPerson, // ✅ Fixed: targetPerson first
        progressCallback // ✅ Fixed: progressCallback second
      )

      await searchRef.update({
        status: 'analyzing',
        currentStep: 'Analyzing content with AI',
        progress: 70,
      })

      console.log('🤖 Starting AI analysis...')
      console.log(
        `📊 Analyzing ${allResults.length} results for: ${targetPerson.name}`
      )
      // const allResultsWithTarget = {
      //   ...allResults,
      //   targetPerson,
      // }
      const analysis = await aiAnalysis.analyzeAllCategories(
        allResults, // ✅ First: RawDataItem[]
        targetPerson // ✅ Second: target person object
      )

      await searchRef.update({
        currentStep: 'Generating final report',
        progress: 90,
      })

      console.log('📄 Generating report...')
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

      console.log('✅ Search completed successfully:', searchId)
    } catch (error: any) {
      console.error('❌ Processing error:', error)

      await searchRef.update({
        status: 'failed',
        error: error.message || 'Processing failed',
        completedAt: new Date().toISOString(),
      })

      throw error
    }
  }
}
