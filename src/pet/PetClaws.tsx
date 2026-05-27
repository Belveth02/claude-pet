import type { ClawState } from './types'

interface PetClawsProps {
  left: ClawState
  right: ClawState
}

export default function PetClaws({ left, right }: PetClawsProps) {
  const leftTransform = left === 'wave'
    ? 'rotate(-15, 100, 220)'
    : left === 'typing'
      ? 'translate(0, -4)'
      : ''

  const rightTransform = right === 'wave'
    ? 'rotate(15, 412, 220)'
    : right === 'typing'
      ? 'translate(0, -4)'
      : ''

  return (
    <g>
      {/* 左爪 */}
      <g stroke="#4a1200" strokeWidth="6" transform={leftTransform}
        style={{ transition: 'transform 0.3s ease' }}>
        <path d="M95 240 L70 215 L70 175 L95 150 L120 150 L145 175 L145 200 L120 225 L145 250 L145 275 L120 300 L85 300 L60 275 L60 240 Z" fill="url(#orange)"/>
      </g>

      {/* 右爪 */}
      <g stroke="#4a1200" strokeWidth="6" transform={rightTransform}
        style={{ transition: 'transform 0.3s ease' }}>
        <path d="M417 240 L442 215 L442 175 L417 150 L392 150 L367 175 L367 200 L392 225 L367 250 L367 275 L392 300 L427 300 L452 275 L452 240 Z" fill="url(#orange)"/>
      </g>
    </g>
  )
}
