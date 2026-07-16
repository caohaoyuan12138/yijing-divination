import { useState, useEffect } from 'react';
import { getDailyFortune } from '@/lib/daily-fortune';

export default function DailyFortunePanel() {
  const [date, setDate] = useState(new Date());
  const [fortune, setFortune] = useState<any>(null);
  const [tab, setTab] = useState<'daily' | 'hexagram' | 'classic'>('daily');

  useEffect(() => {
    setFortune(getDailyFortune(date));
  }, [date]);

  if (!fortune) return null;

  return (
    <div className="panel">
      {/* 标签页切换 */}
      <div className="flex gap-2 mb-4 border-b border-border-light pb-2">
        <button
          onClick={() => setTab('daily')}
          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
            tab === 'daily' ? 'bg-gold/10 text-gold' : 'text-text-muted hover:bg-surface-alt'
          }`}
        >
          📅 每日运势
        </button>
        <button
          onClick={() => setTab('hexagram')}
          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
            tab === 'hexagram' ? 'bg-gold/10 text-gold' : 'text-text-muted hover:bg-surface-alt'
          }`}
        >
          ☯ 每日一卦
        </button>
        <button
          onClick={() => setTab('classic')}
          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
            tab === 'classic' ? 'bg-gold/10 text-gold' : 'text-text-muted hover:bg-surface-alt'
          }`}
        >
          📖 典籍
        </button>
      </div>

      {/* 日期选择 */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setDate(new Date(date.getTime() - 86400000))}
          className="px-2 py-1 bg-surface-alt rounded text-xs hover:bg-surface-alt/80"
        >
          ←
        </button>
        <span className="text-xs text-text-muted flex-1 text-center">
          {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日
        </span>
        <button
          onClick={() => setDate(new Date(date.getTime() + 86400000))}
          className="px-2 py-1 bg-surface-alt rounded text-xs hover:bg-surface-alt/80"
        >
          →
        </button>
      </div>

      {/* 每日运势 */}
      {tab === 'daily' && (
        <div className="space-y-3">
          {/* 宜忌 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-success/5 rounded-lg">
              <div className="text-xs text-success font-bold mb-1">✅ 宜</div>
              <div className="text-xs text-text-secondary space-y-0.5">
                {fortune.yi.map((item: string, i: number) => (
                  <div key={i}>{item}</div>
                ))}
              </div>
            </div>
            <div className="p-2 bg-cinnabar/5 rounded-lg">
              <div className="text-xs text-cinnabar font-bold mb-1">❌ 忌</div>
              <div className="text-xs text-text-secondary space-y-0.5">
                {fortune.ji.map((item: string, i: number) => (
                  <div key={i}>{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 方位 */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-gold/5 rounded text-center">
              <div className="text-text-muted">财神</div>
              <div className="text-gold font-bold">{fortune.wealthDirection}</div>
            </div>
            <div className="p-2 bg-gold/5 rounded text-center">
              <div className="text-text-muted">喜神</div>
              <div className="text-gold font-bold">{fortune.joyDirection}</div>
            </div>
            <div className="p-2 bg-gold/5 rounded text-center">
              <div className="text-text-muted">福神</div>
              <div className="text-gold font-bold">{fortune.blessingDirection}</div>
            </div>
          </div>

          {/* 冲煞 */}
          <div className="p-2 bg-cinnabar/5 rounded-lg text-xs">
            <span className="text-cinnabar">冲煞：</span>
            <span className="text-text-secondary">冲{fortune.clash.shengxiao}（{fortune.clash.direction}）</span>
          </div>

          {/* 分类运势 */}
          <div className="space-y-2">
            <div className="text-xs text-text-muted font-bold">分类运势</div>
            {[
              { name: '事业', data: fortune.fortune.career, icon: '💼' },
              { name: '爱情', data: fortune.fortune.love, icon: '💕' },
              { name: '健康', data: fortune.fortune.health, icon: '🏃' },
              { name: '财富', data: fortune.fortune.wealth, icon: '💰' },
            ].map((cat, i) => (
              <div key={i} className="p-2 bg-surface-alt rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">{cat.icon} {cat.name}</span>
                  <span className="text-xs text-gold font-bold">{cat.data.score}分</span>
                </div>
                <div className="text-xs text-text-secondary">{cat.data.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 每日一卦 */}
      {tab === 'hexagram' && (
        <div className="space-y-3 text-center">
          <div className="text-6xl mb-2">
            {String.fromCodePoint(0x4DC0 + fortune.hexagram.upperTrigram * 8 + fortune.hexagram.lowerTrigram)}
          </div>
          <div className="text-xl font-bold text-gold">{fortune.hexagram.name}</div>
          <div className="text-sm text-text-secondary">{fortune.hexagram.meaning}</div>
          <div className="p-3 bg-gold/5 rounded-lg text-xs text-text-secondary">
            每日卦象根据时间自动计算，揭示当日能量走向。
          </div>
        </div>
      )}

      {/* 典籍阅读 */}
      {tab === 'classic' && (
        <div className="space-y-2">
          {['周易', '奇门遁甲', '太乙神数', '六壬神课', '梅花易数'].map((book, i) => (
            <div key={i} className="p-2 bg-surface-alt rounded-lg hover:bg-surface-alt/80 cursor-pointer">
              <div className="text-xs font-bold text-gold">{book}</div>
              <div className="text-xs text-text-muted">点击开始阅读</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
