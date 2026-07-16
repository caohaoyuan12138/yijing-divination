import { useState, useEffect } from 'react';
import { useDivinationGame, HistoryItem } from '@/lib/useDivinationGame';
import TurtleShellScene from '@/components/animation/TurtleShellScene';
import AiAnalysisPanel from '@/components/ui/AiAnalysisPanel';
import SharePanel from '@/components/ui/SharePanel';
import DailyFortunePanel from '@/components/ui/DailyFortunePanel';
import DivinationMethodsPanel from '@/components/ui/DivinationMethodsPanel';
import ClassicReadingPanel from '@/components/ui/ClassicReadingPanel';
import NotesPanel from '@/components/ui/NotesPanel';
import FunFeaturesPanel from '@/components/ui/FunFeaturesPanel';

type TabType = 'divine' | 'history' | 'classics' | 'fun' | 'settings';

export default function App() {
  const game = useDivinationGame();
  const [activeTab, setActiveTab] = useState<TabType>('divine');

  const posNames = ['上', '五', '四', '三', '二', '初'];

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'divine', label: '摇卦', icon: '🔮' },
    { id: 'history', label: '历史', icon: '📜' },
    { id: 'classics', label: '典籍', icon: '📖' },
    { id: 'fun', label: '趣味', icon: '🎮' },
    { id: 'settings', label: '我的', icon: '👤' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !game.isAnimating && game.userQuestion.trim()) {
      e.preventDefault();
      game.startDivination();
    }
    if (e.key === 'Escape') game.handleReset();
  };

  // 起卦成功后自动切换到结果页
  useEffect(() => {
    if (game.castResult && !game.isAnimating) {
      setActiveTab('settings');
    }
  }, [game.castResult, game.isAnimating]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'divine':
        return (
          <div className="space-y-4">
            <div className="panel !p-0 overflow-hidden">
              <TurtleShellScene
                key={`turtle-${game.coinCount}-${game.isAnimating}`}
                coins={((game.castResult?.coinsHistory[game.coinCount - 1] as [number, number, number] | undefined) ?? [3, 3, 3]) as [number, number, number]}
                isFlipping={game.isAnimating}
                flipProgress={game.shakeProgress}
                yaoIndex={game.coinCount}
              />
            </div>

            <div className="panel">
              <h3 className="text-section-title flex items-center gap-2 mb-3">
                <span>❓</span> 提出你的问题
              </h3>
              <div className="flex-1 flex flex-col">
                <textarea
                  ref={game.questionRef}
                  value={game.userQuestion}
                  onChange={(e) => game.setUserQuestion(e.target.value)}
                  disabled={game.isAnimating || !!game.castResult}
                  placeholder="静心凝神，输入你想问的问题..."
                  className="w-full px-4 py-3 bg-surface-alt border border-border-light rounded-xl text-text-primary placeholder-text-muted resize-none text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300 disabled:opacity-50 font-kaishu min-h-[100px] mb-3"
                />

                <div className="mb-3 p-3 bg-surface-alt/50 rounded-xl border border-border-light">
                  <div className="text-xs text-text-muted mb-2">选择起卦方式：</div>
                  <DivinationMethodsPanel
                    onResult={(result: any) => {
                      if (!result) return;
                      game.createResultFromMethod(result);
                    }}
                    disabled={game.isAnimating}
                  />
                </div>

                <div className="mb-3 p-3 bg-surface-alt/50 rounded-xl border border-border-light">
                  <div className="text-xs text-text-muted mb-2 flex items-center gap-1">
                    <span>🕐</span> 占卜时间
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-xs text-text-muted block mb-1">年</label>
                      <input
                        type="number"
                        value={game.inputYear}
                        onChange={(e) => game.handleYearChange(e.target.value)}
                        placeholder="2026"
                        className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted block mb-1">月</label>
                      <input
                        type="number" min="1" max="12"
                        value={game.inputMonth}
                        onChange={(e) => game.setInputMonth(e.target.value ? parseInt(e.target.value) : '')}
                        placeholder="7"
                        className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted block mb-1">日</label>
                      <input
                        type="number" min="1" max="31"
                        value={game.inputDay}
                        onChange={(e) => game.setInputDay(e.target.value ? parseInt(e.target.value) : '')}
                        placeholder="11"
                        className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs focus:outline-none focus:border-gold/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted block mb-1">时</label>
                      <input
                        type="number" min="0" max="23"
                        value={game.inputHour}
                        onChange={(e) => game.setInputHour(e.target.value ? parseInt(e.target.value) : '')}
                        placeholder="14"
                        className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>
                  {game.dateTimeInfo && (
                    <div className="mt-2 p-2 bg-gold/5 rounded-lg text-xs">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-gold font-bold">{game.dateTimeInfo.ganzhi}年</span>
                        <span className="text-text-muted">天干：{game.dateTimeInfo.stem}（{game.dateTimeInfo.stemWuxing}）</span>
                        <span className="text-text-muted">地支：{game.dateTimeInfo.branch}（{game.dateTimeInfo.branchWuxing}）</span>
                        <span className="text-text-muted">生肖：{game.dateTimeInfo.zodiac}</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={game.startDivination}
                  disabled={game.isAnimating || !game.userQuestion.trim()}
                  className="btn-primary text-base px-6 py-3 tracking-wider w-full"
                >
                  {game.isAnimating ? '🪙 摇卦中...' : '🪙 开始摇卦'}
                </button>
                {game.castResult && !game.isAnimating && (
                  <button onClick={game.handleReset} className="mt-2 px-4 py-2.5 bg-surface-alt border border-border-light rounded-xl text-text-muted text-sm hover:bg-ink-dark/5 transition-all">
                    🔄 重新摇卦
                  </button>
                )}
                {game.isAnimating && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-text-muted text-xs font-kaishu">第 {game.coinCount} / 6 爻</span>
                    <div className="flex gap-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-500 ${i < game.coinCount ? 'bg-gold' : 'bg-border-light'}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <div className="panel">
              <h3 className="text-section-title flex items-center gap-2 mb-3">
                <span>📜</span> 历史记录 ({game.history.length})
              </h3>
              {game.history.length === 0 ? (
                <div className="text-text-muted text-center py-8 text-sm">
                  暂无历史记录<br />去摇卦吧～
                </div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {game.history.map((item, i) => (
                    <HistoryItemView key={i} item={item} onDelete={() => game.deleteHistory(i)} onRegenerate={() => game.handleRegenerateAi(i)} />
                  ))}
                </div>
              )}
            </div>
            {game.regeneratingItem && (
              <div className="panel">
                <h3 className="text-section-title flex items-center gap-2 mb-2">
                  <span>🔄</span> 重新生成AI解读
                  <button onClick={() => game.handleRegenerateAiUpdate('')} className="ml-auto px-2 py-1 bg-surface-alt border border-border-light rounded text-xs text-text-muted">✕ 关闭</button>
                </h3>
                <div className="mb-2 text-xs text-text-muted">
                  问题：{game.regeneratingItem.question} · 卦象：{game.regeneratingItem.result.original.name}
                </div>
                <AiAnalysisPanel
                  key={`regen-${game.regeneratingItem.index}`}
                  result={game.regeneratingItem.result}
                  question={game.regeneratingItem.question}
                  onAiUpdate={game.handleRegenerateAiUpdate}
                  onSearchUpdate={() => {}}
                />
              </div>
            )}
          </div>
        );

      case 'classics':
        return (
          <div className="space-y-4">
            <ClassicReadingPanel />
          </div>
        );

      case 'fun':
        return (
          <div className="space-y-4">
            <DailyFortunePanel />
            <FunFeaturesPanel />
            <NotesPanel />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <div className="panel">
              <h3 className="text-section-title flex items-center gap-2 mb-3">
                <span>⚙️</span> 设置
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl">
                  <span className="text-sm">🌙 暗黑模式</span>
                  <button
                    onClick={() => game.setIsDarkMode(!game.isDarkMode)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      game.isDarkMode ? 'bg-gold text-white' : 'bg-border-light text-text-muted'
                    }`}
                  >
                    {game.isDarkMode ? '已开启' : '已关闭'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl">
                  <span className="text-sm">⚡ 快速模式</span>
                  <button
                    onClick={() => game.setIsFastMode(!game.isFastMode)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      game.isFastMode ? 'bg-gold text-white' : 'bg-border-light text-text-muted'
                    }`}
                  >
                    {game.isFastMode ? '已开启' : '已关闭'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl">
                  <span className="text-sm">🔊 音效</span>
                  <button
                    onClick={game.toggleMute}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      !game.isMuted ? 'bg-gold text-white' : 'bg-border-light text-text-muted'
                    }`}
                  >
                    {!game.isMuted ? '已开启' : '已关闭'}
                  </button>
                </div>
              </div>
            </div>

            {game.castResult && !game.isAnimating && (
              <div className="space-y-4">
                <div className="panel">
                  <h3 className="text-section-title text-center mb-3">📋 掷币记录</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {game.castResult.coinsHistory.length > 0 ? (
                      game.castResult.coinsHistory.map((coins, i) => {
                        const sum = coins[0] + coins[1] + coins[2];
                        const labels: Record<number, string> = { 6: '老阴 ⚋', 7: '少阳 ⚊', 8: '少阴 ⚋', 9: '老阳 ⚊' };
                        return (
                          <div key={i} className="text-sm p-2 bg-surface-alt rounded-lg">
                            <div className="text-text-muted">{['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'][i]}</div>
                            <div className="text-text-primary font-bold">{labels[sum]}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-3 text-text-muted text-sm py-4">本卦：{game.castResult.original.name}</div>
                    )}
                  </div>
                </div>

                <AiAnalysisPanel
                  result={game.castResult}
                  question={game.submittedQuestion}
                  onAiUpdate={game.handleAiUpdate}
                  onSearchUpdate={game.handleSearchUpdate}
                />

                <div className="grid grid-cols-1 gap-4">
                  <div className="panel overflow-hidden">
                    <h3 className="text-section-title text-center mb-2">🔮 本卦</h3>
                    <div className="text-center mb-2">
                      <div className="text-4xl mb-1">{game.getHexagramUnicode(game.castResult.original.upperTrigram, game.castResult.original.lowerTrigram)}</div>
                      <div className="text-lg font-kaishu font-bold">{game.castResult.original.name}</div>
                    </div>
                    <div className="flex justify-center gap-1.5 my-2">
                      {game.castResult.original.yaoLines.slice().reverse().map((y, i) => (
                        <YaoSymbol key={i} yin={y.yin} changing={y.changing} size="sm" />
                      ))}
                    </div>
                    <div className="text-sm space-y-0.5 mt-2 px-1">
                      {game.castResult.original.yaoLines.slice().reverse().map((y, i) => (
                        <div key={i} className={`py-0.5 ${y.changing ? 'text-cinnabar-light font-bold' : 'text-text-primary'}`}>
                          {posNames[i]}爻：{y.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {game.castResult.changingYao.length > 0 && (
                    <div className="panel overflow-hidden">
                      <h3 className="text-section-title text-center mb-2">⚡ 变爻</h3>
                      <div className="space-y-2">
                        {game.castResult.changingYao.map(y => (
                          <div key={y.index} className="p-2 bg-cinnabar/5 border border-cinnabar/20 rounded-lg text-sm">
                            <span className="text-cinnabar-light font-bold">{['初', '二', '三', '四', '五', '上'][y.index]}爻</span>
                            <span className="text-text-muted text-xs ml-2">{y.value === 6 ? '老阴极生阳' : '老阳极生阴'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {game.castResult.changed && game.castResult.changingYao.length > 0 && (
                    <div className="panel overflow-hidden">
                      <h3 className="text-section-title text-center mb-2">🔄 变卦</h3>
                      <div className="text-center mb-2">
                        <div className="text-4xl mb-1">{game.getHexagramUnicode(game.castResult.changed.upperTrigram, game.castResult.changed.lowerTrigram)}</div>
                        <div className="text-lg font-kaishu font-bold">{game.castResult.changed.name}</div>
                      </div>
                      <div className="flex justify-center gap-1.5 my-2">
                        {game.castResult.changed.yaoLines.slice().reverse().map((y, i) => (
                          <YaoSymbol key={i} yin={y.yin} changing={false} size="sm" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 互卦 */}
                  {(() => {
                    const h = game.getInterlockingHexagram(game.castResult.original.yaoLines);
                    if (!h) return null;
                    return (
                      <div className="panel overflow-hidden">
                        <h3 className="text-section-title text-center mb-2">🔄 互卦</h3>
                        <div className="text-xs text-text-muted text-center mb-1">取二至五爻，揭示内在过程</div>
                        <div className="text-center mb-2">
                          <div className="text-4xl mb-1">{game.getHexagramUnicode(h.upperTrigram, h.lowerTrigram)}</div>
                          <div className="text-lg font-kaishu font-bold">{h.name}</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 错卦 / 综卦 */}
                  {(() => {
                    const wrong = game.getWrongHexagram(game.castResult.original.yaoLines);
                    const rev = game.getReverseHexagram(game.castResult.original.yaoLines);
                    if (!wrong || !rev) return null;
                    return (
                      <div className="panel overflow-hidden">
                        <h3 className="text-section-title text-center mb-2">🔍 错卦 · 综卦</h3>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div>
                            <div className="text-xs text-text-muted mb-1">错卦（阴阳全变）</div>
                            <div className="text-3xl mb-1">{game.getHexagramUnicode(wrong.upperTrigram, wrong.lowerTrigram)}</div>
                            <div className="text-sm font-kaishu font-bold">{wrong.name}</div>
                          </div>
                          <div>
                            <div className="text-xs text-text-muted mb-1">综卦（上下翻转）</div>
                            <div className="text-3xl mb-1">{game.getHexagramUnicode(rev.upperTrigram, rev.lowerTrigram)}</div>
                            <div className="text-sm font-kaishu font-bold">{rev.name}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 体用生克 */}
                  {(() => {
                    const bu = game.getBodyUseAnalysis(game.castResult.original);
                    return (
                      <div className="panel overflow-hidden">
                        <h3 className="text-section-title text-center mb-2">⚖️ 体用生克</h3>
                        <div className="grid grid-cols-2 gap-3 text-center text-sm mb-2">
                          <div className="p-2 bg-gold/5 rounded-lg">
                            <div className="text-xs text-text-muted">体（下卦）</div>
                            <div className="font-bold">{bu.body.trigramName} · {bu.body.wuxing}</div>
                          </div>
                          <div className="p-2 bg-gold/5 rounded-lg">
                            <div className="text-xs text-text-muted">用（上卦）</div>
                            <div className="font-bold">{bu.use.trigramName} · {bu.use.wuxing}</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                            bu.relation === '用生体' || bu.relation === '体用比和' ? 'bg-success/10 text-success' :
                            bu.relation === '用克体' ? 'bg-cinnabar/10 text-cinnabar-light' :
                            'bg-gold/10 text-gold'
                          }`}>{bu.relation}</span>
                        </div>
                        <div className="mt-2 text-xs text-text-secondary text-center">{bu.interpretation}</div>
                      </div>
                    );
                  })()}
                </div>

                {game.castResult && !game.isAnimating && (
                  <SharePanel result={game.castResult} question={game.submittedQuestion} />
                )}
              </div>
            )}

            {!game.castResult && (
              <div className="text-text-muted text-center py-4 text-sm">
                还没有摇卦记录<br />返回"摇卦"页开始你的第一卦吧～
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary app-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <header className="app-header relative z-20 text-center py-4 px-4 safe-area-top">
        <h1 className="text-2xl font-bold text-gold-gradient font-songti tracking-[0.1em]">
          周易摇卦
        </h1>
        <p className="text-text-muted text-xs font-kaishu tracking-widest mt-0.5">
          三枚铜钱 · 六爻成卦
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4 safe-area-content">
        <div className="max-w-lg mx-auto">
          {renderTabContent()}
        </div>
      </main>

      <nav className="app-nav fixed bottom-0 left-0 right-0 z-30 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2 bg-surface/95 backdrop-blur-lg border-t border-border-light">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-gold bg-gold/10 scale-105'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function HistoryItemView({ item, onDelete, onRegenerate }: { item: HistoryItem; onDelete: () => void; onRegenerate: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-border-light rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-2 p-3 bg-surface-alt cursor-pointer hover:bg-surface-alt/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-text-muted text-xs shrink-0">{item.date}</span>
        <span className="text-text-secondary truncate flex-1 text-sm">{item.question}</span>
        <span className="text-gold font-bold text-sm">{item.result.original.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('确定要删除这条记录吗？')) onDelete();
          }}
          className="px-2 py-1 bg-cinnabar/10 border border-cinnabar/20 rounded text-cinnabar-light text-xs hover:bg-cinnabar/20"
        >
          ✕
        </button>
        <span className="text-text-muted text-xs">{isExpanded ? '▲' : '▼'}</span>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3 bg-surface/50 border-t border-border-light">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gold/5 rounded">
              <div className="text-text-muted">本卦</div>
              <div className="text-gold font-bold text-base">{item.result.original.name}</div>
            </div>
            <div className="text-center p-2 bg-gold/5 rounded">
              <div className="text-text-muted">变爻</div>
              <div className="text-cinnabar-light font-bold text-base">{item.result.changingYao.length}条</div>
            </div>
            <div className="text-center p-2 bg-gold/5 rounded">
              <div className="text-text-muted">变卦</div>
              <div className="text-text-primary font-bold text-base">{item.result.changed?.name || '无'}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-text-muted mb-1">六爻</div>
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              {item.result.coinsHistory.length > 0 ? (
                item.result.coinsHistory.map((coins, i) => {
                  const sum = coins[0] + coins[1] + coins[2];
                  const labels: Record<number, string> = { 6: '老阴', 7: '少阳', 8: '少阴', 9: '老阳' };
                  return (
                    <div key={i} className="p-1.5 bg-surface-alt rounded">
                      <div className="text-text-muted">{['初爻','二爻','三爻','四爻','五爻','上爻'][i]}</div>
                      <div className="font-bold text-xs">{labels[sum]}</div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-text-muted text-xs py-2">非金钱卦</div>
              )}
            </div>
          </div>

          {item.aiReading ? (
            <div>
              <div className="text-xs text-text-muted mb-1">AI 智能解读</div>
              <div className="text-xs whitespace-pre-wrap leading-relaxed font-kaishu p-2 bg-surface-alt rounded max-h-32 overflow-y-auto">
                {item.aiReading}
              </div>
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
  if (yin) {
    return (
      <div className="flex gap-0.5 items-center">
        <div className={cls} />
        <div className="w-1.5" />
        <div className={cls} />
      </div>
    );
  }
  return <div className={cls} />;
}