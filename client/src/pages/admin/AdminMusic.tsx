import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'

export default function AdminMusic() {
  const [albums, setAlbums] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', coverUrl: '', releaseYear: new Date().getFullYear(), type: 'single', status: 'published' })

  const load = () => axios.get('/api/admin/albums', { withCredentials: true }).then(r => setAlbums(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const create = async () => {
    await axios.post('/api/admin/albums', form, { withCredentials: true })
    setShowForm(false); setForm({ title: '', coverUrl: '', releaseYear: new Date().getFullYear(), type: 'single', status: 'published' }); load()
  }

  const del = async (id: number) => {
    if (!confirm('Supprimer cet album ?')) return
    await axios.delete(`/api/admin/albums/${id}`, { withCredentials: true }); load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bebas text-white text-4xl tracking-widest">MUSIQUE</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#C0392B] hover:bg-[#E74C3C] text-white px-4 py-2 text-sm font-semibold transition-colors">
          + Ajouter un album
        </button>
      </div>

      {showForm && (
        <div className="bg-[#111111] border border-[#222] p-6 mb-6 space-y-4">
          <h2 className="font-bebas text-white text-2xl">NOUVEL ALBUM</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Titre</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm focus:border-[#C0392B]" /></div>
            <div><label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Année</label><input type="number" value={form.releaseYear} onChange={e => setForm({ ...form, releaseYear: Number(e.target.value) })} className="w-full bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm focus:border-[#C0392B]" /></div>
            <div><label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Cover URL</label><input type="text" value={form.coverUrl} onChange={e => setForm({ ...form, coverUrl: e.target.value })} className="w-full bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm focus:border-[#C0392B]" placeholder="https://..." /></div>
            <div><label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm focus:border-[#C0392B]">
                <option value="single">Single</option><option value="album">Album</option><option value="ep">EP</option>
              </select>
            </div>
          </div>
          <button onClick={create} className="bg-[#C0392B] text-white px-6 py-2 text-sm font-semibold hover:bg-[#E74C3C] transition-colors">Créer</button>
        </div>
      )}

      <div className="bg-[#111111] border border-[#222] overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#222] text-[#555] text-xs uppercase tracking-widest"><th className="text-left p-4">Titre</th><th className="text-left p-4">Année</th><th className="text-left p-4">Type</th><th className="text-left p-4">Statut</th><th className="text-left p-4">Actions</th></tr></thead>
          <tbody>
            {albums.map(a => (
              <tr key={a.id} className="border-b border-[#222]/50 hover:bg-[#1a1a1a]">
                <td className="p-4 text-white">{a.title}</td>
                <td className="p-4 text-[#666]">{a.releaseYear}</td>
                <td className="p-4 text-[#666] capitalize">{a.type}</td>
                <td className="p-4"><span className={`text-xs px-2 py-0.5 ${a.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-[#333] text-[#666]'}`}>{a.status}</span></td>
                <td className="p-4"><button onClick={() => del(a.id)} className="text-[#C0392B] hover:text-[#E74C3C] text-xs">Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
