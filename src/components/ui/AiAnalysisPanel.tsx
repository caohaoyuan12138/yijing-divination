import { useState, useCallback, useRef, useEffect } from 'react';
import type { DivinationResult } from '@/lib/divination';
import { getHexagramKnowledge, getFullHexagramInterpretation, getChangingYaoInterpretation, getWuxingRelation } from '@/lib/divination-knowledge';

const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'deepseek-v4-flash';
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const SEARCH_API_KEY = import.meta.env.VITE_SEARCH_API_KEY || '';
const AI_API_BASE = import.meta.env.VITE_AI_API_BASE || 'https://token.sensenova.cn';
const SEARCH_API_BASE = import.meta.env.VITE_SEARCH_API_BASE || 'https://api.anysearch.com';

// 检测是否在原生平台（Capacitor）
function isNativePlatform(): boolean {
  return typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
}

// API 基础路径
function getApiBase(): string {
  // Capacitor 原生模式：如果配置了 server.url（远程加载），走代理路径
  // 否则走直连（本地开发时使用）
  if (isNativePlatform()) {
    // 检查是否在远程加载（通过 Capacitor 配置的 server.url）
    const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isRemote) {
      return '/api/ai';
    }
    return `${AI_API_BASE}/v1`;
  }
  return '/api/ai';
}

function getSearchApiBase(): string {
  if (isNativePlatform()) {
    const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isRemote) {
      return '/api/search';
    }
    return SEARCH_API_BASE;
  }
  return '/api/search';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const SYSTEM_PROMPT = `你是一位精通中国古代占卜典籍的学者。请根据用户的问题和摇卦结果进行详细解读。

【参考典籍】
《周易》：群经之首，阴阳五行、八卦六十四卦的理论基础
《奇门遁甲》：时空选择，天时地利人和的综合考量
《太乙神数》：国运预测，系统性逻辑性
《六壬神课》：人事预测，细节分析和逻辑推理
《梅花易数》：灵活占卜，直觉灵感与数理结合

【解读要求】
1. 必须结合用户的具体问题给出针对性分析
2. 结合卦辞、象辞、五行生克、变爻意义进行解读
3. 引用典籍内容时要简明扼要
4. 给出积极正向的建议，不迷信不恐吓
5. 全程中文，用emoji和数字编号让内容有层次

【解读结构】
一、卦象概述（卦名、卦辞、象辞、五行、自然属性）
二、问题针对性分析
三、变爻/五行分析
四、结果预测与建议
五、典籍智慧引用`;

export default function AiAnalysisPanel({ result, question, onAiUpdate, onSearchUpdate }: { result: DivinationResult; question: string; onAiUpdate?: (reading: string) => void; onSearchUpdate?: (results: any[]) => void; }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasInitialCall, setHasInitialCall] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // 切换卦象时重置状态
  const resultKey = `${result.original.name}_${result.original.yaoLines.map(y => y.value).join('')}`;
  useEffect(() => {
    setMessages([]);
    setError('');
    setSearchResults([]);
    setHasInitialCall(false);
  }, [resultKey]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && lastMsg.content && !lastMsg.isStreaming) {
        onAiUpdate?.(lastMsg.content);
      }
    }
  }, [messages, isLoading, onAiUpdate]);

  const callAI = useCallback(async (history: ChatMessage[]) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setIsLoading(true);
    setError('');
    setSearchResults([]);

    const emptyAi: ChatMessage = { role: 'assistant', content: '', isStreaming: true };
    setMessages(prev => [...prev, emptyAi]);

    try {
      // Step 1: Search (non-blocking, continue to AI even if fails)
      let searchContext = '';
      try {
        const searchBase = getSearchApiBase();
        const searchResp = await fetch(`${searchBase}/v1/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SEARCH_API_KEY}`,
          },
          body: JSON.stringify({ query: question, num_results: 5 }),
        });
        if (searchResp.ok) {
          const data = await searchResp.json();
          const results = data?.data?.results || data?.results || data?.data || [];
          setSearchResults(results);
          onSearchUpdate?.(results);
          if (results.length > 0) {
            searchContext = '\n\n【实时搜索参考数据】\n' + results.slice(0, 5).map((r: any, i: number) =>
              `[${i + 1}] ${r.title || ''}\n${r.snippet || r.content || ''}`
            ).join('\n\n') + '\n\n请结合以上实时数据进行分析。';
          }
        }
      } catch {
        // search failed, continue without it
      }

      if (ctrl.signal.aborted) return;

      // Step 2: Call AI with classical knowledge
      const hexInterpretation = getFullHexagramInterpretation(result.original.upperTrigram, result.original.lowerTrigram);

      let changingYaoText = '';
      if (result.changingYao.length > 0) {
        changingYaoText = '\n【变爻分析】\n';
        for (const y of result.changingYao) {
          changingYaoText += getChangingYaoInterpretation(y.value, y.index) + '\n';
        }
      }

      const knowledge = getHexagramKnowledge(result.original.upperTrigram, result.original.lowerTrigram);
      const wuxingRelation = getWuxingRelation(knowledge.wuxing.split('/')[0], knowledge.wuxing.split('/')[1]);
      const wuxingText = `\n【五行生克】上卦${knowledge.wuxing.split('/')[0]}，下卦${knowledge.wuxing.split('/')[1]}，关系：${wuxingRelation}`;

      const userContent = `${hexInterpretation}${changingYaoText}${wuxingText}

【用户问题】${question}

【六爻状态】
${result.original.yaoLines.map((y, i) => `${['初','二','三','四','五','上'][i]}爻：${y.label}${y.changing ? ' ⚡变爻' : ''}`).join('\n')}${result.changed ? `

