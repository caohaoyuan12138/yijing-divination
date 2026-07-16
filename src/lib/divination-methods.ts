/**
 * 多种起卦方式引擎
 * 支持：数字起卦、时间起卦、方位起卦、测字起卦、姓名起卦
 */

/** 数字起卦：输入1-3个数字，按梅花易数法起卦 */
export function numberDivination(num1: number, num2?: number, num3?: number): {
  upperTrigram: number;
  lowerTrigram: number;
  changingLine: number;
  method: string;
} {
  // 上卦 = num1 % 8
  const upperTrigram = ((num1 % 8) + 8) % 8;

  // 下卦 = num2 % 8 (如果没有num2，用num1的各位数字之和)
  const lowerInput = num2 ?? sumDigits(num1);
  const lowerTrigram = ((lowerInput % 8) + 8) % 8;

  // 动爻 = num3 % 6 (如果没有num3，用num1+num2的和)
  const changingInput = num3 ?? (num1 + (num2 ?? 0));
  const changingLine = ((changingInput % 6) + 6) % 6;

  return { upperTrigram, lowerTrigram, changingLine, method: '数字起卦（梅花易数）' };
}

/** 时间起卦：按当前时间自动起卦（奇门遁甲正宗） */
export function timeDivination(date: Date): {
  upperTrigram: number;
  lowerTrigram: number;
  changingLine: number;
  method: string;
  timeInfo: string;
} {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  // 年支序号（子=0，丑=1...）
  const yearBranch = (year - 1984) % 12;
  const adjustedYearBranch = ((yearBranch % 12) + 12) % 12;

  // 上卦 = (年支 + 月 + 日) % 8
  const upperTrigram = ((adjustedYearBranch + month + day) % 8 + 8) % 8;

  // 下卦 = (年支 + 月 + 日 + 时) % 8
  const hourBranch = Math.floor((hour + 1) / 2) % 12;
  const lowerTrigram = ((adjustedYearBranch + month + day + hourBranch) % 8 + 8) % 8;

  // 动爻 = (年支 + 月 + 日 + 时) % 6
  const changingLine = ((adjustedYearBranch + month + day + hourBranch) % 6 + 6) % 6;

  const timeInfo = `${year}年${month}月${day}日${hour}时`;

  return { upperTrigram, lowerTrigram, changingLine, method: '时间起卦（奇门遁甲）', timeInfo };
}

/** 方位起卦：输入方位+数字 */
export function directionDivination(direction: string, num: number): {
  upperTrigram: number;
  lowerTrigram: number;
  changingLine: number;
  method: string;
} {
  // 方位对应八卦：乾南、坤北、离东、坎西、兑东南、震东北、巽西南、艮西北
  const directionMap: Record<string, number> = {
    '南': 7, '北': 0, '东': 5, '西': 2,
    '东南': 3, '东北': 1, '西南': 6, '西北': 4,
  };

  const upperTrigram = directionMap[direction] ?? 7;
  const lowerTrigram = ((num % 8) + 8) % 8;
  const changingLine = ((num + upperTrigram) % 6 + 6) % 6;

  return { upperTrigram, lowerTrigram, changingLine, method: `方位起卦（${direction}方）` };
}

/** 测字起卦：输入一个字，拆解字形 */
export function characterDivination(char: string): {
  upperTrigram: number;
  lowerTrigram: number;
  changingLine: number;
  method: string;
} {
  // 使用Unicode编码计算
  const code = char.charCodeAt(0);
  const upperTrigram = code % 8;
  const lowerTrigram = Math.floor(code / 8) % 8;
  const changingLine = code % 6;

  return { upperTrigram, lowerTrigram, changingLine, method: `测字起卦（"${char}"）` };
}

/** 姓名起卦：根据姓名笔画起卦 */
export function nameDivination(surname: string, givenName: string): {
  upperTrigram: number;
  lowerTrigram: number;
  changingLine: number;
  method: string;
} {
  // 计算笔画数（简化：用字符编码和）
  const surnameCode = splitInput(surname).reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const givenCode = splitInput(givenName).reduce((sum, c) => sum + c.charCodeAt(0), 0);

  const upperTrigram = surnameCode % 8;
  const lowerTrigram = givenCode % 8;
  const changingLine = (surnameCode + givenCode) % 6;

  return { upperTrigram, lowerTrigram, changingLine, method: `姓名起卦（${surname}${givenName}）` };
}

function sumDigits(n: number): number {
  return Math.abs(n).toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
}

function splitInput(str: string): string[] {
  return Array.from(str);
}
