import type { EyeState } from './types'

interface PetEyesProps {
  state: EyeState
  sleeping: boolean
}

export default function PetEyes({ state, sleeping }: PetEyesProps) {
  // 睡觉和闭眼
  if (sleeping || state === 'closed') {
    return (
      <g fill="#111">
        <rect x="178" y="238" width="44" height="5" rx="2.5"/>
        <rect x="290" y="238" width="44" height="5" rx="2.5"/>
      </g>
    )
  }

  // 眨眼: 极细线
  if (state === 'blink') {
    return (
      <g fill="#111">
        <rect x="178" y="240" width="44" height="3" rx="1.5"/>
        <rect x="290" y="240" width="44" height="3" rx="1.5"/>
      </g>
    )
  }

  // 开心: 弯月眼 (倒V变弧形)
  if (state === 'happy') {
    return (
      <g fill="#111">
        <path d="M184 240 Q200 225 216 240 Q200 232 184 240 Z"/>
        <path d="M296 240 Q312 225 328 240 Q312 232 296 240 Z"/>
      </g>
    )
  }

  // 向上看: 瞳孔上移
  if (state === 'lookUp') {
    return (
      <g fill="#111">
        <path d="M200 232 L182 220 L182 245 Z"/>
        <path d="M312 232 L330 220 L330 245 Z"/>
      </g>
    )
  }

  // 向侧面看
  if (state === 'lookSide') {
    return (
      <g fill="#111">
        <path d="M200 235 L185 220 L185 250 Z"/>
        <path d="M312 235 L330 220 L330 250 Z"/>
      </g>
    )
  }

  // 正常眼睛 (三角形)
  return (
    <g fill="#111">
      <path d="M200 235 L180 220 L180 250 Z"/>
      <path d="M312 235 L332 220 L332 250 Z"/>
    </g>
  )
}
