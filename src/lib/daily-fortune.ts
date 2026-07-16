/**
 * 每日运势助手 — 黄历宜忌、每日一卦、分类运势
 */

import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './divination';

/**
 * 基于日期计算天干地支索引（确定性伪干支）
 * 使用日期数值的确定性哈希，确保同一天总是同一结果
 */
function getDayGanzhi(date: Date): { stemIndex: number; branchIndex: number; stem: string; branch: string } {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const index = ((y * 379 + m * 53 + d * 7) % 60 + 60) % 60;
  return {
    stemIndex: index % 10,
    branchIndex: index % 12,
    stem: HEAVENLY_STEMS[index % 10].name,
    branch: EARTHLY_BRANCHES[index % 12].name,
  };
}

/** 计算建除十二神（确定性，基于日期） */
function getJianChu(date: Date): string {
  const jianChuList = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];

  // 月份对应的地支：正月(1)=寅(2), 二月(2)=卯(3), ..., 十二月(12)=丑(1)
  const monthBranch = (date.getMonth() + 1 + 1) % 12; // +1 because 子=0, 寅=2
  // 日的天干地支
  const dayBranch = getDayGanzhi(date).branchIndex;

  // 建除索引 = (日地支 - 月地支 + 12) % 12
  const jianChuIndex = ((dayBranch - monthBranch + 12) % 12 + 12) % 12;
  return jianChuList[jianChuIndex];
}

/** 获取建除对应宜忌 */
function getJianChuYiJi(jianChu: string): { yi: string[]; ji: string[] } {
  const yiJiMap: Record<string, { yi: string[]; ji: string[] }> = {
    '建': { yi: ['开市', '嫁娶', '造屋', '纳财', '裁衣'], ji: ['移徙', '入宅', '安葬', '词讼'] },
    '除': { yi: ['除服', '疗病', '求医', '扫舍'], ji: ['嫁娶', '开市', '移徙'] },
    '满': { yi: ['祈福', '祭祀', '求嗣', '开市'], ji: ['嫁娶', '造屋', '移徙'] },
    '平': { yi: ['祭祀', '修造', '塗泥', '余事勿取'], ji: ['嫁娶', '开市', '移徙', '入宅'] },
    '定': { yi: ['嫁娶', '开市', '纳财', '造屋'], ji: ['移徙', '入宅', '词讼'] },
    '执': { yi: ['捕捉', '畋猎', '纳财'], ji: ['嫁娶', '开市', '入宅'] },
    '破': { yi: ['破屋', '坏垣', '求医', '治病'], ji: ['嫁娶', '开市', '移徙'] },
    '危': { yi: ['祭祀', '祈福', '求嗣'], ji: ['嫁娶', '开市', '移徙'] },
    '成': { yi: ['开市', '嫁娶', '造屋', '安床'], ji: ['移徙', '入宅', '词讼'] },
    '收': { yi: ['纳财', '捕捉', '畋猎'], ji: ['嫁娶', '开市', '造屋'] },
    '开': { yi: ['开市', '嫁娶', '出行', '纳财'], ji: ['移徙', '入宅', '安葬'] },
    '闭': { yi: ['祭祀', '祈福', '求嗣', '纳财'], ji: ['开市', '嫁娶', '移徙'] },
  };
  
  return yiJiMap[jianChu] || { yi: ['祭祀'], ji: ['嫁娶'] };
}

/** 计算财神方位 */
function getWealthDirection(dayGan: string): string {
  const direction: Record<string, string> = {
    '甲': '东北', '乙': '西南', '丙': '西南', '丁': '正西',
    '戊': '正北', '己': '正南', '庚': '正东', '辛': '正南',
    '壬': '正南', '癸': '正北',
  };
  return direction[dayGan] || '正南';
}

/** 计算喜神方位 */
function getJoyDirection(dayZhi: string): string {
  const direction: Record<string, string> = {
    '子': '艮（东北）', '丑': '离（正南）', '寅': '坎（正北）', '卯': '坤（西南）',
    '辰': '震（正东）', '巳': '兑（正西）', '午': '乾（西北）', '未': '巽（东南）',
    '申': '艮（东北）', '酉': '离（正南）', '戌': '坎（正北）', '亥': '坤（西南）',
  };
  return direction[dayZhi] || '正南';
}

