/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/ai-analysis/index.ts
import OpenAI from 'openai'
import axios from 'axios'
import PQueue from 'p-queue'
import {
  AnalysisCategory,
  FlaggedContent,
  RawDataItem,
} from '../../../../types'

// Define the analysis result type
interface AnalysisResult {
  summary: string
  flags: FlaggedContent[]
}

// Define valid category types
type AnalysisCategoryType = 
  | 'professionalism'
  | 'tone'
  | 'sentiment'
  | 'consistency'
  | 'authenticity'
  | 'socialRisk'
  | 'onlineExposure'
  | 'positiveMarkers'

export class AIAnalysisService {
  private openai: OpenAI
  private perspectiveApiKey: string
  private queue: PQueue

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })
    this.perspectiveApiKey = process.env.GOOGLE_PERSPECTIVE_API_KEY!

    // Queue to manage API rate limits
    this.queue = new PQueue({
      concurrency: 3,
      interval: 1000,
      intervalCap: 5,
    })
  }

  async analyzeAllCategories(
    data: RawDataItem[],
    targetPerson: any
  ): Promise<Record<string, AnalysisCategory>> {
    // Chunk data to stay within token limits
    const chunks = this.chunkData(data, 50) // 50 items per chunk

    // Analyze each category
    const categories = {
      professionalism: await this.analyzeProfessionalism(chunks, targetPerson),
      toneAndLanguage: await this.analyzeToneAndLanguage(chunks, targetPerson),
      sentiment: await this.analyzeSentiment(chunks, targetPerson),
      consistency: await this.analyzeConsistency(chunks, targetPerson),
      authenticity: await this.analyzeAuthenticity(chunks, targetPerson),
      socialRisk: await this.analyzeSocialRisk(chunks, targetPerson),
      onlineExposure: await this.analyzeOnlineExposure(chunks, targetPerson),
      positiveMarkers: await this.analyzePositiveMarkers(chunks, targetPerson),
    }

    return categories
  }

  private async analyzeProfessionalism(
    chunks: RawDataItem[][],
    targetPerson: any
  ): Promise<AnalysisCategory> {
    const flaggedContent: FlaggedContent[] = []
    const summaries: string[] = []

    for (const chunk of chunks) {
      const relevantData = chunk.filter(
        (item) =>
          item.source === 'linkedin' ||
          item.type === 'profile' ||
          item.content.toLowerCase().includes('work') ||
          item.content.toLowerCase().includes('professional') ||
          item.content.toLowerCase().includes('career')
      )

      if (relevantData.length === 0) continue

      const analysis = await this.queue.add<AnalysisResult>(() =>
        this.analyzeChunk(relevantData, 'professionalism', targetPerson)
      )
      if (analysis) {
        summaries.push(analysis.summary)
        flaggedContent.push(...analysis.flags)
      }
    }

    const finalSummary = await this.synthesizeSummaries(
      summaries,
      'professionalism'
    )

    return {
      id: 'professionalism',
      title: 'Professional Reputation',
      summary: finalSummary,
      flaggedContent: this.deduplicateFlags(flaggedContent),
      sources: flaggedContent.length,
    }
  }

  private async analyzeToneAndLanguage(
    chunks: RawDataItem[][],
    targetPerson: any
  ): Promise<AnalysisCategory> {
    const flaggedContent: FlaggedContent[] = []
    const summaries: string[] = []

    for (const chunk of chunks) {
      const socialContent = chunk.filter(
        (item) =>
          item.source === 'twitter' ||
          item.source === 'reddit' ||
          item.type === 'tweet' ||
          item.type === 'forum_post'
      )

      if (socialContent.length === 0) continue

      // Run Perspective API on social content
      const toxicityScores = await this.analyzeToxicity(socialContent)

      const analysis = await this.queue.add<AnalysisResult>(() =>
        this.analyzeChunk(socialContent, 'tone', targetPerson, toxicityScores)
      )

      if (analysis) {
        summaries.push(analysis.summary)
        flaggedContent.push(...analysis.flags)
      }
    }

    const finalSummary = await this.synthesizeSummaries(summaries, 'tone')

    return {
      id: 'toneAndLanguage',
      title: 'Tone & Language Analysis',
      summary: finalSummary,
      flaggedContent: this.deduplicateFlags(flaggedContent),
      sources: flaggedContent.length,
    }
  }

  private async analyzeSentiment(
    chunks: RawDataItem[][],
    targetPerson: any
  ): Promise<AnalysisCategory> {
    const flaggedContent: FlaggedContent[] = []
    const summaries: string[] = []

    for (const chunk of chunks) {
      // Focus on third-party mentions
      const thirdPartyContent = chunk.filter(
        (item) =>
          !item.author ||
          item.author.toLowerCase() !== targetPerson.name.toLowerCase()
      )

      if (thirdPartyContent.length === 0) continue

      const analysis = await this.queue.add<AnalysisResult>(() =>
        this.analyzeChunk(thirdPartyContent, 'sentiment', targetPerson)
      )

      if (analysis) {
        summaries.push(analysis.summary)
        flaggedContent.push(...analysis.flags)
      }
    }

    const finalSummary = await this.synthesizeSummaries(summaries, 'sentiment')

    return {
      id: 'sentiment',
      title: 'Public Sentiment Analysis',
      summary: finalSummary,
      flaggedContent: this.deduplicateFlags(flaggedContent),
      sources: flaggedContent.length,
    }
  }

  private async analyzeConsistency(
    chunks: RawDataItem[][],
    targetPerson: any
  ): Promise<AnalysisCategory> {
    const flaggedContent: FlaggedContent[] = []

    // Group all data by time periods
    const allData = chunks.flat()
    const timeGrouped = this.groupByTimePeriod(allData)

    // Analyze consistency across time periods
    const analysis = await this.queue.add(async () => {
      const prompt = this.buildConsistencyPrompt(timeGrouped, targetPerson)

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert analyst examining consistency in public statements and profiles over time. Identify contradictions, changes in stance, or evolving narratives.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      })

      return this.parseAnalysisResponse(
        response.choices[0].message.content!,
        allData
      )
    })

    return {
      id: 'consistency',
      title: 'Consistency Analysis',
      summary: analysis?.summary || 'No consistency analysis available',
      flaggedContent: analysis?.flags || [],
      sources: analysis?.flags.length || 0,
    }
  }

  private async analyzeAuthenticity(
    chunks: RawDataItem[][],
    targetPerson: any
  ): Promise<AnalysisCategory> {
    const flaggedContent: FlaggedContent[] = []
    const summaries: string[] = []

    for (const chunk of chunks) {
      // Focus on original content
      const relevantData = chunk.filter(
        (item) =>
          item.author?.toLowerCase() === targetPerson.name.toLowerCase() ||
          item.type === 'tweet' ||
          item.type === 'forum_post' ||
          item.content.length > 500 // Longer content more likely to be original
      )

      if (relevantData.length === 0) continue

      const analysis = await this.queue.add<AnalysisResult>(() =>
        this.analyzeChunk(relevantData, 'authenticity', targetPerson)
      )

      if (analysis) {
        summaries.push(analysis.summary)
        flaggedContent.push(...analysis.flags)
      }
    }

    const finalSummary = await this.synthesizeSummaries(
      summaries,
      'authenticity'
    )

    return {
      id: 'authenticity',
      title: 'Authenticity Analysis',
      summary: finalSummary,
      flaggedContent: this.deduplicateFlags(flaggedContent),
      sources: flaggedContent.length,
    }
  }

  private async analyzeSocialRisk(
    chunks: RawDataItem[][],
    targetPerson: any
  ): Promise<AnalysisCategory> {
    const flaggedContent: FlaggedContent[] = []
    const summaries: string[] = []

    for (const chunk of chunks) {
      // Run comprehensive toxicity analysis
      const toxicityScores = await this.analyzeToxicity(chunk)

      // Focus on high-risk content
      const highRiskItems = chunk.filter((item, index) => {
        const score = toxicityScores.get(item.url)
        return score && score > 0.7 // High toxicity threshold
      })

      const analysis = await this.queue.add<AnalysisResult>(() =>
        this.analyzeChunk(chunk, 'socialRisk', targetPerson, toxicityScores)
      )

      if (analysis) {
        summaries.push(analysis.summary)
        flaggedContent.push(...analysis.flags)
      }
    }

    const finalSummary = await this.synthesizeSummaries(summaries, 'socialRisk')

    return {
      id: 'socialRisk',
      title: 'Social Risk Profile',
      summary: finalSummary,
      flaggedContent: this.deduplicateFlags(flaggedContent).sort(
        (a, b) => (b.toxicityScore || 0) - (a.toxicityScore || 0) // Sort by toxicity
      ),
      sources: flaggedContent.length,
    }
  }

  private async analyzeOnlineExposure(
    chunks: RawDataItem[][],
    targetPerson: any
  ): Promise<AnalysisCategory> {
    const allData = chunks.flat()

    // Count mentions by source
    const sourceCounts = new Map<string, number>()
    const mediaArticles: RawDataItem[] = []
    const podcastAppearances: RawDataItem[] = []
    const videoAppearances: RawDataItem[] = []

    allData.forEach((item) => {
      const count = sourceCounts.get(item.source) || 0
      sourceCounts.set(item.source, count + 1)

      // Categorize by type
      if (item.type === 'news' || item.source === 'serpapi') {
        mediaArticles.push(item)
      }
      if (
        item.content.toLowerCase().includes('podcast') ||
        item.title?.toLowerCase().includes('podcast')
      ) {
        podcastAppearances.push(item)
      }
      if (item.source === 'youtube' || item.type === 'video') {
        videoAppearances.push(item)
      }
    })

    const analysis = await this.queue.add(async () => {
      const prompt = `Analyze the online exposure level of ${
        targetPerson.name
      } based on:
- Total mentions: ${allData.length}
- Media articles: ${mediaArticles.length}
- Podcast appearances: ${podcastAppearances.length}
- Video/YouTube appearances: ${videoAppearances.length}
- Source distribution: ${Array.from(sourceCounts.entries())
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')}

Sample high-visibility content:
${this.formatDataForPrompt(mediaArticles.slice(0, 10))}

Provide a summary of their online visibility and reach.

Example output format: "Featured in 4 major tech press articles, appeared on 2 podcasts, mentioned in multiple Reddit threads, and ranks on Google first page."`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Analyze online exposure and visibility levels based on the provided metrics.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      })

      return {
        summary: response.choices[0].message.content!,
        flags: mediaArticles.slice(0, 5).map((item) => ({
          quote: item.title || item.content.substring(0, 100),
          date: item.date || 'Unknown date',
          source: item.source,
          url: item.url,
          context: 'High-visibility media coverage',
        })),
      }
    })

    return {
      id: 'onlineExposure',
      title: 'Online Exposure Level',
      summary: analysis?.summary || 'No exposure analysis available',
      flaggedContent: analysis?.flags || [],
      sources: allData.length,
    }
  }

  private async analyzePositiveMarkers(
    chunks: RawDataItem[][],
    targetPerson: any
  ): Promise<AnalysisCategory> {
    const flaggedContent: FlaggedContent[] = []
    const summaries: string[] = []

    for (const chunk of chunks) {
      // Look for positive achievements
      const positiveIndicators = chunk.filter((item) => {
        const content = (item.content + ' ' + (item.title || '')).toLowerCase()
        return content.match(
          /award|achievement|recognition|honor|featured|selected|appointed|published|verified|board member|charity|volunteer|forbes|inc\.|top \d+/i
        )
      })

      if (positiveIndicators.length === 0) continue

      const analysis = await this.queue.add<AnalysisResult>(() =>
        this.analyzeChunk(positiveIndicators, 'positiveMarkers', targetPerson)
      )

      if (analysis) {
        summaries.push(analysis.summary)
        flaggedContent.push(...analysis.flags)
      }
    }

    const finalSummary = await this.synthesizeSummaries(
      summaries,
      'positiveMarkers'
    )

    return {
      id: 'positiveMarkers',
      title: 'Positive Reputation Markers',
      summary:
        finalSummary ||
        'No significant positive markers or achievements found in the analyzed data.',
      flaggedContent: this.deduplicateFlags(flaggedContent),
      sources: flaggedContent.length,
    }
  }

  private async analyzeChunk(
    data: RawDataItem[],
    category: AnalysisCategoryType,
    targetPerson: any,
    toxicityScores?: Map<string, number>
  ): Promise<{ summary: string; flags: FlaggedContent[] }> {
    const prompt = this.buildAnalysisPrompt(category, data, targetPerson)

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt(category),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const parsed = this.parseAnalysisResponse(
      response.choices[0].message.content!,
      data,
      toxicityScores
    )

    return parsed
  }

  private buildAnalysisPrompt(
    category: AnalysisCategoryType,
    data: RawDataItem[],
    targetPerson: any
  ): string {
    const prompts: Partial<Record<AnalysisCategoryType, string>> = {
      professionalism: `Analyze the professional reputation of ${
        targetPerson.name
      } based on the following content. Focus on:
- Employment history consistency across platforms
- Education verification
- Industry expertise demonstration
- Professional language quality
- Profile completeness

Content to analyze:
${this.formatDataForPrompt(data)}

Provide a summary paragraph and identify specific examples that demonstrate professionalism issues or strengths.

Example output format: "Employment history consistent across LinkedIn and interviews. Posts include detailed SaaS product management commentary. No major grammar issues observed."`,

      tone: `Analyze the communication style and tone of ${
        targetPerson.name
      }. Focus on:
- Overall positive vs negative tone
- Use of aggressive or inflammatory language
- Profanity, insults, or personal attacks
- Constructive vs destructive criticism
- Self-promotion patterns

Content to analyze:
${this.formatDataForPrompt(data)}

Provide a summary and flag specific examples of concerning language or tone.

Example output format: "Consistent professional tone in long-form posts. Occasional sarcasm directed at competitors on X. No profanity observed."`,

      sentiment: `Analyze how others perceive ${
        targetPerson.name
      } based on third-party mentions. Focus on:
- Positive vs negative coverage
- Praise vs criticism patterns
- Community sentiment
- Controversial discussions
- Professional endorsements

Third-party content:
${this.formatDataForPrompt(data)}

Summarize the overall public perception and highlight specific positive/negative mentions.

Example output format: "Positive coverage in multiple TechCrunch articles. One Reddit thread questioning transparency around recent fundraising (linked). No major controversies identified."`,

      consistency: `Examine consistency in statements and profiles for ${targetPerson.name}. Focus on:
- Contradictory statements
- Changes in professional history
- Evolving political/ethical stances
- Retractions or corrections
- Timeline inconsistencies

Provide specific examples of any inconsistencies found.`,

      authenticity: `Analyze the authenticity and depth of ${
        targetPerson.name
      }'s online persona. Focus on:
- Original content vs heavy reposting
- Depth of personal storytelling
- Vulnerability and openness markers
- Quality of engagements with followers
- Community building behavior

Content to analyze:
${this.formatDataForPrompt(data)}

Identify personal narratives, original thought leadership, and flag heavily curated or recycled content.

Example output format: "Shares personal career journey in multiple interviews. Willing to discuss personal failures. High engagement on community-focused threads."`,

      socialRisk: `Assess social risk and potential "cancelability" for ${
        targetPerson.name
      }. Focus on:
- Problematic or offensive content
- Hate speech markers
- Racist, sexist, or hateful statements
- Political extremism
- History of online callouts or backlash

Content to analyze (with toxicity scores where available):
${this.formatDataForPrompt(data)}

Flag specific problematic posts with direct quotes and severity assessment.

Example output format: "One post from 2018 flagged for offensive racial slur (linked). No pattern of recurring problematic behavior detected."`,

      positiveMarkers: `Identify positive achievements and reputation markers for ${
        targetPerson.name
      }. Focus on:
- Awards and recognitions
- Verified accounts
- Published articles or books
- Board memberships or leadership roles
- Community service or charity involvement

Content to analyze:
${this.formatDataForPrompt(data)}

Extract all verifiable positive accomplishments with sources.

Example output format: "Selected for Forbes 30 Under 30 (2023). Board member at local nonprofit. Verified LinkedIn and Twitter accounts."`,
    }

    return prompts[category] || prompts.professionalism || ''
  }

  private getSystemPrompt(category: AnalysisCategoryType): string {
    const systemPrompts: Partial<Record<AnalysisCategoryType, string>> = {
      authenticity: `You are an expert analyst evaluating authenticity and depth of online personas. Your analysis must identify original content vs recycled material, personal narratives, and community engagement quality. Focus on vulnerability markers and genuine interactions.`,

      socialRisk: `You are a risk assessment specialist evaluating potential PR and reputational risks. Focus on identifying problematic content, hate speech, offensive statements, and patterns of controversial behavior. Rate severity critically.`,

      onlineExposure: `You are a digital presence analyst quantifying online visibility. Count and categorize all mentions, media appearances, and platform presence to assess overall public exposure level.`,

      positiveMarkers: `You are an achievement verification specialist. Identify and verify all positive accomplishments, awards, leadership positions, and community contributions with source verification.`,
    }

    return (
      systemPrompts[category] ||
      `You are an expert analyst conducting a reputation assessment. Your analysis must be:
1. Objective and fact-based
2. Supported by specific quotes and examples
3. Balanced (noting both positive and negative findings)
4. Professional in tone

Format your response as:
SUMMARY: [One paragraph overview]
FLAGGED_CONTENT: [List specific concerning items with quotes]
POSITIVE_NOTES: [Any positive findings]

For each flagged item, include:
- Direct quote
- Source and date
- Why it's relevant to the category`
    )
  }

  private formatDataForPrompt(data: RawDataItem[]): string {
    return data
      .slice(0, 20)
      .map(
        (item, index) =>
          `[${index + 1}] ${item.source} (${
            item.date
          }): ${item.content.substring(0, 500)}...
URL: ${item.url}`
      )
      .join('\n\n')
  }

  private parseAnalysisResponse(
    response: string,
    sourceData: RawDataItem[],
    toxicityScores?: Map<string, number>
  ): { summary: string; flags: FlaggedContent[] } {
    const flags: FlaggedContent[] = []

    // Extract summary
    const summaryMatch = response.match(
      /SUMMARY:\s*(.+?)(?=FLAGGED_CONTENT:|POSITIVE_NOTES:|$)/s
    )
    const summary = summaryMatch ? summaryMatch[1].trim() : response

    // Extract flagged content
    const flaggedMatch = response.match(
      /FLAGGED_CONTENT:\s*(.+?)(?=POSITIVE_NOTES:|$)/s
    )
    if (flaggedMatch) {
      const flaggedSection = flaggedMatch[1]
      const items = flaggedSection.split(/\n(?=[-•\d])/g)

      for (const item of items) {
        const quoteMatch = item.match(/"([^"]+)"|'([^']+)'/)
        if (quoteMatch) {
          const quote = quoteMatch[1] || quoteMatch[2]

          // Find source data for this quote
          const source = sourceData.find(
            (d) => d.content.includes(quote) || d.title?.includes(quote)
          )

          if (source) {
            flags.push({
              quote,
              date: source.date || '',
              source: source.source,
              url: source.url,
              context: item,
              toxicityScore: toxicityScores?.get(source.url) || undefined,
            })
          }
        }
      }
    }

    return { summary, flags }
  }

  private async analyzeToxicity(
    items: RawDataItem[]
  ): Promise<Map<string, number>> {
    const scores = new Map<string, number>()

    // Batch requests to Perspective API
    const batches = this.chunkArray(items, 10)

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (item) => {
          try {
            const response = await axios.post(
              'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
              {
                comment: { text: item.content.substring(0, 3000) },
                requestedAttributes: {
                  TOXICITY: {},
                  SEVERE_TOXICITY: {},
                  IDENTITY_ATTACK: {},
                  INSULT: {},
                  PROFANITY: {},
                  THREAT: {},
                  SEXUALLY_EXPLICIT: {},
                  FLIRTATION: {},
                },
              },
              {
                params: { key: this.perspectiveApiKey },
              }
            )

            // Get the highest score across all attributes for risk assessment
            const attributeScores = response.data.attributeScores
            const maxScore = Math.max(
              attributeScores.TOXICITY.summaryScore.value,
              attributeScores.SEVERE_TOXICITY.summaryScore.value,
              attributeScores.IDENTITY_ATTACK.summaryScore.value,
              attributeScores.THREAT.summaryScore.value
            )

            scores.set(item.url, maxScore)
          } catch (error) {
            console.error('Perspective API error:', error)
          }
        })
      )

      // Rate limit delay
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return scores
  }

  private async synthesizeSummaries(
    summaries: string[],
    category: string
  ): Promise<string> {
    if (summaries.length === 0) {
      return `No relevant data found for ${category} analysis.`
    }

    if (summaries.length === 1) {
      return summaries[0]
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Synthesize multiple analysis summaries into one coherent paragraph.',
        },
        {
          role: 'user',
          content: `Combine these ${category} analysis summaries into one comprehensive summary:\n\n${summaries.join(
            '\n\n'
          )}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    return response.choices[0].message.content!
  }

  private chunkData(data: RawDataItem[], chunkSize: number): RawDataItem[][] {
    const chunks: RawDataItem[][] = []
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize))
    }
    return chunks
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  private deduplicateFlags(flags: FlaggedContent[]): FlaggedContent[] {
    const seen = new Set<string>()
    return flags.filter((flag) => {
      const key = `${flag.quote}-${flag.source}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  private groupByTimePeriod(
    data: RawDataItem[]
  ): Record<string, RawDataItem[]> {
    const groups: Record<string, RawDataItem[]> = {
      recent: [], // Last 3 months
      mediumTerm: [], // 3-12 months
      longTerm: [], // Over 1 year
    }

    const now = new Date()
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    data.forEach((item) => {
      const itemDate = new Date(item.date || '2025-10-10')
      if (itemDate > threeMonthsAgo) {
        groups.recent.push(item)
      } else if (itemDate > oneYearAgo) {
        groups.mediumTerm.push(item)
      } else {
        groups.longTerm.push(item)
      }
    })

    return groups
  }

  private buildConsistencyPrompt(
    timeGrouped: Record<string, RawDataItem[]>,
    targetPerson: any
  ): string {
    let prompt = `Analyze consistency over time for ${targetPerson.name}:\n\n`

    Object.entries(timeGrouped).forEach(([period, items]) => {
      if (items.length > 0) {
        prompt += `${period.toUpperCase()} PERIOD:\n`
        prompt += this.formatDataForPrompt(items)
        prompt += '\n\n'
      }
    })

    prompt += `\nIdentify any contradictions, changes in stance, or evolving narratives across these time periods.`

    return prompt
  }
}
