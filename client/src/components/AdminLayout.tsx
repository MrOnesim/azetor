import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import OwlIcon from './OwlIcon'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/music', label: 'Musique', icon: '🎵' },
  { to: '/admin/videos', label: 'Vidéos', icon: '🎬' },
  { to: '/admin/events', label: 'Concerts', icon: '🎤' },
  { to: '/admin/moderation', label: 'Modération', icon: '🛡' },
  { to: '/admin/users', label: 'Utilisateurs', icon: '👥' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const logout = async () => {
    await axios.post('/api/auth/admin/logout', {}, { withCredentials: true })
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#111111] border-r border-[#222] flex flex-col">
        <div className="p-6 border-b border-[#222]">
          <Link to="/" className="flex items-center gap-2">
            <OwlIcon size={24} />
            <span className="font-bebas text-white text-lg tracking-wider">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 py-4">
          {nav.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${pathname === item.to ? 'text-white bg-[#1a1a1a] border-r-2 border-[#C0392B]' : 'text-[#666] hover:text-white hover:bg-[#1a1a1a]'}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="p-4 text-[#555] hover:text-[#C0392B] text-sm text-left px-6 border-t border-[#222] transition-colors">
          ← Déconnexion
        </button>
      </aside>
      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
