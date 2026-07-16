/**
 * AnySearch 搜索引擎服务
 * API: https://api.anysearch.com
 */

const SEARCH_API_KEY = import.meta.env.VITE_SEARCH_API_KEY || '';
const SEARCH_API_BASE = import.meta.env.VITE_SEARCH_API_BASE || 'https://api.anysearch.com';

// 检测是否在原生平台（Capacitor）
function isNativePlatform(): boolean {
  return typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
}

// API 基础路径
function getSearchApiBase(): string {
  if (isNativePlatform()) {
    return SEARCH_API_BASE;
  }
  return '/api/search';
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  content?: string;
}

export async function searchContext(query: string): Promise<SearchResult[]> {
  try {
    const searchBase = getSearchApiBase();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (isNativePlatform()) {
      headers['Authorization'] = `Bearer ${SEARCH_API_KEY}`;
    }
    const response = await fetch(`${searchBase}/v1/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, num_results: 5 }),
    });

    if (!response.ok) {
      console.warn('搜索 API 请求失败:', response.status);
      return [];
    }

    const data = await response.json();
    return extractResults(data);
  } catch (error) {
    console.warn('搜索服务暂时不可用:', error);
    return [];
  }
}

function extractResults(data: unknown): SearchResult[] {
  if (!data || typeof data !== 'object') return [];
  const obj = data as Record<string, unknown>;

  // AnySearch: { data: { results: [...] } }
  if (obj.data && typeof obj.data === 'object') {
    const d = obj.data as Record<string, unknown>;
    if (Array.isArray(d.results)) return d.results as SearchResult[];
    if (Array.isArray(d.data)) return d.data as SearchResult[];
  }

  if (Array.isArray(obj.results)) return obj.results as SearchResult[];
  if (Array.isArray(data)) return data as SearchResult[];

  for (const key of Object.keys(obj)) {
    if (Array.isArray(obj[key])) return obj[key] as SearchResult[];
  }

  return [];
}

export function formatSearchResults(results: SearchResult[] | null | undefined): string {
  if (!results || !Array.isArray(results) || results.length === 0) return '';

  const formatted = results
    .slice(0, 5)
    .map((r, i) => `[${i + 1}] ${r.title || '无标题'}\n${r.snippet || r.content || ''}`)
    .join('\n\n');

  return `【实时搜索参考数据】\n${formatted}\n`;
}
