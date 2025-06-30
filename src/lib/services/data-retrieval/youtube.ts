/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from 'googleapis'
import { RawDataItem } from '../../../../types'

export class YouTubeRetriever {
  private youtube: any

  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    })
  }

  async search(query: string): Promise<RawDataItem[]> {
    try {
      // Search for videos
      const searchResponse = await this.youtube.search.list({
        part: 'snippet',
        q: query,
        maxResults: 25,
        type: 'video',
        relevanceLanguage: 'en',
      })

      const videoIds = searchResponse.data.items.map(
        (item: any) => item.id.videoId
      )

      if (videoIds.length === 0) return []

      // Get detailed video information
      const videosResponse = await this.youtube.videos.list({
        part: 'snippet,statistics,contentDetails',
        id: videoIds.join(','),
      })

      // Get transcripts for top videos
      const results: RawDataItem[] = []

      for (const video of videosResponse.data.items) {
        const transcript = await this.getTranscript(video.id)

        results.push({
          content:
            video.snippet.description +
            (transcript ? `\n\nTranscript: ${transcript}` : ''),
          title: video.snippet.title,
          url: `https://youtube.com/watch?v=${video.id}`,
          source: 'youtube',
          type: 'video',
          date: video.snippet.publishedAt,
          author: video.snippet.channelTitle,
          metrics: {
            views: parseInt(video.statistics.viewCount),
            likes: parseInt(video.statistics.likeCount),
            comments: parseInt(video.statistics.commentCount),
          },
          raw: video,
        })
      }

      return results
    } catch (error) {
      console.error('YouTube search error:', error)
      return []
    }
  }

  private async getTranscript(videoId: string): Promise<string | null> {
    try {
      // Use youtube-transcript library
      const { YoutubeTranscript } = require('youtube-transcript')
      const transcript = await YoutubeTranscript.fetchTranscript(videoId)

      if (transcript && transcript.length > 0) {
        return transcript
          .map((item: any) => item.text)
          .join(' ')
          .substring(0, 5000) // Limit transcript length
      }
    } catch (error) {
      // Transcript not available
    }

    return null
  }
}