【变卦】${result.changed.name}` : ''}${searchContext}

请根据以上信息进行详细解读。`;

      const requestBody = {
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
          ...history,
        ],
        stream: true,
        max_tokens: 4096,
      };

      const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      };

      // Try proxy path first (works in npm run dev / npm run preview)
      const apiBase = getApiBase();
      let resp = await fetch(`${apiBase}/chat/completions`, {
        method: 'POST', headers: requestHeaders, body: JSON.stringify(requestBody), signal: ctrl.signal,
      });

      // Proxy 404 → fallback to direct API URL (works in production behind reverse proxy or native)
      if (!resp.ok && resp.status === 404 && apiBase === '/api/ai') {
        resp = await fetch(`${AI_API_BASE}/v1/chat/completions`, {
          method: 'POST', headers: requestHeaders, body: JSON.stringify(requestBody), signal: ctrl.signal,
        });
      }

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const reader = resp.body?.getReader();
      if (!reader) throw new Error('无响应数据');

      const decoder = new TextDecoder();
      let buf = '';
      let got = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (ctrl.signal.aborted) return;

        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim().startsWith('data:')) continue;
          const data = line.trim().slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const j = JSON.parse(data);
            const delta = j.choices?.[0]?.delta;
            const raw = delta?.content || delta?.reasoning_content || '';
            const clean = raw.replace(/\*/g, '');
            if (clean) {
              got = true;
              setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 && m.isStreaming ? { ...m, content: m.content + clean } : m));
            }
          } catch { /* skip */ }
        }
      }

      setMessages(prev => prev.map(m => ({ ...m, isStreaming: false })));
      if (!got) setError('AI 返回空结果，请重试');
    } catch (e: any) {
      if (e?.name !== 'AbortError') setError(e.message || '解读失败');
      setMessages(prev => prev.map(m => ({ ...m, isStreaming: false })));
    } finally {
      setIsLoading(false);
    }
  }, [question, result.original.yaoLines, result.original.name]);

  useEffect(() => {
    if (!hasInitialCall && result && question) {
      setHasInitialCall(true);
      callAI([]);
    }
  }, [hasInitialCall, result, question, callAI]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const val = input.trim();
    setInput('');

    const u: ChatMessage = { role: 'user', content: val };
    setMessages(p => [...p, u]);
    await callAI([...messages, u]);
  };

  return (
    <div className="panel">
      <h3 className="text-section-title flex items-center gap-2 mb-3">
        <span>🔮</span> AI 智能解读
      </h3>

      {messages.length === 0 && !isLoading && !error && (
        <div className="mb-3 p-3 bg-surface-alt rounded-lg text-sm">
          <span className="text-text-muted">问题：</span>
          <span className="text-text-secondary">{question}</span>
        </div>
      )}

      {isLoading && messages.length === 0 && (
        <div className="flex items-center gap-2 py-6 text-text-muted">
          <div className="w-4 h-4 border-2 border-gold/30 border-t-gold animate-spin rounded-full" />
          <span>解读中...</span>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mb-3 text-xs text-text-muted flex items-center gap-2">
          <span>🔍</span>
          <span>已搜索到 {searchResults.length} 条相关数据作为参考</span>
        </div>
      )}

      {messages.length > 0 && (
        <div ref={chatRef} className="max-h-[350px] overflow-y-auto space-y-3 p-3 bg-surface-alt/50 rounded-lg">
          {messages.filter(m => m.content || m.isStreaming).map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                m.role === 'user' ? 'bg-gold/20 border border-gold/20' : 'bg-surface border border-border-light'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed font-kaishu">
                  {m.content}
                  {m.isStreaming && <span className="inline-block w-1.5 h-4 bg-gold ml-1 animate-pulse" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-cinnabar/10 border border-cinnabar/20 rounded-lg text-cinnabar-light text-sm">
          {error} <button onClick={() => callAI(messages)} className="ml-2 underline">重试</button>
        </div>
      )}

      {!isLoading && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="追问..."
            className="flex-1 py-2 px-3 bg-surface border border-border-light rounded-lg text-sm"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="px-4 py-2 bg-gold/20 rounded-lg text-sm disabled:opacity-50">💬</button>
        </div>
      )}

      {isLoading && (
        <button onClick={() => abortRef.current?.abort()} className="mt-2 px-4 py-2 bg-cinnabar/10 rounded-lg text-cinnabar-light text-sm">■ 停止</button>
      )}
    </div>
  );
}