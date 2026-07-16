import { useState, useEffect } from 'react';

const FORTUNE_LEVELS = ['大吉', '中吉', '小吉', '平', '小凶', '中凶', '大凶'];
const FORTUNE_EMOJI = ['🌟', '✨', '⭐', '➖', '🌧️', '⛈️', '💀'];

const DREAM_MEANINGS: Record<string, string[]> = {
  '水': ['财运将至', '情感流动', '智慧开启', '宜学习新事物'],
  '火': ['事业上升', '贵人相助', '名声远播', '注意言行'],
  '山': ['稳中有升', '贵人扶持', '宜守不宜攻', '健康平安'],
  '风': ['变化将生', '宜出行', '消息将至', '调整心态'],
  '雷': ['突发机遇', '振奋人心', '宜主动出击', '防小人'],
  '泽': ['口舌是非', '宜多沟通', '感情和睦', '财运平稳'],
  '天': ['事业高升', '领导认可', '大展宏图', '贵人相助'],
  '地': ['脚踏实地', '稳扎稳打', '家庭和睦', '健康平安'],
  '蛇': ['智慧启迪', '机遇暗藏', '宜深思熟虑', '防欺骗'],
  '龙': ['大吉之兆', '事业腾飞', '贵人豪助', '名利双收'],
  '虎': ['威严正义', '克服困难', '宜勇敢面对', '小心受伤'],
  '马': ['奔腾向前', '事业顺利', '宜出行', '注意安全'],
};

const ANNUAL_HEXAGRAMS: Record<number, { name: string; meaning: string }> = {
  2024: { name: '雷火丰', meaning: '如日中天，事业鼎盛，把握机遇' },
  2025: { name: '风水涣', meaning: '涣散流通，变化之宜，稳中求变' },
  2026: { name: '雷水解', meaning: '困难解除，否极泰来，把握机遇' },
  2027: { name: '地山谦', meaning: '谦虚受益，德行兼备，稳中有升' },
  2028: { name: '天火同人', meaning: '团结协作，共创辉煌，广结善缘' },
  2029: { name: '泽天夬', meaning: '决断果敢，把握机遇，勇往直前' },
  2030: { name: '山天大畜', meaning: '厚积薄发，德行兼备，大有可为' },
  2031: { name: '火地晋', meaning: '步步高升，事业进展，贵人相助' },
  2032: { name: '天地否', meaning: '闭塞不通，守正待时，韬光养晦' },
  2033: { name: '风山渐', meaning: '循序渐进，稳步推进，终成大器' },
};

