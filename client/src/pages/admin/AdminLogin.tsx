import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import OwlIcon from '../../components/OwlIcon'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('/api/auth/admin/login', { email, password }, { withCredentials: true })
      navigate('/admin')
    } catch (e: any) {
      setError(e.response?.data?.error || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <OwlIcon size={48} />
          <h1 className="font-bebas text-white text-3xl tracking-widest mt-3">ADMIN</h1>
        </div>
        <form onSubmit={submit} className="bg-[#111111] border border-[#222] p-8 space-y-4">
          <div>
            <label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-[#161616] border border-[#333] text-white px-4 py-3 focus:border-[#C0392B] text-sm transition-colors" />
          </div>
          <div>
            <label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-[#161616] border border-[#333] text-white px-4 py-3 focus:border-[#C0392B] text-sm transition-colors" />
          </div>
          {error && <p className="text-[#C0392B] text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#C0392B] hover:bg-[#E74C3C] text-white py-3 font-bebas text-xl tracking-widest transition-colors">
            {loading ? '...' : 'CONNEXION'}
          </button>
        </form>
        <p className="text-center text-[#555] text-xs mt-4">admin@vanobaby.bj</p>
      </div>
    </div>
  )
}
