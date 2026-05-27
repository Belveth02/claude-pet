import { useState, useEffect, useRef } from 'react'
import type { PetState, AnimationState, EyeState, MouthState, ClawState } from '../pet/types'

const BLINK_INTERVAL = 4000
const RANDOM_MIN = 6000
const RANDOM_MAX = 12000

const idleDefaults = {
  eyes: 'normal' as EyeState,
  mouth: 'smile' as MouthState,
  leftClaw: 'idle' as ClawState,
  rightClaw: 'idle' as ClawState,
  bodyBob: false,
  starsTwinkle: false,
  opacity: 1,
}

export function useAnimationMachine(petState: PetState) {
  const [anim, setAnim] = useState<AnimationState>({
    pet: petState,
    ...idleDefaults,
  })

  const blinkTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const randomTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const actionEndTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // 清理所有定时器
  const clearAll = () => {
    clearTimeout(blinkTimer.current)
    clearTimeout(randomTimer.current)
    clearTimeout(actionEndTimer.current)
  }

  // 重置为 idle 默认动画
  const resetToIdle = () => {
    setAnim(a => ({ ...a, ...idleDefaults, pet: 'idle' }))
  }

  // ====== 状态响应 ======
  useEffect(() => {
    clearAll()

    switch (petState) {
      case 'sleeping':
        setAnim({
          pet: 'sleeping', eyes: 'closed', mouth: 'sleep',
          leftClaw: 'rest', rightClaw: 'rest',
          bodyBob: false, starsTwinkle: false, opacity: 0.55,
        })
        break

      case 'dragged':
        setAnim(a => ({
          ...a, pet: 'dragged', eyes: 'normal', mouth: 'neutral', opacity: 0.85,
        }))
        break

      case 'thinking':
        setAnim({
          pet: 'thinking', eyes: 'lookUp', mouth: 'neutral',
          leftClaw: 'typing', rightClaw: 'typing',
          bodyBob: true, starsTwinkle: true, opacity: 1,
        })
        break

      case 'idle':
        resetToIdle()
        break
    }
  }, [petState])

  // ====== 眨眼循环 (idle 时) ======
  useEffect(() => {
    if (petState !== 'idle') return

    let active = true

    const schedule = () => {
      if (!active) return
      blinkTimer.current = setTimeout(() => {
        if (!active) return
        setAnim(a => (a.pet === 'idle' ? { ...a, eyes: 'blink' } : a))
        blinkTimer.current = setTimeout(() => {
          if (!active) return
          setAnim(a => (a.pet === 'idle' ? { ...a, eyes: 'normal' } : a))
          schedule()
        }, 150)
      }, BLINK_INTERVAL + Math.random() * 2000)
    }

    schedule()
    return () => { active = false; clearTimeout(blinkTimer.current) }
  }, [petState])

  // ====== 随机动作 (idle 时) ======
  useEffect(() => {
    if (petState !== 'idle') return

    let active = true

    const actions = [
      // 挥左爪
      () => {
        setAnim(a => (a.pet === 'idle' ? { ...a, leftClaw: 'wave' } : a))
        actionEndTimer.current = setTimeout(() => {
          setAnim(a => (a.pet === 'idle' ? { ...a, leftClaw: 'idle' } : a))
        }, 1600)
      },
      // 开心表情
      () => {
        setAnim(a => (a.pet === 'idle' ? { ...a, eyes: 'happy', mouth: 'open' } : a))
        actionEndTimer.current = setTimeout(() => {
          setAnim(a => (a.pet === 'idle' ? { ...a, eyes: 'normal', mouth: 'smile' } : a))
        }, 1400)
      },
      // 星星闪
      () => {
        setAnim(a => (a.pet === 'idle' ? { ...a, starsTwinkle: true } : a))
        actionEndTimer.current = setTimeout(() => {
          setAnim(a => (a.pet === 'idle' ? { ...a, starsTwinkle: false } : a))
        }, 2000)
      },
      // 身体晃
      () => {
        setAnim(a => (a.pet === 'idle' ? { ...a, bodyBob: true } : a))
        actionEndTimer.current = setTimeout(() => {
          setAnim(a => (a.pet === 'idle' ? { ...a, bodyBob: false } : a))
        }, 800)
      },
      // 侧看
      () => {
        setAnim(a => (a.pet === 'idle' ? { ...a, eyes: 'lookSide', mouth: 'neutral' } : a))
        actionEndTimer.current = setTimeout(() => {
          setAnim(a => (a.pet === 'idle' ? { ...a, eyes: 'normal', mouth: 'smile' } : a))
        }, 1800)
      },
      // 右爪挥
      () => {
        setAnim(a => (a.pet === 'idle' ? { ...a, rightClaw: 'wave' } : a))
        actionEndTimer.current = setTimeout(() => {
          setAnim(a => (a.pet === 'idle' ? { ...a, rightClaw: 'idle' } : a))
        }, 1600)
      },
    ]

    const schedule = () => {
      if (!active) return
      randomTimer.current = setTimeout(() => {
        if (!active) return
        const act = actions[Math.floor(Math.random() * actions.length)]
        act()
        schedule()
      }, RANDOM_MIN + Math.random() * (RANDOM_MAX - RANDOM_MIN))
    }

    schedule()
    return () => { active = false; clearTimeout(randomTimer.current); clearTimeout(actionEndTimer.current) }
  }, [petState])

  return anim
}
