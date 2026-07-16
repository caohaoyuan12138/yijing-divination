import { useState } from 'react';
import { getHexagramUnicode, getHexagramData } from '@/lib/divination';

interface HexagramDetailPanelProps {
  upperTrigram: number;
  lowerTrigram: number;
  yaoLines: { index: number; value: number; yin: boolean; changing: boolean; label: string }[];
}

export default function HexagramDetailPanel({ upperTrigram, lowerTrigram, yaoLines }: HexagramDetailPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const hexData = getHexagramData(upperTrigram, lowerTrigram);

  if (!hexData) return null;

  const yinYangCount = yaoLines.filter(y => y.yin).length;

  return (
    <div className="panel overflow-hidden">
      <h3 className="text-section-title flex items-center gap-2 mb-3">
        <span>📖</span> 卦象详解（离线版）
      </h3>

      {/* 卦名 + 符号 */}
      <div className="text-center mb-4">
        <div className="text-5xl mb-2">{getHexagramUnicode(upperTrigram, lowerTrigram)}</div>
        <div className="text-xl font-bold text-gold mb-1">{hexData.name}</div>
        <div className="text-xs text-text-muted">
          {hexData.upperName}（上卦）· {hexData.lowerName}（下卦）
        </div>
        <div className="text-xs text-text-muted mt-1">{hexData.attribute} · {hexData.summary}</div>
      </div>

      {/* 快速信息 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-surface-alt rounded-lg text-center">
          <div className="text-xs text-text-muted">阴爻</div>
          <div className="font-bold">{yinYangCount}</div>
        </div>
        <div className="p-2 bg-surface-alt rounded-lg text-center">
          <div className="text-xs text-text-muted">阳爻</div>
          <div className="font-bold">{6 - yinYangCount}</div>
        </div>
        <div className="p-2 bg-surface-alt rounded-lg text-center">
          <div className="text-xs text-text-muted">上卦</div>
          <div className="font-bold">{hexData.upperName}</div>
        </div>
        <div className="p-2 bg-surface-alt rounded-lg text-center">
          <div className="text-xs text-text-muted">下卦</div>
          <div className="font-bold">{hexData.lowerName}</div>
        </div>
      </div>

      {/* 卦辞 */}
      <div className="mb-3">
        <div className="text-xs text-text-muted mb-1">卦辞</div>
        <div className="text-sm bg-gold/5 border border-gold/10 rounded-lg p-3 leading-relaxed font-kaishu">
          {hexData.guaci}
        </div>
      </div>

      {/* 象辞 */}
      <div className="mb-3">
        <div className="text-xs text-text-muted mb-1">象辞</div>
        <div className="text-sm bg-surface-alt border border-border-light rounded-lg p-3 leading-relaxed font-kaishu">
          {hexData.xiangCi}
        </div>
      </div>

      {!showAll ? (
        <button onClick={() => setShowAll(true)} className="w-full py-2 text-xs text-gold hover:text-gold-light transition-colors">
          展开全部 ▼
        </button>
      ) : (
        <>
          <div className="mb-3">
            <div className="text-xs text-text-muted mb-1">彖辞</div>
            <div className="text-sm bg-surface-alt border border-border-light rounded-lg p-3 leading-relaxed font-kaishu">
              {hexData.tuanCi}
            </div>
          </div>
          <div className="mb-3">
            <div className="text-xs text-text-muted mb-1">现代解读</div>
            <div className="text-sm bg-gold/5 border border-gold/10 rounded-lg p-3 leading-relaxed">
              {hexData.modernAdvice}
            </div>
          </div>
          <button onClick={() => setShowAll(false)} className="w-full py-2 text-xs text-text-muted hover:text-text-secondary transition-colors">
            收起 ▲
          </button>
        </>
      )}
    </div>
  );
}