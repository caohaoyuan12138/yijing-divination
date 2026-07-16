import { useState } from 'react';
import { numberDivination, timeDivination, directionDivination, characterDivination, nameDivination } from '@/lib/divination-methods';

interface DivinationMethodsPanelProps {
  onResult: (result: { upperTrigram: number; lowerTrigram: number; changingLine: number; method: string }) => void;
  disabled?: boolean;
}

type MethodType = 'coin' | 'number' | 'time' | 'direction' | 'character' | 'name';

export default function DivinationMethodsPanel({ onResult }: DivinationMethodsPanelProps) {
  const [method, setMethod] = useState<MethodType>('coin');
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [direction, setDirection] = useState('南');
  const [character, setCharacter] = useState('');
  const [surname, setSurname] = useState('');
  const [givenName, setGivenName] = useState('');

  const handleNumberDivination = () => {
    const n1 = parseInt(num1) || 0;
    const n2 = num2 ? parseInt(num2) : undefined;
    const n3 = num3 ? parseInt(num3) : undefined;
    const result = numberDivination(n1, n2, n3);
    onResult(result);
  };

  const handleTimeDivination = () => {
    const now = new Date();
    const result = timeDivination(now);
    onResult(result);
  };

  const handleDirectionDivination = () => {
    const n = parseInt(num1) || 0;
    const result = directionDivination(direction, n);
    onResult(result);
  };

  const handleCharacterDivination = () => {
    if (!character) return;
    const result = characterDivination(character.charAt(0));
    onResult(result);
  };

  const handleNameDivination = () => {
    if (!surname && !givenName) return;
    const result = nameDivination(surname || '张', givenName || '三');
    onResult(result);
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-text-muted mb-2">选择起卦方式：</div>

      {/* 方式选择 */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
        {[
          { id: 'coin', label: '🪙 金钱卦' },
          { id: 'number', label: '🔢 数字卦' },
          { id: 'time', label: '🕐 时间卦' },
          { id: 'direction', label: '🧭 方位卦' },
          { id: 'character', label: '✍️ 测字卦' },
          { id: 'name', label: '📛 姓名卦' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id as MethodType)}
            className={`px-2 py-1 rounded text-xs transition-all ${
              method === m.id
                ? 'bg-gold/10 border border-gold/30 text-gold'
                : 'bg-surface-alt border border-border-light text-text-muted hover:bg-surface-alt/80'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 金钱卦 */}
      {method === 'coin' && (
        <div className="p-3 bg-surface-alt rounded-lg text-xs text-text-muted">
          使用三枚铜钱摇六次，每次根据正反面组合得出一个爻（6=老阴、7=少阳、8=少阴、9=老阳）
        </div>
      )}

      {/* 数字起卦 */}
      {method === 'number' && (
        <div className="p-3 bg-surface-alt rounded-lg space-y-2">
          <div className="text-xs text-text-muted">输入1-3个数字（梅花易数法）：</div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="数字1（上卦）"
              className="w-full px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
            />
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder="数字2（下卦）"
              className="w-full px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
            />
            <input
              type="number"
              value={num3}
              onChange={(e) => setNum3(e.target.value)}
              placeholder="数字3（动爻）"
              className="w-full px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
            />
          </div>
          <button
            onClick={handleNumberDivination}
            disabled={!num1}
            className="w-full px-3 py-1.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20 disabled:opacity-50"
          >
            开始数字起卦
          </button>
        </div>
      )}

      {/* 时间起卦 */}
      {method === 'time' && (
        <div className="p-3 bg-surface-alt rounded-lg space-y-2">
          <div className="text-xs text-text-muted">
            按当前时间自动起卦（奇门遁甲正宗法）
          </div>
          <button
            onClick={handleTimeDivination}
            className="w-full px-3 py-1.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20"
          >
            以当前时间起卦
          </button>
        </div>
      )}

      {/* 方位起卦 */}
      {method === 'direction' && (
        <div className="p-3 bg-surface-alt rounded-lg space-y-2">
          <div className="text-xs text-text-muted">选择方位 + 输入数字：</div>
          <div className="flex gap-2">
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="flex-1 px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
            >
              {['南', '北', '东', '西', '东南', '东北', '西南', '西北'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="数字"
              className="w-20 px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
            />
          </div>
          <button
            onClick={handleDirectionDivination}
            disabled={!num1}
            className="w-full px-3 py-1.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20 disabled:opacity-50"
          >
            开始方位起卦
          </button>
        </div>
      )}

      {/* 测字起卦 */}
      {method === 'character' && (
        <div className="p-3 bg-surface-alt rounded-lg space-y-2">
          <div className="text-xs text-text-muted">输入一个字，拆解字形起卦：</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              placeholder="输入一个字"
              maxLength={1}
              className="w-20 px-2 py-1.5 bg-surface border border-border-light rounded text-xs text-center text-lg"
            />
          </div>
          <button
            onClick={handleCharacterDivination}
            disabled={!character}
            className="w-full px-3 py-1.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20 disabled:opacity-50"
          >
            开始测字起卦
          </button>
        </div>
      )}

      {/* 姓名起卦 */}
      {method === 'name' && (
        <div className="p-3 bg-surface-alt rounded-lg space-y-2">
          <div className="text-xs text-text-muted">输入姓名，根据笔画起卦：</div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="姓"
              className="w-full px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
            />
            <input
              type="text"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              placeholder="名"
              className="w-full px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
            />
          </div>
          <button
            onClick={handleNameDivination}
            disabled={!surname && !givenName}
            className="w-full px-3 py-1.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20 disabled:opacity-50"
          >
            开始姓名起卦
          </button>
        </div>
      )}
    </div>
  );
}
