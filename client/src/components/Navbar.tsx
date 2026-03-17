import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import OwlIcon from './OwlIcon'
import { useAuthStore } from '../store/authStore'
import AuthModal from './AuthModal'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'Biographie' },
  { to: '/career', label: 'Carrière' },
  { to: '/music', label: 'Musique' },
  { to: '/videos', label: 'Vidéos' },
  { to: '/concerts', label: 'Concerts' },
  { to: '/community', label: 'Communauté' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { user, openAuth, isAuthOpen } = useAuthStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#080808] border-b border-[#222]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <OwlIcon size={28} />
            <span className="font-bebas text-white text-xl tracking-widest">VANO BABY</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm uppercase tracking-wider transition-colors duration-200 relative group ${pathname === l.to ? 'text-white' : 'text-[#999] hover:text-white'}`}
              >
                {l.label}
                {pathname === l.to && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C0392B]" />}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/concerts" className="bg-[#C0392B] text-white text-sm px-4 py-1.5 rounded-full font-medium hover:bg-[#E74C3C] transition-colors">
              🎟 CONCERT
            </Link>
            {user ? (
              <Link to="/community" className="text-sm text-white border border-[#333] px-4 py-1.5 rounded hover:border-[#C0392B] transition-colors">
                {user.pseudo}
              </Link>
            ) : (
              <button onClick={() => openAuth('login')} className="text-sm text-white border border-[#333] px-4 py-1.5 rounded hover:border-[#C0392B] transition-colors">
                Connexion
              </button>
            )}
          </div>

          <button className="lg:hidden text-white p-2" onClick={() => setMobileOpen(true)}>
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-4 h-0.5 bg-white" />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[#C0392B] flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setMobileOpen(false)}>✕</button>
            <div className="flex flex-col items-center gap-8">
              {links.map(l => (
                <Link key={l.to} to={l.to} className="font-bebas text-white text-4xl tracking-widest hover:opacity-80">
                  {l.label}
                </Link>
              ))}
              {!user && <button onClick={() => { openAuth('login'); setMobileOpen(false) }} className="font-bebas text-white text-2xl tracking-widest border border-white px-8 py-2 mt-4">CONNEXION</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isAuthOpen && <AuthModal />}
    </>
  )
}
