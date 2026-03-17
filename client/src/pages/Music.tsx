import { useState } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { useSpotify } from '../hooks/useSpotify'
import { usePlayerStore } from '../store/playerStore'

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-[#1a1a1a] animate-pulse rounded ${className}`} />
}

export default function Music() {
  const { artist, topTracks, albums, loading } = useSpotify()
  const { setTrack } = usePlayerStore()
  const [filter, setFilter] = useState<'tous' | 'singles' | 'collaborations'>('tous')

  const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`

  const filteredTracks = topTracks.filter(t => {
    if (filter === 'tous') return true
    if (filter === 'singles') return t.album?.album_type === 'single'
    if (filter === 'collaborations') return t.name?.toLowerCase().includes('feat') || t.artists?.length > 1
    return true
  })

  return (
    <PageWrapper>
      {/* HERO */}
      <section className="h-[40vh] flex flex-col items-center justify-center bg-[#080808] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080808]" />
        <motion.div className="text-center relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-bebas text-white text-[10vw] leading-none">DISCOGRAPHIE</h1>
          <p className="text-[#C0392B] tracking-[0.4em] text-sm mt-2">2013 — 2024</p>
        </motion.div>
      </section>

      {/* SPOTIFY PLAYLIST HEADER */}
      <section className="py-12 bg-gradient-to-b from-[#161616] to-[#080808]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
          {loading ? (
            <>
              <Skeleton className="w-40 h-40" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </>
          ) : (
            <>
              <img
                src={artist?.images?.[0]?.url || 'https://picsum.photos/seed/vanobaby/160/160'}
                alt="Vano Baby"
                className="w-40 h-40 rounded shadow-2xl object-cover"
              />
              <div>
                <p className="text-[#999] text-xs uppercase tracking-widest">Artiste</p>
                <h2 className="font-bebas text-white text-5xl mt-1">VANO BABY — TOP TRACKS</h2>
                <p className="text-[#666] text-sm mt-1">
                  {artist?.followers?.total ? `${artist.followers.total.toLocaleString('fr-FR')} auditeurs mensuels` : '800K+ auditeurs'}
                </p>
                <p className="text-[#555] text-xs mt-1">{topTracks.length} titres</p>
                <div className="flex gap-3 mt-4">
                  {topTracks.length > 0 && (
                    <button
                      onClick={() => setTrack({ id: 0, title: topTracks[0].name, audioUrl: '', duration: 0, previewUrl: topTracks[0].preview_url, album: { title: topTracks[0].album?.name, coverUrl: topTracks[0].album?.images?.[0]?.url } }, topTracks.map((t: any) => ({ id: t.id || 0, title: t.name, audioUrl: '', duration: t.duration_ms / 1000, previewUrl: t.preview_url, album: { title: t.album?.name, coverUrl: t.album?.images?.[0]?.url } })))}
                      className="w-14 h-14 rounded-full bg-[#C0392B] hover:bg-[#E74C3C] flex items-center justify-center text-white text-xl transition-colors"
                    >▶</button>
                  )}
                  <a
                    href={`https://open.spotify.com/artist/6VxXJZxxq0cmpBvbVM8p0E`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-black rounded-full text-sm transition-colors font-medium"
                  >
                    <span>🟢</span> Ouvrir sur Spotify
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FILTER TABS */}
      <div className="max-w-5xl mx-auto px-6 mb-4">
        <div className="flex gap-2">
          {(['tous', 'singles', 'collaborations'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-semibold transition-colors ${filter === f ? 'bg-[#C0392B] text-white' : 'text-[#999] hover:text-white border border-[#333]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TRACKLIST */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <div className="border border-[#222] rounded overflow-hidden">
          <div className="grid grid-cols-[32px_1fr_200px_80px] gap-3 px-4 py-2 text-[#555] text-xs uppercase tracking-widest border-b border-[#222]">
            <span>#</span><span>TITRE</span><span>ALBUM</span><span className="text-right">⏱</span>
          </div>
          {loading ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[32px_1fr_200px_80px] gap-3 px-4 py-3 border-b border-[#222]/50">
              <Skeleton className="h-4 w-4" /><Skeleton className="h-4" /><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-10 ml-auto" />
            </div>
          )) : filteredTracks.map((t: any, i: number) => (
            <div
              key={t.id}
              onClick={() => {
                if (t.preview_url) {
                  setTrack({ id: i, title: t.name, audioUrl: '', duration: t.duration_ms / 1000, previewUrl: t.preview_url, album: { title: t.album?.name, coverUrl: t.album?.images?.[0]?.url } })
                } else {
                  window.open(t.external_urls?.spotify, '_blank')
                }
              }}
              className="grid grid-cols-[32px_1fr_200px_80px] gap-3 px-4 py-3 border-b border-[#222]/50 hover:bg-[#1a1a1a] cursor-pointer group items-center"
            >
              <span className="text-[#555] text-sm group-hover:text-[#C0392B]">{i + 1}</span>
              <div className="flex items-center gap-3 min-w-0">
                <img src={t.album?.images?.[2]?.url || t.album?.images?.[0]?.url} alt="" className="w-9 h-9 object-cover rounded" />
                <div className="min-w-0">
                  <p className="text-white text-sm truncate">{t.name}</p>
                  <p className="text-[#555] text-xs">Vano Baby{t.artists?.length > 1 ? ` ft. ${t.artists.slice(1).map((a: any) => a.name).join(', ')}` : ''}</p>
                </div>
              </div>
              <p className="text-[#555] text-sm truncate">{t.album?.name}</p>
              <p className="text-[#555] text-xs text-right">{fmt(t.duration_ms)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALBUMS GRID */}
      <section className="py-12 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest mb-8">ALBUMS</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {albums.map((al: any) => (
                <a key={al.id} href={al.external_urls?.spotify} target="_blank" rel="noreferrer" className="group relative block">
                  <div className="relative overflow-hidden rounded">
                    <img src={al.images?.[0]?.url} alt={al.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 flex items-center justify-center transition-all duration-300">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs tracking-widest font-semibold transition-opacity">Ouvrir sur Spotify</span>
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C0392B] rounded transition-colors duration-200 pointer-events-none" />
                  </div>
                  <h3 className="font-bebas text-white text-lg mt-2 tracking-wider truncate">{al.name}</h3>
                  <p className="text-[#C0392B] text-xs">{new Date(al.release_date).getFullYear()}</p>
                  <span className="text-[#555] text-xs">{al.total_tracks} titres</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STREAMING PLATFORMS */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-10">PLATEFORMES DE STREAMING</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Spotify', url: 'https://open.spotify.com/artist/6VxXJZxxq0cmpBvbVM8p0E' },
              { name: 'Apple Music', url: '#' },
              { name: 'YouTube Music', url: '#' },
              { name: 'Deezer', url: '#' },
              { name: 'Audiomack', url: '#' },
              { name: 'Boomplay', url: '#' },
            ].map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="bg-[#161616] border border-[#222] px-6 py-4 flex items-center justify-between group hover:border-[#C0392B] transition-colors">
                <span className="text-white font-medium">{p.name}</span>
                <span className="text-[#C0392B] group-hover:translate-x-1 transition-transform">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO CLIP */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-8">CLIP VIDÉO</h2>
          <div className="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center group cursor-pointer border border-[#222] hover:border-[#C0392B] transition-colors">
            <div className="absolute inset-0 bg-[#080808]" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-full border-2 border-[#C0392B] flex items-center justify-center text-[#C0392B] text-2xl group-hover:bg-[#C0392B] group-hover:text-white transition-colors mx-auto">▶</div>
              <p className="text-white font-semibold mt-4">VANO BABY — DIYO (CLIP OFFICIEL)</p>
              {/* TODO: replace with official YouTube embed URL */}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
