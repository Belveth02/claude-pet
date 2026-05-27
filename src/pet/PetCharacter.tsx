import type { AnimationState } from './types'
import PetEyes from './PetEyes'
import PetMouth from './PetMouth'
import PetClaws from './PetClaws'

interface PetCharacterProps {
  anim: AnimationState
}

export default function PetCharacter({ anim }: PetCharacterProps) {
  const { opacity, bodyBob, starsTwinkle } = anim

  const bodyStyle: React.CSSProperties = bodyBob
    ? { animation: 'bob 0.4s ease-in-out 2' }
    : {}

  return (
    <>
      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <svg
        width="300" height="400"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        style={{ opacity }}
      >
        <defs>
          <linearGradient id="orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb347"/>
            <stop offset="100%" stopColor="#ff6b00"/>
          </linearGradient>
        </defs>

        {/* 星星 (可闪烁) */}
        <g fill="#ffb300" style={starsTwinkle ? { animation: 'twinkle 0.8s ease-in-out 2' } : {}}>
          <rect x="120" y="90" width="12" height="36"/>
          <rect x="108" y="102" width="36" height="12"/>
          <rect x="170" y="110" width="8" height="24"/>
          <rect x="162" y="118" width="24" height="8"/>
          <rect x="95" y="145" width="8" height="24"/>
          <rect x="87" y="153" width="24" height="8"/>
        </g>

        {/* 身体 (整体晃动) */}
        <g style={bodyStyle}>
          {/* 爪子 */}
          <PetClaws left={anim.leftClaw} right={anim.rightClaw}/>

          {/* 身体主体 */}
          <rect x="145" y="165" width="222" height="150" fill="url(#orange)" stroke="#4a1200" strokeWidth="8"/>

          {/* 顶部方块 */}
          <g fill="#ff9a2e" stroke="#4a1200" strokeWidth="6">
            <rect x="170" y="145" width="45" height="20"/>
            <rect x="225" y="145" width="45" height="20"/>
            <rect x="280" y="145" width="45" height="20"/>
            <rect x="335" y="145" width="32" height="20"/>
          </g>

          {/* 眼睛 */}
          <PetEyes state={anim.eyes} sleeping={anim.pet === 'sleeping'}/>

          {/* 嘴巴 */}
          <PetMouth state={anim.mouth}/>

          {/* 腿部 */}
          <g fill="#ff7a00" stroke="#4a1200" strokeWidth="6">
            <rect x="175" y="315" width="20" height="55"/>
            <rect x="225" y="315" width="20" height="55"/>
            <rect x="275" y="315" width="20" height="55"/>
            <rect x="325" y="315" width="20" height="55"/>
          </g>
        </g>

        {/* 阴影 */}
        <ellipse cx="256" cy="385" rx="120" ry="14" fill="#000" opacity={0.08 * opacity}/>

        {/* 文字 */}
        <g fontFamily="monospace" fontWeight="900" fontSize="34" fill="#2b0d00" opacity={opacity}>
          <text x="256" y="445" textAnchor="middle">&lt;CLAUDE CODE&gt;</text>
        </g>

        {/* 侧边箭头 */}
        <text x="75" y="445" fontFamily="monospace" fontSize="42" fontWeight="bold" fill="#ff7a00" opacity={opacity}>&lt;</text>
        <text x="430" y="445" fontFamily="monospace" fontSize="42" fontWeight="bold" fill="#ff7a00" opacity={opacity}>&gt;</text>
      </svg>

      {/* Zzz 气泡 */}
      {anim.pet === 'sleeping' && (
        <div style={{
          position: 'absolute', top: 10, left: '55%',
          background: '#1e1b4b', color: '#c4b5fd',
          padding: '4px 14px', borderRadius: 12,
          fontSize: 13, fontFamily: 'monospace', whiteSpace: 'nowrap',
        }}>
          Zzz...
        </div>
      )}
    </>
  )
}
