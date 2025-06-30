import { RawDataItem } from '../../../../types'

export class ChunkProcessor {
  private maxTokensPerChunk: number
  private avgTokensPerItem: number = 200

  constructor(maxTokensPerChunk: number = 8000) {
    this.maxTokensPerChunk = maxTokensPerChunk
  }

  chunkData(data: RawDataItem[], itemsPerChunk: number = 50): RawDataItem[][] {
    const chunks: RawDataItem[][] = []

    let currentChunk: RawDataItem[] = []
    let currentTokenCount = 0

    for (const item of data) {
      const estimatedTokens = this.estimateTokens(item)

      if (
        currentTokenCount + estimatedTokens > this.maxTokensPerChunk ||
        currentChunk.length >= itemsPerChunk
      ) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk)
          currentChunk = []
          currentTokenCount = 0
        }
      }

      currentChunk.push(item)
      currentTokenCount += estimatedTokens
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk)
    }

    return chunks
  }

  private estimateTokens(item: RawDataItem): number {
    const contentLength = item.content.length + (item.title?.length || 0)
    return Math.ceil(contentLength / 4)
  }
}
