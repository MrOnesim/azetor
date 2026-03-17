import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/admin/stats', { withCredentials: true })
      .then(r => setStats(r.data))
      .catch(() => navigate('/admin/login'))
  }, [])

  return (
    <AdminLayout>
      <h1 className="font-bebas text-white text-4xl tracking-widest mb-8">DASHBOARD</h1>
      {stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Utilisateurs', value: stats.totalUsers, color: '#C0392B' },
              { label: 'Titres', value: stats.totalTracks, color: '#2980B9' },
              { label: 'Écoutes totales', value: stats.totalPlays?.toLocaleString(), color: '#27AE60' },
              { label: 'Commentaires', value: stats.totalComments, color: '#8E44AD' },
            ].map(s => (
              <div key={s.label} className="bg-[#111111] border border-[#222] p-6">
                <div className="font-bebas text-4xl" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[#666] text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          {stats.nextEvent && (
            <div className="bg-[#111111] border border-[#222] p-6 mb-6">
              <h2 className="font-bebas text-white text-2xl mb-2">PROCHAIN ÉVÉNEMENT</h2>
              <p className="text-[#C0392B] font-semibold">{stats.nextEvent.title}</p>
              <p className="text-[#666] text-sm">{new Date(stats.nextEvent.date).toLocaleDateString('fr-FR')} · {stats.nextEvent.city}</p>
            </div>
          )}
          <div className="bg-[#111111] border border-[#222] p-6">
            <h2 className="font-bebas text-white text-2xl mb-4">TOP 5 TRACKS</h2>
            <div className="space-y-2">
              {stats.topTracks?.map((t: any, i: number) => (
                <div key={t.id} className="flex items-center gap-3 text-sm">
                  <span className="font-bebas text-[#C0392B] w-5">{i + 1}</span>
                  <span className="text-white flex-1">{t.title}</span>
                  <span className="text-[#555]">{t.playCount.toLocaleString()} écoutes</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-[#555]">Chargement...</div>
      )}
    </AdminLayout>
  )
}
