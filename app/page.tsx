'use client'

import { useState } from 'react'
import reelsData from '@/data/reels.json'
import rulesData from '@/data/rules.json'

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  pending_script: { label: 'pending script', dot: '#555' },
  script_done:    { label: 'script done',    dot: '#6b8cff' },
  audio_done:     { label: 'audio done',     dot: '#a78bfa' },
  video_done:     { label: 'video done',     dot: '#f59e0b' },
  editing:        { label: 'editing',        dot: '#f97316' },
  posted:         { label: 'posted',         dot: '#22c55e' },
  scrapped:       { label: 'scrapped',       dot: '#ef4444' },
}

const STATUS_ORDER = ['pending_script', 'script_done', 'audio_done', 'video_done', 'editing', 'posted']

const RULE_STATUS_COLOR: Record<string, string> = {
  proven:  '#22c55e',
  active:  '#6b8cff',
  learning: '#f59e0b',
}

export default function Home() {
  const [rulesOpen, setRulesOpen] = useState(false)

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = reelsData.filter(r => r.status === s).length
    return acc
  }, {} as Record<string, number>)

  const postedReels = reelsData.filter(r => r.status === 'posted' && r.stats)
  const totalViews = postedReels.reduce((a, r) => a + (r.stats?.views ?? 0), 0)
  const totalShares = postedReels.reduce((a, r) => a + (r.stats?.shares ?? 0), 0)
  const totalSaves = postedReels.reduce((a, r) => a + (r.stats?.saves ?? 0), 0)
  const avgShareRate = totalViews > 0 ? ((totalShares / totalViews) * 100).toFixed(1) : '0'

  return (
    <main style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Geist Mono', monospace", fontWeight: 300 }}>

      {/* Header */}
      <header style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>reel paglu</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>rahul + peeyush + ray</span>
      </header>

      {/* Hero */}
      <section style={{ padding: '5rem 2.5rem 3rem', maxWidth: '900px', width: '100%', margin: '0 auto' }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>pipeline tracker</span>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em', marginTop: '1rem' }}>
          reels in <em style={{ fontStyle: 'italic', color: 'var(--muted)' }}>motion.</em>
        </h1>
        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.9, marginTop: '1.25rem', maxWidth: '44ch' }}>
          topic in, video out. every reel tracked from script to post.
        </p>
      </section>

      {/* Status counters */}
      <section style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '0 2.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
        {STATUS_ORDER.map(s => (
          <div key={s} style={{ borderTop: `2px solid ${STATUS_CONFIG[s].dot}`, paddingTop: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>{counts[s]}</div>
            <div style={{ fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{STATUS_CONFIG[s].label}</div>
          </div>
        ))}
      </section>

      {/* Aggregate stats */}
      <section style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '0 2.5rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'total views', value: totalViews.toLocaleString() },
          { label: 'total shares', value: totalShares.toLocaleString() },
          { label: 'total saves', value: totalSaves.toLocaleString() },
          { label: 'avg share rate', value: `${avgShareRate}%` },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.6rem', fontWeight: 400 }}>{stat.value}</div>
            <div style={{ fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Reel list */}
      <section style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '0 2.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ paddingTop: '3rem', display: 'flex', flexDirection: 'column' }}>
          {reelsData.map((reel, i) => {
            const status = STATUS_CONFIG[reel.status] ?? { label: reel.status, dot: '#999' }
            return (
              <div key={reel.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', padding: '2.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ paddingTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--faint)' }}>#{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: status.dot, display: 'inline-block' }} />
                      {status.label}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--faint)' }}>{reel.date}</span>
                    {reel.duration && <span style={{ fontSize: '0.6rem', color: 'var(--faint)' }}>{reel.duration}s</span>}
                  </div>

                  <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: '1.6rem', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                    {reel.title}
                  </h2>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '52ch' }}>{reel.topic}</p>
                  {reel.notes && <p style={{ fontSize: '0.6rem', color: 'var(--faint)', marginTop: '0.5rem', fontStyle: 'italic' }}>{reel.notes}</p>}

                  {/* Stats */}
                  {reel.stats && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1.25rem', padding: '1rem', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                      {[
                        { label: 'views', value: reel.stats.views.toLocaleString() },
                        { label: 'likes', value: reel.stats.likes.toLocaleString() },
                        { label: 'shares', value: reel.stats.shares.toLocaleString() },
                        { label: 'saves', value: reel.stats.saves.toLocaleString() },
                        { label: 'interactions', value: reel.stats.interactions.toLocaleString() },
                      ].map(s => (
                        <div key={s.label}>
                          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.1rem', fontWeight: 400 }}>{s.value}</div>
                          <div style={{ fontSize: '0.5rem', color: 'var(--faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                    {reel.videoLink && (
                      <a href={reel.videoLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--fg)', textDecoration: 'none', borderBottom: '1px solid var(--fg)', paddingBottom: '1px' }}>
                        video ↗
                      </a>
                    )}
                    {reel.audioLink && (
                      <a href={reel.audioLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--fg)', textDecoration: 'none', borderBottom: '1px solid var(--fg)', paddingBottom: '1px' }}>
                        audio ↗
                      </a>
                    )}
                    {reel.brollLinks.map((l, j) => (
                      <a key={j} href={l} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--faint)', paddingBottom: '1px' }}>
                        b-roll {j + 1} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Rules Drawer */}
      <section style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '3rem 2.5rem' }}>
        <button
          onClick={() => setRulesOpen(!rulesOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: 0, width: '100%', textAlign: 'left', color: 'var(--fg)' }}
        >
          <span style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: '1.4rem' }}>
            Ray&apos;s {rulesData.length} rules for growth
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'inline-block', transform: rulesOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▾</span>
        </button>
        <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          learned from your data. updated every 10 reels.
        </p>

        {rulesOpen && (
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
            {rulesData.map((rule, i) => (
              <div key={rule.id} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1.5rem', padding: '1.75rem 0', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--faint)', paddingTop: '0.15rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: RULE_STATUS_COLOR[rule.status] ?? '#999', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.55rem', color: 'var(--faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{rule.status}</span>
                  </div>
                  <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: '1.05rem', fontWeight: 400, lineHeight: 1.3, marginBottom: '0.4rem' }}>{rule.rule}</p>
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
