import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import OwlIcon from '../components/OwlIcon'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import AuthModal from '../components/AuthModal'

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
    <div className="flex gap-6 justify-center text-white">
      {[['JOURS', d], ['HEURES', h], ['MINUTES', m], ['SECONDES', s]].map(([l, v]) => (
        <div key={l as string} className="text-center">
          <span className="font-bebas text-5xl">{String(v).padStart(2, '0')}</span>
          <span className="text-[#C0392B] font-bebas text-2xl mx-1">:</span>
          <div className="text-xs tracking-widest text-white/60">{l}</div>
        </div>
      ))}
    </div>
  )
}

const faq = [
  { q: 'Comment accéder au site ?', a: 'Plusieurs entrées seront disponibles selon votre catégorie de billet. Des navettes seront mises en place depuis le centre-ville de Cotonou.' },
  { q: 'Y a-t-il un parking ?', a: 'Un grand parking gratuit sera disponible sur le site. Nous recommandons d\'arriver tôt pour éviter les files.' },
  { q: 'Quels objets sont interdits ?', a: 'Bouteilles en verre, canettes, appareils photo professionnels (objectif > 10cm), drones, armes de toute nature.' },
  { q: 'Les billets sont-ils remboursables ?', a: 'Les billets ne sont pas remboursables en cas d\'annulation personnelle. En cas de report ou d\'annulation de l\'événement, un remboursement intégral sera effectué.' },
  { q: 'Qu\'inclut l\'Espace VIP ?', a: 'Accès prioritaire, zone aménagée avec sièges, bar privé, meet & greet avec l\'artiste après le concert.' },
  { q: 'Y aura-t-il un streaming du concert ?', a: 'Oui ! Le concert sera diffusé en direct sur nos réseaux sociaux pour ceux qui ne peuvent pas se déplacer.' },
]

