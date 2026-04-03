import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const articlesDir = path.join(process.cwd(), 'content/articles')

export interface ArticleMeta {
  slug: string
  title: string
  meta: string
  date: string
  match: string
  league: string
  kickoff: string
  odds_home: string
  odds_draw: string
  odds_away: string
  affiliate: string
  affiliate_name: string
  featured: boolean
}

export interface Article extends ArticleMeta {
  contentHtml: string
}

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(articlesDir)
  const articles = files
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(articlesDir, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      return { slug, ...data } as ArticleMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return articles
}

export async function getArticle(slug: string): Promise<Article> {
  const fullPath = path.join(articlesDir, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const processed = await remark().use(html).process(content)
  return {
    slug,
    contentHtml: processed.toString(),
    ...data,
  } as Article
}

export function getFeaturedArticle(): ArticleMeta | null {
  const articles = getAllArticles()
  return articles.find(a => a.featured) || articles[0] || null
}
