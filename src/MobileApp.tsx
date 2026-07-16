import { useEffect, useState, useCallback, useRef } from 'react';
import { castHexagram, getHexagramUnicode, getGanzhiDetail, buildHexagram, EIGHT_TRIGRAMS, type DivinationResult } from '@/lib/divination';
import TurtleShellScene from '@/components/animation/TurtleShellScene';
import AiAnalysisPanel from '@/components/ui/AiAnalysisPanel';
import { SoundManager } from '@/lib/sounds';
import SharePanel from '@/components/ui/SharePanel';
import DailyFortunePanel from '@/components/ui/DailyFortunePanel';
import DivinationMethodsPanel from '@/components/ui/DivinationMethodsPanel';
import ClassicReadingPanel from '@/components/ui/ClassicReadingPanel';
import NotesPanel from '@/components/ui/NotesPanel';
import FunFeaturesPanel from '@/components/ui/FunFeaturesPanel';

const LINE_ANIMATION_DURATION = 1200;
const LINE_INTERVAL = 400;

interface HistoryItem {
  question: string;
  result: DivinationResult;
  aiReading?: string;
  searchResults?: any[];
  date: string;
}

type TabType = 'divine' | 'history' | 'classics' | 'fun' | 'settings';

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState<TabType>('divine');
  const [castResult, setCastResult] = useState<DivinationResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shakeProgress, setShakeProgress] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [userQuestion, setUserQuestion] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [aiReading, setAiReading] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [inputYear, setInputYear] = useState<number | ''>('');
  const [inputMonth, setInputMonth] = useState<number | ''>('');
  const [inputDay, setInputDay] = useState<number | ''>('');
  const [inputHour, setInputHour] = useState<number | ''>('');
  const [dateTimeInfo, setDateTimeInfo] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFastMode, setIsFastMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const questionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('yijing-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    try {
      if (inputYear && typeof inputYear === 'number' && !isNaN(inputYear) && inputYear > 0 && inputYear < 3000) {
        const detail = getGanzhiDetail(inputYear);
        setDateTimeInfo(detail);
      } else {
        setDateTimeInfo(null);
      }
    } catch {
      setDateTimeInfo(null);
    }
  }, [inputYear]);

  useEffect(() => {
    const saved = localStorage.getItem('yijing-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const unique: HistoryItem[] = [];
        const seen = new Set<string>();
        for (const item of parsed) {
          const key = `${item.question}_${item.result.original.name}_${item.result.original.yaoLines.map((y: { value: number }) => y.value).join('')}_${item.date}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
          }
        }
        setHistory(unique);
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const savedRef = useRef<string | null>(null);
  const aiReadingRef = useRef(aiReading);
  const searchResultsRef = useRef(searchResults);

  useEffect(() => { aiReadingRef.current = aiReading; }, [aiReading]);
  useEffect(() => { searchResultsRef.current = searchResults; }, [searchResults]);

  useEffect(() => {
    if (castResult && submittedQuestion) {
      const key = `${submittedQuestion}_${castResult.original.name}_${castResult.original.yaoLines.map(y => y.value).join('')}`;
      if (savedRef.current === key) return;
      savedRef.current = key;
      const item: HistoryItem = {
        question: submittedQuestion,
        result: castResult,
        aiReading: aiReadingRef.current || undefined,
        searchResults: searchResultsRef.current.length > 0 ? searchResultsRef.current : undefined,
        date: new Date().toLocaleString('zh-CN')
      };
      setHistory(prev => {
        const next = [item, ...prev];
        localStorage.setItem('yijing-history', JSON.stringify(next));
        return next;
      });
    }
  }, [castResult, submittedQuestion]);

  // 起卦成功后自动切换到结果页
  useEffect(() => {
    if (castResult && !isAnimating) {
      setActiveTab('settings');
    }
  }, [castResult, isAnimating]);

  const handleAiUpdate = useCallback((reading: string) => { setAiReading(reading); }, []);
  const handleSearchUpdate = useCallback((results: any[]) => { setSearchResults(results); }, []);

  const animateSingleLine = useCallback((): Promise<[number, number, number]> => {
    return new Promise((resolve) => {
      const coins: [number, number, number] = [ Math.random() < 0.5 ? 2 : 3, Math.random() < 0.5 ? 2 : 3, Math.random() < 0.5 ? 2 : 3 ];
      setShakeProgress(0);
      const duration = isFastMode ? 300 : LINE_ANIMATION_DURATION;
      if (!SoundManager.isMuted() && (SoundManager as any).ctx) SoundManager.playCoinCollide();
      setTimeout(() => setShakeProgress(1), 50);
      setTimeout(() => {
        if (!SoundManager.isMuted() && (SoundManager as any).ctx) SoundManager.playCoinLand();
        resolve(coins);
      }, duration);
    });
  }, [isFastMode]);

  const startDivination = useCallback(async () => {
    if (!userQuestion.trim()) return;
    SoundManager.init();
    setIsAnimating(true);
    setCastResult(null);
    setCoinCount(0);
    setShakeProgress(0);
    setSubmittedQuestion(userQuestion);
    const collected: number[][] = [];
    for (let i = 0; i < 6; i++) {
      const coins = await animateSingleLine();
      collected.push(coins);
      setCoinCount(i + 1);
      if (i < 5) await new Promise(r => setTimeout(r, isFastMode ? 100 : LINE_INTERVAL));
    }
    setCastResult(castHexagram(collected));
    setIsAnimating(false);
    setShakeProgress(0);
  }, [userQuestion, animateSingleLine]);

  const createResultFromMethod = useCallback((trigramResult: { upperTrigram: number; lowerTrigram: number; changingLine: number; method: string; timeInfo?: string }) => {
    if (!userQuestion.trim()) { alert('请先输入您要问的问题'); return; }
    SoundManager.init();
    const upperTrigram = EIGHT_TRIGRAMS[trigramResult.upperTrigram];
    const lowerTrigram = EIGHT_TRIGRAMS[trigramResult.lowerTrigram];
    if (!upperTrigram || !lowerTrigram) return;
    const lines = [...lowerTrigram.lines, ...upperTrigram.lines];
    const yaoLines = lines.map((isYang, i) => {
      const isChanging = i === trigramResult.changingLine;
      const sum = isChanging ? (Math.random() < 0.5 ? 6 : 9) : (isYang ? 7 : 8);
      const yin = sum % 2 === 0;
      let label: string;
      switch (sum) { case 6: label = '老阴 ⚋ (变)'; break; case 7: label = '少阳 ⚊'; break; case 8: label = '少阴 ⚋'; break; case 9: label = '老阳 ⚊ (变)'; break; default: label = '未知'; }
      return { index: i, value: sum as 6|7|8|9, yin, changing: isChanging, label };
    });
    const original = buildHexagram(yaoLines.map(y => ({ index: y.index, yin: y.yin, label: y.label, value: y.value, changing: y.changing })), trigramResult.upperTrigram, trigramResult.lowerTrigram);
    let changed = null;
    const changingYaoList = yaoLines.filter(y => y.changing);
    if (changingYaoList.length > 0) {
      const variantYaoLines = yaoLines.map(y => ({ index: y.index, yin: y.changing ? !y.yin : y.yin, label: y.changing ? (y.value === 6 ? '老阴→少阳' : '老阳→少阴') : y.label, value: y.value, changing: y.changing }));
      changed = buildHexagram(variantYaoLines, trigramResult.upperTrigram, trigramResult.lowerTrigram);
    }
    setCastResult({ original, changed, changingYao: changingYaoList, coinsHistory: [] });
    setSubmittedQuestion(userQuestion);
  }, [userQuestion]);

  const handleReset = useCallback(() => { setCastResult(null); setCoinCount(0); setShakeProgress(0); setUserQuestion(''); setSubmittedQuestion(''); }, []);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !isAnimating && userQuestion.trim()) { e.preventDefault(); startDivination(); } if (e.key === 'Escape') handleReset(); };
  const posNames = ['上', '五', '四', '三', '二', '初'];
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'divine', label: '摇卦', icon: '🔮' },
    { id: 'history', label: '历史', icon: '📜' },
    { id: 'classics', label: '典籍', icon: '📖' },
    { id: 'fun', label: '趣味', icon: '🎮' },
    { id: 'settings', label: '我的', icon: '👤' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'divine':
        return (
          <div className="space-y-4">
            <div className="panel !p-0 overflow-hidden">
              <TurtleShellScene key={`turtle-${coinCount}-${isAnimating}`} coins={((castResult?.coinsHistory[coinCount - 1] as [number, number, number] | undefined) ?? [3, 3, 3]) as [number, number, number]} isFlipping={isAnimating} flipProgress={shakeProgress} yaoIndex={coinCount} />
            </div>
            <div className="panel">
              <h3 className="text-section-title flex items-center gap-2 mb-3"><span>❓</span> 提出你的问题</h3>
              <div className="flex-1 flex flex-col">
                <textarea ref={questionRef} value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} disabled={isAnimating || !!castResult} placeholder="静心凝神，输入你想问的问题..." className="w-full px-4 py-3 bg-surface-alt border border-border-light rounded-xl text-text-primary placeholder-text-muted resize-none text-sm focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all duration-300 disabled:opacity-50 font-kaishu min-h-[100px] mb-3" />
                <div className="mb-3 p-3 bg-surface-alt/50 rounded-xl border border-border-light">
                  <div className="text-xs text-text-muted mb-2">选择起卦方式：</div>
                  <DivinationMethodsPanel onResult={(result: any) => { if (!result) return; createResultFromMethod(result); }} disabled={isAnimating} />
                </div>
                <div className="mb-3 p-3 bg-surface-alt/50 rounded-xl border border-border-light">
                  <div className="text-xs text-text-muted mb-2 flex items-center gap-1"><span>🕐</span> 占卜时间</div>
                  <div className="grid grid-cols-4 gap-2">
                    <div><label className="text-xs text-text-muted block mb-1">年</label><input type="number" value={inputYear} onChange={(e) => { const val = e.target.value; if (!val) { setInputYear(''); return; } const num = parseInt(val); if (!isNaN(num) && num > 0 && num < 9999) setInputYear(num); }} placeholder="2026" className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs focus:outline-none focus:border-gold/50" /></div>
                    <div><label className="text-xs text-text-muted block mb-1">月</label><input type="number" min="1" max="12" value={inputMonth} onChange={(e) => setInputMonth(e.target.value ? parseInt(e.target.value) : '')} placeholder="7" className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs focus:outline-none focus:border-gold/50" /></div>
                    <div><label className="text-xs text-text-muted block mb-1">日</label><input type="number" min="1" max="31" value={inputDay} onChange={(e) => setInputDay(e.target.value ? parseInt(e.target.value) : '')} placeholder="11" className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs focus:outline-none focus:border-gold/50" /></div>
                    <div><label className="text-xs text-text-muted block mb-1">时</label><input type="number" min="0" max="23" value={inputHour} onChange={(e) => setInputHour(e.target.value ? parseInt(e.target.value) : '')} placeholder="14" className="w-full px-2 py-1.5 bg-surface border border-border-light rounded-lg text-xs focus:outline-none focus:border-gold/50" /></div>
                  </div>
                  {dateTimeInfo && <div className="mt-2 p-2 bg-gold/5 rounded-lg text-xs"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-gold font-bold">{dateTimeInfo.ganzhi}年</span><span className="text-text-muted">天干：{dateTimeInfo.stem}</span><span className="text-text-muted">地支：{dateTimeInfo.branch}</span><span className="text-text-muted">生肖：{dateTimeInfo.zodiac}</span></div></div>}
                </div>
                <button onClick={startDivination} disabled={isAnimating || !userQuestion.trim()} className="btn-primary text-base px-6 py-3 tracking-wider w-full">{isAnimating ? '🪙 摇卦中...' : '🪙 开始摇卦'}</button>
                {castResult && !isAnimating && <button onClick={handleReset} className="mt-2 px-4 py-2.5 bg-surface-alt border border-border-light rounded-xl text-text-muted text-sm hover:bg-ink-dark/5 transition-all">🔄 重新摇卦</button>}
                {isAnimating && <div className="flex items-center gap-2 mt-3"><span className="text-text-muted text-xs font-kaishu">第 {coinCount} / 6 爻</span><div className="flex gap-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-500 ${i < coinCount ? 'bg-gold' : 'bg-border-light'}`} />)}</div></div>}
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-4">
            <div className="panel">
              <h3 className="text-section-title flex items-center gap-2 mb-3"><span>📜</span> 历史记录 ({history.length})</h3>
              {history.length === 0 ? <div className="text-text-muted text-center py-8 text-sm">暂无历史记录<br />去摇卦吧～</div> : <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">{history.map((item, i) => <MobileHistoryItem key={i} item={item} index={i} onDelete={() => setHistory(prev => prev.filter((_, idx) => idx !== i))} />)}</div>}
            </div>
          </div>
        );
      case 'classics': return <div className="space-y-4"><ClassicReadingPanel /></div>;
      case 'fun': return <div className="space-y-4"><DailyFortunePanel /><FunFeaturesPanel /><NotesPanel /></div>;
      case 'settings':
        return (
          <div className="space-y-4">
            <div className="panel">
              <h3 className="text-section-title flex items-center gap-2 mb-3"><span>⚙️</span> 设置</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl"><span className="text-sm">🌙 暗黑模式</span><button onClick={() => setIsDarkMode(!isDarkMode)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${isDarkMode ? 'bg-gold text-white' : 'bg-border-light text-text-muted'}`}>{isDarkMode ? '已开启' : '已关闭'}</button></div>
                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl"><span className="text-sm">⚡ 快速模式</span><button onClick={() => setIsFastMode(!isFastMode)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${isFastMode ? 'bg-gold text-white' : 'bg-border-light text-text-muted'}`}>{isFastMode ? '已开启' : '已关闭'}</button></div>
                <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl"><span className="text-sm">🔊 音效</span><button onClick={() => setIsMuted(SoundManager.toggleMute())} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${!isMuted ? 'bg-gold text-white' : 'bg-border-light text-text-muted'}`}>{!isMuted ? '已开启' : '已关闭'}</button></div>
              </div>
            </div>
            {castResult && !isAnimating && (
              <div className="space-y-4">
                <div className="panel"><h3 className="text-section-title text-center mb-3">📋 掷币记录</h3><div className="grid grid-cols-3 gap-2 text-center">{castResult.coinsHistory.length > 0 ? castResult.coinsHistory.map((coins, i) => { const sum = coins[0] + coins[1] + coins[2]; const labels: Record<number, string> = { 6: '老阴 ⚋', 7: '少阳 ⚊', 8: '少阴 ⚋', 9: '老阳 ⚊' }; return <div key={i} className="text-sm p-2 bg-surface-alt rounded-lg"><div className="text-text-muted">{['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'][i]}</div><div className="text-text-primary font-bold">{labels[sum]}</div></div>; }) : <div className="col-span-3 text-text-muted text-sm py-4">本卦：{castResult.original.name}</div>}</div></div>
                <AiAnalysisPanel result={castResult} question={submittedQuestion} onAiUpdate={handleAiUpdate} onSearchUpdate={handleSearchUpdate} />
                <div className="grid grid-cols-1 gap-4">
                  <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">🔮 本卦</h3><div className="text-center mb-2"><div className="text-4xl mb-1">{getHexagramUnicode(castResult.original.upperTrigram, castResult.original.lowerTrigram)}</div><div className="text-lg font-kaishu font-bold">{castResult.original.name}</div></div><div className="flex justify-center gap-1.5 my-2">{castResult.original.yaoLines.slice().reverse().map((y, i) => <YaoSymbol key={i} yin={y.yin} changing={y.changing} size="sm" />)}</div><div className="text-sm space-y-0.5 mt-2 px-1">{castResult.original.yaoLines.slice().reverse().map((y, i) => <div key={i} className={`py-0.5 ${y.changing ? 'text-cinnabar-light font-bold' : 'text-text-primary'}`}>{posNames[i]}爻：{y.label}</div>)}</div></div>
                  {castResult.changingYao.length > 0 && <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">⚡ 变爻</h3><div className="space-y-2">{castResult.changingYao.map(y => <div key={y.index} className="p-2 bg-cinnabar/5 border border-cinnabar/20 rounded-lg text-sm"><span className="text-cinnabar-light font-bold">{['初', '二', '三', '四', '五', '上'][y.index]}爻</span><span className="text-text-muted text-xs ml-2">{y.value === 6 ? '老阴极生阳' : '老阳极生阴'}</span></div>)}</div></div>}
                  {castResult.changed && castResult.changingYao.length > 0 && <div className="panel overflow-hidden"><h3 className="text-section-title text-center mb-2">🔄 变卦</h3><div className="text-center mb-2"><div className="text-4xl mb-1">{getHexagramUnicode(castResult.changed.upperTrigram, castResult.changed.lowerTrigram)}</div><div className="text-lg font-kaishu font-bold">{castResult.changed.name}</div></div><div className="flex justify-center gap-1.5 my-2">{castResult.changed.yaoLines.slice().reverse().map((y, i) => <YaoSymbol key={i} yin={y.yin} changing={false} size="sm" />)}</div></div>}
                </div>
                {castResult && !isAnimating && <SharePanel result={castResult} question={submittedQuestion} />}
              </div>
            )}
            {!castResult && <div className="text-text-muted text-center py-4 text-sm">还没有摇卦记录<br />返回"摇卦"页开始你的第一卦吧～</div>}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-primary app-container" onKeyDown={handleKeyDown} tabIndex={0}>
      <header className="app-header relative z-20 text-center py-4 px-4 safe-area-top"><h1 className="text-2xl font-bold text-gold-gradient font-songti tracking-[0.1em]">周易摇卦</h1><p className="text-text-muted text-xs font-kaishu tracking-widest mt-0.5">三枚铜钱 · 六爻成卦</p></header>
      <main className="flex-1 overflow-y-auto px-4 pb-4 safe-area-content"><div className="max-w-lg mx-auto">{renderTabContent()}</div></main>
      <nav className="app-nav fixed bottom-0 left-0 right-0 z-30 safe-area-bottom"><div className="flex items-center justify-around px-2 py-2 bg-surface/95 backdrop-blur-lg border-t border-border-light">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${activeTab === tab.id ? 'text-gold bg-gold/10 scale-105' : 'text-text-muted hover:text-text-secondary'}`}><span className="text-lg">{tab.icon}</span><span className="text-[10px] font-medium">{tab.label}</span></button>)}</div></nav>
    </div>
  );
}

function MobileHistoryItem({ item, onDelete }: { item: HistoryItem; index: number; onDelete: () => void; }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="border border-border-light rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-surface-alt cursor-pointer hover:bg-surface-alt/80 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="text-text-muted text-xs shrink-0">{item.date}</span>
        <span className="text-text-secondary truncate flex-1 text-sm">{item.question}</span>
        <span className="text-gold font-bold text-sm">{item.result.original.name}</span>
        <button onClick={(e) => { e.stopPropagation(); if (confirm('确定要删除这条记录吗？')) onDelete(); }} className="px-2 py-1 bg-cinnabar/10 border border-cinnabar/20 rounded text-cinnabar-light text-xs hover:bg-cinnabar/20">✕</button>
        <span className="text-text-muted text-xs">{isExpanded ? '▲' : '▼'}</span>
      </div>
      {isExpanded && (
        <div className="p-3 space-y-3 bg-surface/50 border-t border-border-light">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gold/5 rounded"><div className="text-text-muted">本卦</div><div className="text-gold font-bold text-base">{item.result.original.name}</div></div>
            <div className="text-center p-2 bg-gold/5 rounded"><div className="text-text-muted">变爻</div><div className="text-cinnabar-light font-bold text-base">{item.result.changingYao.length}条</div></div>
            <div className="text-center p-2 bg-gold/5 rounded"><div className="text-text-muted">变卦</div><div className="text-text-primary font-bold text-base">{item.result.changed?.name || '无'}</div></div>
          </div>
          <div><div className="text-xs text-text-muted mb-1">六爻</div><div className="grid grid-cols-3 gap-1 text-center text-xs">{item.result.coinsHistory.length > 0 ? item.result.coinsHistory.map((coins, i) => { const sum = coins[0] + coins[1] + coins[2]; const labels: Record<number, string> = { 6: '老阴', 7: '少阳', 8: '少阴', 9: '老阳' }; return <div key={i} className="p-1.5 bg-surface-alt rounded"><div className="text-text-muted">{['初爻','二爻','三爻','四爻','五爻','上爻'][i]}</div><div className="font-bold text-xs">{labels[sum]}</div></div>; }) : <div className="col-span-3 text-text-muted text-xs py-2">非金钱卦</div>}</div></div>
          {item.aiReading && <div><div className="text-xs text-text-muted mb-1">AI 智能解读</div><div className="text-xs whitespace-pre-wrap leading-relaxed font-kaishu p-2 bg-surface-alt rounded max-h-32 overflow-y-auto">{item.aiReading}</div></div>}
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
