import { useState } from 'react';
import { useDivinationGame, HistoryItem } from '@/lib/useDivinationGame';
import TurtleShellScene from '@/components/animation/TurtleShellScene';
import AiAnalysisPanel from '@/components/ui/AiAnalysisPanel';
import SharePanel from '@/components/ui/SharePanel';
import DailyFortunePanel from '@/components/ui/DailyFortunePanel';
import DivinationMethodsPanel from '@/components/ui/DivinationMethodsPanel';
import ClassicReadingPanel from '@/components/ui/ClassicReadingPanel';
import NotesPanel from '@/components/ui/NotesPanel';
import FunFeaturesPanel from '@/components/ui/FunFeaturesPanel';
import HexagramDetailPanel from '@/components/ui/HexagramDetailPanel';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function WebApp() {
  const game = useDivinationGame();
  const [showHistory, setShowHistory] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  const historyItemForRegen = regeneratingIndex !== null ? game.history[regeneratingIndex] : null;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary">
      <header className="relative z-10 text-center py-6 px-4">
        <div className="flex justify-end items-center gap-2 mb-2 max-w-7xl mx-auto">
          <button onClick={() => game.setIsDarkMode(!game.isDarkMode)} className={`px-3 py-1.5 border rounded-lg text-xs transition-all ${game.isDarkMode ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-surface-alt border-border-light text-text-muted hover:bg-surface-alt/80'}`}>{game.isDarkMode ? '🌙 暗黑模式' : '☀️ 清新模式'}</button>
          <button onClick={() => game.setIsFastMode(!game.isFastMode)} className={`px-3 py-1.5 border rounded-lg text-xs transition-all ${game.isFastMode ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-surface-alt border-border-light text-text-muted hover:bg-surface-alt/80'}`}>{game.isFastMode ? '⚡ 快速模式' : '🐢 正常速度'}</button>
          <button onClick={game.toggleMute} className="px-3 py-1.5 bg-surface-alt border border-border-light rounded-lg text-text-muted text-xs hover:bg-surface-alt/80 transition-all">{game.isMuted ? '🔇 静音' : '🔊 音效'}</button>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-2 font-songti tracking-[0.15em]">周易摇卦</h1>
        <p className="text-text-muted text-sm font-kaishu tracking-widest">三枚铜钱 · 六爻成卦 · 趋吉避凶</p>
      </header>
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
        <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-8">
            <div className="panel !p-0 overflow-hidden">
              <TurtleShellScene key={`turtle-${game.coinCount}-${game.isAnimating}`} coins={((game.castResult?.coinsHistory[game.coinCount - 1] as [number, number, number] | undefined) ?? [3, 3, 3]) as [number, number, number]} isFlipping={game.isAnimating} flipProgress={game.shakeProgress} yaoIndex={game.coinCount} />
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="panel h-full flex flex-col">
              <h3 className="text-section-title flex items-center gap-2 mb-3"><span>❓</span> 提出你的问题</h3>
              <div className="flex-1 flex flex-col">
                <textarea ref={game.questionRef} value={game.userQuestion} onChange={(e) => game.setUserQuestion(e.target.value)} disabled={game.isAnimating || !!game.castResult} placeholder="静心凝神，输入你想问的问题..." className="w-full px-4 py-3 bg-surface-alt border border-border-light rounded-xl text-text-primary placeholder-text-muted resize-none text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300 disabled:opacity-50 font-kaishu flex-1 min-h-[120px] mb-3" />
                <div className="mb-3 p-3 bg-surface-alt/50 rounded-xl border border-border-light">
                  <div className="text-xs text-text-muted mb-2">选择起卦方式：</div>
                  <DivinationMethodsPanel onResult={(result: any) => { if (!result) return; game.createResultFromMethod(result); }} disabled={game.isAnimating} />
                </div>
                <div className="mb-3 p-3 bg-surface-alt/50 rounded-xl border border-border-light">
                  <div className="text-xs text-text-muted mb-2 flex items-center gap-1"><span>🕐</span> 占卜时间</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div><label className="text-xs text-text-muted block mb-1">年</label><input type="number" value={game.inputYear} onChange={(e) => game.handleYearChange(e.target.value)} placeholder="2026" className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs" /></div>
                    <div><label className="text-xs text-text-muted block mb-1">月</label><input type="number" min="1" max="12" value={game.inputMonth} onChange={(e) => game.setInputMonth(e.target.value ? parseInt(e.target.value) : '')} placeholder="7" className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs" /></div>
                    <div><label className="text-xs text-text-muted block mb-1">日</label><input type="number" min="1" max="31" value={game.inputDay} onChange={(e) => game.setInputDay(e.target.value ? parseInt(e.target.value) : '')} placeholder="11" className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs" /></div>
                    <div><label className="text-xs text-text-muted block mb-1">时</label><input type="number" min="0" max="23" value={game.inputHour} onChange={(e) => game.setInputHour(e.target.value ? parseInt(e.target.value) : '')} placeholder="14" className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs" /></div>
                  </div>
                  {game.dateTimeInfo && <div className="mt-2 p-2 bg-gold/5 rounded-lg text-xs"><div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"><span className="text-gold font-bold">{game.dateTimeInfo.ganzhi}年</span><span className="text-text-muted">天干：{game.dateTimeInfo.stem}（{game.dateTimeInfo.stemWuxing}）</span><span className="text-text-muted">地支：{game.dateTimeInfo.branch}（{game.dateTimeInfo.branchWuxing}）</span></div><div className="text-text-muted mt-1">生肖：{game.dateTimeInfo.zodiac}</div></div>}
                </div>
                <button onClick={game.startDivination} disabled={game.isAnimating || !game.userQuestion.trim()} className="btn-primary text-base px-6 py-3 tracking-wider w-full">{game.isAnimating ? '🪙 摇卦中...' : '🪙 开始摇卦'}</button>
                {game.castResult && !game.isAnimating && <button onClick={game.handleReset} className="mt-2 px-4 py-2.5 bg-surface-alt border border-border-light rounded-xl text-text-muted text-sm hover:bg-ink-dark/5 transition-all">🔄 重新摇卦</button>}
                {game.isAnimating && <div className="flex items-center gap-2 mt-3"><span className="text-text-muted text-xs font-kaishu">第 {game.coinCount} / 6 爻</span><div className="flex gap-2">{Array.from({length:6}).map((_,i) => <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-500 ${i < game.coinCount ? 'bg-gold' : 'bg-border-light'}`}/>)}</div></div>}
              </div>
            </div>
          </div>
        </div>
        {game.castResult && !game.isAnimating && (
          <>
            <div className="mb-6 panel"><h3 className="text-section-title text-center mb-3">📋 掷币记录</h3><div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">{game.castResult.coinsHistory.map((coins, i) => { const sum = coins[0] + coins[1] + coins[2]; const labels: Record<number, string> = { 6: '老阴 ⚋', 7: '少阳 ⚊', 8: '少阴 ⚋', 9: '老阳 ⚊' }; return <div key={i} className="text-sm p-2 bg-surface-alt rounded-lg"><div className="text-text-muted">{['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'][i]}</div><div className="text-text-primary font-bold">{labels[sum]}</div></div>; })}</div></div>
            <div className="mb-6"><AiAnalysisPanel result={game.castResult} question={game.submittedQuestion} onAiUpdate={game.handleAiUpdate} onSearchUpdate={game.handleSearchUpdate} /></div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">🔮 本卦</h3><div className="text-center mb-2"><div className="text-4xl mb-1">{game.getHexagramUnicode(game.castResult.original.upperTrigram, game.castResult.original.lowerTrigram)}</div><div className="text-lg font-kaishu font-bold">{game.castResult.original.name}</div></div><div className="flex justify-center gap-1.5 my-2">{game.castResult.original.yaoLines.slice().reverse().map((y, i) => <YaoSymbol key={i} yin={y.yin} changing={y.changing} size="sm" />)}</div><div className="text-sm space-y-0.5 mt-2 px-1">{game.castResult.original.yaoLines.slice().reverse().map((y, i) => <div key={i} className={`py-0.5 ${y.changing ? 'text-cinnabar-light font-bold' : 'text-text-primary'}`}>{['上','五','四','三','二','初'][i]}爻：{y.label}</div>)}</div></div>
              <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">⚡ 变爻</h3>{game.castResult.changingYao.length > 0 ? <div className="space-y-2">{game.castResult.changingYao.map(y => <div key={y.index} className="p-2 bg-cinnabar/5 border border-cinnabar/20 rounded-lg text-sm"><span className="text-cinnabar-light font-bold">{['初', '二', '三', '四', '五', '上'][y.index]}爻</span><span className="text-text-muted text-xs ml-2">{y.value === 6 ? '老阴极生阳' : '老阳极生阴'}</span></div>)}</div> : <div className="text-text-muted text-center py-6 text-sm">六爻安定</div>}</div>
              <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">🔄 变卦</h3>{game.castResult.changingYao.length > 0 && game.castResult.changed ? <><div className="text-center mb-2"><div className="text-4xl mb-1">{game.getHexagramUnicode(game.castResult.changed.upperTrigram, game.castResult.changed.lowerTrigram)}</div><div className="text-lg font-kaishu font-bold">{game.castResult.changed.name}</div></div><div className="flex justify-center gap-1.5 my-2">{game.castResult.changed.yaoLines.slice().reverse().map((y, i) => <YaoSymbol key={i} yin={y.yin} changing={false} size="sm" />)}</div><div className="text-sm space-y-0.5 mt-2 px-1">{game.castResult.changed.yaoLines.slice().reverse().map((y, i) => <div key={i} className="py-0.5 text-text-primary">{['上','五','四','三','二','初'][i]}爻：{y.label}</div>)}</div></> : <div className="text-text-muted text-center py-6 text-sm">六爻安定</div>}</div>
            </div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {(() => { const h = game.getInterlockingHexagram(game.castResult.original.yaoLines); if (!h) return null; return <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">🔄 互卦</h3><div className="text-xs text-text-muted text-center mb-1">取二至五爻，揭示内在过程</div><div className="text-center mb-2"><div className="text-4xl mb-1">{game.getHexagramUnicode(h.upperTrigram, h.lowerTrigram)}</div><div className="text-lg font-kaishu font-bold">{h.name}</div></div></div>; })()}
              {(() => { const wrong = game.getWrongHexagram(game.castResult.original.yaoLines); const rev = game.getReverseHexagram(game.castResult.original.yaoLines); if (!wrong || !rev) return null; return <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">🔍 错卦 · 综卦</h3><div className="grid grid-cols-2 gap-3 text-center"><div><div className="text-xs text-text-muted mb-1">错卦</div><div className="text-3xl mb-1">{game.getHexagramUnicode(wrong.upperTrigram, wrong.lowerTrigram)}</div><div className="text-sm font-kaishu font-bold">{wrong.name}</div></div><div><div className="text-xs text-text-muted mb-1">综卦</div><div className="text-3xl mb-1">{game.getHexagramUnicode(rev.upperTrigram, rev.lowerTrigram)}</div><div className="text-sm font-kaishu font-bold">{rev.name}</div></div></div></div>; })()}
              {(() => { const bu = game.getBodyUseAnalysis(game.castResult.original); return <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">⚖️ 体用生克</h3><div className="grid grid-cols-2 gap-3 text-center text-sm mb-2"><div className="p-2 bg-gold/5 rounded-lg"><div className="text-xs text-text-muted">体（下卦）</div><div className="font-bold">{bu.body.trigramName} · {bu.body.wuxing}</div></div><div className="p-2 bg-gold/5 rounded-lg"><div className="text-xs text-text-muted">用（上卦）</div><div className="font-bold">{bu.use.trigramName} · {bu.use.wuxing}</div></div></div><div className="text-center"><span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${bu.relation === '用生体' || bu.relation === '体用比和' ? 'bg-success/10 text-success' : bu.relation === '用克体' ? 'bg-cinnabar/10 text-cinnabar-light' : 'bg-gold/10 text-gold'}`}>{bu.relation}</span></div><div className="mt-2 text-xs text-text-secondary text-center">{bu.interpretation}</div></div>; })()}
              <HexagramDetailPanel
                upperTrigram={game.castResult.original.upperTrigram}
                lowerTrigram={game.castResult.original.lowerTrigram}
                yaoLines={game.castResult.original.yaoLines}
              />
            </div>
          </>
        )}
        <div className="mb-6"><DailyFortunePanel /></div>
        <div className="mb-6"><ClassicReadingPanel /></div>
        <div className="mb-6"><NotesPanel /></div>
        <div className="mb-6"><FunFeaturesPanel /></div>
        {game.castResult && !game.isAnimating && <div className="mb-6"><SharePanel result={game.castResult} question={game.submittedQuestion} /></div>}
        {game.history.length > 0 && <div className="panel"><h3 className="text-sm font-bold mb-2 flex items-center gap-2 cursor-pointer" onClick={() => setShowHistory(!showHistory)}><span>📜</span> 历史记录 ({game.history.length}) <span className="ml-auto">{showHistory ? '▲' : '▼'}</span></h3>{showHistory && <div className="space-y-2 overflow-y-auto">{game.history.map((item, i) => <WebHistoryItem key={i} item={item} onDelete={() => game.deleteHistory(i)} onRegenerate={() => { setRegeneratingIndex(i); }} />)}</div>}</div>}

        {/* 从历史记录重新生成AI解读 */}
        {historyItemForRegen && (
          <div className="panel mb-6">
            <h3 className="text-section-title flex items-center gap-2 mb-2">
              <span>🔄</span> 重新生成AI解读
              <button onClick={() => setRegeneratingIndex(null)} className="ml-auto px-2 py-1 bg-surface-alt border border-border-light rounded text-xs text-text-muted">✕ 关闭</button>
            </h3>
            <div className="mb-2 text-xs text-text-muted">
              问题：{historyItemForRegen.question} · 卦象：{historyItemForRegen.result.original.name}
            </div>
            <AiAnalysisPanel
              key={`regen-${regeneratingIndex}`}
              result={historyItemForRegen.result}
              question={historyItemForRegen.question}
              onAiUpdate={(reading) => {
                if (regeneratingIndex !== null) {
                  game.updateHistoryAiReading(regeneratingIndex, reading);
                }
              }}
              onSearchUpdate={() => {}}
            />
          </div>
        )}
      </ErrorBoundary>
      </main>
    </div>
  );
}

