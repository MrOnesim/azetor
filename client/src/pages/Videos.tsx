import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import AuthModal from '../components/AuthModal'

type Category = 'tous' | 'clip' | 'freestyle' | 'live' | 'interview'

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([])
  const [filter, setFilter] = useState<Category>('tous')
  const [selected, setSelected] = useState<any | null>(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const { user, openAuth, isAuthOpen } = useAuthStore()

  useEffect(() => {
    axios.get('/api/videos').then(r => setVideos(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (selected) {
      axios.get(`/api/comments?videoId=${selected.id}`).then(r => setComments(r.data)).catch(() => {})
      axios.post(`/api/videos/${selected.id}/view`, {}, { withCredentials: true }).catch(() => {})
    }
  }, [selected])

  const filtered = filter === 'tous' ? videos : videos.filter(v => v.category === filter)

  const postComment = async () => {
    if (!user) { openAuth('register'); return }
    if (!comment.trim()) return
    const r = await axios.post('/api/comments', { videoId: selected.id, content: comment }, { withCredentials: true })
    setComments(prev => [r.data, ...prev])
    setComment('')
  }

  const getYoutubeId = (url: string) => {
    const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
    return m?.[1]
  }

  return (
    <PageWrapper>
      {/* HERO */}
      <section className="h-[35vh] flex flex-col items-center justify-center bg-[#080808]">
        <h1 className="font-bebas text-white text-[10vw] leading-none">VIDÉOS</h1>
        <div className="w-16 h-0.5 bg-[#C0392B] mt-3" />
      </section>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-wrap gap-2">
        {(['tous', 'clip', 'freestyle', 'live', 'interview'] as Category[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs uppercase tracking-widest font-semibold transition-colors capitalize ${filter === f ? 'bg-[#C0392B] text-white' : 'text-[#999] hover:text-white border border-[#333]'}`}
          >
            {f === 'clip' ? 'Clips Officiels' : f === 'freestyle' ? 'Freestyles' : f}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <div key={v.id} onClick={() => setSelected(v)} className="cursor-pointer group">
              <div className="relative aspect-video overflow-hidden rounded bg-[#111111]">
                <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200">
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity">▶</div>
                </div>
              </div>
              <h3 className="text-white font-medium mt-2 text-sm line-clamp-2">{v.title}</h3>
              <p className="text-[#555] text-xs capitalize mt-1">{v.category} · {v.viewCount.toLocaleString()} vues</p>
            </div>
          ))}
        </div>
      </div>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
            <motion.div
              className="relative bg-[#111111] rounded-lg overflow-hidden w-full max-w-4xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 text-white bg-black/50 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#C0392B] transition-colors">✕</button>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(selected.youtubeUrl)}?autoplay=1`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-semibold text-lg">{selected.title}</h3>
                <p className="text-[#666] text-sm mt-1">{selected.description}</p>
                <div className="mt-6 border-t border-[#222] pt-4">
                  <h4 className="text-white text-sm font-medium mb-3">Commentaires ({comments.length})</h4>
                  {user ? (
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Ton commentaire..."
                        className="flex-1 bg-[#161616] border border-[#333] text-white px-3 py-2 text-sm rounded focus:border-[#C0392B] transition-colors"
                        onKeyDown={e => e.key === 'Enter' && postComment()}
                      />
                      <button onClick={postComment} className="bg-[#C0392B] text-white px-4 py-2 text-sm rounded hover:bg-[#E74C3C] transition-colors">Envoyer</button>
                    </div>
                  ) : (
                    <button onClick={() => openAuth('register')} className="text-[#C0392B] text-sm mb-4 hover:text-[#E74C3C]">Connecte-toi pour commenter →</button>
                  )}
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {comments.map(c => (
                      <div key={c.id} className="flex gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0" style={{ background: c.user.avatarColor }}>
                          {c.user.pseudo[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="text-white text-xs font-medium">{c.user.pseudo}</span>
                          <p className="text-[#999] text-xs mt-0.5">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isAuthOpen && <AuthModal />}
    </PageWrapper>
  )
}
