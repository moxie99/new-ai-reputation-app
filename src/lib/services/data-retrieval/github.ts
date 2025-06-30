import { Octokit } from '@octokit/rest'
import { RawDataItem } from '../../../../types'

export class GitHubRetriever {
  private octokit: Octokit

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })
  }

  async getUser(username: string): Promise<RawDataItem[]> {
    try {
      const results: RawDataItem[] = []

      // Get user profile
      const userResponse = await this.octokit.users.getByUsername({ username })
      const user = userResponse.data

      results.push({
        content: user.bio || '',
        title: user.name || user.login,
        url: user.html_url,
        source: 'github',
        type: 'profile',
        date: user.created_at,
        author: user.login,
        metrics: {
          followers: user.followers,
          following: user.following,
          publicRepos: user.public_repos,
        },
        raw: user,
      })

      // Get repositories
      const reposResponse = await this.octokit.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 30,
      })

      reposResponse.data.forEach((repo) => {
        results.push({
          content: repo.description || '',
          title: repo.name,
          url: repo.html_url,
          source: 'github',
          type: 'repository',
          date: repo.updated_at,
          author: username,
          metrics: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            watchers: repo.watchers_count,
          },
          raw: repo,
        })
      })

      // Get recent activity
      const eventsResponse =
        await this.octokit.activity.listPublicEventsForUser({
          username,
          per_page: 30,
        })

      eventsResponse.data.forEach((event) => {
        if (
          event.type === 'IssueCommentEvent' ||
          event.type === 'PullRequestReviewCommentEvent'
        ) {
          results.push({
            content: event.payload.comment?.body || '',
            title: `GitHub ${event.type}`,
            url: event.payload.comment?.html_url || '',
            source: 'github',
            type: 'activity',
            date: event.created_at,
            author: username,
            raw: event,
          })
        }
      })

      return results
    } catch (error) {
      console.error('GitHub fetch error:', error)
      return []
    }
  }
}
