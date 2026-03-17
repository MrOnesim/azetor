import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function AuthModal() {
  const { authTab, closeAuth, setUser } = useAuthStore()
  const [tab, setTab] = useState<'register' | 'login'>(authTab)
  const [pseudo, setPseudo] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pseudoAvailable, setPseudoAvailable] = useState<boolean | null>(null)

  useEffect(() => setTab(authTab), [authTab])

  useEffect(() => {
    if (!pseudo || tab !== 'register') return setPseudoAvailable(null)
    const t = setTimeout(() => {
      axios.get(`/api/auth/check-pseudo?pseudo=${pseudo}`)
        .then(r => setPseudoAvailable(r.data.available))
        .catch(() => {})
    }, 400)
    return () => clearTimeout(t)
  }, [pseudo, tab])

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const endpoint = tab === 'register' ? '/api/auth/register' : '/api/auth/login'
      const r = await axios.post(endpoint, { pseudo, pin }, { withCredentials: true })
      setUser(r.data)
      closeAuth()
    } catch (e: any) {
      setError(e.response?.data?.error || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const initials = pseudo.slice(0, 2).toUpperCase()
  const colors = ['#C0392B', '#2980B9', '#27AE60', '#8E44AD', '#E67E22']
  const avatarColor = colors[pseudo.length % colors.length]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeAuth} />
        <motion.div
          className="relative bg-[#111111] border border-[#222] rounded-lg p-8 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <button onClick={closeAuth} className="absolute top-4 right-4 text-[#999] hover:text-white text-xl">✕</button>

          <div className="flex gap-4 mb-8 border-b border-[#222] pb-4">
            <button
              className={`font-bebas text-xl tracking-wider transition-colors ${tab === 'register' ? 'text-[#C0392B]' : 'text-[#666] hover:text-white'}`}
              onClick={() => setTab('register')}
            >Nouveau fan</button>
            <button
              className={`font-bebas text-xl tracking-wider transition-colors ${tab === 'login' ? 'text-[#C0392B]' : 'text-[#666] hover:text-white'}`}
              onClick={() => setTab('login')}
            >J'ai déjà un compte</button>
          </div>

          {tab === 'register' && pseudo && (
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bebas text-2xl" style={{ background: avatarColor }}>
                {initials}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Pseudo</label>
              <input
                type="text"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                className="w-full bg-[#161616] border border-[#333] text-white px-4 py-3 rounded focus:border-[#C0392B] transition-colors"
                placeholder="Ton pseudo unique"
                maxLength={30}
              />
              {tab === 'register' && pseudoAvailable !== null && (
                <p className={`text-xs mt-1 ${pseudoAvailable ? 'text-green-400' : 'text-[#C0392B]'}`}>
                  {pseudoAvailable ? '✓ Disponible' : '✗ Déjà pris'}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-[#999] uppercase tracking-widest block mb-1">PIN (4–6 chiffres)</label>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-[#161616] border border-[#333] text-white px-4 py-3 rounded focus:border-[#C0392B] transition-colors"
                placeholder="••••••"
                maxLength={6}
              />
            </div>
          </div>

          {error && <p className="text-[#C0392B] text-sm mt-3">{error}</p>}

          <button
            onClick={submit}
            disabled={loading || !pseudo || pin.length < 4}
            className="w-full mt-6 bg-[#C0392B] hover:bg-[#E74C3C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bebas text-xl tracking-widest py-3 rounded transition-colors"
          >
            {loading ? '...' : tab === 'register' ? 'Créer mon profil' : 'Se connecter'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
