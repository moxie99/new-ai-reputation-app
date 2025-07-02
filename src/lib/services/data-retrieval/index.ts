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

    // Helper function to safely call progress callback
    const updateProgress = async (progress: number, step: string) => {
      try {
        if (progressCallback && typeof progressCallback === 'function') {
          await progressCallback(progress, step)
        } else {
          console.log(`📊 Progress: ${progress}% - ${step}`)
        }
      } catch (error) {
        console.error('Progress callback error:', error)
      }
    }

    console.log(`🔍 Starting data retrieval for: ${targetPerson.name}`)
    console.log(`📝 Generated ${queries.length} search queries`)

    try {
      // Step 1: Perplexity web search (primary source)
      await updateProgress(10, 'Searching web with Perplexity')
      try {
        const perplexityResults = await this.retrievers.perplexity.searchAll(
          queries
        )
        allResults.push(...perplexityResults)
        console.log(`✅ Perplexity: Found ${perplexityResults.length} results`)
      } catch (error) {
        console.error('❌ Perplexity search failed:', error)
      }

      // Step 2: SerpAPI as backup
      await updateProgress(20, 'Searching Google via SerpAPI')
      try {
        const serpResults = await this.retrievers.serpapi.searchAll(
          queries.slice(0, 3)
        )
        allResults.push(...serpResults)
        console.log(`✅ SerpAPI: Found ${serpResults.length} results`)
      } catch (error) {
        console.error('❌ SerpAPI search failed:', error)
      }

      // Step 3: YouTube search
      await updateProgress(30, 'Searching YouTube')
      try {
        const youtubeResults = await this.retrievers.youtube.search(
          targetPerson.name
        )
        allResults.push(...youtubeResults)
        console.log(`✅ YouTube: Found ${youtubeResults.length} results`)
      } catch (error) {
        console.error('❌ YouTube search failed:', error)
      }

      // Step 4: Reddit discussions
      await updateProgress(40, 'Searching Reddit discussions')
      try {
        const redditResults = await this.retrievers.reddit.search(
          targetPerson.name
        )
        allResults.push(...redditResults)
        console.log(`✅ Reddit: Found ${redditResults.length} results`)
      } catch (error) {
        console.error('❌ Reddit search failed:', error)
      }

      // Step 5: Platform-specific searches if handles provided
      if (targetPerson.socialHandles) {
        if (targetPerson.socialHandles.twitter) {
          await updateProgress(50, 'Retrieving Twitter/X data')
          try {
            const twitterResults = await this.retrievers.twitter.getUser(
              targetPerson.socialHandles.twitter
            )
            allResults.push(...twitterResults)
            console.log(`✅ Twitter: Found ${twitterResults.length} results`)
          } catch (error) {
            console.error('❌ Twitter search failed:', error)
          }
        }

        if (targetPerson.socialHandles.github) {
          await updateProgress(55, 'Retrieving GitHub data')
          try {
            const githubResults = await this.retrievers.github.getUser(
              targetPerson.socialHandles.github
            )
            allResults.push(...githubResults)
            console.log(`✅ GitHub: Found ${githubResults.length} results`)
          } catch (error) {
            console.error('❌ GitHub search failed:', error)
          }
        }

        if (targetPerson.socialHandles.linkedin) {
          await updateProgress(60, 'Retrieving LinkedIn data')
          try {
            const linkedinResults = await this.retrievers.linkedin.search(
              targetPerson.name,
              targetPerson.socialHandles.linkedin
            )
            allResults.push(...linkedinResults)
            console.log(`✅ LinkedIn: Found ${linkedinResults.length} results`)
          } catch (error) {
            console.error('❌ LinkedIn search failed:', error)
          }
        }
      }

      await updateProgress(65, 'Deduplicating results')

      // Remove duplicates based on URL
      const uniqueResults = this.deduplicateResults(allResults)

      console.log(
        `🎯 Total results: ${allResults.length}, Unique results: ${uniqueResults.length}`
      )

      await updateProgress(70, 'Data retrieval completed')

      return uniqueResults
    } catch (error) {
      console.error('❌ Data retrieval orchestrator error:', error)
      await updateProgress(0, 'Data retrieval failed')
      throw error
    }
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
