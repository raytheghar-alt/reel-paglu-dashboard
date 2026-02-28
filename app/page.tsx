'use client'

import { useState } from 'react'
import reelsData from '@/data/reels.json'
import rulesData from '@/data/rules.json'

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  pending_script: { label: 'todo',     dot: '#555' },
  script_done:    { label: 'script',   dot: '#6b8cff' },
  audio_done:     { label: 'audio',    dot: '#a78bfa' },
  video_done:     { label: 'video',    dot: '#f59e0b' },
  editing:        { label: 'editing',  dot: '#f97316' },
  posted:         { label: 'posted',   dot: '#22c55e' },
  scrapped:       { label: 'scrapped', dot: '#ef4444' },
}

const KANBAN_COLS = [
  { key: 'pending_script', label: 'todo' },
  { key: 'script_done',    label: 'script' },
  { key: 'audio_done',     label: 'audio' },
  { key: 'video_done',     label: 'video' },
  { key: 'editing',        label: 'editing' },
]

const STATUS_ORDER = [...KANBAN_COLS.map(c => c.key), 'posted']

const RULE_STATUS_COLOR: Record<string, string> = {
  proven:   '#22c55e',
  active:   '#6b8cff',
  learning: '#f59e0b',
}

export default function Home() {
  const [rulesOpen, setRulesOpen] = useState(false)

  const postedReels = reelsData.filter(r => r.status === 'posted' && r.stats)
  const activeReels = reelsData.filter(r => r.status !== 'posted')
  const totalViews   = postedReels.reduce((a, r) => a + (r.stats?.views   ?? 0), 0)
  const totalShares  = postedReels.reduce((a, r) => a + (r.stats?.shares  ?? 0), 0)
  const totalSaves   = postedReels.reduce((a, r) => a + (r.stats?.saves   ?? 0), 0)
  const avgShareRate = totalViews > 0 ? ((totalShares / totalViews) * 100).toFixed(1) : '0'

  const link = (muted = false) => ({
    fontSize: '0.6rem', letterSpacing: '0.08em',
    color: muted ? 'var(--muted)' : 'var(--fg)',
    textDecoration: 'none' as const,
    borderBottom: `1px solid ${muted ? 'var(--faint)' : 'var(--fg)'}`,
    paddingBottom: '1px',
  })

  const KanbanCard = ({ reel }: { reel: typeof reelsData[0] }) => (
    <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1rem' }}>
      <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.3, marginBottom: '0.4rem' }}>{reel.title}</p>
      <p style={{ fontSize: '0.58rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.6rem' }}>{reel.topic}</p>
      {reel.notes && <p style={{ fontSize: '0.55rem', color: 'var(--faint)', fontStyle: 'italic', marginBottom: '0.6rem' }}>{reel.notes}</p>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.55rem', color: 'var(--faint)' }}>{reel.date}</span>
        {reel.duration && <span style={{ fontSize: '0.55rem', color: 'var(--faint)' }}>{reel.duration}s</span>}
      </div>
      {(reel.videoLink || (reel.brollLinks?.length ?? 0) > 0) && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const }}>
          {reel.videoLink && <a href={reel.videoLink} target="_blank" rel="noopener noreferrer" style={link()}>video ↗</a>}
          {reel.brollLinks?.slice(0, 2).map((l, j) => <a key={j} href={l} target="_blank" rel="noopener noreferrer" style={link(true)}>b-roll {j + 1} ↗</a>)}
        </div>
      )}
    </div>
  )

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Geist Mono', monospace", fontWeight: 300 }}>

      {/* Header */}
      <header style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>reel paglu</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>rahul + peeyush + ray</span>
      </header>

      {/* Hero */}
      <section style={{ padding: '4rem 2.5rem 2rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>pipeline tracker</span>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.02em', marginTop: '0.75rem' }}>
          reels in <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>motion.</em>
        </h1>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 2.5rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'total views',    value: totalViews.toLocaleString() },
          { label: 'total shares',   value: totalShares.toLocaleString() },
          { label: 'total saves',    value: totalSaves.toLocaleString() },
          { label: 'avg share rate', value: `${avgShareRate}%` },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.6rem', fontWeight: 400 }}>{stat.value}</div>
            <div style={{ fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ── KANBAN — Active Pipeline ── */}
      <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 2.5rem 2rem' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.2rem' }}>active pipeline</span>
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{activeReels.length} reel{activeReels.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${KANBAN_COLS.length}, minmax(180px, 1fr))`, gap: '1rem', overflowX: 'auto' }}>
          {KANBAN_COLS.map(col => {
            const colReels = reelsData.filter(r => r.status === col.key)
            return (
              <div key={col.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: `2px solid ${STATUS_CONFIG[col.key].dot}` }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>{col.label}</span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--faint)', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '999px', padding: '0 0.4rem', lineHeight: '1.6' }}>{colReels.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {colReels.length === 0
                    ? <div style={{ border: '1px dashed var(--border)', borderRadius: '8px', padding: '1rem', fontSize: '0.6rem', color: 'var(--faint)', textAlign: 'center' as const }}>empty</div>
                    : colReels.map(reel => <KanbanCard key={reel.id} reel={reel} />)
                  }
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Posted — separate section ── */}
      <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 2.5rem 4rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.2rem' }}>posted</span>
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{postedReels.length} reel{postedReels.length !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {reelsData.filter(r => r.status === 'posted').map((reel, i, arr) => (
            <div key={reel.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '2rem', padding: '1.75rem 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ paddingTop: '0.15rem' }}>
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--faint)' }}>#{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' as const, marginBottom: '0.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.55rem', color: '#22c55e' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                    posted
                  </span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--faint)' }}>{reel.date}</span>
                  {reel.duration && <span style={{ fontSize: '0.55rem', color: 'var(--faint)' }}>{reel.duration}s</span>}
                </div>
                <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: '1.3rem', letterSpacing: '-0.01em', lineHeight: 1.15, marginBottom: '0.35rem' }}>{reel.title}</h2>
                <p style={{ fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '52ch', marginBottom: '0.35rem' }}>{reel.topic}</p>
                {reel.notes && <p style={{ fontSize: '0.6rem', color: 'var(--faint)', fontStyle: 'italic' }}>{reel.notes}</p>}
                {reel.stats && (
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '1.25rem', marginTop: '1rem', padding: '0.875rem', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                    {[
                      { label: 'views',        value: reel.stats.views.toLocaleString() },
                      { label: 'likes',        value: reel.stats.likes.toLocaleString() },
                      { label: 'shares',       value: reel.stats.shares.toLocaleString() },
                      { label: 'saves',        value: reel.stats.saves.toLocaleString() },
                      { label: 'interactions', value: reel.stats.interactions.toLocaleString() },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1rem', fontWeight: 400 }}>{s.value}</div>
                        <div style={{ fontSize: '0.48rem', color: 'var(--faint)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules Drawer */}
      <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 2.5rem 4rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ paddingTop: '2.5rem' }}>
          <button onClick={() => setRulesOpen(!rulesOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: 0, width: '100%', textAlign: 'left' as const, color: 'var(--fg)' }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: '1.2rem' }}>Ray&apos;s {rulesData.length} rules for growth</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'inline-block', transform: rulesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
          </button>
          <p style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: '0.4rem' }}>learned from your data. updated every 10 reels.</p>
          {rulesOpen && (
            <div style={{ marginTop: '2rem' }}>
              {rulesData.map((rule, i) => (
                <div key={rule.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1.5rem', padding: '1.5rem 0', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--faint)', paddingTop: '0.1rem' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: RULE_STATUS_COLOR[rule.status] ?? '#999', display: 'inline-block' }} />
                      <span style={{ fontSize: '0.55rem', color: 'var(--faint)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{rule.status}</span>
                    </div>
                    <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1rem', fontWeight: 400, lineHeight: 1.3, marginBottom: '0.35rem' }}>{rule.rule}</p>
                    <p style={{ fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.8 }}>{rule.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: '0.6rem', color: 'var(--faint)', letterSpacing: '0.06em' }}>reel paglu — 2026</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--faint)', letterSpacing: '0.06em' }}>built by ray</span>
      </footer>

    </main>
  )
}
