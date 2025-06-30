/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@upstash/qstash'
import { SearchRequest } from '../../../../types'

export class QueueService {
  private client: Client

  constructor() {
    this.client = new Client({
      token: process.env.QSTASH_TOKEN!,
    })
  }

  async enqueueSearch(
    searchId: string,
    targetPerson: SearchRequest['targetPerson'],
    photoEmbedding: any,
    userId: string
  ) {
    const response = await this.client.publishJSON({
      url: `${process.env.NEXTAUTH_URL}/api/jobs/process-search`,
      body: {
        searchId,
        targetPerson,
        photoEmbedding,
        userId,
        timestamp: new Date().toISOString(),
      },
      retries: 3,
      delay: '5s',
    })

    return response.messageId
  }
}
