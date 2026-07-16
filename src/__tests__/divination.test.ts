/**
 * 核心占卜引擎单元测试
 */
import { describe, it, expect } from 'vitest';
import {
  castHexagram,
  buildHexagram,
  getHexagramUnicode,
  getHexagramData,
  getInterlockingHexagram,
  getWrongHexagram,
  getReverseHexagram,
  getBodyUseAnalysis,
  getGanzhiDetail,
  yearToGanzhi,
  EIGHT_TRIGRAMS,
  HEXAGRAM_DATA,
  Wuxing,
  WUXING_GENERATE,
  WUXING_OVERCOME,
} from '@/lib/divination';

// ============================================================
// 第一部分：基础数据完整性
// ============================================================

describe('八卦数据', () => {
  it('应该有 8 个八卦', () => {
    expect(Object.keys(EIGHT_TRIGRAMS)).toHaveLength(8);
  });

  it('每个八卦都应该有正确的数据结构', () => {
    for (const [key, trigram] of Object.entries(EIGHT_TRIGRAMS)) {
      expect(trigram).toHaveProperty('name');
      expect(trigram).toHaveProperty('symbol');
      expect(trigram).toHaveProperty('nature');
      expect(trigram).toHaveProperty('wuxing');
      expect(trigram).toHaveProperty('lines');
      expect(trigram.lines).toHaveLength(3);
    }
  });

  it('乾卦应该是全阳爻', () => {
    expect(EIGHT_TRIGRAMS[7].lines).toEqual([true, true, true]);
    expect(EIGHT_TRIGRAMS[7].name).toBe('乾');
  });

  it('坤卦应该是全阴爻', () => {
    expect(EIGHT_TRIGRAMS[0].lines).toEqual([false, false, false]);
    expect(EIGHT_TRIGRAMS[0].name).toBe('坤');
  });
});

describe('六十四卦数据', () => {
  it('应该有 64 卦', () => {
    expect(HEXAGRAM_DATA).toHaveLength(64);
  });

  it('所有卦名应该唯一', () => {
    const names = HEXAGRAM_DATA.map(h => h.name);
    expect(new Set(names).size).toBe(64);
  });

  it('每卦应该有完整的字段', () => {
    for (const hex of HEXAGRAM_DATA) {
      expect(hex.name).toBeTruthy();
      expect(hex.unicode).toBeTruthy();
      expect(hex.guaci).toBeTruthy();
      expect(hex.xiangCi).toBeTruthy();
      expect(hex.modernAdvice).toBeTruthy();
      expect(hex.upperTrigram).toBeGreaterThanOrEqual(0);
      expect(hex.upperTrigram).toBeLessThan(8);
      expect(hex.lowerTrigram).toBeGreaterThanOrEqual(0);
      expect(hex.lowerTrigram).toBeLessThan(8);
    }
  });

  it('所有卦应该以 index 排序（非数组顺序）', () => {
    // HEXAGRAM_DATA 按 index 排序，不是按数组位置
    const indices = HEXAGRAM_DATA.map(h => h.index).sort((a, b) => a - b);
    expect(indices[0]).toBe(0);
    expect(indices[indices.length - 1]).toBe(63);

    // 找到乾为天和坤为地
    const qian = HEXAGRAM_DATA.find(h => h.name === '乾为天');
    const kun = HEXAGRAM_DATA.find(h => h.name === '坤为地');
    expect(qian).toBeDefined();
    expect(kun).toBeDefined();
    expect(qian!.index).toBe(0);
    expect(kun!.index).toBe(62);
  });
});

// ============================================================
// 第二部分：占卜核心逻辑
// ============================================================