export default function FunFeaturesPanel() {
  const [tab, setTab] = useState<'checkin' | 'match' | 'stats' | 'dream' | 'annual'>('checkin');
  const [signed, setSigned] = useState(false);
  const [signResult, setSignResult] = useState<any>(null);

  const doSign = () => {
    const level = Math.floor(Math.random() * 7);
    const wishes = ['事业', '爱情', '健康', '财运', '学业'];
    const wish = wishes[Math.floor(Math.random() * wishes.length)];
    setSignResult({
      level: FORTUNE_LEVELS[level],
      emoji: FORTUNE_EMOJI[level],
      wish,
      advice: getAdvice(level),
    });
    setSigned(true);
  };

  const getAdvice = (level: number) => {
    const advices = [
      '今日运势极佳，适合做重要决定！',
      '好运相伴，保持积极心态。',
      '小有收获，脚踏实地。',
      '平稳度日，不宜冒进。',
      '需要谨慎，多留心眼。',
      '困难较多，保持冷静，寻求帮助。',
      '韬光养晦，以退为进，等待时机。',
    ];
    return advices[level];
  };

  return (
    <div className="panel">
      <h3 className="text-section-title flex items-center gap-2 mb-4">
        <span>🎯</span> 趣味功能
      </h3>

      {/* 标签页 */}
      <div className="flex gap-2 mb-4 border-b border-border-light pb-2 overflow-x-auto">
        {[
          { id: 'checkin', label: '🎯 签到' },
          { id: 'match', label: '💕 配对' },
          { id: 'stats', label: '📊 统计' },
          { id: 'dream', label: '🌙 解梦' },
          { id: 'annual', label: '📅 年度' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
              tab === t.id ? 'bg-gold/10 text-gold' : 'text-text-muted hover:bg-surface-alt'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 签到摇一签 */}
      {tab === 'checkin' && (
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-xs text-text-muted mb-2">每日一卦，摇出好运</div>
            {!signed ? (
              <button
                onClick={doSign}
                className="px-6 py-3 bg-gradient-to-r from-gold-dark to-gold rounded-lg text-white font-bold tracking-wider hover:from-gold hover:to-gold-light transition-all"
              >
                🎲 摇一签
              </button>
            ) : (
              <div className="space-y-2">
                <div className="text-3xl">{signResult.emoji}</div>
                <div className="text-lg font-bold text-gold">{signResult.level}</div>
                <div className="text-xs text-text-secondary">
                  <span className="text-gold">{signResult.wish}运</span>
                </div>
                <div className="text-xs text-text-muted">{signResult.advice}</div>
                <button
                  onClick={doSign}
                  className="mt-2 px-3 py-1 bg-surface-alt rounded text-xs text-text-muted hover:bg-surface-alt/80"
                >
                  再摇一次
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 配对测试 */}
      {tab === 'match' && (
        <MatchTest />
      )}

      {/* 卦象统计 */}
      {tab === 'stats' && (
        <HexagramStats />
      )}

      {/* 周公解梦 */}
      {tab === 'dream' && (
        <DreamInterpreter />
      )}

      {/* 年度卦象 */}
      {tab === 'annual' && (
        <AnnualHexagram />
      )}
    </div>
  );
}

function MatchTest() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<any>(null);

  const doMatch = () => {
    if (!name1 || !name2) return;
    const score = Math.floor(Math.random() * 30) + 70;
    const level = score >= 90 ? '天作之合' : score >= 80 ? '情投意合' : score >= 70 ? '相敬如宾' : '需要磨合';
    setResult({ score, level, advice: getMatchAdvice(score) });
  };

  const getMatchAdvice = (score: number) => {
    if (score >= 90) return '你们非常般配，彼此是命中注定的缘分，珍惜这段感情。';
    if (score >= 80) return '你们情投意合，互相理解，感情稳定发展。';
    if (score >= 70) return '你们相敬如宾，多沟通多包容，感情会更好。';
    return '你们需要磨合，多站在对方思考，感情会越来越稳定。';
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-text-muted">输入两人姓名，测试配对指数：</div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          placeholder="姓名1"
          className="w-full px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
        />
        <input
          type="text"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          placeholder="姓名2"
          className="w-full px-2 py-1.5 bg-surface border border-border-light rounded text-xs"
        />
      </div>
      <button
        onClick={doMatch}
        disabled={!name1 || !name2}
        className="w-full px-3 py-1.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20 disabled:opacity-50"
      >
        测试配对
      </button>
      {result && (
        <div className="p-3 bg-gold/5 rounded-lg text-center">
          <div className="text-2xl text-gold font-bold">{result.score}分</div>
          <div className="text-sm text-gold font-bold">{result.level}</div>
          <div className="text-xs text-text-secondary mt-1">{result.advice}</div>
        </div>
      )}
    </div>
  );
}

function HexagramStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('yijing-history') || '[]');
    const trigramCount: Record<string, number> = {};
    let total = 0;
    history.forEach((item: any) => {
      const name = item.result.original.name;
      trigramCount[name] = (trigramCount[name] || 0) + 1;
      total++;
    });
    const sorted = Object.entries(trigramCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5);
    setStats({ total, top: sorted });
  }, []);

  if (!stats || stats.total === 0) {
    return <div className="text-xs text-text-muted text-center py-4">暂无历史记录，开始摇卦吧！</div>;
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-text-muted">共 {stats.total} 次摇卦</div>
      <div className="text-xs text-text-muted font-bold">最常出现的卦象：</div>
      {stats.top.map(([name, count]: any, i: number) => (
        <div key={i} className="flex items-center justify-between p-2 bg-surface-alt rounded">
          <span className="text-xs font-bold text-gold">{name}</span>
          <span className="text-xs text-text-muted">{count} 次</span>
        </div>
      ))}
    </div>
  );
}

function DreamInterpreter() {
  const [dream, setDream] = useState('');
  const [meaning, setMeaning] = useState('');

  const interpret = () => {
    if (!dream) return;
    const results: string[] = [];
    Object.entries(DREAM_MEANINGS).forEach(([key, values]) => {
      if (dream.includes(key)) {
        results.push(...values);
      }
    });
    if (results.length === 0) {
      results.push('梦境信息有限，建议记录更多细节', '保持积极心态，好运将至');
    }
    setMeaning(results.slice(0, 4).join('、'));
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-text-muted">描述你的梦境中的关键元素（如水、火、山、龙、马等）：</div>
      <textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="例如：我梦见一条龙在天空飞翔..."
        className="w-full px-2 py-1.5 bg-surface border border-border-light rounded text-xs h-16 resize-none"
      />
      <button
        onClick={interpret}
        disabled={!dream}
        className="w-full px-3 py-1.5 bg-gold/10 border border-gold/20 rounded text-xs text-gold hover:bg-gold/20 disabled:opacity-50"
      >
        解梦
      </button>
      {meaning && (
        <div className="p-2 bg-gold/5 rounded text-xs text-text-secondary">
          🔮 {meaning}
        </div>
      )}
    </div>
  );
}

function AnnualHexagram() {
  const [year, setYear] = useState(new Date().getFullYear());
  const info = ANNUAL_HEXAGRAMS[year] || { name: '待定', meaning: '请等待来年' };

  return (
    <div className="space-y-3">
      <div className="text-xs text-text-muted">查看每年的年度卦象：</div>
      <div className="flex gap-2 flex-wrap">
        {Object.keys(ANNUAL_HEXAGRAMS).map((y) => (
          <button
            key={y}
            onClick={() => setYear(parseInt(y))}
            className={`px-2 py-1 rounded text-xs ${
              year === parseInt(y)
                ? 'bg-gold/10 border border-gold/30 text-gold'
                : 'bg-surface-alt border border-border-light text-text-muted'
            }`}
          >
            {y}
          </button>
        ))}
      </div>
      <div className="p-3 bg-gold/5 rounded-lg text-center">
        <div className="text-gold font-bold text-lg">{info.name}</div>
        <div className="text-xs text-text-secondary mt-1">{info.meaning}</div>
      </div>
    </div>
  );
}
