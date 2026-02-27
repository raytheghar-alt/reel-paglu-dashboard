import reels from '@/data/reels.json'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending_script: { label: 'Pending Script', color: 'bg-gray-700 text-gray-300' },
  script_done: { label: 'Script Done', color: 'bg-blue-900 text-blue-300' },
  audio_done: { label: 'Audio Done', color: 'bg-purple-900 text-purple-300' },
  video_done: { label: 'Video Done', color: 'bg-yellow-900 text-yellow-300' },
  editing: { label: 'Editing', color: 'bg-orange-900 text-orange-300' },
  posted: { label: 'Posted ✓', color: 'bg-green-900 text-green-300' },
}

const STATUS_ORDER = ['pending_script', 'script_done', 'audio_done', 'video_done', 'editing', 'posted']

export default function Home() {
  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = reels.filter(r => r.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans px-6 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">🎬 Reel Paglu</h1>
        <p className="text-gray-400 mt-1 text-sm">Rahul + Peeyush + Ray — Full AI reel pipeline</p>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10">
        {STATUS_ORDER.map(s => (
          <div key={s} className="bg-[#111] rounded-xl p-4 text-center border border-white/5">
            <div className="text-2xl font-bold">{counts[s]}</div>
            <div className="text-xs text-gray-500 mt-1">{STATUS_CONFIG[s].label}</div>
          </div>
        ))}
      </div>

      {/* Reel list */}
      <div className="space-y-4">
        {reels.map(reel => {
          const status = STATUS_CONFIG[reel.status] ?? { label: reel.status, color: 'bg-gray-700 text-gray-300' }
          return (
            <div key={reel.id} className="bg-[#111] border border-white/5 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-500">#{reel.id}</span>
                    <h2 className="font-semibold text-white">{reel.title}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{reel.topic}</p>
                  {reel.notes && <p className="text-xs text-gray-600 mt-1 italic">{reel.notes}</p>}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">{reel.date}</div>
              </div>

              {/* Links */}
              <div className="mt-4 flex flex-wrap gap-3">
                {reel.videoLink && (
                  <a href={reel.videoLink} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-white/5 hover:bg-white/10 transition px-3 py-1.5 rounded-lg text-gray-300">
                    🎬 Video
                  </a>
                )}
                {reel.audioLink && (
                  <a href={reel.audioLink} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-white/5 hover:bg-white/10 transition px-3 py-1.5 rounded-lg text-gray-300">
                    🎙️ Audio
                  </a>
                )}
                {reel.brollLinks.map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-white/5 hover:bg-white/10 transition px-3 py-1.5 rounded-lg text-gray-300">
                    📹 B-Roll {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-700 mt-12">Updated by Ray on every pipeline run</p>
    </main>
  )
}