/** 计算福神方位 */
function getBlessingDirection(dayZhi: string): string {
  const direction: Record<string, string> = {
    '子': '巽（东南）', '丑': '震（正东）', '寅': '坎（正北）', '卯': '离（正南）',
    '辰': '艮（东北）', '巳': '坤（西南）', '午': '乾（西北）', '未': '巽（东南）',
    '申': '震（正东）', '酉': '坎（正北）', '戌': '离（正南）', '亥': '艮（东北）',
  };
  return direction[dayZhi] || '正南';
}

/** 计算冲煞 */
function getClash(dayZhi: string): { shengxiao: string; direction: string } {
  const clashMap: Record<string, { shengxiao: string; direction: string }> = {
    '子': { shengxiao: '马', direction: '正南' },
    '丑': { shengxiao: '羊', direction: '西南' },
    '寅': { shengxiao: '猴', direction: '西南' },
    '卯': { shengxiao: '鸡', direction: '正西' },
    '辰': { shengxiao: '狗', direction: '西北' },
    '巳': { shengxiao: '猪', direction: '西北' },
    '午': { shengxiao: '鼠', direction: '正北' },
    '未': { shengxiao: '牛', direction: '东北' },
    '申': { shengxiao: '虎', direction: '东北' },
    '酉': { shengxiao: '兔', direction: '正东' },
    '戌': { shengxiao: '龙', direction: '东南' },
    '亥': { shengxiao: '蛇', direction: '东南' },
  };
  return clashMap[dayZhi] || { shengxiao: '未知', direction: '未知' };
}