export default function Concerts() {
  const [events, setEvents] = useState<any[]>([])
  const [reactions, setReactions] = useState<Record<number, boolean>>({})
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [showArchives, setShowArchives] = useState(false)
  const { user, openAuth, isAuthOpen } = useAuthStore()

  useEffect(() => {
    axios.get('/api/events').then(r => setEvents(r.data)).catch(() => {})
  }, [])

  const upcoming = events.filter(e => e.status === 'upcoming')
  const past = events.filter(e => e.status === 'past')

  const react = async (eventId: number) => {
    if (!user) { openAuth('register'); return }
    const r = await axios.post(`/api/events/${eventId}/react`, {}, { withCredentials: true })
    setReactions(prev => ({ ...prev, [eventId]: r.data.reacted }))
  }

  return (
    <PageWrapper>
      {/* HERO */}
      <section className="relative h-[60vh] bg-[#080808] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C0392B]/5 to-transparent" />
        <div className="text-center z-10">
          <OwlIcon size={80} />
          <div className="inline-block bg-[#C0392B] text-white text-xs tracking-widest px-3 py-1 mt-4 mb-2">LE CONCERT</div>
          <h1 className="font-bebas text-white text-[12vw] leading-none">10 ANS DE RÈGNE</h1>
          <p className="text-[#999] tracking-widest mt-2 text-sm">VANO BABY EN CONCERT — COTONOU, BÉNIN</p>
          <div className="mt-8">
            <Countdown />
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest mb-8">ÉVÉNEMENTS À VENIR</h2>
          <div className="space-y-4">
            {upcoming.map(ev => (
              <div key={ev.id} className="bg-[#161616] border border-[#222] p-6 flex flex-col md:flex-row items-start md:items-center gap-4 hover:border-[#C0392B] transition-colors">
                <div className="flex-1">
                  <div className="font-bebas text-[#C0392B] text-2xl">
                    {new Date(ev.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-white font-semibold mt-1 text-lg">{ev.title}</h3>
                  <p className="text-[#666] text-sm">{ev.venue} · {ev.city}, {ev.country}</p>
                  <p className="text-[#555] text-xs mt-1">{new Date(ev.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => react(ev.id)}
                    className={`text-sm px-4 py-2 border transition-colors ${reactions[ev.id] ? 'border-[#C0392B] text-[#C0392B]' : 'border-[#333] text-[#999] hover:border-[#C0392B] hover:text-white'}`}
                  >
                    {reactions[ev.id] ? '✓ Je serai là' : '🙋 Je serai là'}
                    <span className="ml-2 text-xs text-[#555]">{ev._count?.reactions || 0}</span>
                  </button>
                  {ev.ticketUrl && ev.ticketUrl !== '#' && (
                    <a href={ev.ticketUrl} target="_blank" rel="noreferrer" className="bg-[#C0392B] hover:bg-[#E74C3C] text-white px-4 py-2 text-sm transition-colors font-medium">
                      Billets
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKET TIERS */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-10">BILLETTERIE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'PELOUSE', price: '15 000', currency: 'FCFA', perks: ['Accès au site', 'Zone debout', 'Vue sur la scène'], vip: false },
              { name: 'TRIBUNE', price: '30 000', currency: 'FCFA', perks: ['Accès tribune', 'Siège numéroté', 'Vue privilégiée', 'Bar dédié'], vip: false },
              { name: 'VIP', price: '75 000', currency: 'FCFA', perks: ['Zone VIP premium', 'Siège de luxe', 'Bar privé', 'Meet & Greet', 'Cadeau exclusif'], vip: true },
            ].map(tier => (
              <div key={tier.name} className={`bg-[#161616] p-8 flex flex-col items-center text-center relative ${tier.vip ? 'border-2 border-[#C0392B]' : 'border border-[#222]'}`}>
                {tier.vip && <div className="absolute -top-3 bg-[#C0392B] text-white text-xs tracking-widest px-3 py-1">RECOMMANDÉ</div>}
                <h3 className="font-bebas text-white text-3xl tracking-widest">{tier.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="font-bebas text-[#C0392B] text-4xl">{tier.price}</span>
                  <span className="text-[#666] text-sm ml-1">{tier.currency}</span>
                </div>
                <ul className="space-y-2 mb-8 text-left w-full">
                  {tier.perks.map(p => <li key={p} className="text-[#999] text-sm flex items-center gap-2"><span className="text-[#C0392B]">✓</span>{p}</li>)}
                </ul>
                <button className={`w-full py-3 font-bebas tracking-widest text-lg transition-colors ${tier.vip ? 'bg-[#C0392B] text-white hover:bg-[#E74C3C]' : 'border border-[#C0392B] text-[#C0392B] hover:bg-[#C0392B] hover:text-white'}`}>
                  Choisir ce billet
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest mb-8">GALERIE PHOTOS</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} onClick={() => setLightbox(i)} className="relative overflow-hidden aspect-video cursor-pointer group rounded">
                <img src={`https://picsum.photos/seed/concert${i + 1}/640/360`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-[#C0392B]/0 group-hover:bg-[#C0392B]/50 flex items-center justify-center transition-all duration-200">
                  <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <img src={`https://picsum.photos/seed/concert${lightbox + 1}/1280/720`} alt="" className="max-w-4xl max-h-[80vh] object-contain rounded" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-8">FAQ CONCERT</h2>
          <div className="space-y-2">
            {faq.map((item, i) => (
              <div key={i} className="bg-[#161616] border border-[#222] overflow-hidden">
                <button className="w-full px-6 py-4 flex items-center justify-between text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-white font-medium text-sm">{item.q}</span>
                  <motion.span className="text-[#C0392B] text-lg" animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}>+</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-6 pb-4 text-[#999] text-sm">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHIVES */}
      <section className="py-10 bg-[#111111]">
        <div className="max-w-5xl mx-auto px-6">
          <button onClick={() => setShowArchives(!showArchives)} className="text-[#555] hover:text-[#999] text-sm tracking-widest transition-colors">
            {showArchives ? 'Masquer les archives ▲' : 'Voir les archives ▼'}
          </button>
          {showArchives && (
            <div className="mt-6 space-y-3">
              {past.map(ev => (
                <div key={ev.id} className="bg-[#161616] border border-[#222] p-4 opacity-60">
                  <div className="font-bebas text-[#555] text-xl">{new Date(ev.date).getFullYear()}</div>
                  <h3 className="text-[#666] text-sm">{ev.title} · {ev.city}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {isAuthOpen && <AuthModal />}
    </PageWrapper>
  )
}
