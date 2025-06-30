/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { RawDataItem } from '../../../../types'

export class TwitterRetriever {
  private bearerToken: string
  private baseURL = 'https://api.twitter.com/2'

  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN!
  }

  async getUser(username: string): Promise<RawDataItem[]> {
    try {
      // Clean username (remove @ if present)
      username = username.replace('@', '')

      // Get user info
      const userResponse = await axios.get(
        `${this.baseURL}/users/by/username/${username}`,
        {
          params: {
            'user.fields':
              'created_at,description,entities,id,location,name,profile_image_url,protected,public_metrics,url,username,verified',
          },
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
          },
        }
      )

      if (!userResponse.data.data) return []

      const user = userResponse.data.data
      const results: RawDataItem[] = []

      // Add user profile
      results.push({
        content: user.description || '',
        title: `@${user.username} Twitter Profile`,
        url: `https://twitter.com/${user.username}`,
        source: 'twitter',
        type: 'profile',
        date: user.created_at,
        author: user.username,
        metrics: user.public_metrics,
        raw: user,
      })

      // Get recent tweets
      const tweets = await this.getUserTweets(user.id)
      results.push(...tweets)

      return results
    } catch (error) {
      console.error('Twitter user fetch error:', error)
      return []
    }
  }

  private async getUserTweets(userId: string): Promise<RawDataItem[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/users/${userId}/tweets`,
        {
          params: {
            max_results: 100,
            'tweet.fields':
              'created_at,public_metrics,possibly_sensitive,referenced_tweets,entities,context_annotations',
            exclude: 'retweets',
          },
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
          },
        }
      )

      if (!response.data.data) return []

      return response.data.data.map((tweet: any) => ({
        content: tweet.text,
        title: `Tweet: ${tweet.text.substring(0, 50)}...`,
        url: `https://twitter.com/i/status/${tweet.id}`,
        source: 'twitter',
        type: 'tweet',
        date: tweet.created_at,
        metrics: tweet.public_metrics,
        raw: tweet,
      }))
    } catch (error) {
      console.error('Twitter tweets fetch error:', error)
      return []
    }
  }
}
