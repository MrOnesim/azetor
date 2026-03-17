interface OwlIconProps {
  size?: number
  animated?: boolean
  className?: string
}

export default function OwlIcon({ size = 40, animated = false, className = '' }: OwlIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-[breathe_2s_ease-in-out_infinite]' : ''} ${className}`}
      style={animated ? { animation: 'breathe 2s ease-in-out infinite' } : {}}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      {/* Body */}
      <polygon points="50,15 75,35 72,75 50,85 28,75 25,35" fill="#FFFFFF" />
      {/* Wings */}
      <polygon points="25,35 5,55 20,70 28,75" fill="#CCCCCC" />
      <polygon points="75,35 95,55 80,70 72,75" fill="#CCCCCC" />
      {/* Head */}
      <polygon points="50,10 65,25 35,25" fill="#FFFFFF" />
      {/* Ear tufts */}
      <polygon points="38,10 35,25 42,20" fill="#FFFFFF" />
      <polygon points="62,10 65,25 58,20" fill="#FFFFFF" />
      {/* Eyes */}
      <circle cx="40" cy="34" r="7" fill="#C0392B" />
      <circle cx="60" cy="34" r="7" fill="#C0392B" />
      <circle cx="40" cy="34" r="3" fill="#1a0000" />
      <circle cx="60" cy="34" r="3" fill="#1a0000" />
      {/* Eye glow */}
      <circle cx="40" cy="34" r="7" fill="none" stroke="#E74C3C" strokeWidth="1" opacity="0.7" />
      <circle cx="60" cy="34" r="7" fill="none" stroke="#E74C3C" strokeWidth="1" opacity="0.7" />
      {/* Beak */}
      <polygon points="50,40 45,46 55,46" fill="#E67E22" />
      {/* Belly pattern */}
      <ellipse cx="50" cy="62" rx="12" ry="15" fill="#E8E8E8" opacity="0.3" />
      {/* Feet */}
      <line x1="44" y1="85" x2="39" y2="95" stroke="#E67E22" strokeWidth="2" />
      <line x1="50" y1="85" x2="50" y2="96" stroke="#E67E22" strokeWidth="2" />
      <line x1="56" y1="85" x2="61" y2="95" stroke="#E67E22" strokeWidth="2" />
    </svg>
  )
}
