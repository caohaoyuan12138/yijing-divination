/**
 * 卦象显示组件 - 清洁版
 */
import { getTrigramNames, type Hexagram, type Yao } from '@/lib/divination';
import { getHexagramData, type HexagramData } from '@/lib/divination';
import { useMemo } from 'react';
import type { DivinationResult } from '@/lib/divination';

function YaoLine({ yao, index }: { yao: Yao; index: number }) {
  const isYang = yao.yin;
  const isChanging = yao.changing;
  const positionNames = ['初', '二', '三', '四', '五', '上'];

  return (
    <div className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-500 ${
      isChanging ? 'bg-gold/10 border border-gold/20' : ''
    }`} style={{ animationDelay: `${index * 80}ms` }}>
      <span className={`w-8 text-sm shrink-0 font-medium ${
        isChanging ? 'text-gold-dark' : 'text-text-muted'
      }`}>
        {positionNames[index]}
      </span>

      {isYang ? (
        <div className="flex-1 h-5 flex items-center justify-center">
          <div className={`w-full h-2.5 rounded-full transition-all duration-300 ${
            isChanging
              ? 'bg-gradient-to-r from-cinnabar to-gold animate-pulse'
              : 'bg-gradient-to-r from-gold-dark to-gold'
          }`} />
        </div>
      ) : (
        <div className="flex-1 h-5 flex items-center justify-between px-3">
          <div className={`w-[42%] h-2.5 rounded-full transition-all duration-300 ${
            isChanging
              ? 'bg-gradient-to-r from-cinnabar to-gold animate-pulse'
              : 'bg-gradient-to-r from-gold-dark/70 to-gold-light/70'
          }`} />
          <div className={`w-[42%] h-2.5 rounded-full transition-all duration-300 ${
            isChanging
              ? 'bg-gradient-to-r from-cinnabar to-gold animate-pulse'
              : 'bg-gradient-to-r from-gold-dark/70 to-gold-light/70'
          }`} />
        </div>
      )}

      <span className={`text-xs w-20 text-right shrink-0 font-medium ${
        isChanging ? 'text-cinnabar-light' : 'text-text-muted'
      }`}>
        {yao.value === 6 ? '老阴 ⚋' : yao.value === 7 ? '少阳 ⚊' : yao.value === 8 ? '少阴 ⚋' : '老阳 ⚊'}
        {isChanging && ' ↻'}
      </span>
    </div>
  );
}

function HexagramCard({ hexagram, title, data }: {
  hexagram: Hexagram;
  title: string;
  data?: HexagramData;
}) {
  const trigrams = getTrigramNames(hexagram);
  const visualLines = [...hexagram.yaoLines].reverse().map(y => y.yin ? '⚊' : '⚋').join('');

  return (
    <div className="panel">
      <h3 className="text-section-title text-center mb-4">{title}</h3>

      <div className="text-center mb-4">
        <span className="text-6xl">{data?.unicode || '☰'}</span>
        <div className="text-2xl font-kaishu text-text-primary mt-2 font-bold">{hexagram.name}</div>
      </div>

      <div className="text-center mb-4 font-kaishu text-text-muted text-xl tracking-widest">
        {visualLines}
      </div>

      <div className="flex justify-center gap-6 mb-4 text-sm text-text-muted">
        <span className="badge-gold">上: {trigrams.upper}</span>
        <span className="badge-gold">下: {trigrams.lower}</span>
      </div>

      <div className="divider my-4" />

      {data && (
        <div className="space-y-3 text-sm text-text-secondary">
          <div>
            <span className="text-gold-dark font-bold">卦辞：</span>
            <span className="text-kaishu">{data.guaci}</span>
          </div>
          <div>
            <span className="text-gold-dark font-bold">象辞：</span>
            <span className="text-kaishu">{data.xiangCi}</span>
          </div>
          <div>
            <span className="text-gold-dark font-bold">概要：</span>
            <span className="text-kaishu">{data.summary}</span>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-1">
        {[...hexagram.yaoLines].reverse().map((yao, revIdx) => (
          <YaoLine key={yao.index} yao={yao} index={revIdx} />
        ))}
      </div>
    </div>
  );
}

function ChangingYaoNotice({ changingYao, changed }: {
  changingYao: Yao[];
  original?: Hexagram;
  changed: Hexagram | null;
}) {
  if (changingYao.length === 0) return null;

  const positionNames = ['初', '二', '三', '四', '五', '上'];
  const changingNames = changingYao.map(y => positionNames[y.index]);

  return (
    <div className="panel border-cinnabar/20 bg-cinnabar/5">
      <h3 className="text-cinnabar-light text-lg font-bold mb-3 text-center">⚡ 变爻提示</h3>
      <p className="text-text-secondary text-sm text-center mb-3">
        共 <span className="text-cinnabar-light font-bold">{changingYao.length}</span> 条变爻（{changingNames.join('、')}爻），变为 <span className="font-bold">{changed?.name || '未知'}</span>
      </p>
      <div className="space-y-2">
        {changingYao.map(y => (
          <div key={y.index} className="text-sm text-text-secondary">
            <span className="text-cinnabar-light font-bold">
              {positionNames[y.index]}爻（{y.value === 6 ? '老阴' : '老阳'}）：
            </span>
            {y.value === 6
              ? '阴盛至极，将转为阳。宜守不宜进。'
              : '阳极将衰，将转为阴。宜顺势而为。'
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HexagramDisplay({ result }: { result: DivinationResult }) {
  const originalData = useMemo(() =>
    getHexagramData(result.original.upperTrigram, result.original.lowerTrigram),
    [result.original.upperTrigram, result.original.lowerTrigram]
  );

  const variantData = result.changed ?
    getHexagramData(result.changed.upperTrigram, result.changed.lowerTrigram) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 掷币记录 */}
      <div className="panel">
        <h3 className="text-section-title text-center mb-4">掷币记录</h3>
        <div className="grid grid-cols-6 gap-2 text-center">
          {result.coinsHistory.map((coins: number[], i: number) => {
            const sum = coins[0] + coins[1] + coins[2];
            const positionNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
            const labels: Record<number, string> = { 6: '老阴 ⚋', 7: '少阳 ⚊', 8: '少阴 ⚋', 9: '老阳 ⚊' };
            return (
              <div key={i} className="text-sm p-2 bg-surface-alt rounded-lg">
                <div className="text-text-muted font-medium">{positionNames[i]}</div>
                <div className="text-text-primary font-bold">{labels[sum]}</div>
                <div className="text-text-muted/60 text-xs mt-1">
                  {coins.map((c: number) => c === 3 ? '阳' : '阴').join('')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 本卦 */}
      <HexagramCard hexagram={result.original} title="本 卦" data={originalData ?? undefined} />

      {/* 变爻 */}
      <ChangingYaoNotice
        changingYao={result.changingYao}
        original={result.original}
        changed={result.changed}
      />

      {/* 变卦 */}
      {result.changed && variantData && (
        <HexagramCard hexagram={result.changed} title="变 卦" data={variantData ?? undefined} />
      )}
    </div>
  );
}
