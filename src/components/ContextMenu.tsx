import { useEffect, useRef } from 'react'

interface ContextMenuProps {
  position: { x: number; y: number } | null
  onClose: () => void
  onLaunchClaude: () => void
  onLaunchVSCode: () => void
}

export default function ContextMenu({ position, onClose, onLaunchClaude, onLaunchVSCode }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // 点击空白处关闭
  useEffect(() => {
    if (!position) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // 延迟绑定避免当前点击触发关闭
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [position, onClose])

  if (!position) return null

  const itemStyle: React.CSSProperties = {
    padding: '6px 14px', cursor: 'pointer',
    fontSize: 12, fontFamily: 'monospace',
    whiteSpace: 'nowrap',
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: position.x, top: position.y,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        padding: '4px 0',
        zIndex: 99999,
        minWidth: 180,
        border: '1px solid #e5e4e7',
      }}
    >
      <div style={{ padding: '4px 14px 6px', fontSize: 11, color: '#999', fontFamily: 'monospace' }}>
        Claude Pet
      </div>
      <div style={{ borderTop: '1px solid #eee' }} />
      <div
        style={itemStyle}
        onClick={() => { onLaunchClaude(); onClose() }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f0f0ff')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        在终端打开 Claude Code
      </div>
      <div
        style={itemStyle}
        onClick={() => { onLaunchVSCode(); onClose() }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f0f0ff')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        在 VSCode 中打开
      </div>
      <div style={{ borderTop: '1px solid #eee' }} />
      <div
        style={{ ...itemStyle, color: '#999' }}
        onClick={onClose}
        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        关闭菜单
      </div>
    </div>
  )
}
