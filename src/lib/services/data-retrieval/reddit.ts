/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { RawDataItem } from '../../../../types'

export class RedditRetriever {
  private clientId: string
  private clientSecret: string
  private userAgent = 'ReputationLookup/1.0'
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor() {
    this.clientId = process.env.REDDIT_CLIENT_ID!
    this.clientSecret = process.env.REDDIT_CLIENT_SECRET!
  }

  private async authenticate() {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64'
    )

    try {
      const response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': this.userAgent,
          },
        }
      )

      this.accessToken = response.data.access_token
      this.tokenExpiry = new Date(
        Date.now() + (response.data.expires_in - 60) * 1000
      )
    } catch (error) {
      console.error('Reddit authentication error:', error)
      throw error
    }
  }

  async search(query: string): Promise<RawDataItem[]> {
    try {
      await this.authenticate()

      const params = {
        q: query,
        limit: 100,
        sort: 'relevance',
        time: 'all',
        type: 'link,self',
      }

      const response = await axios.get('https://oauth.reddit.com/search', {
        params,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'User-Agent': this.userAgent,
        },
      })

      return this.parseResults(response.data)
    } catch (error) {
      console.error('Reddit search error:', error)
      return []
    }
  }

  private parseResults(data: any): RawDataItem[] {
    const results: RawDataItem[] = []

    if (data.data && data.data.children) {
      data.data.children.forEach((child: any) => {
        const post = child.data

        results.push({
          content: post.selftext || post.title,
          title: post.title,
          url: `https://reddit.com${post.permalink}`,
          source: 'reddit',
          type: 'forum_post',
          date: new Date(post.created_utc * 1000).toISOString(),
          author: post.author,
          metrics: {
            score: post.score,
            comments: post.num_comments,
            upvoteRatio: post.upvote_ratio,
          },
          raw: post,
        })

        // Also get top comments if it's a discussion
        if (post.num_comments > 0 && post.selftext) {
          // Note: Would need additional API call to get comments
          // Keeping it simple for now
        }
      })
    }

    return results
  }
}
