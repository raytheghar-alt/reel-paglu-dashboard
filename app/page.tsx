import reels from '@/data/reels.json'

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

export default function Home() {
  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = reels.filter(r => r.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <main style={{ background: '#fafafa', color: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        padding: '2rem 2.5rem',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'lowercase' }}>
          reel paglu
        </span>
        <span style={{ fontSize: '0.65rem', color: '#999', letterSpacing: '0.06em' }}>
          rahul + peeyush + ray
        </span>
      </header>

      {/* Hero */}
      <section style={{
        padding: '5rem 2.5rem 3rem',
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
      }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
          pipeline tracker
        </span>
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontWeight: 400,
          fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginTop: '1rem',
        }}>
          reels in <em style={{ fontStyle: 'italic', color: '#999' }}>motion.</em>
        </h1>
        <p style={{ fontSize: '0.7rem', color: '#999', lineHeight: 1.9, marginTop: '1.25rem', maxWidth: '44ch' }}>
          topic in, video out. every reel tracked from script to post.
        </p>
      </section>

      {/* Status counters */}
      <section style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '0 2.5rem 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '1rem',
      }}>
        {STATUS_ORDER.map(s => (
          <div key={s} style={{
            borderTop: `2px solid ${STATUS_CONFIG[s].dot}`,
            paddingTop: '1rem',
          }}>
            <div style={{ fontSize: '1.5rem', fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
              {counts[s]}
            </div>
            <div style={{ fontSize: '0.55rem', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
              {STATUS_CONFIG[s].label}
            </div>
          </div>
        ))}
      </section>

      {/* Reel list */}
      <section style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '0 2.5rem 6rem',
        borderTop: '1px solid #f0f0f0',
      }}>
        <div style={{ paddingTop: '3rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {reels.map((reel, i) => {
            const status = STATUS_CONFIG[reel.status] ?? { label: reel.status, dot: '#999' }
            return (
              <div key={reel.id} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '2rem',
                padding: '2.5rem 0',
                borderBottom: '1px solid #f0f0f0',
              }}>
                {/* Number */}
                <div style={{ paddingTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ccc' }}>
                    #{String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div>
                  {/* Status + date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#999',
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: status.dot, display: 'inline-block' }} />
                      {status.label}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: '#ccc' }}>{reel.date}</span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontWeight: 400,
                    fontSize: '1.6rem',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                    marginBottom: '0.5rem',
                  }}>
                    {reel.title}
                  </h2>

                  {/* Topic */}
                  <p style={{ fontSize: '0.7rem', color: '#999', lineHeight: 1.8, maxWidth: '52ch' }}>
                    {reel.topic}
                  </p>

                  {/* Notes */}
                  {reel.notes && (
                    <p style={{ fontSize: '0.6rem', color: '#bbb', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      {reel.notes}
                    </p>
                  )}

                  {/* Links */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
                    {reel.videoLink && (
                      <a href={reel.videoLink} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.08em',
                        color: '#0a0a0a',
                        textDecoration: 'none',
                        borderBottom: '1px solid #0a0a0a',
                        paddingBottom: '1px',
                      }}>
                        video ↗
                      </a>
                    )}
                    {reel.audioLink && (
                      <a href={reel.audioLink} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.08em',
                        color: '#0a0a0a',
                        textDecoration: 'none',
                        borderBottom: '1px solid #0a0a0a',
                        paddingBottom: '1px',
                      }}>
                        audio ↗
                      </a>
                    )}
                    {reel.brollLinks.map((link, j) => (
                      <a key={j} href={link} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.08em',
                        color: '#999',
                        textDecoration: 'none',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '1px',
                      }}>
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

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 2.5rem',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
      }}>
        <span style={{ fontSize: '0.6rem', color: '#ccc', letterSpacing: '0.06em' }}>reel paglu — 2026</span>
        <span style={{ fontSize: '0.6rem', color: '#ccc', letterSpacing: '0.06em' }}>built by ray</span>
      </footer>

    </main>
  )
}
