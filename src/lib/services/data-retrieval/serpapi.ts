/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { RawDataItem } from '../../../../types'

export class SerpAPIRetriever {
  private apiKey: string
  private baseURL = 'https://serpapi.com/search'

  constructor() {
    this.apiKey = process.env.SERP_API_KEY!
  }

  async searchAll(queries: string[]): Promise<RawDataItem[]> {
    const results: RawDataItem[] = []

    for (const query of queries) {
      try {
        const queryResults = await this.search(query)
        results.push(...queryResults)

        // Rate limit delay
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`SerpAPI search error for query "${query}":`, error)
      }
    }

    return results
  }

  async search(query: string): Promise<RawDataItem[]> {
    try {
      const params = {
        q: query,
        api_key: this.apiKey,
        engine: 'google',
        num: 20,
        hl: 'en',
        gl: 'us',
      }

      const response = await axios.get(this.baseURL, { params })
      return this.parseResults(response.data)
    } catch (error) {
      console.error('SerpAPI error:', error)
      return []
    }
  }

  private parseResults(data: any): RawDataItem[] {
    const results: RawDataItem[] = []

    // Organic search results
    if (data.organic_results) {
      data.organic_results.forEach((result: any) => {
        results.push({
          content: result.snippet || '',
          title: result.title,
          url: result.link,
          source: 'serpapi',
          type: 'search_result',
          date: result.date || new Date().toISOString(),
          raw: result,
        })
      })
    }

    // News results
    if (data.news_results) {
      data.news_results.forEach((news: any) => {
        results.push({
          content: news.snippet || '',
          title: news.title,
          url: news.link,
          source: 'serpapi',
          type: 'news',
          date: news.date || new Date().toISOString(),
          author: news.source,
          raw: news,
        })
      })
    }

    // Knowledge graph
    if (data.knowledge_graph) {
      const kg = data.knowledge_graph
      results.push({
        content: kg.description || kg.snippet || '',
        title: kg.title,
        url: kg.website || kg.link || 'knowledge_graph',
        source: 'serpapi',
        type: 'knowledge_graph',
        date: new Date().toISOString(),
        raw: kg,
      })
    }

    return results
  }
}
