import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OwlIcon from './OwlIcon'

interface IntroLoaderProps {
  onDone: () => void
}

export default function IntroLoader({ onDone }: IntroLoaderProps) {
  const [count, setCount] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading')

  useEffect(() => {
    const duration = 2500
    const interval = 20
    const steps = duration / interval
    let step = 0
    const timer = setInterval(() => {
      step++
      setCount(Math.min(100, Math.round((step / steps) * 100)))
      if (step >= steps) {
        clearInterval(timer)
        setTimeout(() => setPhase('exit'), 300)
        setTimeout(() => onDone(), 1300)
      }
    }, interval)
    return () => clearInterval(timer)
  }, [onDone])

  return (
    <AnimatePresence>
      {phase === 'loading' ? (
        <motion.div
          key="loader"
          className="fixed inset-0 bg-[#080808] z-[9999] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3"
          >
            <OwlIcon size={120} animated />
            <span className="font-bebas text-white tracking-[0.4em] text-[1.4rem] mt-2">VANO BABY</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-8 w-[280px]"
          >
            <div className="text-right font-bebas text-white text-5xl mb-2">{count}</div>
            <div className="h-[3px] bg-[#222] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#C0392B]"
                animate={{ width: `${count}%` }}
                transition={{ ease: 'easeInOut' }}
              />
            </div>
            <div className="text-[0.55rem] uppercase tracking-widest text-[#999] mt-2 text-center">Chargement</div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          <motion.div
            key="top-half"
            className="absolute inset-x-0 top-0 h-1/2 bg-[#080808]"
            initial={{ y: 0 }}
            animate={{ y: '-50vh' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
          <motion.div
            key="bottom-half"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#080808]"
            initial={{ y: 0 }}
            animate={{ y: '50vh' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}
