/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from '@/lib/firebase-admin'
import { FlaggedContent } from '../../../../types'

export class ReasoningLogger {
  private searchId: string
  private logs: any[] = []

  constructor(searchId: string) {
    this.searchId = searchId
  }

  logAnalysisStep(category: string, step: string, data: any) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      category,
      step,
      data,
    })
  }

  logFlaggedContent(category: string, flag: FlaggedContent, reasoning: string) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      category,
      type: 'flagged_content',
      flag,
      reasoning,
      sourceUrl: flag.url,
      directQuote: flag.quote,
    })
  }

  logChunkAnalysis(
    category: string,
    chunkIndex: number,
    itemCount: number,
    prompt: string,
    response: string
  ) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      category,
      type: 'chunk_analysis',
      chunkIndex,
      itemCount,
      prompt: prompt.substring(0, 1000),
      response: response.substring(0, 1000),
      fullResponseAvailable: true,
    })
  }

  async saveToFirestore() {
    const docRef = adminDb
      .collection('analysis_reasoning_logs')
      .doc(this.searchId)

    await docRef.set({
      searchId: this.searchId,
      createdAt: new Date().toISOString(),
      logs: this.logs,
      totalSteps: this.logs.length,
      categories: [...new Set(this.logs.map((l) => l.category))],
    })
  }
}
