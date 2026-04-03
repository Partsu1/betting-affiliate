import { getAllArticles, ArticleMeta } from '@/lib/articles'
import { format } from 'date-fns'
import Link from 'next/link'

function OddsBar({ home, draw, away, affiliate, affiliateName }: {
  home:string; draw:string; away:string; affiliate:string; affiliateName:string
}) {
  const best = Math.max(parseFloat(home), parseFloat(draw), parseFloat(away))
  const items = [{ label:'Home', val:home },{ label:'Draw', val:draw },{ label:'Away', val:away }]
  return (
    <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
      {items.map(({label,val}) => (
        <div key={label} style={{
          background:parseFloat(val)===best?'var(--green-bg)':'var(--surface2)',
          border:`1px solid ${parseFloat(val)===best?'var(--border-bright)':'var(--border)'}`,
          borderRadius:'6px',padding:'6px 12px',textAlign:'center',minWidth:'72px',
        }}>
          <div style={{fontSize:'0.7rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{label}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:'1.4rem',fontWeight:700,color:parseFloat(val)===best?'var(--green)':'var(--text)'}}>{val}</div>
        </div>
      ))}
      <Link href={affiliate} target="_blank" rel="noopener noreferrer sponsored" style={{
        marginLeft:'auto',background:'var(--green)',color:'#000',
        padding:'8px 16px',borderRadius:'6px',
        fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
        fontSize:'0.95rem',letterSpacing:'0.04em',textTransform:'uppercase',whiteSpace:'nowrap',
      }}>Bet at {affiliateName} →</Link>
    </div>
  )
}

function ArticleCard({ article, featured }: { article:ArticleMeta; featured?:boolean }) {
  const kickoff = new Date(article.kickoff)
  const isUpcoming = kickoff > new Date()
  return (
    <div style={{
      background:'var(--surface)',
      border:`1px solid ${featured?'var(--border-bright)':'var(--border)'}`,
      borderRadius:'10px',padding:featured?'1.5rem':'1.25rem',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'0.6rem'}}>
        {isUpcoming && <span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'0.72rem',color:'var(--green)',textTransform:'uppercase',letterSpacing:'0.06em'}}><span className="live-dot"/> Upcoming</span>}
        <span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{format(kickoff,'EEE d MMM · HH:mm')}</span>
        <span style={{fontSize:'0.75rem',color:'var(--text-muted)',marginLeft:'auto'}}>{article.league}</span>
      </div>
      <Link href={`/articles/${article.slug}`} style={{display:'block',marginBottom:'0.75rem'}}>
        <h2 style={{fontSize:featured?'1.6rem':'1.25rem',color:'var(--text)',margin:0}}>{article.title}</h2>
      </Link>
      <p style={{fontSize:'0.875rem',color:'var(--text-muted)',marginBottom:'1rem',lineHeight:1.5}}>{article.meta}</p>
      <OddsBar home={article.odds_home} draw={article.odds_draw} away={article.odds_away} affiliate={article.affiliate} affiliateName={article.affiliate_name}/>
    </div>
  )
}

export default function HomePage() {
  const articles = getAllArticles()
  const featured = articles.find(a => a.featured) || articles[0]
  const rest = articles.filter(a => a.slug !== featured?.slug)
  return (
    <div style={{maxWidth:'820px',margin:'0 auto',padding:'2rem 1.5rem'}}>
      <div style={{marginBottom:'2.5rem'}}>
        <h1 style={{fontSize:'2.2rem',marginBottom:'0.4rem'}}>Premier League <span style={{color:'var(--green)'}}>Betting Tips</span></h1>
        <p style={{color:'var(--text-muted)',fontSize:'0.95rem'}}>AI-generated previews with real-time odds. Updated automatically before every match.</p>
      </div>
      {featured && (
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{fontSize:'0.75rem',color:'var(--green)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.75rem'}}>★ Featured Preview</div>
          <ArticleCard article={featured} featured/>
        </div>
      )}
      {rest.length > 0 && (
        <>
          <div style={{fontSize:'0.75rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'1rem',marginTop:'2rem'}}>Latest Previews</div>
          <div style={{display:'grid',gap:'12px'}}>
            {rest.map(article => <ArticleCard key={article.slug} article={article}/>)}
          </div>
        </>
      )}
      <div style={{marginTop:'3rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'10px',padding:'1.25rem',fontSize:'0.8rem',color:'var(--text-muted)',lineHeight:1.7}}>
        <strong style={{color:'var(--text)'}}>Affiliate disclosure:</strong> Some links on this page are affiliate links. We may earn a commission at no extra cost to you.
      </div>
    </div>
  )
}
