/* eslint-disable @typescript-eslint/no-explicit-any */

import { RawDataItem, SearchRequest } from '../../../../types'
import { GitHubRetriever } from './github'
import { LinkedInRetriever } from './linkedin'
import { PerplexityRetriever } from './perplexity'
import { RedditRetriever } from './reddit'
import { SerpAPIRetriever } from './serpapi'
import { TwitterRetriever } from './twitter'
import { YouTubeRetriever } from './youtube'

export class DataRetrievalOrchestrator {
  private retrievers: Record<string, any>

  constructor() {
    this.retrievers = {
      perplexity: new PerplexityRetriever(),
      serpapi: new SerpAPIRetriever(),
      youtube: new YouTubeRetriever(),
      reddit: new RedditRetriever(),
      twitter: new TwitterRetriever(),
      github: new GitHubRetriever(),
      linkedin: new LinkedInRetriever(),
    }
  }

  async retrieveAllData(
    targetPerson: SearchRequest['targetPerson'],
    progressCallback?: (progress: number, step: string) => Promise<void>
  ): Promise<RawDataItem[]> {
    const allResults: RawDataItem[] = []
    const queries = this.buildSearchQueries(targetPerson)

    // Step 1: Perplexity web search (primary source)
    await progressCallback?.(10, 'Searching web with Perplexity')
    const perplexityResults = await this.retrievers.perplexity.searchAll(
      queries
    )
    allResults.push(...perplexityResults)

    // Step 2: SerpAPI as backup
    await progressCallback?.(20, 'Searching Google via SerpAPI')
    const serpResults = await this.retrievers.serpapi.searchAll(
      queries.slice(0, 3)
    )
    allResults.push(...serpResults)

    // Step 3: YouTube search
    await progressCallback?.(30, 'Searching YouTube')
    const youtubeResults = await this.retrievers.youtube.search(
      targetPerson.name
    )
    allResults.push(...youtubeResults)

    // Step 4: Reddit discussions
    await progressCallback?.(40, 'Searching Reddit discussions')
    const redditResults = await this.retrievers.reddit.search(targetPerson.name)
    allResults.push(...redditResults)

    // Step 5: Platform-specific searches if handles provided
    if (targetPerson.socialHandles) {
      if (targetPerson.socialHandles.twitter) {
        await progressCallback?.(50, 'Retrieving Twitter/X data')
        const twitterResults = await this.retrievers.twitter.getUser(
          targetPerson.socialHandles.twitter
        )
        allResults.push(...twitterResults)
      }

      if (targetPerson.socialHandles.github) {
        await progressCallback?.(55, 'Retrieving GitHub data')
        const githubResults = await this.retrievers.github.getUser(
          targetPerson.socialHandles.github
        )
        allResults.push(...githubResults)
      }

      if (targetPerson.socialHandles.linkedin) {
        await progressCallback?.(60, 'Retrieving LinkedIn data')
        const linkedinResults = await this.retrievers.linkedin.search(
          targetPerson.name,
          targetPerson.socialHandles.linkedin
        )
        allResults.push(...linkedinResults)
      }
    }

    // Remove duplicates based on URL
    const uniqueResults = this.deduplicateResults(allResults)

    return uniqueResults
  }

  private buildSearchQueries(
    targetPerson: SearchRequest['targetPerson']
  ): string[] {
    const queries: string[] = []
    const { name, email, socialHandles } = targetPerson

    // Name variations
    queries.push(name)
    queries.push(`"${name}"`)

    // Professional queries
    queries.push(`${name} LinkedIn profile`)
    queries.push(`${name} company CEO founder`)
    queries.push(`${name} professional background`)

    // News and media
    queries.push(`${name} news articles`)
    queries.push(`${name} interview podcast`)

    // Controversy and sentiment
    queries.push(`${name} controversy scandal`)
    queries.push(`${name} reviews opinions`)

    // Platform-specific
    if (socialHandles) {
      Object.entries(socialHandles).forEach(([platform, handle]) => {
        if (handle) {
          queries.push(`${handle} ${platform}`)
          queries.push(`${name} ${platform}`)
        }
      })
    }

    // Email domain search
    if (email) {
      const domain = email.split('@')[1]
      queries.push(`${name} ${domain}`)
    }

    return [...new Set(queries)] // Remove duplicates
  }

  private deduplicateResults(results: RawDataItem[]): RawDataItem[] {
    const seen = new Set<string>()
    return results.filter((item) => {
      const key = item.url || `${item.source}-${item.content.substring(0, 100)}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
}