describe('castHexagram', () => {
  it('应该返回正确的数据结构', () => {
    const coins = [[2,2,3], [3,2,2], [3,3,2], [2,3,2], [2,2,3], [3,2,2]];
    const result = castHexagram(coins);

    expect(result).toHaveProperty('original');
    expect(result).toHaveProperty('changed');
    expect(result).toHaveProperty('changingYao');
    expect(result).toHaveProperty('coinsHistory');
    expect(result.coinsHistory).toEqual(coins);
  });

  it('应该正确识别本卦名称', () => {
    // 6个少阳（7） → 具体卦象由上下卦决定
    const coins = [[2,3,2], [2,3,2], [2,3,2], [2,3,2], [2,3,2], [2,3,2]];
    const result = castHexagram(coins);
    expect(result.original.name).toBeTruthy();
    expect(result.original.yaoLines).toHaveLength(6);
  });

  it('变爻为 6 或 9 时应标记 changing', () => {
    // 老阴(6) = 2+2+2, 老阳(9) = 3+3+3
    const coins: number[][] = [[2,2,2], [3,2,2], [3,3,2], [2,3,2], [2,2,3], [3,3,3]];
    const result = castHexagram(coins);

    expect(result.original.yaoLines[0].changing).toBe(true);  // 老阴
    expect(result.original.yaoLines[0].value).toBe(6);
    expect(result.original.yaoLines[5].changing).toBe(true);  // 老阳
    expect(result.original.yaoLines[5].value).toBe(9);
    expect(result.changingYao.length).toBeGreaterThanOrEqual(1);
  });

  it('无变爻时应返回 null changed', () => {
    // 全部少阳(7)少阴(8)
    const coins = [[2,3,2], [2,3,2], [3,2,3], [2,3,2], [3,2,3], [2,3,2]];
    const result = castHexagram(coins);
    expect(result.changed).toBeNull();
    expect(result.changingYao).toHaveLength(0);
  });

  it('有变爻时应生成变卦', () => {
    const coins = [[2,2,2], [3,2,2], [3,3,2], [2,3,2], [2,2,3], [3,2,3]];
    const result = castHexagram(coins);
    if (result.changingYao.length > 0) {
      expect(result.changed).not.toBeNull();
      expect(result.changed!.name).toBeTruthy();
    }
  });
});

describe('buildHexagram', () => {
  it('应该从爻线正确构建卦象', () => {
    // 乾为天：全部阳爻
    const yaoLines = [
      { index: 0, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 1, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 2, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 3, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 4, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 5, value: 7 as const, yin: false, changing: false, label: '少阳' },
    ];
    // 上乾下乾 → 乾为天
    const hex = buildHexagram(yaoLines, 7, 7);
    expect(hex.name).toBe('乾为天');
  });
});

// ============================================================
// 第三部分：卦象关系
// ============================================================

describe('getInterlockingHexagram', () => {
  it('应该正确计算互卦', () => {
    // 用具体卦象测试
    const yaoLines = [
      { index: 0, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 1, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 2, value: 8 as const, yin: true, changing: false, label: '少阴' },
      { index: 3, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 4, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 5, value: 7 as const, yin: false, changing: false, label: '少阳' },
    ];
    const result = getInterlockingHexagram(yaoLines);
    expect(result).not.toBeNull();
    expect(result!.name).toBeTruthy();
  });
});

describe('getWrongHexagram', () => {
  it('应该正确计算错卦（阴阳全变）', () => {
    // 乾为天 → 坤为地
    const yaoLines = [
      { index: 0, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 1, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 2, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 3, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 4, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 5, value: 7 as const, yin: false, changing: false, label: '少阳' },
    ];
    const result = getWrongHexagram(yaoLines);
    expect(result).not.toBeNull();
    expect(result!.name).toContain('坤');
  });
});

describe('getReverseHexagram', () => {
  it('应该正确计算综卦（上下翻转）', () => {
    const yaoLines = [
      { index: 0, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 1, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 2, value: 7 as const, yin: false, changing: false, label: '少阳' },
      { index: 3, value: 8 as const, yin: true, changing: false, label: '少阴' },
      { index: 4, value: 8 as const, yin: true, changing: false, label: '少阴' },
      { index: 5, value: 8 as const, yin: true, changing: false, label: '少阴' },
    ];
    const result = getReverseHexagram(yaoLines);
    expect(result).not.toBeNull();
    expect(result!.name).toBeTruthy();
  });
});

// ============================================================
// 第四部分：体用生克
// ============================================================

