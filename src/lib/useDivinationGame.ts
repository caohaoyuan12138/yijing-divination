/**
 * 共享摇卦逻辑 Hook — 抽取 App.tsx / WebApp.tsx 的公共状态与回调
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { castHexagram, getHexagramUnicode, getGanzhiDetail, buildHexagram, EIGHT_TRIGRAMS, getInterlockingHexagram, getWrongHexagram, getReverseHexagram, getBodyUseAnalysis, type DivinationResult } from '@/lib/divination';
import { SoundManager } from '@/lib/sounds';

export const LINE_ANIMATION_DURATION = 1200;
export const LINE_INTERVAL = 400;

export interface HistoryItem {
  question: string;
  result: DivinationResult;
  aiReading?: string;
  searchResults?: any[];
  date: string;
}

// 五行对应的天干/地支
const STEM_WUXING: Record<string, string> = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const BRANCH_WUXING: Record<string, string> = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };

export function useDivinationGame() {
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
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const questionRef = useRef<HTMLTextAreaElement>(null);

  // 暗黑模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('yijing-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // 天干地支计算（含五行）
  useEffect(() => {
    try {
      if (inputYear && typeof inputYear === 'number' && !isNaN(inputYear) && inputYear > 0 && inputYear < 3000) {
        const detail = getGanzhiDetail(inputYear);
        if (!detail) { setDateTimeInfo(null); return; }
        setDateTimeInfo({
          ...detail,
          stemWuxing: STEM_WUXING[detail.stem] || '',
          branchWuxing: BRANCH_WUXING[detail.branch] || '',
        });
      } else {
        setDateTimeInfo(null);
      }
    } catch {
      setDateTimeInfo(null);
    }
  }, [inputYear]);

  // 历史记录加载
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

  // 自动保存历史
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
        date: new Date().toLocaleString('zh-CN'),
      };
      setHistory(prev => {
        const next = [item, ...prev];
        localStorage.setItem('yijing-history', JSON.stringify(next));
        return next;
      });
    }
  }, [castResult, submittedQuestion]);

  // AI 解读完成后更新历史记录（AI 响应比占卜结果晚，需要单独更新）
  useEffect(() => {
    if (!savedRef.current || (!aiReading && searchResults.length === 0)) return;
    setHistory(prev => {
      if (prev.length === 0) return prev;
      // 更新第一条记录（最新一次占卜）的 AI 解读和搜索结果
      const updated = { ...prev[0] };
      if (aiReading) updated.aiReading = aiReading;
      if (searchResults.length > 0) updated.searchResults = searchResults;
      const next = [updated, ...prev.slice(1)];
      localStorage.setItem('yijing-history', JSON.stringify(next));
      return next;
    });
  }, [aiReading, searchResults]);

  // 删除历史
  const deleteHistory = useCallback((index: number) => {
    setHistory(prev => {
      const next = prev.filter((_, idx) => idx !== index);
      localStorage.setItem('yijing-history', JSON.stringify(next));
      return next;
    });
  }, []);

  // 更新指定历史记录的 AI 解读
  const updateHistoryAiReading = useCallback((index: number, reading: string) => {
    setHistory(prev => {
      if (index < 0 || index >= prev.length) return prev;
      const updated = { ...prev[index], aiReading: reading };
      const next = [...prev];
      next[index] = updated;
      localStorage.setItem('yijing-history', JSON.stringify(next));
      return next;
    });
  }, []);

  // AI 解读回调 — 直接保存到 localStorage，确保数据不丢失
  const handleAiUpdate = useCallback((reading: string) => {
    setAiReading(reading);
    // 立即保存到 localStorage（不依赖 useEffect 异步触发）
    if (savedRef.current && reading) {
      try {
        const saved = localStorage.getItem('yijing-history');
        if (saved) {
          const history = JSON.parse(saved);
          if (history.length > 0) {
            history[0].aiReading = reading;
            localStorage.setItem('yijing-history', JSON.stringify(history));
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);
  const handleSearchUpdate = useCallback((results: any[]) => setSearchResults(results), []);

  // 单爻动画
  const animateSingleLine = useCallback((): Promise<[number, number, number]> => {
    return new Promise((resolve) => {
      const coins: [number, number, number] = [
        Math.random() < 0.5 ? 2 : 3,
        Math.random() < 0.5 ? 2 : 3,
        Math.random() < 0.5 ? 2 : 3,
      ];
      setShakeProgress(0);

      const duration = isFastMode ? 300 : LINE_ANIMATION_DURATION;

      if (!SoundManager.isMuted() && (SoundManager as any).ctx) {
        SoundManager.playCoinCollide();
      }
      setTimeout(() => setShakeProgress(1), 50);
      setTimeout(() => {
        if (!SoundManager.isMuted() && (SoundManager as any).ctx) {
          SoundManager.playCoinLand();
        }
        resolve(coins);
      }, duration);
    });
  }, [isFastMode]);

  // 开始摇卦
  const startDivination = useCallback(async () => {
    if (!userQuestion.trim()) return;

    SoundManager.init();

    setIsAnimating(true);
    setCastResult(null);
    setCoinCount(0);
    setShakeProgress(0);
    setSubmittedQuestion(userQuestion);
    setAiReading('');

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
  }, [userQuestion, animateSingleLine, isFastMode]);

  // 其他起卦方式
  const createResultFromMethod = useCallback((trigramResult: { upperTrigram: number; lowerTrigram: number; changingLine: number; method: string; timeInfo?: string }) => {
    if (!userQuestion.trim()) {
      alert('请先输入您要问的问题');
      return;
    }
    SoundManager.init();

    const upperTrigram = EIGHT_TRIGRAMS[trigramResult.upperTrigram];
    const lowerTrigram = EIGHT_TRIGRAMS[trigramResult.lowerTrigram];
    if (!upperTrigram || !lowerTrigram) return;

    setAiReading('');

    const lines = [...lowerTrigram.lines, ...upperTrigram.lines];

    const yaoLines = lines.map((isYang, i) => {
      const isChanging = i === trigramResult.changingLine;
      const sum = isChanging ? (Math.random() < 0.5 ? 6 : 9) : (isYang ? 7 : 8);
      const yin = sum % 2 === 0;
      let label: string;
      switch (sum) {
        case 6: label = '老阴 ⚋ (变)'; break;
        case 7: label = '少阳 ⚊'; break;
        case 8: label = '少阴 ⚋'; break;
        case 9: label = '老阳 ⚊ (变)'; break;
        default: label = '未知';
      }
      return { index: i, value: sum as 6|7|8|9, yin, changing: isChanging, label };
    });

    const original = buildHexagram(
      yaoLines.map(y => ({ index: y.index, yin: y.yin, label: y.label, value: y.value, changing: y.changing })),
      trigramResult.upperTrigram,
      trigramResult.lowerTrigram
    );

    let changed = null;
    const changingYaoList = yaoLines.filter(y => y.changing);
    if (changingYaoList.length > 0) {
      const variantYaoLines = yaoLines.map(y => ({
        index: y.index,
        yin: y.changing ? !y.yin : y.yin,
        label: y.changing ? (y.value === 6 ? '老阴→少阳' : '老阳→少阴') : y.label,
        value: y.value,
        changing: y.changing,
      }));
      changed = buildHexagram(variantYaoLines, trigramResult.upperTrigram, trigramResult.lowerTrigram);
    }

    setCastResult({ original, changed, changingYao: changingYaoList, coinsHistory: [] });
    setSubmittedQuestion(userQuestion);
  }, [userQuestion]);

  // 重置
  const handleReset = useCallback(() => {
    setCastResult(null);
    setCoinCount(0);
    setShakeProgress(0);
    setUserQuestion('');
    setSubmittedQuestion('');
  }, []);

  // 音效切换
  const toggleMute = useCallback(() => {
    setIsMuted(SoundManager.toggleMute());
  }, []);

  // 从历史记录重新生成AI解读（App.tsx移动版使用）
  const [regeneratingItem, setRegeneratingItem] = useState<{ result: DivinationResult; question: string; index: number } | null>(null);

  const handleRegenerateAi = useCallback((index: number) => {
    setHistory(prev => {
      const item = prev[index];
      if (!item) return prev;
      setRegeneratingItem({ result: item.result, question: item.question, index });
      return prev;
    });
  }, []);

  const handleRegenerateAiUpdate = useCallback((reading: string) => {
    if (regeneratingItem) {
      updateHistoryAiReading(regeneratingItem.index, reading);
      setRegeneratingItem(null);
    }
  }, [regeneratingItem, updateHistoryAiReading]);

  // 设置输入年份
  const handleYearChange = useCallback((val: string) => {
    if (!val) { setInputYear(''); return; }
    const num = parseInt(val);
    if (!isNaN(num) && num > 0 && num < 9999) setInputYear(num);
  }, []);

  return {
    // 状态
    castResult, isAnimating, shakeProgress, coinCount,
    userQuestion, submittedQuestion, history,
    aiReading, searchResults, regeneratingItem,
    inputYear, inputMonth, inputDay, inputHour,
    dateTimeInfo, isMuted, isFastMode, isDarkMode,
    questionRef,

    // 状态设置
    setUserQuestion, setInputMonth, setInputDay, setInputHour,
    setIsDarkMode, setIsFastMode,

    // 回调
    startDivination, createResultFromMethod, handleReset,
    handleAiUpdate, handleSearchUpdate,
    handleYearChange, toggleMute, deleteHistory, updateHistoryAiReading,
    handleRegenerateAi, handleRegenerateAiUpdate,

    // 工具
    getHexagramUnicode,
    getInterlockingHexagram,
    getWrongHexagram,
    getReverseHexagram,
    getBodyUseAnalysis,
  };
}