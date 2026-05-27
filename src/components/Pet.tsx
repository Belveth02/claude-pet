import { useState, useCallback, useEffect, useRef } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { PetState } from '../pet/types'
import { useAnimationMachine } from '../hooks/useAnimationMachine'
import PetCharacter from '../pet/PetCharacter'
import Bubble from './Bubble'
import ContextMenu from './ContextMenu'

const SLEEP_TIMEOUT = 30000
const DRAG_THRESHOLD = 5

export default function Pet() {
  const [state, setState] = useState<PetState>('idle')
  const [pos, setPos] = useState({ x: 80, y: 80 })
  const [showBubble, setShowBubble] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const isDown = useRef(false)
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)
  const sleepTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const anim = useAnimationMachine(state)

  useEffect(() => {
    clearTimeout(sleepTimer.current)
    if (state === 'idle') {
      sleepTimer.current = setTimeout(() => setState('sleeping'), SLEEP_TIMEOUT)
    }
    return () => clearTimeout(sleepTimer.current)
  }, [state])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDown.current = true
    dragStart.current = { x: e.clientX, y: e.clientY }
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    hasMoved.current = false
    dragging.current = false
    setContextMenu(null)
  }, [pos])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDown.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      hasMoved.current = true
    }
    if (hasMoved.current) {
      if (!dragging.current) {
        dragging.current = true
        setState('dragged')
      }
      const nx = e.clientX - dragOffset.current.x
      const ny = e.clientY - dragOffset.current.y
      setPos({
        x: Math.max(0, Math.min(nx, window.innerWidth - 300)),
        y: Math.max(0, Math.min(ny, window.innerHeight - 400)),
      })
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    isDown.current = false
    if (dragging.current) {
      dragging.current = false
      setState('idle')
      return
    }
    if (state === 'sleeping') {
      setState('idle')
    } else {
      setShowBubble(v => !v)
    }
  }, [state])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowBubble(false)
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleLaunchClaude = useCallback(() => {
    setShowBubble(false)
    setContextMenu(null)
    invoke('launch_claude_code').catch(err => alert('Claude Code 启动失败: ' + err))
  }, [])

  const handleLaunchVSCode = useCallback(() => {
    setShowBubble(false)
    setContextMenu(null)
    invoke('launch_vscode').catch(err => alert('VSCode 启动失败: ' + err))
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onContextMenu={handleContextMenu}
        style={{
          position: 'absolute',
          left: pos.x, top: pos.y,
          width: 300, height: 400,
          cursor: dragging.current ? 'grabbing' : 'pointer',
          userSelect: 'none' as const,
          touchAction: 'none',
          zIndex: 10,
        }}
      >
        <PetCharacter anim={anim} />
        <Bubble
          visible={showBubble}
          anim={anim}
          onClose={() => setShowBubble(false)}
        />
      </div>
      <ContextMenu
        position={contextMenu}
        onClose={() => setContextMenu(null)}
        onLaunchClaude={handleLaunchClaude}
        onLaunchVSCode={handleLaunchVSCode}
      />
    </div>
  )
}
