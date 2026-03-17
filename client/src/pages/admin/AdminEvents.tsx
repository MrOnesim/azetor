import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([])
  const load = () => axios.get('/api/admin/events', { withCredentials: true }).then(r => setEvents(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const cancel = async (id: number) => {
    await axios.put(`/api/admin/events/${id}`, { status: 'cancelled' }, { withCredentials: true }); load()
  }

  return (
    <AdminLayout>
      <h1 className="font-bebas text-white text-4xl tracking-widest mb-8">CONCERTS</h1>
      <div className="bg-[#111111] border border-[#222] overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#222] text-[#555] text-xs uppercase tracking-widest"><th className="text-left p-4">Titre</th><th className="text-left p-4">Date</th><th className="text-left p-4">Lieu</th><th className="text-left p-4">Fans</th><th className="text-left p-4">Statut</th><th className="text-left p-4">Actions</th></tr></thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} className="border-b border-[#222]/50 hover:bg-[#1a1a1a]">
                <td className="p-4 text-white">{ev.title}</td>
                <td className="p-4 text-[#666]">{new Date(ev.date).toLocaleDateString('fr-FR')}</td>
                <td className="p-4 text-[#666]">{ev.city}</td>
                <td className="p-4 text-[#666]">{ev._count?.reactions || 0}</td>
                <td className="p-4"><span className={`text-xs px-2 py-0.5 ${ev.status === 'upcoming' ? 'bg-green-900/30 text-green-400' : ev.status === 'cancelled' ? 'bg-red-900/30 text-red-400' : 'bg-[#333] text-[#666]'}`}>{ev.status}</span></td>
                <td className="p-4">{ev.status === 'upcoming' && <button onClick={() => cancel(ev.id)} className="text-[#C0392B] hover:text-[#E74C3C] text-xs">Annuler</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
