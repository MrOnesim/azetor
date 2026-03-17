import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'

export default function AdminModeration() {
  const [comments, setComments] = useState<any[]>([])
  const load = () => axios.get('/api/admin/comments', { withCredentials: true }).then(r => setComments(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const approve = async (id: number) => { await axios.put(`/api/admin/comments/${id}/approve`, {}, { withCredentials: true }); load() }
  const del = async (id: number) => { if (!confirm('Supprimer ?')) return; await axios.delete(`/api/admin/comments/${id}`, { withCredentials: true }); load() }

  return (
    <AdminLayout>
      <h1 className="font-bebas text-white text-4xl tracking-widest mb-8">MODÉRATION</h1>
      <div className="bg-[#111111] border border-[#222] overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#222] text-[#555] text-xs uppercase tracking-widest"><th className="text-left p-4">Utilisateur</th><th className="text-left p-4">Vidéo</th><th className="text-left p-4">Commentaire</th><th className="text-left p-4">Flags</th><th className="text-left p-4">Statut</th><th className="text-left p-4">Actions</th></tr></thead>
          <tbody>
            {comments.map(c => (
              <tr key={c.id} className={`border-b border-[#222]/50 hover:bg-[#1a1a1a] ${c.flagCount >= 3 ? 'bg-red-900/10' : ''}`}>
                <td className="p-4 text-white">{c.user.pseudo}</td>
                <td className="p-4 text-[#666] truncate max-w-[100px]">{c.video.title}</td>
                <td className="p-4 text-[#666] max-w-[200px] truncate">{c.content}</td>
                <td className={`p-4 font-semibold ${c.flagCount >= 3 ? 'text-[#C0392B]' : 'text-[#666]'}`}>{c.flagCount}</td>
                <td className="p-4"><span className={`text-xs px-2 py-0.5 ${c.approved ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{c.approved ? 'Approuvé' : 'Masqué'}</span></td>
                <td className="p-4 flex gap-2">
                  {!c.approved && <button onClick={() => approve(c.id)} className="text-green-400 hover:text-green-300 text-xs">Approuver</button>}
                  <button onClick={() => del(c.id)} className="text-[#C0392B] hover:text-[#E74C3C] text-xs">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
