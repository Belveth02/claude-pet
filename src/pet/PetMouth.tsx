import type { MouthState } from './types'

interface PetMouthProps {
  state: MouthState
}

export default function PetMouth({ state }: PetMouthProps) {
  switch (state) {
    case 'open':
      return (
        <g fill="#4a1200">
          <ellipse cx="256" cy="280" rx="14" ry="16"/>
          <ellipse cx="256" cy="275" rx="10" ry="8" fill="#ffb347"/>
        </g>
      )

    case 'surprised':
      return (
        <g fill="#4a1200">
          <ellipse cx="256" cy="278" rx="16" ry="20"/>
          <ellipse cx="256" cy="273" rx="12" ry="10" fill="#ffb347"/>
        </g>
      )

    case 'neutral':
      return (
        <line x1="236" y1="278" x2="276" y2="278" stroke="#4a1200" strokeWidth="4" strokeLinecap="round"/>
      )

    case 'sleep':
      return (
        <g fill="none" stroke="#4a1200" strokeWidth="3" strokeLinecap="round">
          <path d="M240 275 Q248 272 256 275 Q264 278 272 275"/>
        </g>
      )

    case 'smile':
    default:
      return (
        <g fill="none" stroke="#4a1200" strokeWidth="3.5" strokeLinecap="round">
          <path d="M240 275 Q256 290 272 275"/>
        </g>
      )
  }
}