describe('getBodyUseAnalysis', () => {
  it('应该返回正确的体用分析', () => {
    // 用乾为天卦测试
    const hexagram = {
      name: '乾为天',
      yaoLines: [
        { index: 0, value: 7 as const, yin: false, changing: false, label: '少阳' },
        { index: 1, value: 7 as const, yin: false, changing: false, label: '少阳' },
        { index: 2, value: 7 as const, yin: false, changing: false, label: '少阳' },
        { index: 3, value: 7 as const, yin: false, changing: false, label: '少阳' },
        { index: 4, value: 7 as const, yin: false, changing: false, label: '少阳' },
        { index: 5, value: 7 as const, yin: false, changing: false, label: '少阳' },
      ],
      upperTrigram: 7,  // 乾
      lowerTrigram: 7,  // 乾
    };
    const result = getBodyUseAnalysis(hexagram);
    expect(result.body.trigramName).toBe('乾');
    expect(result.use.trigramName).toBe('乾');
    expect(result.relation).toBe('体用比和');
    expect(result.interpretation).toContain('大吉');
  });
});

describe('五行生克', () => {
  it('木生火', () => {
    expect(WUXING_GENERATE[Wuxing.Wood]).toBe(Wuxing.Fire);
  });
  it('金克木', () => {
    expect(WUXING_OVERCOME[Wuxing.Metal]).toBe(Wuxing.Wood);
  });
  it('五行相生循环完整', () => {
    expect(WUXING_GENERATE[Wuxing.Wood]).toBe(Wuxing.Fire);
    expect(WUXING_GENERATE[Wuxing.Fire]).toBe(Wuxing.Earth);
    expect(WUXING_GENERATE[Wuxing.Earth]).toBe(Wuxing.Metal);
    expect(WUXING_GENERATE[Wuxing.Metal]).toBe(Wuxing.Water);
    expect(WUXING_GENERATE[Wuxing.Water]).toBe(Wuxing.Wood);
  });
});

// ============================================================
// 第五部分：天干地支
// ============================================================

describe('getGanzhiDetail', () => {
  it('1984 年应该是甲子年', () => {
    const result = getGanzhiDetail(1984);
    expect(result).not.toBeNull();
    expect(result!.ganzhi).toBe('甲子');
    expect(result!.stem).toBe('甲');
    expect(result!.branch).toBe('子');
    expect(result!.zodiac).toBe('鼠');
  });

  it('2024 年应该是甲辰年', () => {
    const result = getGanzhiDetail(2024);
    expect(result).not.toBeNull();
    expect(result!.ganzhi).toBe('甲辰');
    expect(result!.zodiac).toBe('龙');
  });

  it('无效年份应该返回 null', () => {
    expect(getGanzhiDetail(0)).toBeNull();
    expect(getGanzhiDetail(10000)).toBeNull();
    expect(getGanzhiDetail(NaN)).toBeNull();
  });
});

describe('yearToGanzhi', () => {
  it('1984 年 -> 甲子', () => {
    expect(yearToGanzhi(1984)).toBe('甲子');
  });
  it('2026 年应该是丙午年', () => {
    // 2026 - 1984 = 42, 42 % 60 = 42
    // 甲子=0, 乙丑=1, ..., 丙午=42
    expect(yearToGanzhi(2026)).toBe('丙午');
  });
});

// ============================================================
// 第六部分：卦符 Unicode
// ============================================================

describe('getHexagramUnicode', () => {
  it('乾为天应该返回对应的 Unicode 卦符', () => {
    // 上乾(7)下乾(7) → 0x4DC0 + 63 = 0x4DFF
    expect(getHexagramUnicode(7, 7)).toBe('䷿');
  });
  it('坤为地应该返回对应的 Unicode 卦符', () => {
    // 上坤(0)下坤(0) → 0x4DC0 + 0 = 0x4DC0
    expect(getHexagramUnicode(0, 0)).toBe('䷀');
  });
});

// ============================================================
// 第七部分：getHexagramData
// ============================================================

describe('getHexagramData', () => {
  it('应该返回正确的卦数据', () => {
    // 上离(5)下坎(2) → 火水未济
    const data = getHexagramData(5, 2);
    expect(data).not.toBeNull();
    expect(data!.name).toBe('火水未济');
  });

  it('不存在的组合应该返回 null', () => {
    expect(getHexagramData(99, 99)).toBeNull();
  });
});