import { useEffect } from 'react'
import type { Task } from '@/types/task'
import { playSpinTick } from '@/services/audio/audioService'

const SIZE = 380
const CX = SIZE / 2
const CY = SIZE / 2
const R = 162
const INNER_R = 36
export const SPIN_DURATION = 3200

const DEFAULT_COLORS = [
  '#FF6B6B', '#FF9F3C', '#FFD93D', '#52C99B',
  '#9B8FFF', '#74C0FC', '#FFB5A7', '#D4BBFF',
  '#FFC3A0', '#A8E6CF', '#C9B1FF', '#B3E0FF',
]

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function slicePath(startAngle: number, endAngle: number): string {
  const o1 = polar(CX, CY, R, startAngle)
  const o2 = polar(CX, CY, R, endAngle)
  const i1 = polar(CX, CY, INNER_R, startAngle)
  const i2 = polar(CX, CY, INNER_R, endAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${i1.x} ${i1.y}`,
    `L ${o1.x} ${o1.y}`,
    `A ${R} ${R} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${i1.x} ${i1.y}`,
    'Z',
  ].join(' ')
}

interface Props {
  tasks: Task[]
  categoryColors: Record<string, string>
  rotation: number
  isSpinning: boolean
  onSpinComplete: () => void
  onTick?: () => void
}

export function ChoreWheel({ tasks, categoryColors, rotation, isSpinning, onSpinComplete, onTick }: Props) {
  const n = tasks.length
  const sliceAngle = n > 0 ? 360 / n : 360

  useEffect(() => {
    if (!isSpinning) return

    const timer = setTimeout(onSpinComplete, SPIN_DURATION + 80)

    const tickCount = 38
    const handles: ReturnType<typeof setTimeout>[] = []
    for (let i = 0; i < tickCount; i++) {
      const t = Math.pow(i / tickCount, 1.6) * (SPIN_DURATION * 0.96)
      handles.push(setTimeout(() => {
        playSpinTick()
        onTick?.()
      }, t))
    }

    return () => {
      clearTimeout(timer)
      handles.forEach(clearTimeout)
    }
  }, [isSpinning]) // eslint-disable-line react-hooks/exhaustive-deps

  if (n === 0) {
    return (
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={CX} cy={CY} r={R} fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fill="rgba(45,45,58,0.35)" fontSize="14" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="500">
            No tasks due
          </text>
        </svg>
      </div>
    )
  }

  const labelFontSize = n <= 4 ? 13 : n <= 7 ? 11 : n <= 12 ? 9 : 8
  const maxLabelChars = n <= 4 ? 14 : n <= 7 ? 12 : n <= 12 ? 10 : 8

  return (
    <div className="relative select-none" style={{ width: SIZE, height: SIZE }}>
      {/* Pointer arrow */}
      <div
        className="absolute left-1/2 z-10 pointer-events-none"
        style={{
          top: -6,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '13px solid transparent',
          borderRight: '13px solid transparent',
          borderTop: '26px solid #FF6B6B',
          filter: 'drop-shadow(0 3px 6px rgba(255,107,107,0.55))',
        }}
      />

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="wheel-shine" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <filter id="wheel-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer glow ring */}
        <circle cx={CX} cy={CY} r={R + 14} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="18" />
        <circle cx={CX} cy={CY} r={R + 8} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="6" />

        {/* Spinning wheel group */}
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
            transition: `transform ${SPIN_DURATION}ms cubic-bezier(0.15, 0.6, 0.1, 1)`,
            filter: 'url(#wheel-shadow)',
          }}
        >
          {tasks.map((task, i) => {
            const start = i * sliceAngle
            const end = (i + 1) * sliceAngle
            const mid = (i + 0.5) * sliceAngle
            const color = task.categoryId
              ? (categoryColors[task.categoryId] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length])
              : DEFAULT_COLORS[i % DEFAULT_COLORS.length]

            const labelR = (R + INNER_R) / 2 + 4
            const labelPos = polar(CX, CY, labelR, mid)
            const label = task.title.length > maxLabelChars
              ? task.title.slice(0, maxLabelChars - 1) + '…'
              : task.title

            return (
              <g key={task.id}>
                <path
                  d={slicePath(start, end)}
                  fill={color}
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="2.5"
                />
                <path
                  d={slicePath(start, end)}
                  fill="url(#wheel-shine)"
                  stroke="none"
                />
                {n <= 20 && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={labelFontSize}
                    fontWeight="700"
                    fontFamily="Bricolage Grotesque, sans-serif"
                    fill="white"
                    style={{
                      transform: `rotate(${mid}deg)`,
                      transformOrigin: `${labelPos.x}px ${labelPos.y}px`,
                      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }}
                    paintOrder="stroke"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  >
                    {label}
                  </text>
                )}
              </g>
            )
          })}
        </g>

        {/* Center hub (non-rotating, layered on top) */}
        <circle cx={CX} cy={CY} r={INNER_R + 6} fill="rgba(255,255,255,0.95)" />
        <circle cx={CX} cy={CY} r={INNER_R + 2} fill="#FFF8F5" />
        <circle cx={CX} cy={CY} r={INNER_R - 2} fill="rgba(45,45,58,0.06)" />
        <circle cx={CX} cy={CY} r={10} fill="rgba(45,45,58,0.12)" />
        <circle cx={CX} cy={CY} r={5} fill="rgba(45,45,58,0.25)" />
      </svg>
    </div>
  )
}