function WebHistoryItem({ item, onDelete, onRegenerate }: { item: HistoryItem; onDelete: () => void; onRegenerate: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="border border-border-light rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-2 bg-surface-alt cursor-pointer hover:bg-surface-alt/80 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="text-text-muted text-xs">{item.date}</span>
        <span className="text-text-secondary truncate flex-1">{item.question}</span>
        <span className="text-gold font-bold">{item.result.original.name}</span>
        <button onClick={(e) => { e.stopPropagation(); if (confirm('确定要删除这条记录吗？')) onDelete(); }} className="px-2 py-1 bg-cinnabar/10 border border-cinnabar/20 rounded text-cinnabar-light text-xs hover:bg-cinnabar/20">✕</button>
        <span className="text-text-muted text-xs">{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <div className="p-3 space-y-3 bg-surface/50 border-t border-border-light">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gold/5 rounded"><div className="text-text-muted">本卦</div><div className="text-gold font-bold text-lg">{item.result.original.name}</div></div>
            <div className="text-center p-2 bg-gold/5 rounded"><div className="text-text-muted">变爻</div><div className="text-cinnabar-light font-bold text-lg">{item.result.changingYao.length}条</div></div>
            <div className="text-center p-2 bg-gold/5 rounded"><div className="text-text-muted">变卦</div><div className="text-text-primary font-bold text-lg">{item.result.changed?.name || '无'}</div></div>
          </div>
          <div><div className="text-xs text-text-muted mb-1">六爻</div><div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-center text-xs">{item.result.coinsHistory.map((coins, i) => { const sum = coins[0] + coins[1] + coins[2]; const labels: Record<number, string> = { 6: '老阴', 7: '少阳', 8: '少阴', 9: '老阳' }; return <div key={i} className="p-1 bg-surface-alt rounded"><div className="text-text-muted">{['初爻','二爻','三爻','四爻','五爻','上爻'][i]}</div><div className="font-bold">{labels[sum]}</div></div>; })}</div></div>
          {item.aiReading ? (
            <div>
              <div className="text-xs text-text-muted mb-1">AI 智能解读</div>
              <div className="text-xs whitespace-pre-wrap leading-relaxed font-kaishu p-2 bg-surface-alt rounded max-h-32 overflow-y-auto">{item.aiReading}</div>
            </div>
          ) : (
            <div className="text-center">
              <button onClick={(e) => { e.stopPropagation(); onRegenerate(); }} className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg text-gold text-xs hover:bg-gold/20 transition-all">
                🤖 重新生成AI解读
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function YaoSymbol({ yin, changing, size = 'md' }: { yin: boolean; changing?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const w = { sm: 'w-7', md: 'w-9', lg: 'w-11' };
  const h = { sm: 'h-1.5', md: 'h-2', lg: 'h-2.5' };
  const cls = `${w[size]} ${h[size]} rounded-full ${changing ? 'bg-cinnabar' : 'bg-ink'}`;
  if (yin) return <div className="flex gap-0.5 items-center"><div className={cls} /><div className="w-1.5" /><div className={cls} /></div>;
  return <div className={cls} />;
}