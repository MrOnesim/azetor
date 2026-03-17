import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { usePlayerStore } from '../store/playerStore'
import axios from 'axios'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

function Countdown() {
  const target = new Date('2025-12-31T20:00:00').getTime()
  const [diff, setDiff] = useState(target - Date.now())

  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  return (
    <div className="flex gap-6 justify-center">
      {[['JOURS', d], ['HEURES', h], ['MINUTES', m], ['SECONDES', s]].map(([label, val]) => (
        <div key={label as string} className="text-center">
          <div className="font-bebas text-white text-5xl md:text-6xl">{String(val).padStart(2, '0')}</div>
          <div className="text-xs tracking-widest text-white/70 mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { setTrack } = usePlayerStore()
  const [topTracks, setTopTracks] = useState<any[]>([])
  const [concerts, setConcerts] = useState<any[]>([])
  const [latestAlbum, setLatestAlbum] = useState<any>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true })

  useEffect(() => {
    axios.get('/api/tracks/top').then(r => setTopTracks(r.data)).catch(() => {})
    axios.get('/api/events').then(r => setConcerts(r.data.filter((e: any) => e.status === 'upcoming').slice(0, 3))).catch(() => {})
    axios.get('/api/albums').then(r => setLatestAlbum(r.data[0])).catch(() => {})
  }, [])

  return (
    <PageWrapper>
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <img src="https://picsum.photos/seed/vanobaby/1920/1080" alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* TODO: replace with official Vano Baby press photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
        <div className="absolute inset-0 bg-[#C0392B]/5" />

        {/* Decorative 10 */}
        <div className="absolute bottom-0 right-0 font-bebas text-[28vw] leading-none text-white opacity-[0.04] pointer-events-none select-none">10</div>

        {/* Badge */}
        <div className="absolute top-24 left-6 border-l-2 border-[#C0392B] pl-3">
          <p className="text-white text-xs tracking-widest font-semibold">2014 — 2024 · 10 ANS DE RÈGNE</p>
          <p className="text-[#999] text-xs mt-0.5">Rappeur béninois · Azéto Gbèdé · Cotonou</p>
        </div>

        {/* Title */}
        <div className="absolute bottom-24 left-6 md:left-12">
          <div className="font-bebas leading-none">
            <div className="text-[18vw] text-white" style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>VANO</div>
            <div className="text-[18vw] text-[#C0392B] -mt-4">BABY</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="absolute bottom-12 right-6 md:right-12 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => topTracks[0] && setTrack(topTracks[0], topTracks)}
            className="bg-[#C0392B] hover:bg-[#E74C3C] text-white px-6 py-3 font-bebas tracking-widest text-lg transition-colors"
          >
            ▶ Écouter maintenant
          </button>
          <Link to="/music" className="border border-white text-white px-6 py-3 font-bebas tracking-widest text-lg hover:bg-white hover:text-[#080808] transition-colors text-center">
            Voir tous les sons
          </Link>
        </div>

        {/* Scroll arrow */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#C0392B] text-xl"
        >↓</motion.div>
      </section>

      {/* LATEST RELEASE */}
      {latestAlbum && (
        <section className="py-20 bg-[#111111]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-bebas text-white text-4xl tracking-widest mb-10 text-center">DERNIÈRE SORTIE</h2>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <img src={latestAlbum.coverUrl} alt={latestAlbum.title} className="w-64 h-64 object-cover rounded shadow-2xl" />
              <div className="flex-1">
                <p className="text-[#999] text-sm uppercase tracking-widest">Dernier album</p>
                <h3 className="font-bebas text-white text-5xl mt-1 tracking-widest">{latestAlbum.title}</h3>
                <p className="text-[#666] mb-6">{latestAlbum.releaseYear}</p>
                <button
                  onClick={() => latestAlbum.tracks.length && setTrack(latestAlbum.tracks[0], latestAlbum.tracks)}
                  className="bg-[#C0392B] hover:bg-[#E74C3C] text-white px-6 py-2 font-bebas tracking-widest transition-colors mr-3"
                >▶ Lancer l'album</button>
                <div className="mt-6 space-y-2">
                  {latestAlbum.tracks.slice(0, 3).map((t: any, i: number) => (
                    <div key={t.id} onClick={() => setTrack(t, latestAlbum.tracks)} className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded cursor-pointer group">
                      <span className="text-[#555] w-4 text-sm group-hover:text-[#C0392B]">{i + 1}</span>
                      <span className="text-white text-sm flex-1">{t.title}</span>
                      <span className="text-[#555] text-xs">{Math.floor(t.duration / 60)}:{String(t.duration % 60).padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      <section ref={statsRef} className="py-20 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: 10, suffix: '+', label: 'ANS' },
            { val: 50, suffix: '+', label: 'TITRES' },
            { val: 4, suffix: 'x', label: 'AWARDS' },
            { val: 800, suffix: 'K+', label: 'FANS' },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={statsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <div className="font-bebas text-[#C0392B] text-6xl md:text-7xl">
                <CountUp target={s.val} suffix={s.suffix} />
              </div>
              <div className="text-white text-sm tracking-widest mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOP TRACKS */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest mb-8">TOP TRACKS</h2>
          <div className="space-y-1">
            {topTracks.map((t, i) => (
              <div
                key={t.id}
                onClick={() => setTrack(t, topTracks)}
                className="flex items-center gap-4 p-3 hover:bg-[#1a1a1a] rounded cursor-pointer group"
              >
                <span className="text-[#555] w-5 text-sm group-hover:text-[#C0392B] font-bebas">{i + 1}</span>
                <img src={t.album?.coverUrl || `https://picsum.photos/seed/t${t.id}/40/40`} alt="" className="w-10 h-10 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{t.title}</p>
                  <p className="text-[#666] text-xs">{t.album?.title}</p>
                </div>
                <span className="text-[#555] text-xs">{t.playCount.toLocaleString()} écoutes</span>
                <span className="text-[#555] text-xs">{Math.floor(t.duration / 60)}:{String(t.duration % 60).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE PREVIEW */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest mb-10 text-center">10 ANS EN QUELQUES DATES</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { year: '2014', title: 'MTN Découverte Talents', desc: 'Victoire nationale, dotation 5M FCFA' },
              { year: '2018', title: 'Universal Music Africa', desc: 'Reconnaissance internationale' },
              { year: '2024', title: '10 Ans de Règne', desc: 'Méga-concert en préparation' },
            ].map(ev => (
              <div key={ev.year} className="bg-[#161616] border border-[#222] p-6 hover:border-[#C0392B] transition-colors">
                <div className="font-bebas text-[#C0392B] text-4xl">{ev.year}</div>
                <h3 className="text-white font-semibold mt-2">{ev.title}</h3>
                <p className="text-[#666] text-sm mt-1">{ev.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/career" className="text-[#C0392B] hover:text-[#E74C3C] text-sm tracking-wider">Voir toute la carrière →</Link>
          </div>
        </div>
      </section>

      {/* CONCERTS PREVIEW */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest mb-8 text-center">CONCERTS PROCHAINS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {concerts.map(ev => (
              <div key={ev.id} className="bg-[#161616] border border-[#222] p-6 hover:border-[#C0392B] transition-colors">
                <div className="font-bebas text-[#C0392B] text-2xl">{new Date(ev.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                <h3 className="text-white font-semibold mt-2">{ev.title}</h3>
                <p className="text-[#666] text-sm">{ev.venue} · {ev.city}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/concerts" className="text-[#C0392B] hover:text-[#E74C3C] text-sm tracking-wider">Voir tous les concerts →</Link>
          </div>
        </div>
      </section>

      {/* CONCERT CTA */}
      <section className="py-20 bg-[#C0392B] text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bebas text-white text-5xl md:text-6xl tracking-widest mb-2">10 ANS DE RÈGNE</h2>
          <p className="text-white/80 mb-8 text-lg">COTONOU, BÉNIN — 31 DÉCEMBRE 2025</p>
          <Countdown />
          <Link to="/concerts" className="inline-block mt-10 bg-[#080808] text-white px-10 py-4 font-bebas text-xl tracking-widest hover:bg-[#111111] transition-colors">
            Réserver ma place
          </Link>
        </div>
      </section>
    </PageWrapper>
  )
}
