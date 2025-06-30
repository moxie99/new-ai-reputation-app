/* eslint-disable @typescript-eslint/no-explicit-any */

import { RawDataItem } from '../../../../types'

export abstract class BaseRetriever {
  protected name: string
  protected apiKey: string | undefined
  protected rateLimitDelay: number = 1000

  constructor(name: string, apiKey?: string) {
    this.name = name
    this.apiKey = apiKey
  }

  abstract search(query: string, options?: any): Promise<RawDataItem[]>

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  protected normalizeDate(date: any): string {
    if (!date) return new Date().toISOString()
    try {
      return new Date(date).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  protected truncateContent(content: string, maxLength: number = 5000): string {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  async searchWithRetry(
    query: string,
    maxRetries: number = 3
  ): Promise<RawDataItem[]> {
    let lastError: any

    for (let i = 0; i < maxRetries; i++) {
      try {
        const results = await this.search(query)
        return results
      } catch (error) {
        lastError = error
        console.error(`${this.name} retry ${i + 1}/${maxRetries}:`, error)

        if (i < maxRetries - 1) {
          await this.delay(this.rateLimitDelay * (i + 1))
        }
      }
    }

    console.error(`${this.name} failed after ${maxRetries} retries:`, lastError)
    return []
  }
}
