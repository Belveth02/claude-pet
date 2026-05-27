import { useState } from 'react'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import type { AnimationState } from '../pet/types'

interface BubbleProps {
  visible: boolean
  anim: AnimationState
  onClose: () => void
}

const stateLabels: Record<string, string> = {
  idle: '待机', sleeping: '睡眠', dragged: '拖拽中', thinking: '思考中',
  normal: '正常', blink: '眨眼', closed: '闭眼', happy: '开心', lookUp: '向上看', lookSide: '侧看',
  smile: '微笑', open: '张嘴', surprised: '惊讶', neutral: '平静', sleep: '睡觉嘴',
  wave: '挥爪', typing: '打字', rest: '休息',
}

export default function Bubble({ visible, anim, onClose }: BubbleProps) {
  const [copied, setCopied] = useState(false)

  if (!visible) return null

  const statusText = [
    `状态: ${stateLabels[anim.pet] || anim.pet}`,
    `眼睛: ${stateLabels[anim.eyes] || anim.eyes}`,
    `嘴巴: ${stateLabels[anim.mouth] || anim.mouth}`,
    `左爪: ${stateLabels[anim.leftClaw] || anim.leftClaw}`,
    `右爪: ${stateLabels[anim.rightClaw] || anim.rightClaw}`,
    `透明度: ${Math.round(anim.opacity * 100)}%`,
    anim.bodyBob ? '身体: 晃动中' : '',
    anim.starsTwinkle ? '星星: 闪烁中' : '',
  ].filter(Boolean).join('\n')

  const handleCopy = async () => {
    await writeText(statusText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{
      position: 'absolute',
      top: -100, left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      borderRadius: 12,
      padding: 10,
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      minWidth: 180,
      fontFamily: 'monospace',
      fontSize: 12,
      zIndex: 100,
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#2b0d00', textAlign: 'center' }}>
        {stateLabels[anim.pet] || anim.pet}
      </div>

      <pre style={{
        fontSize: 10, background: '#f8f8f8', padding: 6, borderRadius: 6,
        margin: '0 0 6px', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        maxHeight: 120, overflow: 'auto',
      }}>
        {statusText}
      </pre>

      <button onClick={handleCopy} style={btnStyle}>
        {copied ? '已复制' : '复制当前状态'}
      </button>

      <button onClick={onClose} style={{ ...btnStyle, background: '#eee', color: '#999' }}>
        关闭
      </button>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  display: 'block', width: '100%',
  padding: '6px 10px', marginBottom: 4,
  border: 'none', borderRadius: 6,
  background: '#f0f0ff', color: '#1e1b4b',
  cursor: 'pointer', fontFamily: 'monospace',
  fontSize: 11, textAlign: 'left',
}