/** 获取每日卦象 */
export function getDailyHexagram(date: Date): {
  name: string;
  upperTrigram: number;
  lowerTrigram: number;
  meaning: string;
} {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const hexagramIndex = dayOfYear % 64;
  
  const hexagrams = [
    { name: '乾为天', upperTrigram: 7, lowerTrigram: 7, meaning: '刚健中正，自强不息' },
    { name: '坤为地', upperTrigram: 0, lowerTrigram: 0, meaning: '厚德载物，包容万物' },
    { name: '水雷屯', upperTrigram: 2, lowerTrigram: 1, meaning: '初生艰难，需要耐心' },
    { name: '山水蒙', upperTrigram: 4, lowerTrigram: 2, meaning: '启蒙教育，去除蒙昧' },
    { name: '水天需', upperTrigram: 2, lowerTrigram: 7, meaning: '等待时机，养精蓄锐' },
    { name: '天水讼', upperTrigram: 7, lowerTrigram: 2, meaning: '争讼纠纷，以和为贵' },
    { name: '地水师', upperTrigram: 0, lowerTrigram: 2, meaning: '统众用兵，纪律严明' },
    { name: '水地比', upperTrigram: 2, lowerTrigram: 0, meaning: '亲比团结，和睦相处' },
    { name: '风天小畜', upperTrigram: 6, lowerTrigram: 7, meaning: '小有积蓄，待时而动' },
    { name: '天泽履', upperTrigram: 7, lowerTrigram: 3, meaning: '如履薄冰，谨慎行事' },
    { name: '地天泰', upperTrigram: 0, lowerTrigram: 7, meaning: '天地交泰，万物通达' },
    { name: '天地否', upperTrigram: 7, lowerTrigram: 0, meaning: '闭塞不通，否极泰来' },
    { name: '天火同人', upperTrigram: 7, lowerTrigram: 5, meaning: '志同道合，团结协作' },
    { name: '火天大有', upperTrigram: 5, lowerTrigram: 7, meaning: '盛大富有，如日中天' },
    { name: '地山谦', upperTrigram: 0, lowerTrigram: 4, meaning: '谦虚谨慎，德高望重' },
    { name: '雷地豫', upperTrigram: 1, lowerTrigram: 0, meaning: '喜悦和乐，顺时而动' },
    { name: '泽雷随', upperTrigram: 3, lowerTrigram: 1, meaning: '随机应变，顺势而行' },
    { name: '山风蛊', upperTrigram: 4, lowerTrigram: 6, meaning: '整治腐败，拨乱反正' },
    { name: '地泽临', upperTrigram: 0, lowerTrigram: 3, meaning: '居高临下，亲临督导' },
    { name: '风地观', upperTrigram: 6, lowerTrigram: 0, meaning: '观察审视，静待时机' },
    { name: '火雷噬嗑', upperTrigram: 5, lowerTrigram: 1, meaning: '咬合决断，执法严明' },
    { name: '山火贲', upperTrigram: 4, lowerTrigram: 5, meaning: '文饰之美，内外兼修' },
    { name: '山地剥', upperTrigram: 4, lowerTrigram: 0, meaning: '剥落侵蚀，顺势而为' },
    { name: '地雷复', upperTrigram: 0, lowerTrigram: 1, meaning: '一阳来复，重新开始' },
    { name: '天雷无妄', upperTrigram: 7, lowerTrigram: 1, meaning: '真实无妄，顺其自然' },
    { name: '山天大畜', upperTrigram: 4, lowerTrigram: 7, meaning: '厚积薄发，大有积蓄' },
    { name: '山雷颐', upperTrigram: 4, lowerTrigram: 1, meaning: '颐养生息，自力更生' },
    { name: '泽风大过', upperTrigram: 3, lowerTrigram: 6, meaning: '非常之时，大胆作为' },
    { name: '坎为水', upperTrigram: 2, lowerTrigram: 2, meaning: '重重险阻，坚守正道' },
    { name: '离为火', upperTrigram: 5, lowerTrigram: 5, meaning: '光明美丽，文明相继' },
    { name: '泽山咸', upperTrigram: 3, lowerTrigram: 4, meaning: '感应相通，心心相印' },
    { name: '雷风恒', upperTrigram: 1, lowerTrigram: 6, meaning: '持之以恒，恒久之道' },
    { name: '天山遁', upperTrigram: 7, lowerTrigram: 4, meaning: '退避隐忍，明哲保身' },
    { name: '雷天大壮', upperTrigram: 1, lowerTrigram: 7, meaning: '大义凛然，壮盛昌明' },
    { name: '火地晋', upperTrigram: 5, lowerTrigram: 0, meaning: '晋升前进，旭日东升' },
    { name: '地火明夷', upperTrigram: 0, lowerTrigram: 5, meaning: '光明受损，韬光养晦' },
    { name: '风火家人', upperTrigram: 6, lowerTrigram: 5, meaning: '家庭和睦，各守其分' },
    { name: '火泽睽', upperTrigram: 5, lowerTrigram: 3, meaning: '意见相左，求同存异' },
    { name: '水山蹇', upperTrigram: 2, lowerTrigram: 4, meaning: '艰难险阻，退守待时' },
    { name: '雷水解', upperTrigram: 1, lowerTrigram: 2, meaning: '解除困难，化险为夷' },
    { name: '山泽损', upperTrigram: 4, lowerTrigram: 3, meaning: '损下益上，舍小取大' },
    { name: '风雷益', upperTrigram: 6, lowerTrigram: 1, meaning: '损上益下，互利共赢' },
    { name: '泽天夬', upperTrigram: 3, lowerTrigram: 7, meaning: '决断果敢，去除障碍' },
    { name: '天风姤', upperTrigram: 7, lowerTrigram: 6, meaning: '不期而遇，机缘巧合' },
    { name: '泽地萃', upperTrigram: 3, lowerTrigram: 0, meaning: '聚集汇聚，众志成城' },
    { name: '地风升', upperTrigram: 0, lowerTrigram: 6, meaning: '上升进取，积小成大' },
    { name: '泽水困', upperTrigram: 3, lowerTrigram: 2, meaning: '困境考验，坚守待时' },
    { name: '水风井', upperTrigram: 2, lowerTrigram: 6, meaning: '修身养德，惠及他人' },
    { name: '泽火革', upperTrigram: 3, lowerTrigram: 5, meaning: '变革更新，去旧立新' },
    { name: '火风鼎', upperTrigram: 5, lowerTrigram: 6, meaning: '去旧立新，革故鼎新' },
    { name: '震为雷', upperTrigram: 1, lowerTrigram: 1, meaning: '震惊恐惧，修身反省' },
    { name: '艮为山', upperTrigram: 4, lowerTrigram: 4, meaning: '稳重静止，知止而安' },
    { name: '风山渐', upperTrigram: 6, lowerTrigram: 4, meaning: '循序渐进，稳步前进' },
    { name: '雷泽归妹', upperTrigram: 1, lowerTrigram: 3, meaning: '循序渐进，婚姻之道' },
    { name: '雷火丰', upperTrigram: 1, lowerTrigram: 5, meaning: '丰盛光明，如日中天' },
    { name: '火山旅', upperTrigram: 5, lowerTrigram: 4, meaning: '行旅在外，谨慎安守' },
    { name: '巽为风', upperTrigram: 6, lowerTrigram: 6, meaning: '柔顺渗透，谦逊顺从' },
    { name: '兑为泽', upperTrigram: 3, lowerTrigram: 3, meaning: '喜悦沟通，和谐相处' },
    { name: '风水涣', upperTrigram: 6, lowerTrigram: 2, meaning: '涣散流通，化整为零' },
    { name: '水泽节', upperTrigram: 2, lowerTrigram: 3, meaning: '节制有度，适可而止' },
    { name: '风泽中孚', upperTrigram: 6, lowerTrigram: 3, meaning: '诚信为本，感化四方' },
    { name: '雷山小过', upperTrigram: 1, lowerTrigram: 4, meaning: '小有过度，谨慎行事' },
    { name: '水火既济', upperTrigram: 2, lowerTrigram: 5, meaning: '大功告成，需要警惕' },
    { name: '火水未济', upperTrigram: 5, lowerTrigram: 2, meaning: '尚未成功，仍需努力' },
  ];
  
  return hexagrams[hexagramIndex];
}

