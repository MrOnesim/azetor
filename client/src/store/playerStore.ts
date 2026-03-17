import { create } from 'zustand'

export interface Track {
  id: number
  title: string
  feat?: string
  audioUrl: string
  duration: number
  album?: { title: string; coverUrl: string }
  previewUrl?: string
}

interface PlayerStore {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  repeat: 'none' | 'one' | 'all'
  shuffle: boolean
  isVisible: boolean
  setTrack: (track: Track, queue?: Track[]) => void
  setPlaying: (playing: boolean) => void
  setVolume: (vol: number) => void
  setCurrentTime: (t: number) => void
  setDuration: (d: number) => void
  toggleRepeat: () => void
  toggleShuffle: () => void
  next: () => void
  prev: () => void
  close: () => void
  addToQueue: (track: Track) => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  repeat: 'none',
  shuffle: false,
  isVisible: false,

  setTrack: (track, queue) => {
    set({ currentTrack: track, isPlaying: true, isVisible: true, currentTime: 0, queue: queue || get().queue })
  },
  setPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (vol) => set({ volume: vol }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  toggleRepeat: () => {
    const r = get().repeat
    set({ repeat: r === 'none' ? 'one' : r === 'one' ? 'all' : 'none' })
  },
  toggleShuffle: () => set({ shuffle: !get().shuffle }),
  next: () => {
    const { queue, currentTrack, shuffle, repeat } = get()
    if (!currentTrack || !queue.length) return
    const idx = queue.findIndex(t => t.id === currentTrack.id)
    let nextIdx: number
    if (shuffle) nextIdx = Math.floor(Math.random() * queue.length)
    else nextIdx = idx + 1 >= queue.length ? (repeat === 'all' ? 0 : idx) : idx + 1
    set({ currentTrack: queue[nextIdx], isPlaying: true, currentTime: 0 })
  },
  prev: () => {
    const { queue, currentTrack } = get()
    if (!currentTrack || !queue.length) return
    const idx = queue.findIndex(t => t.id === currentTrack.id)
    const prevIdx = idx - 1 < 0 ? 0 : idx - 1
    set({ currentTrack: queue[prevIdx], isPlaying: true, currentTime: 0 })
  },
  close: () => set({ isVisible: false, isPlaying: false, currentTrack: null }),
  addToQueue: (track) => set(s => ({ queue: [...s.queue, track] })),
}))
