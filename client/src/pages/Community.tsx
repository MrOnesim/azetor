import { useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { useAuthStore } from '../store/authStore'
import AuthModal from '../components/AuthModal'
import axios from 'axios'

const allBadges = [
  { slug: 'auditeur-actif', name: 'Auditeur Actif', emoji: '🎧', desc: '10 titres écoutés', threshold: 10, type: 'plays' },
  { slug: 'fan-premiere-heure', name: 'Fan de la Première Heure', emoji: '🔥', desc: '50 titres écoutés', threshold: 50, type: 'plays' },
  { slug: 'legende', name: 'Légende', emoji: '💎', desc: '200 titres écoutés', threshold: 200, type: 'plays' },
  { slug: 'voix-du-peuple', name: 'Voix du Peuple', emoji: '💬', desc: '20 commentaires', threshold: 20, type: 'comments' },
  { slug: 'coeur-fidele', name: 'Cœur Fidèle', emoji: '❤️', desc: '30 titres likés', threshold: 30, type: 'likes' },
  { slug: 'present-concerts', name: 'Présent aux Concerts', emoji: '📅', desc: '3 événements "Je serai là"', threshold: 3, type: 'events' },
  { slug: 'addict', name: 'Addict', emoji: '🔁', desc: 'Même track 10 fois', threshold: 10, type: 'repeat' },
  { slug: 'decouvreur', name: 'Découvreur', emoji: '🌟', desc: '5 albums différents', threshold: 5, type: 'albums' },
]

export default function Community() {
  const { user, openAuth, isAuthOpen } = useAuthStore()
  const [userBadges, setUserBadges] = useState<string[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      axios.get(`/api/badges/user/${user.id}`).then(r => setUserBadges(r.data.map((ub: any) => ub.badge.slug))).catch(() => {})
    }
  }, [user])

  // Mock leaderboard for now
  useEffect(() => {
    setLeaderboard([
      { rank: 1, pseudo: 'AzetoFan237', avatarColor: '#C0392B', score: 2450, badges: 7 },
      { rank: 2, pseudo: 'CotonouVibes', avatarColor: '#2980B9', score: 1890, badges: 5 },
      { rank: 3, pseudo: 'VanoBabyForever', avatarColor: '#27AE60', score: 1650, badges: 6 },
      { rank: 4, pseudo: 'GrandPopoBoy', avatarColor: '#8E44AD', score: 1320, badges: 4 },
      { rank: 5, pseudo: 'BéninRap', avatarColor: '#E67E22', score: 1100, badges: 3 },
    ])
  }, [])

  if (!user) {
    return (
      <PageWrapper>
        <section className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-bebas text-white text-6xl tracking-widest mb-4">COMMUNAUTÉ</h1>
          <p className="text-[#666] mb-8 max-w-md">Rejoins la communauté Vano Baby pour accéder à ton profil, tes badges, et le classement des fans.</p>
          <button onClick={() => openAuth('register')} className="bg-[#C0392B] hover:bg-[#E74C3C] text-white px-8 py-3 font-bebas text-xl tracking-widest transition-colors">
            Créer mon profil
          </button>
        </section>
        {isAuthOpen && <AuthModal />}
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* HERO */}
      <section className="h-[35vh] flex flex-col items-center justify-center bg-[#080808]">
        <h1 className="font-bebas text-white text-[8vw] leading-none">COMMUNAUTÉ</h1>
        <div className="w-16 h-0.5 bg-[#C0392B] mt-3" />
      </section>

      {/* USER PROFILE */}
      <section className="py-12 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bebas text-3xl text-2xl" style={{ background: user.avatarColor }}>
              {user.pseudo.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bebas text-white text-4xl">{user.pseudo}</h2>
              <p className="text-[#666] text-sm">
                Membre depuis {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '2024'}
              </p>
              <p className="text-[#C0392B] text-sm">{userBadges.length} badge{userBadges.length !== 1 ? 's' : ''} obtenu{userBadges.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </section>

      {/* BADGES SHOWCASE */}
      <section className="py-12 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest mb-8">BADGES</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allBadges.map(b => {
              const earned = userBadges.includes(b.slug)
              return (
                <div key={b.slug} className={`bg-[#161616] border p-5 text-center transition-all ${earned ? 'border-[#C0392B]' : 'border-[#222] opacity-60 grayscale'}`}>
                  <div className="text-3xl mb-2">{earned ? b.emoji : '🔒'}</div>
                  <h3 className="text-white text-sm font-medium">{b.name}</h3>
                  <p className="text-[#555] text-xs mt-1">{b.desc}</p>
                  {earned && <div className="mt-3 h-1 bg-[#C0392B] rounded-full" />}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="py-12 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest mb-8">CLASSEMENT TOP 10</h2>
          <div className="space-y-2">
            {leaderboard.map(l => (
              <div key={l.rank} className={`flex items-center gap-4 p-4 bg-[#161616] border ${l.pseudo === user.pseudo ? 'border-[#C0392B]' : 'border-[#222]'}`}>
                <span className="font-bebas text-[#C0392B] text-2xl w-8">#{l.rank}</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bebas" style={{ background: l.avatarColor }}>
                  {l.pseudo[0].toUpperCase()}
                </div>
                <span className="text-white font-medium flex-1">{l.pseudo}</span>
                <span className="text-[#666] text-sm">{l.score.toLocaleString()} pts</span>
                <span className="text-[#555] text-xs">{l.badges} badges</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isAuthOpen && <AuthModal />}
    </PageWrapper>
  )
}
