import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { getHexagramUnicode } from '@/lib/divination';
import type { DivinationResult } from '@/lib/divination';

interface SharePanelProps {
  result: DivinationResult;
  question: string;
}

export default function SharePanel({ result, question }: SharePanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `周易卦象_${result.original.name}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('生成图片失败:', error);
    }

    setIsGenerating(false);
  };

  const copyText = () => {
    const text = `【周易摇卦】
📅 ${new Date().toLocaleDateString('zh-CN')}
❓ 问题：${question}
🔮 本卦：${result.original.name}
⚡ 变爻：${result.changingYao.length > 0 ? result.changingYao.map(y => ['初', '二', '三', '四', '五', '上'][y.index] + '爻').join('、') : '无'}
${result.changed ? `🔄 变卦：${result.changed.name}` : ''}

六爻：
${result.original.yaoLines.map((y, i) => `${['初', '二', '三', '四', '五', '上'][i]}爻：${y.label}`).join('\n')}`;

    navigator.clipboard.writeText(text).then(() => alert('已复制到剪贴板'));
  };

  const shareUrl = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify({
      q: question,
      h: result.original.name,
      d: Date.now(),
    })));
    const url = `${window.location.origin}?share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => alert('已复制分享链接'));
  };

  return (
    <div className="panel">
      <h3 className="text-section-title flex items-center gap-2 mb-3">
        <span>📤</span> 分享与导出
      </h3>

      {/* 预览卡片 */}
      <div ref={cardRef} className="p-4 bg-gradient-to-b from-gold/5 to-white rounded-lg border border-gold/20 mb-3">
        <div className="text-center">
          <div className="text-5xl mb-2">
            {getHexagramUnicode(result.original.upperTrigram, result.original.lowerTrigram)}
          </div>
          <div className="text-lg font-bold text-gold mb-1">{result.original.name}</div>
          <div className="text-xs text-text-muted mb-2">{question}</div>
          <div className="text-xs text-text-secondary">
            {result.changingYao.length > 0
              ? `变爻：${result.changingYao.map(y => ['初', '二', '三', '四', '五', '上'][y.index]).join('、')}爻`
              : '六爻安定'}
          </div>
          {result.changed && (
            <div className="text-xs text-text-muted mt-1">变卦：{result.changed.name}</div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="px-3 py-2 bg-gold/10 border border-gold/20 rounded-lg text-xs text-gold hover:bg-gold/20 disabled:opacity-50"
        >
          {isGenerating ? '⏳ 生成中...' : '🖼️ 生成图片'}
        </button>
        <button
          onClick={copyText}
          className="px-3 py-2 bg-surface-alt border border-border-light rounded-lg text-xs text-text-muted hover:bg-surface-alt/80"
        >
          📋 复制文本
        </button>
        <button
          onClick={shareUrl}
          className="px-3 py-2 bg-surface-alt border border-border-light rounded-lg text-xs text-text-muted hover:bg-surface-alt/80"
        >
          🔗 分享链接
        </button>
      </div>
    </div>
  );
}
