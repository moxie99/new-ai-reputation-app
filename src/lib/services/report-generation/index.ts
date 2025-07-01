/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from '@/lib/firebase-admin'
import { findPhotoMatches } from '../photo-matching'
import {
  PhotoMatch,
  RawDataItem,
  SearchRequest,
  Report,
} from '../../../../types'

// Define types for the reasoning log
interface ReasoningCategory {
  summary: string
  flagCount: number
  reasoning: Array<{
    quote: string
    source: string
    url: string
    context: string
    toxicityScore?: number
  }>
}

interface ReasoningLog {
  searchId: string
  timestamp: string
  categories: Record<string, ReasoningCategory>
}

export class ReportGenerationService {
  async generateReport(
    searchId: string,
    targetPerson: SearchRequest['targetPerson'],
    rawData: RawDataItem[],
    analysis: Record<string, any>,
    photoEmbedding?: any
  ): Promise<Report> {
    // Find photo matches if embedding available
    let photoMatches: PhotoMatch[] = []
    if (photoEmbedding) {
      photoMatches = await findPhotoMatches(photoEmbedding, rawData)
    }

    const report: Report = {
      id: searchId,
      searchId,
      targetPerson,
      generatedAt: new Date().toISOString(),
      categories: {
        professionalism: analysis.professionalism,
        toneAndLanguage: analysis.toneAndLanguage,
        sentiment: analysis.sentiment,
        consistency: analysis.consistency,
        authenticity: analysis.authenticity,
        socialRisk: analysis.socialRisk,
        onlineExposure: analysis.onlineExposure,
        positiveMarkers: analysis.positiveMarkers,
      },
      totalItemsAnalyzed: rawData.length,
      dataSourcesUsed: this.getDataSources(rawData),
      photoMatches,
    }

    // Store report with full audit trail
    await adminDb
      .collection('reports')
      .doc(searchId)
      .set({
        ...report,
        generatedAt: report.generatedAt.toString(),
      })

    // Log analysis reasoning for transparency
    await this.logAnalysisReasoning(searchId, analysis)

    return report
  }

  private getDataSources(data: RawDataItem[]): string[] {
    const sources = new Set<string>()
    data.forEach((item) => sources.add(item.source))
    return Array.from(sources)
  }

  private async logAnalysisReasoning(searchId: string, analysis: any) {
    // Store detailed reasoning for each conclusion
    const reasoningLog: ReasoningLog = {
      searchId,
      timestamp: new Date().toISOString(),
      categories: {},
    }

    Object.entries(analysis).forEach(([category, data]: [string, any]) => {
      reasoningLog.categories[category] = {
        summary: data.summary,
        flagCount: data.flaggedContent.length,
        reasoning: data.flaggedContent.map((flag: any) => ({
          quote: flag.quote,
          source: flag.source,
          url: flag.url,
          context: flag.context,
          toxicityScore: flag.toxicityScore,
        })),
      }
    })

    await adminDb.collection('analysis_logs').doc(searchId).set(reasoningLog)
  }
}
