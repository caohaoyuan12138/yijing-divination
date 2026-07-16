/**
 * 周易摇卦动画 v8.0 — 电影级视频 + 3D铜钱
 * 
 * 使用 AI 生成的龟壳卜卦视频作为背景动画，
 * 在摇卦阶段播放电影级视频，随后3D铜钱翻转揭示结果
 * 
 * 视频 URL: /videos/divination.mp4
 */
import { useState, useEffect, useRef } from 'react';

type Phase = 'idle' | 'focusing' | 'shaking' | 'falling' | 'revealed';

const VIDEO_URL = '/videos/divination.mp4';
const POSTER_URL = '/images/shell-static.png';

/* ============================================================
 *  铜钱 3D 翻转
 * ============================================================ */
function Coin3D({ value, index, phase, intensity }: {
  value: number; index: number; phase: Phase; intensity: number;
}) {
  const getTransform = (): string => {
    switch (phase) {
      case 'idle':
        return `translateX(${(index - 1) * 70}px) translateY(0) rotateY(0deg)`;
      case 'focusing':
        return `translateX(${(index - 1) * 70}px) translateY(-20px) rotateY(${20 + index * 15}deg) rotateX(${10 + index * 5}deg)`;
      case 'shaking':
        const shake = Math.sin(Date.now() * 0.018 * (index + 1)) * 10 * intensity;
        return `translateX(${shake + (index - 1) * 70}px) translateY(-30px) rotateY(${index * 60}deg) rotateX(${30 + intensity * 60}deg)`;
      case 'falling':
      case 'revealed':
        const rounds = 4 + index * 2;
        const finalRotY = value === 3 ? 0 : 180;
        return `translateX(${(index - 1) * 70}px) translateY(250px) rotateY(${rounds * 360 + finalRotY}deg) rotateX(${360 * 3}deg)`;
      default:
        return `translateX(0) translateY(0)`;
    }
  };

  const getTransition = (): string => {
    switch (phase) {
      case 'idle': return 'all 0.5s ease-out';
      case 'focusing': return 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      case 'shaking': return 'all 0.1s linear';
      case 'falling': return `all ${1.5 + index * 0.3}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      case 'revealed': return 'all 0.4s ease';
      default: return 'all 0.3s ease';
    }
  };

  const visible = phase === 'shaking' || phase === 'falling' || phase === 'revealed';

  if (!visible) return null;

  return (
    <div className="absolute left-1/3 top-1/2 -translate-y-1/2"
      style={{
        perspective: 800,
        zIndex: phase === 'falling' || phase === 'revealed' ? 20 : 10,
        opacity: phase === 'shaking' ? 0.7 : 1,
      }}>
      <div className="relative w-16 h-16"
        style={{
          transformStyle: 'preserve-3d',
          transform: getTransform(),
          transition: getTransition(),
        }}>
        {/* 正面 */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #ffe066, #daa520 50%, #8b6914)',
            boxShadow: phase === 'falling' || phase === 'revealed'
              ? '0 8px 25px rgba(139,69,19,0.4), 0 0 30px rgba(218,165,32,0.2)'
              : '0 4px 15px rgba(139,69,19,0.3)',
            border: '3px solid #b8860b',
            fontFamily: '"Noto Serif SC", serif',
            fontWeight: 700,
            fontSize: '13px',
            color: '#5a4520',
            backfaceVisibility: 'hidden',
            transition: 'box-shadow 0.4s ease',
          }}>
          <span>乾隆通宝</span>
          <div className="absolute w-3.5 h-3.5 bg-ink border border-gold rounded-sm" />
        </div>
        {/* 背面 */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #cd853f, #a0522d 50%, #5a3010)',
            boxShadow: '0 4px 15px rgba(60,30,10,0.4)',
            border: '3px solid #8b4513',
            fontFamily: '"Noto Serif SC", serif',
            fontWeight: 700,
            fontSize: '13px',
            color: '#4a3520',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}>
          <span>光绪元年</span>
          <div className="absolute w-3.5 h-3.5 bg-ink border border-[#cd853f] rounded-sm" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 *  主场景
 * ============================================================ */
export default function TurtleShellScene({
  coins, isFlipping, flipProgress, yaoIndex = 0,
}: {
  coins: [number, number, number];
  isFlipping: boolean;
  flipProgress: number;
  yaoIndex?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  // 动画状态机 — 三枚铜钱掷六次（支持快速模式）
  useEffect(() => {
    if (!isFlipping) {
      setPhase('idle');
      return;
    }

    setPhase('focusing');

    // 快速模式：缩短动画时间
    const shakeDelay = 200;
    const fallingDelay = 500 + yaoIndex * 100;
    const revealedDelay = 1000 + yaoIndex * 100;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('shaking'), shakeDelay));
    timers.push(setTimeout(() => setPhase('falling'), fallingDelay));
    timers.push(setTimeout(() => setPhase('revealed'), revealedDelay));

    return () => timers.forEach(t => clearTimeout(t));
  }, [isFlipping, yaoIndex]);

  // 控制视频播放
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (phase === 'shaking' || phase === 'falling') {
      if (video.paused) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    } else if (phase === 'revealed' || phase === 'idle') {
      video.pause();
    }
  }, [phase]);

  const lightingBoost = phase === 'shaking' ? flipProgress * 0.3 :
                        phase === 'falling' ? 0.4 : 0.2;

  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden select-none"
      style={{
        background: '#0a0a12',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(218,165,32,0.08)',
      }}>

      {/* 视频背景（摇卦阶段显示） */}
      {(phase === 'shaking' || phase === 'falling') && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: `brightness(${0.6 + lightingBoost}) contrast(1.1) saturate(1.1)`,
            zIndex: 1,
          }}
          src={VIDEO_URL}
          loop
          muted
          playsInline
          preload="auto"
        />
      )}

      {/* 静态背景（focusing/revealed 阶段显示） */}
      {phase !== 'shaking' && phase !== 'falling' && (
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url(${POSTER_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `brightness(${0.5 + lightingBoost}) contrast(1.1) saturate(1.0)`,
            zIndex: 1,
          }} />
      )}

      {/* 暖色光晕 */}
      <div className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 35%, rgba(218,165,32,${lightingBoost * 0.1}) 0%, transparent 55%)`,
          mixBlendMode: 'screen',
          zIndex: 2,
        }} />

      {/* 铜钱（shaking/falling/revealed 阶段显示） */}
      {coins.map((v, i) => (
        <Coin3D key={`c-${i}-${isFlipping}`} value={v} index={i}
          phase={phase} intensity={flipProgress} />
      ))}

      {/* 冲击波 */}
      {phase === 'revealed' && (
        <div className="absolute left-1/3 top-[72%] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 25 }}>
          {[0, 0.2, 0.4].map((d, i) => (
            <div key={i}
              className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/30"
              style={{ animation: `shockwave 0.6s ease-out ${d}s forwards`, opacity: 0 }} />
          ))}
        </div>
      )}

      {/* 角晕 */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,18,0.5) 100%)',
          zIndex: 30,
        }} />

      {/* HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none" style={{ zIndex: 40 }}>
        <div className="px-5 py-2 rounded-full text-xs font-kaishu tracking-[0.2em]"
          style={{
            background: 'rgba(218,165,32,0.06)',
            border: '1px solid rgba(218,165,32,0.15)',
            color: '#daa520',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.4s ease',
          }}>
          {phase === 'idle' && '☯  静 心 凝 神'}
          {phase === 'focusing' && '✦  心 诚 则 灵'}
          {phase === 'shaking' && '⚡  天 机 将 至'}
          {phase === 'falling' && '☲  乾 坤 翻 转'}
          {phase === 'revealed' && '✧  天 意 已 显'}
        </div>
      </div>

      {/* 底部结果 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 pointer-events-none"
        style={{ zIndex: 40 }}>
        {coins.map((v, i) => (
          <div key={i}
            className="px-3 py-1.5 rounded-lg text-xs font-kaishu transition-all duration-700"
            style={{
              background: phase === 'revealed'
                ? (v === 3 ? 'rgba(218,165,32,0.12)' : 'rgba(108,99,91,0.1)')
                : 'rgba(255,255,255,0.03)',
              border: phase === 'revealed'
                ? `1px solid ${v === 3 ? 'rgba(218,165,32,0.3)' : 'rgba(108,99,91,0.2)'}`
                : '1px solid rgba(255,255,255,0.03)',
              color: phase === 'revealed'
                ? (v === 3 ? '#daa520' : '#8a7e6a)')
                : 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
            }}>
            {phase === 'revealed' ? (v === 3 ? '🪙 阳 ☰' : '🪙 阴 ☷') : `🪙 ${i + 1}`}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shockwave {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(30); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
