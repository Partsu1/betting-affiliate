import { getAllArticles } from '@/lib/articles'

export default function sitemap() {
  const articles = getAllArticles()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oddsedge.com'

  const articleUrls = articles.map(article => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly' as const, priority: 1 },
    ...articleUrls,
  ]
}
