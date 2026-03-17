import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const load = () => axios.get('/api/admin/users', { withCredentials: true }).then(r => setUsers(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const ban = async (id: number, days?: number) => { await axios.put(`/api/admin/users/${id}/ban`, { days }, { withCredentials: true }); load() }
  const unban = async (id: number) => { await axios.put(`/api/admin/users/${id}/unban`, {}, { withCredentials: true }); load() }

  const filtered = users.filter(u => u.pseudo.toLowerCase().includes(search.toLowerCase()))

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bebas text-white text-4xl tracking-widest">UTILISATEURS</h1>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un pseudo..." className="bg-[#161616] border border-[#333] text-white px-4 py-2 text-sm focus:border-[#C0392B] w-48" />
      </div>
      <div className="bg-[#111111] border border-[#222] overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#222] text-[#555] text-xs uppercase tracking-widest"><th className="text-left p-4">Pseudo</th><th className="text-left p-4">Inscription</th><th className="text-left p-4">Écoutes</th><th className="text-left p-4">Badges</th><th className="text-left p-4">Statut</th><th className="text-left p-4">Actions</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-[#222]/50 hover:bg-[#1a1a1a]">
                <td className="p-4 text-white font-medium">{u.pseudo}</td>
                <td className="p-4 text-[#666]">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="p-4 text-[#666]">{u._count?.playHistory || 0}</td>
                <td className="p-4 text-[#666]">{u._count?.badges || 0}</td>
                <td className="p-4"><span className={`text-xs px-2 py-0.5 ${u.isBanned ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>{u.isBanned ? 'Banni' : 'Actif'}</span></td>
                <td className="p-4 flex gap-2">
                  {u.isBanned
                    ? <button onClick={() => unban(u.id)} className="text-green-400 hover:text-green-300 text-xs">Débannir</button>
                    : <>
                        <button onClick={() => ban(u.id, 7)} className="text-yellow-400 hover:text-yellow-300 text-xs">Ban 7j</button>
                        <button onClick={() => ban(u.id)} className="text-[#C0392B] hover:text-[#E74C3C] text-xs">Ban ∞</button>
                      </>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
