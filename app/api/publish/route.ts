import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// n8n kutsuu tätä endpointia kun uusi artikkeli generoidaan
// POST /api/publish
// Body: { slug, title, meta, date, match, league, kickoff,
//         odds_home, odds_draw, odds_away, affiliate, affiliate_name,
//         featured, content, secret }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Yksinkertainen API-avain suoja
    if (body.secret !== process.env.PUBLISH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      slug, title, meta, date, match, league, kickoff,
      odds_home, odds_draw, odds_away,
      affiliate, affiliate_name, featured = false,
      content,
    } = body

    // Validoi pakolliset kentät
    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields: slug, title, content' }, { status: 400 })
    }

    // Rakenna MDX-tiedosto
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
meta: "${meta?.replace(/"/g, '\\"') || ''}"
date: "${date || new Date().toISOString().split('T')[0]}"
match: "${match || ''}"
league: "${league || 'Premier League'}"
kickoff: "${kickoff || new Date().toISOString()}"
odds_home: "${odds_home || '2.00'}"
odds_draw: "${odds_draw || '3.50'}"
odds_away: "${odds_away || '3.50'}"
affiliate: "${affiliate || ''}"
affiliate_name: "${affiliate_name || ''}"
featured: ${featured}
---

${content}
`

    const filePath = path.join(process.cwd(), 'content/articles', `${slug}.mdx`)
    fs.writeFileSync(filePath, frontmatter, 'utf8')

    return NextResponse.json({
      success: true,
      slug,
      url: `/articles/${slug}`,
      message: `Article published: ${slug}`,
    })
  } catch (err) {
    console.error('Publish error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Listaa kaikki julkaistut artikkelit (n8n voi tarkistaa duplikaatit)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('x-api-key')
  if (authHeader !== process.env.PUBLISH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const articlesDir = path.join(process.cwd(), 'content/articles')
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.mdx'))
  const slugs = files.map(f => f.replace('.mdx', ''))

  return NextResponse.json({ articles: slugs, count: slugs.length })
}
