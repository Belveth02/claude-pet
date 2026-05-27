// 桌宠动画状态
export type PetState = 'idle' | 'walking' | 'dragged' | 'sleeping' | 'thinking'

// 眼睛状态
export type EyeState = 'normal' | 'blink' | 'closed' | 'happy' | 'lookUp' | 'lookSide'

// 嘴巴状态
export type MouthState = 'smile' | 'open' | 'surprised' | 'neutral' | 'sleep'

// 爪子状态
export type ClawState = 'idle' | 'wave' | 'typing' | 'rest'

// 动画状态集合
export interface AnimationState {
  pet: PetState
  eyes: EyeState
  mouth: MouthState
  leftClaw: ClawState
  rightClaw: ClawState
  bodyBob: boolean
  starsTwinkle: boolean
  opacity: number
}
