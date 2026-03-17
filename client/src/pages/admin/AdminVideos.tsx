import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'

export default function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', youtubeUrl: '', category: 'clip', thumbnailUrl: '' })

  const load = () => axios.get('/api/admin/videos', { withCredentials: true }).then(r => setVideos(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const create = async () => {
    await axios.post('/api/admin/videos', form, { withCredentials: true }); setShowForm(false); load()
  }

  const del = async (id: number) => {
    if (!confirm('Supprimer cette vidéo ?')) return
    await axios.delete(`/api/admin/videos/${id}`, { withCredentials: true }); load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bebas text-white text-4xl tracking-widest">VIDÉOS</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#C0392B] hover:bg-[#E74C3C] text-white px-4 py-2 text-sm font-semibold transition-colors">+ Ajouter</button>
      </div>
      {showForm && (
        <div className="bg-[#111111] border border-[#222] p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Titre</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm" /></div>
            <div><label className="text-xs text-[#999] uppercase tracking-widest block mb-1">YouTube URL</label><input type="text" value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} className="w-full bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm" /></div>
            <div><label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Catégorie</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm">
                <option value="clip">Clip</option><option value="freestyle">Freestyle</option><option value="live">Live</option><option value="interview">Interview</option>
              </select>
            </div>
            <div><label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Thumbnail URL</label><input type="text" value={form.thumbnailUrl} onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} className="w-full bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm" /></div>
          </div>
          <button onClick={create} className="bg-[#C0392B] text-white px-6 py-2 text-sm font-semibold hover:bg-[#E74C3C] transition-colors">Créer</button>
        </div>
      )}
      <div className="bg-[#111111] border border-[#222] overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#222] text-[#555] text-xs uppercase tracking-widest"><th className="text-left p-4">Titre</th><th className="text-left p-4">Catégorie</th><th className="text-left p-4">Vues</th><th className="text-left p-4">Actions</th></tr></thead>
          <tbody>
            {videos.map(v => (
              <tr key={v.id} className="border-b border-[#222]/50 hover:bg-[#1a1a1a]">
                <td className="p-4 text-white">{v.title}</td>
                <td className="p-4 text-[#666] capitalize">{v.category}</td>
                <td className="p-4 text-[#666]">{v.viewCount}</td>
                <td className="p-4"><button onClick={() => del(v.id)} className="text-[#C0392B] hover:text-[#E74C3C] text-xs">Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
