import { getAllArticles, getArticle } from '@/lib/articles'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  return {
    title: article.title,
    description: article.meta,
    openGraph: { title: article.title, description: article.meta },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  const kickoff = new Date(article.kickoff)

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <a href="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
        ← All previews
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{article.league}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {format(kickoff, 'EEEE d MMMM yyyy · HH:mm')}
        </span>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: 1.15 }}>{article.title}</h1>

      {/* Odds card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-bright)',
        borderRadius: '10px',
        padding: '1.25rem',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
          Best available odds
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
          {[
            { label: article.match.split(' vs ')[0] || 'Home', val: article.odds_home },
            { label: 'Draw', val: article.odds_draw },
            { label: article.match.split(' vs ')[1] || 'Away', val: article.odds_away },
          ].map(({ label, val }) => {
            const best = Math.max(parseFloat(article.odds_home), parseFloat(article.odds_draw), parseFloat(article.odds_away))
            const isBest = parseFloat(val) === best
            return (
              <div key={label} style={{
                background: isBest ? 'var(--green-bg)' : 'var(--surface2)',
                border: `1px solid ${isBest ? 'var(--border-bright)' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2rem', fontWeight: 700, color: isBest ? 'var(--green)' : 'var(--text)' }}>{val}</div>
                {isBest && <div style={{ fontSize: '0.65rem', color: 'var(--green)', marginTop: '2px' }}>Best value</div>}
              </div>
            )
          })}
        </div>
        <a
          href={article.affiliate}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{
            display: 'block',
            width: '100%',
            background: 'var(--green)',
            color: '#000',
            padding: '12px',
            borderRadius: '7px',
            textAlign: 'center',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Claim Best Odds at {article.affiliate_name} →
        </a>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px', marginBottom: 0 }}>
          18+ | Gamble responsibly | T&Cs apply
        </p>
      </div>

      {/* Article content */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      {/* Bottom CTA */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '1.5rem',
        marginTop: '2.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Ready to place your bet?
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Get the best odds and a welcome bonus at {article.affiliate_name}
        </p>
        <a href={article.affiliate} target="_blank" rel="noopener noreferrer sponsored" style={{
          display: 'inline-block',
          background: 'var(--green)',
          color: '#000',
          padding: '10px 28px',
          borderRadius: '7px',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          Bet at {article.affiliate_name} →
        </a>
      </div>
    </div>
  )
}