/** 获取分类运势 */
export function getCategoryFortune(date: Date): {
  career: { score: number; text: string };
  love: { score: number; text: string };
  health: { score: number; text: string };
  wealth: { score: number; text: string };
} {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  
  // 使用固定种子生成稳定的运势
  const pseudoRandom = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 49297;
    return x - Math.floor(x);
  };
  
  const careerScore = Math.floor(pseudoRandom(1) * 40) + 60;
  const loveScore = Math.floor(pseudoRandom(2) * 40) + 60;
  const healthScore = Math.floor(pseudoRandom(3) * 40) + 60;
  const wealthScore = Math.floor(pseudoRandom(4) * 40) + 60;
  
  const careerTexts = [
    '事业运势上升，适合积极进取，把握机会。',
    '工作中可能遇到挑战，保持冷静应对。',
    '贵人运旺，适合拓展人脉和合作。',
    '稳扎稳打，不宜冒进，积累实力为上。',
  ];
  
  const loveTexts = [
    '感情运势良好，适合表白或约会。',
    '可能会有小摩擦，多沟通理解对方。',
    '桃花运旺，单身者有机会遇到心仪对象。',
    '感情稳定，适合深入交流和规划未来。',
  ];
  
  const healthTexts = [
    '身体状况良好，适合运动和户外活动。',
    '注意休息，避免过度劳累。',
    '饮食要规律，少吃生冷食物。',
    '心情愉悦，有利于身心健康。',
  ];
  
  const wealthTexts = [
    '财运不错，适合投资理财。',
    '可能有意外之财，但不可贪心。',
    '支出较大，注意理财规划。',
    '正财运旺，努力工作会有回报。',
  ];
  
  return {
    career: { score: careerScore, text: careerTexts[Math.floor(pseudoRandom(5) * 4)] },
    love: { score: loveScore, text: loveTexts[Math.floor(pseudoRandom(6) * 4)] },
    health: { score: healthScore, text: healthTexts[Math.floor(pseudoRandom(7) * 4)] },
    wealth: { score: wealthScore, text: wealthTexts[Math.floor(pseudoRandom(8) * 4)] },
  };
}

/** 获取完整每日运势 */
export function getDailyFortune(date: Date) {
  const ganzhi = getDayGanzhi(date);
  const jianChu = getJianChu(date);
  const yiJi = getJianChuYiJi(jianChu);
  const hexagram = getDailyHexagram(date);
  const fortune = getCategoryFortune(date);

  return {
    jianChu,
    yi: yiJi.yi,
    ji: yiJi.ji,
    wealthDirection: getWealthDirection(ganzhi.stem),
    joyDirection: getJoyDirection(ganzhi.branch),
    blessingDirection: getBlessingDirection(ganzhi.branch),
    clash: getClash(ganzhi.branch),
    hexagram,
    fortune,
    ganzhi: `${ganzhi.stem}${ganzhi.branch}`,
  };
}
