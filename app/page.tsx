'use client'

import { useState, useMemo } from 'react'
import reelsData from '@/data/reels.json'
import rulesData from '@/data/rules.json'

const CONTENT_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  useful:        { label: 'useful',        color: '#6b8cff', bg: 'rgba(107,140,255,0.08)' },
  news:          { label: 'news',          color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  bookmark:      { label: 'bookmark',      color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  entertainment: { label: 'entertainment', color: '#22c55e', bg: 'rgba(34,197,94,0.08)'   },
}

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

const RULE_STATUS_COLOR: Record<string, string> = {
  proven:   '#22c55e',
  active:   '#6b8cff',
  learning: '#f59e0b',
}

type SortKey = 'date_desc' | 'date_asc' | 'views_desc' | 'views_asc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date_desc',  label: 'newest first' },
  { key: 'date_asc',   label: 'oldest first' },
  { key: 'views_desc', label: 'most views' },
  { key: 'views_asc',  label: 'least views' },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
    >
      <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SectionHeader({
  title, subtitle, open, onToggle, right
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  open: boolean
  onToggle: () => void
  right?: React.ReactNode
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        color: 'var(--fg)', textAlign: 'left' as const,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: '1.2rem' }}>{title}</span>
        {subtitle && <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{subtitle}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--muted)', flexShrink: 0 }}>
        {right}
        <Chevron open={open} />
      </div>
    </button>
  )
}

