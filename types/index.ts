/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string
  email: string
  createdAt: string
  connectedAccounts?: {
    google?: boolean
    twitter?: boolean
    linkedin?: boolean
    reddit?: boolean
  }
}

export interface SearchRequest {
  id: string
  userId?: string
  targetPerson: {
    name: string
    email?: string
    socialHandles?: {
      twitter?: string
      linkedin?: string
      github?: string
      reddit?: string
      youtube?: string
    }
  }
  photoUrl?: string
  photoEmbedding?: any
  status: 'queued' | 'processing' | 'analyzing' | 'completed' | 'failed'
  progress: number
  currentStep: string
  createdAt: string
  completedAt?: string
  error?: string
}

export interface RawDataItem {
  content: string
  title?: string
  url: string
  source: string
  type: string
  date: string | null | undefined
  author?: string
  metrics?: any
  raw?: any
  retrievalMetadata?: {
    source: string
    query: string
    retrievedAt: string
    searchId: string
  }
}

export interface AnalysisCategory {
  id: string
  title: string
  summary: string
  flaggedContent: FlaggedContent[]
  sources: number
}

export interface FlaggedContent {
  quote: string
  date: string
  source: string
  url: string
  context?: string
  toxicityScore?: number
}

export interface Report {
  id: string
  searchId: string
  targetPerson: SearchRequest['targetPerson']
  generatedAt: string
  categories: {
    professionalism: AnalysisCategory
    toneAndLanguage: AnalysisCategory
    sentiment: AnalysisCategory
    consistency: AnalysisCategory
    authenticity: AnalysisCategory
    socialRisk: AnalysisCategory
    onlineExposure: AnalysisCategory
    positiveMarkers: AnalysisCategory
  }
  totalItemsAnalyzed: number
  dataSourcesUsed: string[]
  photoMatches?: PhotoMatch[]
}

export interface PhotoMatch {
  url: string
  platform: string
  confidence: number
  matchedImageUrl: string
}
