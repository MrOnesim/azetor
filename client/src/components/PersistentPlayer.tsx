import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerStore } from '../store/playerStore'
import { useAuthStore } from '../store/authStore'
import AuthModal from './AuthModal'
import axios from 'axios'

export default function PersistentPlayer() {
  const { currentTrack, queue, isPlaying, volume, currentTime, duration, repeat, shuffle,
    isVisible, setPlaying, setVolume, setCurrentTime, setDuration, toggleRepeat, toggleShuffle,
    next, prev, close } = usePlayerStore()
  const { user, openAuth, isAuthOpen } = useAuthStore()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showQueue, setShowQueue] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const blockedRef = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    const src = currentTrack.previewUrl || currentTrack.audioUrl
    if (!src) return
    audio.src = src
    audio.volume = volume
    if (isPlaying) audio.play().catch(() => {})
    blockedRef.current = false
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) audio.play().catch(() => {})
    else audio.pause()
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    // 30-second rule
    if (!user && audio.currentTime >= 30 && !blockedRef.current) {
      blockedRef.current = true
      audio.pause()
      setPlaying(false)
      setToast('Tu aimes ce que tu entends ? Crée ton profil gratuit.')
      openAuth('register')
    }
  }

  const handleEnded = () => {
    if (repeat === 'one') {
      audioRef.current!.currentTime = 0
      audioRef.current!.play()
    } else {
      next()
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    if (audioRef.current) audioRef.current.currentTime = pct * duration
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  useEffect(() => {
    if (currentTrack) {
      axios.post(`/api/tracks/${currentTrack.id}/play`, {}, { withCredentials: true }).catch(() => {})
    }
  }, [currentTrack?.id])

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={handleEnded}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-[#161616] border border-[#C0392B] px-6 py-3 rounded-lg flex items-center gap-4 text-sm text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <span>{toast}</span>
            <button onClick={() => { setToast(null); openAuth('register') }} className="text-[#C0392B] font-semibold whitespace-nowrap">Créer mon profil</button>
            <button onClick={() => setToast(null)} className="text-[#666] hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && currentTrack && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[150] bg-[#111111] border-t border-[#222] h-[72px] md:h-[72px] flex items-center px-4 gap-4"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', damping: 30 }}
          >
            {/* LEFT - Track info */}
            <div className="flex items-center gap-3 w-[220px] min-w-0 shrink-0">
              <img
                src={currentTrack.album?.coverUrl || `https://picsum.photos/seed/${currentTrack.id}/48/48`}
                alt=""
                className="w-12 h-12 object-cover rounded"
              />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{currentTrack.title}</p>
                <p className="text-[#999] text-xs truncate">{currentTrack.album?.title || 'Vano Baby'}</p>
              </div>
            </div>

            {/* CENTER - Controls */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-4">
                <button onClick={toggleShuffle} className={`text-xs transition-colors ${shuffle ? 'text-[#C0392B]' : 'text-[#666] hover:text-white'}`}>⇄</button>
                <button onClick={prev} className="text-[#999] hover:text-white text-lg">⏮</button>
                <button
                  onClick={() => setPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-[#C0392B] hover:bg-[#E74C3C] flex items-center justify-center text-white text-lg transition-colors"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button onClick={next} className="text-[#999] hover:text-white text-lg">⏭</button>
                <button onClick={toggleRepeat} className={`text-xs transition-colors ${repeat !== 'none' ? 'text-[#C0392B]' : 'text-[#666] hover:text-white'}`}>
                  {repeat === 'one' ? '🔂' : '🔁'}
                </button>
              </div>
              <div className="flex items-center gap-2 w-full max-w-sm">
                <span className="text-[#666] text-[10px] w-7 text-right">{fmt(currentTime)}</span>
                <div className="flex-1 h-1 bg-[#333] rounded cursor-pointer" onClick={seek}>
                  <div className="h-full bg-[#C0392B] rounded" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} />
                </div>
                <span className="text-[#666] text-[10px] w-7">{fmt(duration)}</span>
              </div>
            </div>

            {/* RIGHT - Volume + queue + close */}
            <div className="hidden md:flex items-center gap-3 w-[180px] justify-end shrink-0">
              <span className="text-[#666] text-xs">🔊</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="w-20 accent-[#C0392B]"
              />
              <button onClick={() => setShowQueue(!showQueue)} className="text-[#666] hover:text-white text-sm">☰</button>
              <button onClick={close} className="text-[#666] hover:text-white text-sm">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Queue drawer */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            className="fixed bottom-[72px] right-0 w-72 max-h-80 bg-[#111111] border border-[#222] rounded-tl-lg overflow-y-auto z-[140]"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
          >
            <div className="p-3 border-b border-[#222]">
              <h3 className="text-white text-sm font-semibold">File d'attente</h3>
            </div>
            {queue.map((t, i) => (
              <div key={t.id} className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#1a1a1a] ${t.id === currentTrack?.id ? 'text-[#C0392B]' : 'text-[#999]'}`}>
                <span className="w-4 text-xs text-[#555]">{i + 1}</span>
                <span className="flex-1 truncate">{t.title}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isAuthOpen && <AuthModal />}
    </>
  )
}
