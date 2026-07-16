import { describe, it, expect } from 'vitest';
import {
  numberDivination,
  timeDivination,
  directionDivination,
  characterDivination,
  nameDivination,
} from '@/lib/divination-methods';

describe('数字起卦', () => {
  it('应该返回正确的上下卦和动爻', () => {
    const result = numberDivination(3, 5, 7);
    expect(result.upperTrigram).toBeGreaterThanOrEqual(0);
    expect(result.upperTrigram).toBeLessThan(8);
    expect(result.lowerTrigram).toBeGreaterThanOrEqual(0);
    expect(result.lowerTrigram).toBeLessThan(8);
    expect(result.changingLine).toBeGreaterThanOrEqual(0);
    expect(result.changingLine).toBeLessThan(6);
    expect(result.method).toContain('数字起卦');
  });

  it('单个数字也能起卦', () => {
    const result = numberDivination(10);
    expect(result.upperTrigram).toBeGreaterThanOrEqual(0);
    expect(result.lowerTrigram).toBeGreaterThanOrEqual(0);
  });
});

describe('时间起卦', () => {
  it('应该返回正确的卦象', () => {
    const now = new Date('2026-07-16T14:30:00');
    const result = timeDivination(now);
    expect(result.upperTrigram).toBeGreaterThanOrEqual(0);
    expect(result.upperTrigram).toBeLessThan(8);
    expect(result.lowerTrigram).toBeGreaterThanOrEqual(0);
    expect(result.lowerTrigram).toBeLessThan(8);
    expect(result.method).toContain('时间起卦');
    expect(result.timeInfo).toBeTruthy();
  });
});

describe('方位起卦', () => {
  it('南方应该对应乾卦', () => {
    const result = directionDivination('南', 5);
    expect(result.upperTrigram).toBe(7); // 乾
    expect(result.method).toContain('方位起卦');
  });

  it('东方应该对应离卦', () => {
    const result = directionDivination('东', 3);
    expect(result.upperTrigram).toBe(5); // 离
  });
});

describe('测字起卦', () => {
  it('应该返回有效卦象', () => {
    const result = characterDivination('易');
    expect(result.upperTrigram).toBeGreaterThanOrEqual(0);
    expect(result.upperTrigram).toBeLessThan(8);
    expect(result.lowerTrigram).toBeGreaterThanOrEqual(0);
    expect(result.lowerTrigram).toBeLessThan(8);
  });
});

describe('姓名起卦', () => {
  it('应该返回有效卦象', () => {
    const result = nameDivination('张', '三');
    expect(result.upperTrigram).toBeGreaterThanOrEqual(0);
    expect(result.upperTrigram).toBeLessThan(8);
    expect(result.lowerTrigram).toBeGreaterThanOrEqual(0);
    expect(result.lowerTrigram).toBeLessThan(8);
  });
});