export default function Home() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pipeline: true,
    posted: true,
    calendar: false,
    breakdown: false,
    rules: false,
  })
  const [sort, setSort] = useState<SortKey>('date_desc')

  const toggle = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))

  const sortedPosted = useMemo(() => {
    const posted = reelsData.filter(r => r.status === 'posted')
    return [...posted].sort((a, b) => {
      if (sort === 'date_desc')  return b.date.localeCompare(a.date)
      if (sort === 'date_asc')   return a.date.localeCompare(b.date)
      if (sort === 'views_desc') return (b.stats?.views ?? 0) - (a.stats?.views ?? 0)
      if (sort === 'views_asc')  return (a.stats?.views ?? 0) - (b.stats?.views ?? 0)
      return 0
    })
  }, [sort])

  const activeReels = reelsData.filter(r => r.status !== 'posted')
  const postedReels = reelsData.filter(r => r.status === 'posted' && r.stats)
  const totalViews  = postedReels.reduce((a, r) => a + (r.stats?.views  ?? 0), 0)
  const totalShares = postedReels.reduce((a, r) => a + (r.stats?.shares ?? 0), 0)
  const totalSaves  = postedReels.reduce((a, r) => a + (r.stats?.saves  ?? 0), 0)
  const avgShareRate = totalViews > 0 ? ((totalShares / totalViews) * 100).toFixed(1) : '0'

  // Cost calculations
  // ElevenLabs: eleven_turbo_v2_5 = 0.5 credits/char. Creator plan $22/mo = 100K credits → $0.00022/credit. ~500 chars/script = $0.055
  // HeyGen: Avatar IV = 1 credit per 10s. Pro plan $99/mo = 100 credits → $0.99/credit. ~30s reel = 3 credits = $2.97
  const COST_ELEVENLABS = 0.055
  const COST_HEYGEN = 2.97
  const COST_PER_REEL = COST_ELEVENLABS + COST_HEYGEN
  const allReels = reelsData.filter(r => r.status !== 'pending_script')
  const totalCost = (allReels.length * COST_PER_REEL).toFixed(2)
  const totalCostPosted = (postedReels.length * COST_PER_REEL).toFixed(2)

  const typeBreakdown = useMemo(() => {
    const map: Record<string, { count: number; views: number; saves: number; shares: number }> = {}
    for (const r of postedReels) {
      const t = (r as { content_type?: string }).content_type || 'uncategorized'
      if (!map[t]) map[t] = { count: 0, views: 0, saves: 0, shares: 0 }
      map[t].count++
      map[t].views  += r.stats?.views  ?? 0
      map[t].saves  += r.stats?.saves  ?? 0
      map[t].shares += r.stats?.shares ?? 0
    }
    return map
  }, [postedReels])

  const calendarReels = useMemo(() =>
    [...reelsData]
      .filter(r => r.status === 'posted')
      .sort((a, b) => b.date.localeCompare(a.date)),
    []
  )

  const linkStyle = (muted = false) => ({
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
          {reel.videoLink && <a href={reel.videoLink} target="_blank" rel="noopener noreferrer" style={linkStyle()}>video ↗</a>}
          {reel.brollLinks?.slice(0, 2).map((l, j) => <a key={j} href={l} target="_blank" rel="noopener noreferrer" style={linkStyle(true)}>b-roll {j + 1} ↗</a>)}
        </div>
      )}
    </div>
  )

  const sectionStyle = { maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '1.75rem 2.5rem', borderTop: '1px solid var(--border)' }

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

      {/* Cost Section */}
      <section style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 2.5rem 2rem' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.1rem' }}>cost per reel</span>
            <span style={{ fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>elevenlabs + heygen</span>
          </div>

          {/* Per reel breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'ElevenLabs / reel', value: `$${COST_ELEVENLABS.toFixed(3)}`, sub: 'turbo_v2_5 · ~500 chars · 0.5 cr/char', color: '#6b8cff' },
              { label: 'HeyGen / reel', value: `$${COST_HEYGEN.toFixed(2)}`, sub: 'Avatar IV · ~30s · 3 credits @ $0.99', color: '#a78bfa' },
              { label: 'Total / reel', value: `$${COST_PER_REEL.toFixed(2)}`, sub: '≈ ₹250 per reel', color: '#22c55e' },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.4rem', color: item.color }}>{item.value}</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginTop: '0.2rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.5rem', color: 'var(--faint)', marginTop: '0.3rem' }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Total spend */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' as const }}>
            {[
              { label: `total spent (${allReels.length} reels made)`, value: `$${totalCost}` },
              { label: `posted reels only (${postedReels.length})`, value: `$${totalCostPosted}` },
              { label: 'heygen plan', value: '$99 / mo', sub: '100 credits' },
              { label: 'elevenlabs plan', value: '$22 / mo', sub: '100K credits' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: '0.9rem', fontFamily: "'Instrument Serif', serif" }}>{item.value}</div>
                <div style={{ fontSize: '0.5rem', color: 'var(--faint)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginTop: '0.15rem' }}>{item.label}</div>
                {'sub' in item && <div style={{ fontSize: '0.48rem', color: 'var(--faint)' }}>{item.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Pipeline */}
      <section style={sectionStyle}>
        <SectionHeader
          title="active pipeline"
          subtitle={`${activeReels.length} reel${activeReels.length !== 1 ? 's' : ''}`}
          open={openSections.pipeline}
          onToggle={() => toggle('pipeline')}
        />
        {openSections.pipeline && (
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: `repeat(${KANBAN_COLS.length}, minmax(180px, 1fr))`, gap: '1rem', overflowX: 'auto' }}>
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
        )}
      </section>

      {/* Posted */}
      <section style={sectionStyle}>
        <SectionHeader
          title="posted"
          subtitle={`${sortedPosted.length} reel${sortedPosted.length !== 1 ? 's' : ''}`}
          open={openSections.posted}
          onToggle={() => toggle('posted')}
          right={openSections.posted ? (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' as const }} onClick={e => e.stopPropagation()}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => setSort(opt.key)} style={{
                  cursor: 'pointer', padding: '0.25rem 0.5rem',
                  fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                  color: sort === opt.key ? 'var(--fg)' : 'var(--faint)',
                  background: sort === opt.key ? 'var(--card)' : 'transparent',
                  border: `1px solid ${sort === opt.key ? 'var(--card-border)' : 'transparent'}`,
                  borderRadius: '6px', transition: 'all 0.15s',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          ) : undefined}
        />
        {openSections.posted && (
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1.5rem' }}>
            {sortedPosted.map((reel, i, arr) => (
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
                    {(() => {
                      const ct = (reel as { content_type?: string }).content_type
                      const cfg = ct ? CONTENT_TYPE_CONFIG[ct] : null
                      return cfg ? (
                        <span style={{ fontSize: '0.48rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`, borderRadius: '999px', padding: '0.1rem 0.45rem' }}>{cfg.label}</span>
                      ) : null
                    })()}
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
        )}
      </section>

      {/* Content Calendar */}
      <section style={sectionStyle}>
        <SectionHeader
          title="content calendar"
          subtitle="when + what type"
          open={openSections.calendar}
          onToggle={() => toggle('calendar')}
        />
        {openSections.calendar && (
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.875rem' }}>
            {calendarReels.map(reel => {
              const ct = (reel as { content_type?: string }).content_type || 'uncategorized'
              const cfg = CONTENT_TYPE_CONFIG[ct] ?? { label: ct, color: '#999', bg: 'rgba(150,150,150,0.08)' }
              return (
                <div key={reel.id} style={{ background: cfg.bg, border: `1px solid ${cfg.color}22`, borderRadius: '10px', padding: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.52rem', color: 'var(--faint)', letterSpacing: '0.08em' }}>{reel.date}</span>
                    <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}33`, borderRadius: '999px', padding: '0.1rem 0.45rem' }}>{cfg.label}</span>
                  </div>
                  <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: '0.85rem', fontWeight: 400, lineHeight: 1.25, marginBottom: '0.6rem' }}>{reel.title}</p>
                  {reel.stats && (
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.52rem', color: 'var(--muted)' }}>
                      <span>👁 {reel.stats.views.toLocaleString()}</span>
                      <span>💾 {reel.stats.saves}</span>
                      <span>📤 {reel.stats.shares}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Content Type Breakdown */}
      <section style={sectionStyle}>
        <SectionHeader
          title="content type breakdown"
          subtitle="what kind of account are you building?"
          open={openSections.breakdown}
          onToggle={() => toggle('breakdown')}
        />
        {openSections.breakdown && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {Object.entries(typeBreakdown).map(([type, stats]) => {
                const cfg = CONTENT_TYPE_CONFIG[type] ?? { label: type, color: '#999', bg: 'rgba(150,150,150,0.08)' }
                const pct = Math.round((stats.count / postedReels.length) * 100)
                return (
                  <div key={type} style={{ background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: '10px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: cfg.color }}>{cfg.label}</span>
                      <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.5rem', color: cfg.color }}>{stats.count}</span>
                    </div>
                    <div style={{ height: '3px', background: `${cfg.color}20`, borderRadius: '999px', marginBottom: '0.875rem' }}>
                      <div style={{ height: '3px', width: `${pct}%`, background: cfg.color, borderRadius: '999px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.3rem', fontSize: '0.55rem', color: 'var(--muted)' }}>
                      {[
                        { l: 'views',  v: stats.views.toLocaleString(),  c: 'var(--fg)' },
                        { l: 'saves',  v: stats.saves.toLocaleString(),  c: cfg.color   },
                        { l: 'shares', v: stats.shares.toLocaleString(), c: 'var(--fg)' },
                      ].map(({ l, v, c }) => (
                        <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{l}</span><span style={{ color: c, fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${cfg.color}22`, paddingTop: '0.3rem', marginTop: '0.1rem' }}>
                        <span>mix %</span><span style={{ color: cfg.color, fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Target mix */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '1rem' }}>target mix</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { type: 'useful', target: 40 },
                  { type: 'news', target: 30 },
                  { type: 'entertainment', target: 20 },
                  { type: 'bookmark', target: 10 },
                ].map(({ type, target }) => {
                  const cfg = CONTENT_TYPE_CONFIG[type]
                  const current = typeBreakdown[type] ? Math.round((typeBreakdown[type].count / postedReels.length) * 100) : 0
                  const diff = current - target
                  return (
                    <div key={type} style={{ textAlign: 'center' as const }}>
                      <div style={{ fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: cfg.color, marginBottom: '0.35rem' }}>{type}</div>
                      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.4rem', color: 'var(--fg)' }}>{current}%</div>
                      <div style={{ fontSize: '0.5rem', color: 'var(--faint)', marginTop: '0.15rem' }}>target {target}%</div>
                      {diff !== 0 && (
                        <div style={{ fontSize: '0.48rem', marginTop: '0.2rem', color: diff > 0 ? '#f59e0b' : '#6b8cff', fontWeight: 600 }}>
                          {diff > 0 ? `↑ ${diff}% over` : `↓ ${Math.abs(diff)}% under`}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Rules */}
      <section style={{ ...sectionStyle, paddingBottom: '4rem' }}>
        <SectionHeader
          title={<>Ray&apos;s {rulesData.length} rules for growth</>}
          subtitle="learned from your data. updated every 10 reels."
          open={openSections.rules}
          onToggle={() => toggle('rules')}
        />
        {openSections.rules && (
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
      </section>

      {/* Footer */}
      <footer style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: '0.6rem', color: 'var(--faint)', letterSpacing: '0.06em' }}>reel paglu — 2026</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--faint)', letterSpacing: '0.06em' }}>built by ray</span>
      </footer>

    </main>
  )
}
