import type { CSSProperties } from 'react'

type DecorationProps = {
  kind: 'butterfly' | 'flowers-tl' | 'flowers-br' | 'flowers-tr' | 'branch'
  color?: string
  style?: CSSProperties
  className?: string
}

export function Decoration({ kind, color = '#5b2d8e', style, className }: DecorationProps) {
  const common = { width: '100%', height: '100%', display: 'block', ...style }
  switch (kind) {
    case 'butterfly':
      return (
        <svg viewBox="0 0 120 100" style={common} className={className} aria-hidden>
          <g fill={color} opacity="0.95">
            <ellipse cx="38" cy="42" rx="28" ry="34" transform="rotate(-18 38 42)" />
            <ellipse cx="82" cy="42" rx="28" ry="34" transform="rotate(18 82 42)" />
            <ellipse cx="32" cy="68" rx="16" ry="20" transform="rotate(-12 32 68)" opacity="0.85" />
            <ellipse cx="88" cy="68" rx="16" ry="20" transform="rotate(12 88 68)" opacity="0.85" />
            <ellipse cx="60" cy="52" rx="7" ry="22" fill="#2a1840" />
            <circle cx="60" cy="28" r="4" fill="#2a1840" />
            <path d="M56 26 Q48 8 42 4" stroke="#2a1840" strokeWidth="2" fill="none" />
            <path d="M64 26 Q72 8 78 4" stroke="#2a1840" strokeWidth="2" fill="none" />
            <ellipse cx="30" cy="38" rx="6" ry="9" fill="#c9a6e8" opacity="0.55" />
            <ellipse cx="90" cy="38" rx="6" ry="9" fill="#c9a6e8" opacity="0.55" />
          </g>
        </svg>
      )
    case 'flowers-tl':
      return (
        <svg viewBox="0 0 220 180" style={common} className={className} aria-hidden>
          <g>
            <path d="M20 160 C40 120, 70 90, 110 70" stroke="#6b7280" strokeWidth="2" fill="none" />
            <path d="M50 150 C80 110, 120 85, 160 55" stroke="#6b7280" strokeWidth="1.5" fill="none" />
            <Flower cx={70} cy={55} r={28} color={color} />
            <Flower cx={120} cy={40} r={22} color="#7c3aed" />
            <Flower cx={40} cy={95} r={18} color="#8b5cf6" />
            <Flower cx={155} cy={70} r={16} color="#a78bfa" />
            <Leaf x={90} y={100} rot={-30} />
            <Leaf x={130} y={85} rot={20} />
            <circle cx={100} cy={120} r={4} fill="#ddd6fe" />
            <circle cx={145} cy={100} r={3} fill="#ede9fe" />
          </g>
        </svg>
      )
    case 'flowers-tr':
      return (
        <svg viewBox="0 0 200 160" style={common} className={className} aria-hidden>
          <g>
            <path d="M180 20 C140 40, 100 70, 70 120" stroke="#6b7280" strokeWidth="2" fill="none" />
            <Flower cx={150} cy={45} r={26} color={color} />
            <Flower cx={110} cy={30} r={18} color="#7c3aed" />
            <Flower cx={175} cy={80} r={14} color="#a78bfa" />
            <Leaf x={100} y={70} rot={40} />
            <Leaf x={140} y={90} rot={-10} />
          </g>
        </svg>
      )
    case 'flowers-br':
      return (
        <svg viewBox="0 0 240 200" style={common} className={className} aria-hidden>
          <g>
            <path d="M20 40 C60 80, 120 130, 200 170" stroke="#6b7280" strokeWidth="2" fill="none" />
            <path d="M40 20 C90 70, 150 120, 220 150" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
            <Flower cx={170} cy={140} r={30} color={color} />
            <Flower cx={120} cy={160} r={20} color="#7c3aed" />
            <Flower cx={200} cy={100} r={16} color="#a78bfa" />
            <Leaf x={80} y={100} rot={25} />
            <Leaf x={140} y={90} rot={-35} />
            <circle cx={90} cy={140} r={3.5} fill="#ddd6fe" />
          </g>
        </svg>
      )
    case 'branch':
      return (
        <svg viewBox="0 0 260 80" style={common} className={className} aria-hidden>
          <path
            d="M10 50 C60 20, 120 70, 180 35 S240 20 250 40"
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
          />
          <Leaf x={50} y={30} rot={-40} />
          <Leaf x={110} y={45} rot={30} />
          <Leaf x={170} y={25} rot={-20} />
          <circle cx={90} cy={35} r={3} fill={color} />
          <circle cx={150} cy={48} r={3} fill="#a78bfa" />
          <circle cx={210} cy={32} r={2.5} fill="#c4b5fd" />
        </svg>
      )
  }
}

function Flower({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const petals = 5
  return (
    <g>
      {Array.from({ length: petals }).map((_, i) => {
        const a = (i / petals) * Math.PI * 2 - Math.PI / 2
        const px = cx + Math.cos(a) * r * 0.55
        const py = cy + Math.sin(a) * r * 0.55
        return <ellipse key={i} cx={px} cy={py} rx={r * 0.42} ry={r * 0.55} fill={color} opacity="0.9" />
      })}
      <circle cx={cx} cy={cy} r={r * 0.28} fill="#1f1235" />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#f5e8ff" />
    </g>
  )
}

function Leaf({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={18}
      ry={8}
      fill="#9ca3af"
      opacity="0.75"
      transform={`rotate(${rot} ${x} ${y})`}
    />
  )
}
