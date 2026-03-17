import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const pos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const raf = useRef<number>()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`
      }
      raf.current = requestAnimationFrame(animate)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovered(!!t.closest('a, button, [role="button"], input, textarea, select, label'))
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: hovered ? 20 : 10,
          height: hovered ? 20 : 10,
          background: '#C0392B',
          borderRadius: '50%',
          transition: 'width 0.15s, height 0.15s',
          willChange: 'transform',
        }}
      />
      {!hovered && (
        <div
          ref={ringRef}
          className="fixed top-0 left-0 pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 36,
            height: 36,
            border: '1.5px solid #C0392B',
            borderRadius: '50%',
            willChange: 'transform',
          }}
        />
      )}
    </>
  )
}
