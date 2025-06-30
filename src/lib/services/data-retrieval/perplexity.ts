/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { RawDataItem } from '../../../../types'

export class PerplexityRetriever {
  private apiKey: string
  private baseURL = 'https://api.perplexity.ai'

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY!
  }

  async searchAll(queries: string[]): Promise<RawDataItem[]> {
    const results: RawDataItem[] = []

    // Process queries in batches to avoid rate limits
    for (const query of queries.slice(0, 5)) {
      try {
        const queryResults = await this.search(query)
        results.push(...queryResults)

        // Small delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Perplexity search error for query "${query}":`, error)
      }
    }

    return results
  }

  async search(query: string): Promise<RawDataItem[]> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'pplx-70b-online',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that searches for comprehensive information about people. Return detailed results with sources.',
            },
            {
              role: 'user',
              content: `Search for information about: ${query}`,
            },
          ],
          max_tokens: 2000,
          temperature: 0.2,
          return_citations: true,
          return_related_questions: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return this.parseResponse(response.data, query)
    } catch (error) {
      console.error('Perplexity API error:', error)
      return []
    }
  }

  private parseResponse(data: any, query: string): RawDataItem[] {
    const results: RawDataItem[] = []

    if (data.choices && data.choices[0]) {
      const content = data.choices[0].message.content
      const citations = data.citations || []

      // Extract sections from the response
      const sections = content.split('\n\n').filter((s: string) => s.trim())

      sections.forEach((section: string, index: number) => {
        // Try to match this section with a citation
        const citation = citations[index] || {}

        results.push({
          content: section,
          title: `Perplexity result for: ${query}`,
          url: citation.url || `perplexity:${query}:${index}`,
          source: 'perplexity',
          type: 'web_aggregation',
          date: new Date().toISOString(),
          raw: {
            query,
            citation,
            fullResponse: data,
          },
        })
      })
    }

    return results
  }
}
