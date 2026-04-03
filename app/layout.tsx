import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'OddsEdge — Premier League Betting Tips & Best Odds',
    template: '%s | OddsEdge',
  },
  description: 'AI-powered Premier League betting tips, best odds comparison and exclusive bonus offers.',
  openGraph: { siteName: 'OddsEdge', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{
          background:'var(--surface)',borderBottom:'1px solid var(--border)',
          padding:'0 1.5rem',display:'flex',alignItems:'center',
          justifyContent:'space-between',height:'56px',
          position:'sticky',top:0,zIndex:100,
        }}>
          <a href="/" style={{
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,
            fontSize:'1.5rem',letterSpacing:'0.06em',textTransform:'uppercase',
            color:'var(--green)',
          }}>Odds<span style={{color:'var(--text)'}}>Edge</span></a>
          <div style={{display:'flex',gap:'1.5rem',fontSize:'0.9rem',color:'var(--text-muted)'}}>
            <a href="/" style={{transition:'color .2s'}}>Previews</a>
            <a href="/bonuses" style={{transition:'color .2s'}}>Bonuses</a>
          </div>
        </nav>
        <main style={{minHeight:'calc(100vh - 56px)'}}>{children}</main>
        <footer style={{
          background:'var(--surface)',borderTop:'1px solid var(--border)',
          padding:'2rem 1.5rem',textAlign:'center',
          color:'var(--text-muted)',fontSize:'0.8rem',lineHeight:1.8,
        }}>
          <p>© {new Date().getFullYear()} OddsEdge. For entertainment purposes only.</p>
          <p>Gambling can be addictive. Please play responsibly. 18+ only.</p>
        </footer>
      </body>
    </html>
  )
}
