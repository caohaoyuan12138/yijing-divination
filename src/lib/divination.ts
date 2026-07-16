/**
 * 周易核心算法引擎 v3.0
 * 
 * 包含：
 * 一、基础符号与阴阳学说
 * 二、四象八卦与万物类象
 * 三、天干地支与五行生克
 * 四、六十四卦生成逻辑
 * 五、卦象推演与解卦技法（体用生克、爻位学说、动爻变卦）
 * 
 * 金钱卦规则：三枚铜钱，每枚2/3概率
 * 6=老阴(变爻) 7=少阳 8=少阴 9=老阳(变爻)
 * "老变少不变"
 */

// ========================================================================
// 第一部分：基础符号与阴阳学说
// ========================================================================

/** 五行枚举 */
export enum Wuxing {
  Wood = '木', Fire = '火', Earth = '土', Metal = '金', Water = '水',
}

/** 五行相生：木 → 火 → 土 → 金 → 水 → 木 */
export const WUXING_GENERATE: Record<Wuxing, Wuxing> = {
  [Wuxing.Wood]: Wuxing.Fire, [Wuxing.Fire]: Wuxing.Earth, [Wuxing.Earth]: Wuxing.Metal,
  [Wuxing.Metal]: Wuxing.Water, [Wuxing.Water]: Wuxing.Wood,
};

/** 五行相克：木 → 土 → 水 → 火 → 金 → 木 */
export const WUXING_OVERCOME: Record<Wuxing, Wuxing> = {
  [Wuxing.Wood]: Wuxing.Earth, [Wuxing.Earth]: Wuxing.Water, [Wuxing.Water]: Wuxing.Fire,
  [Wuxing.Fire]: Wuxing.Metal, [Wuxing.Metal]: Wuxing.Wood,
};

/** 八卦 - 先天八卦数（伏羲八卦）= 乾1 兑2 离3 震4 巽5 坎6 艮7 坤8 */
export interface Trigram {
  index: number; name: string; symbol: string; nature: string; attribute: string;
  wuxing: Wuxing; direction: string; family: string; body: string; animal: string;
  season: string; lines: [boolean, boolean, boolean];
}

export const EIGHT_TRIGRAMS: Record<number, Trigram> = {
  0: { index: 0, name: '坤', symbol: '☷', nature: '地', attribute: '柔顺、包容、承载、厚德', wuxing: Wuxing.Earth, direction: '北（先天）/西南（后天）', family: '母', body: '腹', animal: '牛', season: '秋', lines: [false, false, false] },
  1: { index: 1, name: '震', symbol: '☳', nature: '雷', attribute: '动、震惊、激发、新生', wuxing: Wuxing.Wood, direction: '东北（先天）/东（后天）', family: '长男', body: '足', animal: '龙', season: '春', lines: [true, false, false] },
  2: { index: 2, name: '坎', symbol: '☵', nature: '水', attribute: '险陷、智慧、流动、诚信', wuxing: Wuxing.Water, direction: '西（先天）/北（后天）', family: '中男', body: '耳', animal: '豕', season: '冬', lines: [false, true, false] },
  3: { index: 3, name: '兑', symbol: '☱', nature: '泽', attribute: '喜悦、口舌、沟通、润泽', wuxing: Wuxing.Metal, direction: '东南（先天）/西（后天）', family: '少女', body: '口', animal: '羊', season: '秋', lines: [true, true, false] },
  4: { index: 4, name: '艮', symbol: '☶', nature: '山', attribute: '止、安静、笃定、界限', wuxing: Wuxing.Earth, direction: '西北（先天）/东北（后天）', family: '少男', body: '手', animal: '狗', season: '冬春之间', lines: [false, false, true] },
  5: { index: 5, name: '离', symbol: '☲', nature: '火', attribute: '光明、依附、文明、美丽', wuxing: Wuxing.Fire, direction: '东（先天）/南（后天）', family: '中女', body: '目', animal: '雉', season: '夏', lines: [true, false, true] },
  6: { index: 6, name: '巽', symbol: '☴', nature: '风', attribute: '渗透、顺从、谦逊、入', wuxing: Wuxing.Wood, direction: '西南（先天）/东南（后天）', family: '长女', body: '股', animal: '鸡', season: '春夏之间', lines: [false, true, true] },
  7: { index: 7, name: '乾', symbol: '☰', nature: '天', attribute: '刚健、创造、领导、天行健', wuxing: Wuxing.Metal, direction: '南（先天）/西北（后天）', family: '父', body: '首', animal: '马', season: '秋冬之间', lines: [true, true, true] },
};

/** 十天干 */
export const HEAVENLY_STEMS = [
  { name: '甲', wuxing: Wuxing.Wood, yinYang: '阳' }, { name: '乙', wuxing: Wuxing.Wood, yinYang: '阴' },
  { name: '丙', wuxing: Wuxing.Fire, yinYang: '阳' }, { name: '丁', wuxing: Wuxing.Fire, yinYang: '阴' },
  { name: '戊', wuxing: Wuxing.Earth, yinYang: '阳' }, { name: '己', wuxing: Wuxing.Earth, yinYang: '阴' },
  { name: '庚', wuxing: Wuxing.Metal, yinYang: '阳' }, { name: '辛', wuxing: Wuxing.Metal, yinYang: '阴' },
  { name: '壬', wuxing: Wuxing.Water, yinYang: '阳' }, { name: '癸', wuxing: Wuxing.Water, yinYang: '阴' },
] as const;

/** 十二地支 */
export const EARTHLY_BRANCHES = [
  { name: '子', wuxing: Wuxing.Water, zodiac: '鼠', hour: '23-1' }, { name: '丑', wuxing: Wuxing.Earth, zodiac: '牛', hour: '1-3' },
  { name: '寅', wuxing: Wuxing.Wood, zodiac: '虎', hour: '3-5' }, { name: '卯', wuxing: Wuxing.Wood, zodiac: '兔', hour: '5-7' },
  { name: '辰', wuxing: Wuxing.Earth, zodiac: '龙', hour: '7-9' }, { name: '巳', wuxing: Wuxing.Fire, zodiac: '蛇', hour: '9-11' },
  { name: '午', wuxing: Wuxing.Fire, zodiac: '马', hour: '11-13' }, { name: '未', wuxing: Wuxing.Earth, zodiac: '羊', hour: '13-15' },
  { name: '申', wuxing: Wuxing.Metal, zodiac: '猴', hour: '15-17' }, { name: '酉', wuxing: Wuxing.Metal, zodiac: '鸡', hour: '17-19' },
  { name: '戌', wuxing: Wuxing.Earth, zodiac: '狗', hour: '19-21' }, { name: '亥', wuxing: Wuxing.Water, zodiac: '猪', hour: '21-23' },
] as const;

/**
 * 天干地支纪年计算
 * 计算方法：年份减3，天干对10取余，地支对12取余
 * 例：1984年为甲子年
 */
export const SEXAGENARY_YEAR_MAP: { stem: number; branch: number; name: string }[] = (() => {
  const map: { stem: number; branch: number; name: string }[] = [];
  for (let i = 0; i < 60; i++) {
    const stem = HEAVENLY_STEMS[i % 10];
    const branch = EARTHLY_BRANCHES[i % 12];
    map.push({ stem: i % 10, branch: i % 12, name: stem.name + branch.name });
  }
  return map;
})();

/**
 * 将公元年份转换为天干地支纪年
 * @param year 公元年份
 * @returns 天干地支字符串（如 "甲子"）
 */
export function yearToGanzhi(year: number): string {
  // 1984年为甲子年
  const offset = year - 1984;
  const index = ((offset % 60) + 60) % 60;
  return SEXAGENARY_YEAR_MAP[index].name;
}

/**
 * 获取天干地支详细信息
 */
export function getGanzhiDetail(year: number): {
  year: number;
  ganzhi: string;
  stem: string;
  branch: string;
  stemWuxing: string;
  branchWuxing: string;
  zodiac: string;
} | null {
  if (!year || isNaN(year) || year < 1 || year > 9999) return null;
  const offset = year - 1984;
  const index = ((offset % 60) + 60) % 60;
  const stem = HEAVENLY_STEMS[index % 10];
  const branch = EARTHLY_BRANCHES[index % 12];
  if (!stem || !branch) return null;
  return {
    year,
    ganzhi: stem.name + branch.name,
    stem: stem.name,
    branch: branch.name,
    stemWuxing: stem.wuxing,
    branchWuxing: branch.wuxing,
    zodiac: branch.zodiac || '',
  };
}

// ========================================================================
// 第二部分：六十四卦数据
// ========================================================================

export interface HexagramData {
  index: number; name: string; unicode: string; upperTrigram: number; lowerTrigram: number;
  upperName: string; lowerName: string; attribute: string; summary: string;
  guaci: string; tuanCi: string; xiangCi: string; modernAdvice: string;
}

export const HEXAGRAM_DATA: HexagramData[] = [
  { index: 62, name: '坤为地', unicode: '䷁', upperTrigram: 0, lowerTrigram: 0, upperName: '坤', lowerName: '坤', attribute: '地地', summary: '厚德载物，柔顺包容，至柔而刚', guaci: '坤，元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。', tuanCi: '至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆。', xiangCi: '地势坤，君子以厚德载物。', modernAdvice: '坤卦代表大地，厚德载物。柔顺包容，以柔克刚。利牝马之贞——像母马一样柔顺而坚韧。' },
  { index: 31, name: '地雷复', unicode: '䷗', upperTrigram: 0, lowerTrigram: 1, upperName: '坤', lowerName: '震', attribute: '地雷', summary: '一阳来复，重新开始，否极泰来', guaci: '复，亨，出入无疾，朋来无咎。反复其道，七日来复，利有攸往。', tuanCi: '复亨，刚反，动而以顺行，是以出入无疾，朋来无咎。', xiangCi: '雷在地中，复；先王以至日闭关，商旅不行。', modernAdvice: '一阳来复，重新开始。黑暗即将过去，光明即将到来。把握新的开始，谨慎规划未来。' },
  { index: 63, name: '地水师', unicode: '䷆', upperTrigram: 0, lowerTrigram: 2, upperName: '坤', lowerName: '坎', attribute: '地水', summary: '统众用兵，纪律严明', guaci: '师，贞，丈人吉，无咎。', tuanCi: '师，众也，贞，正也。', xiangCi: '地中有水，师；君子以容民畜众。', modernAdvice: '统众用兵之卦。需要组织团队、建立纪律。' },
  { index: 16, name: '地泽临', unicode: '䷒', upperTrigram: 0, lowerTrigram: 3, upperName: '坤', lowerName: '兑', attribute: '地泽', summary: '居高临下，亲临督导，循序渐进', guaci: '临，元亨利贞，至于八月有凶。彖曰：临，刚浸而长，说而顺。', tuanCi: '刚中而应，大亨以正，天之道也。', xiangCi: '泽上有地，临；君子以教思无穷，容保民无疆。', modernAdvice: '居高临下、亲临指导的好时机。事业上适合担任管理、指导角色。但需防"八月有凶"——盛极必衰。' },
  { index: 54, name: '地山谦', unicode: '䷎', upperTrigram: 0, lowerTrigram: 4, upperName: '坤', lowerName: '艮', attribute: '地山', summary: '谦虚谨慎，德高望重，唯一全吉卦', guaci: '谦，亨，君子有终。彖曰：谦，亨，天道下济而光明，地道卑而上行。', tuanCi: '天道亏盈而益谦，地道变盈而流谦，鬼神害盈而福谦，人道恶盈而好谦。', xiangCi: '地中有山，谦；君子以裒多益寡，称物平施。', modernAdvice: '《周易》中唯一的六爻皆吉之卦。谦虚带来亨通。保持谦逊、不骄不躁，自然德高望重。' },
  { index: 23, name: '地火明夷', unicode: '䷣', upperTrigram: 0, lowerTrigram: 5, upperName: '坤', lowerName: '离', attribute: '地火', summary: '光明受损，韬光养晦，忍辱负重', guaci: '明夷，利艰贞。彖曰：明入地中，明夷。内文明而外柔顺，以蒙大难。', tuanCi: '文王以之，利艰贞，晦其明也。内难而能正其志，箕子以之。', xiangCi: '明入地中，明夷；君子以莅众，用晦而明。', modernAdvice: '光明被遮蔽，处境艰难。此时不宜锋芒毕露，应韬光养晦、忍辱负重。暗中积蓄力量，等待光明再现。' },
  { index: 39, name: '地风升', unicode: '䷭', upperTrigram: 0, lowerTrigram: 6, upperName: '坤', lowerName: '巽', attribute: '地风', summary: '上升进取，积小成大，步步高升', guaci: '升，元亨，用见大人，勿恤，南征吉。彖曰：柔以时升，巽而顺，刚中而应。', tuanCi: '是以大亨，用见大人，勿恤，有庆也。南征吉，志行也。', xiangCi: '地中生木，升；君子以顺德，积小以高大。', modernAdvice: '步步高升之卦。积小成大，循序渐进。事业上升期，应顺势而为，不断积累，前途光明。' },
  { index: 7, name: '地天泰', unicode: '䷊', upperTrigram: 0, lowerTrigram: 7, upperName: '坤', lowerName: '乾', attribute: '地天', summary: '天地交泰，万物通顺，否极泰来', guaci: '泰，小往大来，吉亨。彖曰：泰，小往大来，吉亨，则是天地交而万物通也。', tuanCi: '天地交，泰；后以财成天地之道，辅相天地之宜，以左右民。', xiangCi: '天地交，泰；后以财成天地之道，辅相天地之宜。', modernAdvice: '最吉之卦之一。天地阴阳交合，万物通畅。事业亨通、感情和美、健康安泰。把握当下好时光。' },
  { index: 58, name: '雷地豫', unicode: '䷏', upperTrigram: 1, lowerTrigram: 0, upperName: '震', lowerName: '坤', attribute: '雷地', summary: '喜悦和乐，顺时而动，鸣豫之象', guaci: '豫，利建侯行师。彖曰：豫，刚应而志行，顺以动，豫。', tuanCi: '豫顺以动，天地如之，而况建侯行师乎。', xiangCi: '雷出地奋，豫；君子以作乐崇德。', modernAdvice: '喜悦和乐之卦。顺势而为，自然亨通。但"豫"也有懈怠之意，不可过于安逸。' },
  { index: 27, name: '震为雷', unicode: '䷲', upperTrigram: 1, lowerTrigram: 1, upperName: '震', lowerName: '震', attribute: '雷雷', summary: '震惊恐惧，修身反省，临危不惧', guaci: '震，亨。震来虩虩，笑言哑哑，震惊百里，不丧匕鬯。彖曰：震，亨。', tuanCi: '震来虩虩，恐致福也。笑言哑哑，后有则也。', xiangCi: '荐雷，震；君子以恐惧修省。', modernAdvice: '震惊之卦，可能面临突发事件。但"震"也是修身的契机。临危不惧、反躬自省，恐惧可以转化为福泽。' },
  { index: 43, name: '雷水解', unicode: '䷧', upperTrigram: 1, lowerTrigram: 2, upperName: '震', lowerName: '坎', attribute: '雷水', summary: '解除困难，舒展生机，化险为夷', guaci: '解，利西南，无所往，其来复吉。有攸往，夙吉。彖曰：解，险以动，动而免乎险，解。', tuanCi: '解，利西南，往得众也。其来复吉，乃得中也。', xiangCi: '雷雨作，解；君子以赦过宥罪。', modernAdvice: '困难解除，化险为夷。之前的困境开始缓解。把握时机，迅速行动（夙吉），不可拖延。' },
  { index: 12, name: '雷泽归妹', unicode: '䷵', upperTrigram: 1, lowerTrigram: 3, upperName: '震', lowerName: '兑', attribute: '雷泽', summary: '循序渐进，婚姻之道，不可急躁', guaci: '归妹，征凶，无攸利。彖曰：归妹，天地之大义也。', tuanCi: '天地不交而万物不兴，归妹，人之终始也。', xiangCi: '泽上有雷，归妹；君子以永终知敝。', modernAdvice: '感情或合作需循序渐进，不可操之过急。婚姻、合伙等大事需慎重考虑，基础不牢则难以长久。' },
  { index: 50, name: '雷山小过', unicode: '䷽', upperTrigram: 1, lowerTrigram: 4, upperName: '震', lowerName: '艮', attribute: '雷山', summary: '小有过度，谨慎行事，不宜大动作', guaci: '小过，亨，利贞，可小事，不可大事。飞鸟遗之音，不宜上，宜下，大吉。', tuanCi: '小过，小者过而亨也。过以利贞，与时行也。', xiangCi: '山上有雷，小过；君子以行过乎恭，丧过乎哀，用过乎俭。', modernAdvice: '小有过越，可小事不可大事。谨慎行事，宁可过度谨慎也不可冒险。宜下不宜上。' },
  { index: 19, name: '雷火丰', unicode: '䷶', upperTrigram: 1, lowerTrigram: 5, upperName: '震', lowerName: '离', attribute: '雷火', summary: '丰盛光明，如日中天，鼎盛之象', guaci: '丰，亨，王假之，勿忧，宜日中。彖曰：丰，大也。明以动，故丰。', tuanCi: '王假之，尚大也。勿忧，宜日中，宜照天下也。', xiangCi: '雷电皆至，丰；君子以折狱致刑。', modernAdvice: '鼎盛时期，如日中天。事业、财富、名望达到顶峰。但需警惕"日中则昃"，盛极必衰，居安思危。' },
  { index: 35, name: '雷风恒', unicode: '䷟', upperTrigram: 1, lowerTrigram: 6, upperName: '震', lowerName: '巽', attribute: '雷风', summary: '持之以恒，恒久之道，守正不移', guaci: '恒，亨，无咎，利贞，利有攸往。彖曰：恒，久也。刚上而柔下，雷风相与。', tuanCi: '巽而动，刚柔皆应，恒。', xiangCi: '雷风，恒；君子以立不易方。', modernAdvice: '持之以恒之卦。成功需要长期坚持，不可朝三暮四。守正不移，持续努力，自然亨通。' },
  { index: 3, name: '雷天大壮', unicode: '䷡', upperTrigram: 1, lowerTrigram: 7, upperName: '震', lowerName: '乾', attribute: '雷天', summary: '大义凛然，壮盛昌明，大有作为', guaci: '大壮，利贞。彖曰：大壮，大者壮也。刚以动，故壮。', tuanCi: '大壮贞吉也，正大而天地之情可见矣。', xiangCi: '雷在天上，大壮；君子以非礼弗履。', modernAdvice: '气势正盛，适合扩大规模、壮大气势。但"大壮"警示不可恃强凌弱，遵守正道方能化壮为用。' },
  { index: 60, name: '水地比', unicode: '䷇', upperTrigram: 2, lowerTrigram: 0, upperName: '坎', lowerName: '坤', attribute: '水地', summary: '亲近团结，和睦相处，比辅之道', guaci: '比，吉，原筮，元永贞，无咎。不宁方来，后夫凶。彖曰：比，吉也，比，辅也，下顺从也。', tuanCi: '原筮，元永贞，无咎，以刚中也。不宁方来，上下应也。后夫凶，其道穷也。', xiangCi: '地上有水，比；先王以建万国，亲诸侯。', modernAdvice: '亲近团结之卦。寻找合作伙伴、建立人脉。但需选择正直之人，不可与小人比附。' },
  { index: 29, name: '水雷屯', unicode: '䷂', upperTrigram: 2, lowerTrigram: 1, upperName: '坎', lowerName: '震', attribute: '水雷', summary: '万事开头难，初生之险，艰难起步', guaci: '屯，元亨利贞，勿用有攸往，利建侯。彖曰：屯，刚柔始交而难生。', tuanCi: '动乎险中，大亨贞。雷雨之动满盈，天造草昧，宜建侯而不宁。', xiangCi: '云雷，屯；君子以经纶。', modernAdvice: '万事开头难。此时不宜大动作，应打好基础、建立秩序。虽然艰难，但前途光明，需坚持不懈。' },
  { index: 45, name: '坎为水', unicode: '䷜', upperTrigram: 2, lowerTrigram: 2, upperName: '坎', lowerName: '坎', attribute: '水水', summary: '重重险阻，坚守正道，有孚维心', guaci: '习坎，有孚，维心亨，行有尚。彖曰：习坎，重险也。水流而不盈，行险而不失其信。', tuanCi: '维心亨，乃以刚中也。行有尚，往有功也。', xiangCi: '水流而不盈，行险而不失其信；君子以常德行，习教事。', modernAdvice: '重重险阻，但"有孚维心"——保持诚信和坚定。水流不盈，持续前行。险中有信，终能脱险。' },
  { index: 14, name: '水泽节', unicode: '䷻', upperTrigram: 2, lowerTrigram: 3, upperName: '坎', lowerName: '兑', attribute: '水泽', summary: '节制有度，适可而止，过犹不及', guaci: '节，亨，苦节不可贞。彖曰：节，刚柔分而刚得中。', tuanCi: '苦节不可贞，其道穷也。', xiangCi: '泽上有水，节；君子以制数度，议德行。', modernAdvice: '凡事需有节制。消费、饮食、言语、工作皆不可过度。适度节制带来亨通，过度节制则成苦节。' },
  { index: 52, name: '水山蹇', unicode: '䷦', upperTrigram: 2, lowerTrigram: 4, upperName: '坎', lowerName: '艮', attribute: '水山', summary: '艰难险阻，退守待时，反身修德', guaci: '蹇，利西南，不利东北，利见大人，贞吉。彖曰：蹇，难也，险在前也。', tuanCi: '见险而能止，知矣哉。', xiangCi: '山上有水，蹇；君子以反身修德。', modernAdvice: '艰难险阻，不可强行。退守待时，反身修德。遇到困难时，先反省自己，再寻求突破。' },
  { index: 63, name: '水火既济', unicode: '䷾', upperTrigram: 2, lowerTrigram: 5, upperName: '坎', lowerName: '离', attribute: '水火', summary: '大功告成，需要警惕，居安思危', guaci: '亨，小利贞，初吉终乱。彖曰：既济亨，小者亨也。利贞，刚柔正而位当也。', tuanCi: '初吉，柔得中也。终止则乱，其道穷也。', xiangCi: '水在火上，既济；君子以思患而预防之。', modernAdvice: '大事已成，万事皆备。但初吉终乱，成功之后更需谨慎，防微杜渐，居安思危。' },
  { index: 37, name: '水风井', unicode: '䷯', upperTrigram: 2, lowerTrigram: 6, upperName: '坎', lowerName: '巽', attribute: '水风', summary: '修身养德，惠及他人，井养之道', guaci: '井，改邑不改井，无丧无得，往来井井。汔至亦未繘井，羸其瓶，凶。', tuanCi: '巽乎水而上水，井；井养而不穷也。', xiangCi: '木上有水，井；君子以劳民劝相。', modernAdvice: '井养之卦。修身养德，惠及他人。不求回报地奉献，如井水般源源不断。服务他人，成就自己。' },
  { index: 5, name: '水天需', unicode: '䷄', upperTrigram: 2, lowerTrigram: 7, upperName: '坎', lowerName: '乾', attribute: '水天', summary: '等待时机，饮食宴乐，养精蓄锐', guaci: '需，有孚，光亨，贞吉，利涉大川。彖曰：需，须也，险在前也。', tuanCi: '刚健而不陷，其义不困穷矣。', xiangCi: '云上于天，需；君子以饮食宴乐。', modernAdvice: '前方有险阻，不宜强行突破。耐心等待是最好的策略。利用这段时间休养生息、学习充电，时机自来。' },
  { index: 56, name: '泽地萃', unicode: '䷬', upperTrigram: 3, lowerTrigram: 0, upperName: '兑', lowerName: '坤', attribute: '泽地', summary: '聚集汇聚，众志成城，荟萃之象', guaci: '萃，亨，王假有庙，利见大人，亨，利贞，用大牲吉，利有攸往。', tuanCi: '萃，聚也。顺以说，刚中而应，故聚也。', xiangCi: '泽上于地，萃；君子以除戎器，戒不虞。', modernAdvice: '聚集之卦，众志成城。适合聚会、团建、汇聚资源。但需防意外，提前准备。' },
  { index: 25, name: '泽雷随', unicode: '䷐', upperTrigram: 3, lowerTrigram: 1, upperName: '兑', lowerName: '震', attribute: '泽雷', summary: '随机应变，顺势而行，与时俱进', guaci: '随，元亨利贞，无咎。彖曰：随，刚来而下柔，动而说，随。', tuanCi: '大亨贞，无咎，而天下随时，随之时义大矣哉。', xiangCi: '泽中有雷，随；君子以向晦入宴息。', modernAdvice: '随机应变、与时俱进之卦。不可固执己见，应顺应时势、灵活调整。跟随大势，自然亨通。' },
  { index: 41, name: '泽水困', unicode: '䷮', upperTrigram: 3, lowerTrigram: 2, upperName: '兑', lowerName: '坎', attribute: '泽水', summary: '困境考验，坚守待时，处困之道', guaci: '困，亨，贞，大人吉，无咎，有言不信。彖曰：困，刚掩也。险以说，困而不失其所，亨。', tuanCi: '贞大人吉，以刚中也。有言不信，尚口乃穷也。', xiangCi: '泽无水，困；君子以致命遂志。', modernAdvice: '身处困境，但"困"也是考验。坚守正道、保持信念。不可尚口多言，行动胜于言语。' },
  { index: 9, name: '兑为泽', unicode: '䷹', upperTrigram: 3, lowerTrigram: 3, upperName: '兑', lowerName: '兑', attribute: '泽泽', summary: '喜悦沟通，和谐相处，以和为贵', guaci: '兑，亨，利贞。彖曰：兑，说也。刚中而柔外，说以利贞。', tuanCi: '是以顺乎天而应乎人。说以先民，民忘其劳。', xiangCi: '丽泽，兑；君子以朋友讲习。', modernAdvice: '最利沟通谈判、团队协作、感情交流。以真诚和喜悦待人，自然广结善缘。注意：过悦则谄，保持真诚。' },
  { index: 49, name: '泽山咸', unicode: '䷞', upperTrigram: 3, lowerTrigram: 4, upperName: '兑', lowerName: '艮', attribute: '泽山', summary: '感应相通，心心相印，以情感人', guaci: '咸，亨，利贞，取女吉。彖曰：咸，感也。柔上而刚下，二气感应以相与。', tuanCi: '止而说，男下女，是以亨利贞，取女吉也。', xiangCi: '山上有泽，咸；君子以虚受人。', modernAdvice: '感应之卦，以情感人。感情、合作需真诚感应。虚心接受他人，自然心心相印。' },
  { index: 10, name: '泽火革', unicode: '䷰', upperTrigram: 3, lowerTrigram: 5, upperName: '兑', lowerName: '离', attribute: '泽火', summary: '变革更新，去旧立新，顺天应人', guaci: '革，已日乃孚，元亨利贞，悔亡。彖曰：革，水火相息，二女同居，其志不相得，曰革。', tuanCi: '天地革而四时成，汤武革命，顺乎天而应乎人，革之时大矣哉。', xiangCi: '泽中有火，革；君子以治历明时。', modernAdvice: '变革的时机已到。旧有模式已不适应，必须大刀阔斧改革。但变革需取信于民，不可操之过急。' },
  { index: 33, name: '泽风大过', unicode: '䷛', upperTrigram: 3, lowerTrigram: 6, upperName: '兑', lowerName: '巽', attribute: '泽风', summary: '非常之时，大胆作为，栋桡之危', guaci: '大过，栋桡，利有攸往，亨。彖曰：大过，大者过也。栋桡，本末弱也。', tuanCi: '刚过而中，巽而说行，利有攸往，乃亨。', xiangCi: '泽灭木，大过；君子以独立不惧，遁世无闷。', modernAdvice: '压力巨大、负荷过重。此时需要非常手段、大胆作为。独立不惧，超越常规，方能度过难关。' },
  { index: 1, name: '泽天夬', unicode: '䷪', upperTrigram: 3, lowerTrigram: 7, upperName: '兑', lowerName: '乾', attribute: '泽天', summary: '决断果敢，去除障碍，清除小人', guaci: '夬，扬于王庭，孚号，有厉。告自邑，不利即戎，利有攸往。', tuanCi: '夬，决也，刚决柔也。健而说，决而和。', xiangCi: '泽上于天，夬；君子以施禄及下，居德则忌。', modernAdvice: '面临决断时刻，需快刀斩乱麻。处理积弊、结束不合适的关系或项目。果断决策优于拖延不决。' },
  { index: 61, name: '山地剥', unicode: '䷖', upperTrigram: 4, lowerTrigram: 0, upperName: '艮', lowerName: '坤', attribute: '山地', summary: '剥落侵蚀，顺势而为，硕果仅存', guaci: '剥，不利有攸往。彖曰：剥，剥也，柔变刚也。不利有攸往，小人长也。', tuanCi: '顺而止之，观象也。君子尚消息盈虚，天之道也。', xiangCi: '山附于地，剥；上以厚下安宅。', modernAdvice: '剥落之卦，小人得势。此时不宜大动作，顺势而为。保留实力，等待时机。' },
  { index: 30, name: '山雷颐', unicode: '䷚', upperTrigram: 4, lowerTrigram: 1, upperName: '艮', lowerName: '震', attribute: '山雷', summary: '颐养生息，自力更生，养生之道', guaci: '颐，贞吉，观颐，自求口实。彖曰：颐，贞吉，养正则吉也。', tuanCi: '观颐，观其所养也。自求口实，观其自养也。', xiangCi: '山下有雷，颐；君子以慎语言，节饮食。', modernAdvice: '养生之卦。注意饮食健康、言语谨慎。自力更生，不依赖他人。养身养德，方能颐养天年。' },
  { index: 46, name: '山水蒙', unicode: '䷃', upperTrigram: 4, lowerTrigram: 2, upperName: '艮', lowerName: '坎', attribute: '山水', summary: '启蒙教育，虚心求教，蒙以养正', guaci: '蒙，亨，匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。', tuanCi: '蒙，山下有险，险而止，蒙。蒙亨，以亨行时中也。', xiangCi: '山下出泉，蒙；君子以果行育德。', modernAdvice: '蒙昧未开，需要教育启蒙。虚心求教，不可自以为是。教育需适时，反复追问则为亵渎。' },
  { index: 15, name: '山泽损', unicode: '䷨', upperTrigram: 4, lowerTrigram: 3, upperName: '艮', lowerName: '兑', attribute: '山泽', summary: '损下益上，减损私欲，先难后易', guaci: '损，有孚，元吉，无咎，可贞，利有攸往。彖曰：损，损下益上，其道上行。', tuanCi: '损而有孚，元吉，无咎，可贞，利有攸往。', xiangCi: '山下有泽，损；君子以惩忿窒欲。', modernAdvice: '需要做出牺牲或减损。减少不良欲望、放弃短期利益、投资自己。先苦后甜，损小得大。' },
  { index: 53, name: '艮为山', unicode: '䷳', upperTrigram: 4, lowerTrigram: 4, upperName: '艮', lowerName: '艮', attribute: '山山', summary: '稳重静止，知止而安，止欲之道', guaci: '艮其背，不获其身，行其庭，不见其人，无咎。彖曰：艮，止也。时止则止，时行则行。', tuanCi: '动静不失其时，其道光明。', xiangCi: '兼山，艮；君子以思不出其位。', modernAdvice: '知止之卦。该停就停，该动就动。不可妄动，止欲守静。思考问题不要越位，各守本分。' },
  { index: 22, name: '山火贲', unicode: '䷕', upperTrigram: 4, lowerTrigram: 5, upperName: '艮', lowerName: '离', attribute: '山火', summary: '文饰之美，外在修养，以文化人', guaci: '贲，亨，小利有攸往。彖曰：贲，亨，柔来而文刚，故亨。', tuanCi: '刚上而文柔，故小利有攸往。天文也，文明以止，人文也。', xiangCi: '山下有火，贲；君子以明庶政，无敢折狱。', modernAdvice: '注重外在形象、文化修养。适合学习、装饰、提升品味。但"贲"为文饰，不可徒有虚表，需内外兼修。' },
  { index: 38, name: '山风蛊', unicode: '䷑', upperTrigram: 4, lowerTrigram: 6, upperName: '艮', lowerName: '巽', attribute: '山风', summary: '整治腐败，拨乱反正，挽救败局', guaci: '蛊，元亨，利涉大川。先甲三日，后甲三日。彖曰：蛊，刚上而柔下，巽而止蛊。', tuanCi: '蛊，元亨，而天下治也。利涉大川，往有事也。', xiangCi: '山下有风，蛊；君子以振民育德。', modernAdvice: '事物已腐败，需要整治。面对问题不可回避，应大刀阔斧改革。先规划后行动，拨乱反正。' },
  { index: 6, name: '山天大畜', unicode: '䷙', upperTrigram: 4, lowerTrigram: 7, upperName: '艮', lowerName: '乾', attribute: '山天', summary: '厚积薄发，大有积蓄，德行兼备', guaci: '大畜，利贞，不家食吉，利涉大川。彖曰：大畜，刚健笃实，辉光日新。', tuanCi: '刚上而尚贤，能止健，大正也。', xiangCi: '天在山中，大畜；君子以多识前言往行，以畜其德。', modernAdvice: '积累已厚，正是施展才华之时。不局限于小圈子，大胆向外发展。德行与才能兼备，前途不可限量。' },
  { index: 57, name: '火地晋', unicode: '䷢', upperTrigram: 5, lowerTrigram: 0, upperName: '离', lowerName: '坤', attribute: '火地', summary: '晋升前进，光明在上，旭日东升', guaci: '晋，康侯用锡马蕃庶，昼日三接。彖曰：晋，进也。明出地上，顺而丽乎大明。', tuanCi: '柔进而上行，是以康侯用锡马蕃庶，昼日三接也。', xiangCi: '明出地上，晋；君子以自昭明德。', modernAdvice: '晋升之卦，光明在前。事业上升、获得认可。但需自昭明德，不可骄傲自满。' },
  { index: 26, name: '火雷噬嗑', unicode: '䷔', upperTrigram: 5, lowerTrigram: 1, upperName: '离', lowerName: '震', attribute: '火雷', summary: '咬合决断，执法严明，铲除障碍', guaci: '噬嗑，亨，利用狱。彖曰：颐中有物，曰噬嗑。噬嗑而亨，刚柔分，动而明。', tuanCi: '雷电噬嗑，先王以明罚敕法。', xiangCi: '雷电噬嗑；先王以明罚敕法。', modernAdvice: '需要决断、执法、处理棘手问题。面对障碍要像"咬合"一样坚决果断。公正严明，不徇私情。' },
  { index: 42, name: '火水未济', unicode: '䷿', upperTrigram: 5, lowerTrigram: 2, upperName: '离', lowerName: '坎', attribute: '火水', summary: '尚未成功，继续努力，前途光明', guaci: '未济，亨，小狐汔济，濡其尾，无攸利。彖曰：未济，亨，柔得中也。', tuanCi: '小狐汔济，未出中也。濡其尾，无攸利，不续终也。', xiangCi: '火在水上，未济；君子以慎辨物居方。', modernAdvice: '尚未成功，仍需努力。不可半途而废（如小狐濡尾）。谨慎行事，继续推进，终会成功。' },
  { index: 11, name: '火泽睽', unicode: '䷥', upperTrigram: 5, lowerTrigram: 3, upperName: '离', lowerName: '兑', attribute: '火泽', summary: '意见相左，求同存异，异中有同', guaci: '睽，小事吉。彖曰：睽，火动而上，泽动而下，二女同居，其志不同行。', tuanCi: '说而丽乎明，柔进而上行，得中而应乎刚，是以小事吉。', xiangCi: '上火下泽，睽；君子以同而异。', modernAdvice: '双方意见不合，立场相左。此时不宜强求一致，求同存异、各退一步反而能找到共识。' },
  { index: 21, name: '火山旅', unicode: '䷷', upperTrigram: 5, lowerTrigram: 4, upperName: '离', lowerName: '艮', attribute: '火山', summary: '行旅在外，谨慎安守，旅行之象', guaci: '旅，小亨，旅贞吉。彖曰：旅，须也，柔得中乎外，而顺乎刚。', tuanCi: '止而丽乎明，是以小亨，旅贞吉也。', xiangCi: '山上有火，旅；君子以明慎用刑，而不留狱。', modernAdvice: '漂泊在外、出差旅行之象。此时不宜大动作，谨慎行事、守正待时。注意财物安全，避免口舌是非。' },
  { index: 18, name: '离为火', unicode: '䷝', upperTrigram: 5, lowerTrigram: 5, upperName: '离', lowerName: '离', attribute: '火火', summary: '光明依附，文明美丽，外明内虚', guaci: '离，利贞，亨，畜牝牛，吉。彖曰：离，丽也。日月丽乎天，百谷草木丽乎土。', tuanCi: '重明以丽乎正，乃化成天下。', xiangCi: '明两作，离；大人以继明照于四方。', modernAdvice: '光明美丽之卦。适合展示才华、艺术创作、宣传推广。但"离"有依附之意，需找到可以依托的平台或贵人。' },
  { index: 34, name: '火风鼎', unicode: '䷱', upperTrigram: 5, lowerTrigram: 6, upperName: '离', lowerName: '巽', attribute: '火风', summary: '去旧立新，革故鼎新，烹饪之象', guaci: '鼎，元吉，亨。彖曰：鼎，象也。以木巽火，烹饪也。', tuanCi: '巽而耳目聪明，柔进而上行，得中而应乎刚，是以元亨。', xiangCi: '木上有火，鼎；君子以正位凝命。', modernAdvice: '革故鼎新、去旧立新之卦。适合改革、创新、转型。如烹饪般掌握火候，稳步推进变革。' },
  { index: 2, name: '火天大有', unicode: '䷍', upperTrigram: 5, lowerTrigram: 7, upperName: '离', lowerName: '乾', attribute: '火天', summary: '盛大富有，如日中天，大有收获', guaci: '大有，元亨。彖曰：大有，柔得尊位，大中而上下应之，曰大有。', tuanCi: '其德刚健而文明，应乎天而时行，是以元亨。', xiangCi: '火在天上，大有；君子以遏恶扬善，顺天休命。', modernAdvice: '正是收获时节，财富、名望或感情皆有斩获。但富有时更应谦虚，广结善缘，回馈社会，方能长久。' },
  { index: 59, name: '风地观', unicode: '䷓', upperTrigram: 6, lowerTrigram: 0, upperName: '巽', lowerName: '坤', attribute: '风地', summary: '观察审视，静待时机，风行草偃', guaci: '观，盥而不荐，有孚，有孚，有孚颙若。彖曰：大观在上，顺而巽，中正以观天下。', tuanCi: '观天之神道，而四时不忒，圣人以神道设教，而天下服矣。', xiangCi: '风行地上，观；先王以省方，观民设教。', modernAdvice: '观察审视之卦。先观察再行动，不可贸然。如风行草偃，上行下效。静待时机。' },
  { index: 28, name: '风雷益', unicode: '䷩', upperTrigram: 6, lowerTrigram: 1, upperName: '巽', lowerName: '震', attribute: '风雷', summary: '损上益下，互利共赢，有损有益', guaci: '益，利有攸往，利涉大川。彖曰：益，损上益上，民说无疆。', tuanCi: '自上下下，其道大光。', xiangCi: '风雷，益；君子以见善则迁，有过则改。', modernAdvice: '损上益下、互利共赢之卦。适合投资、帮助他人、团队合作。见善则迁，有过则改，自然受益。' },
  { index: 44, name: '风水涣', unicode: '䷺', upperTrigram: 6, lowerTrigram: 2, upperName: '巽', lowerName: '坎', attribute: '风水', summary: '涣散流通，化整为零，凝聚人心', guaci: '涣，亨，王假有庙，利涉大川，利贞。彖曰：涣，亨，刚来而不穷，柔得位乎外而上同。', tuanCi: '王假有庙，王乃在中也。利涉大川，乘木有功也。', xiangCi: '风行水上，涣；先王以享于帝，立庙。', modernAdvice: '涣散之象，人心不齐。此时需要凝聚人心、建立共识。如风行水上，自然流通，化散为聚。' },
  { index: 13, name: '风泽中孚', unicode: '䷼', upperTrigram: 6, lowerTrigram: 3, upperName: '巽', lowerName: '兑', attribute: '风泽', summary: '诚信为本，感化四方，言出必行', guaci: '中孚，豚鱼吉，利涉大川，利贞。彖曰：中孚，柔在内而刚得中。', tuanCi: '说而巽，孚乃化邦也。', xiangCi: '泽上有风，中孚；君子以议狱缓死。', modernAdvice: '诚信是立身之本。此时最重要的是言出必行、以诚待人。诚信能感化最顽固的人，化解最深的矛盾。' },
  { index: 51, name: '风山渐', unicode: '䷴', upperTrigram: 6, lowerTrigram: 4, upperName: '巽', lowerName: '艮', attribute: '风山', summary: '循序渐进，稳步前进，渐进之道', guaci: '渐，女归吉，利贞。彖曰：渐之进也，女归吉也。进得位，往有功也。', tuanCi: '进以正，可以正邦也。其位刚，得中也。', xiangCi: '山上有木，渐；君子以居贤德，善俗。', modernAdvice: '循序渐进之卦。不可急躁，稳步前进。如登山一样，一步步积累，终能到达顶峰。' },
  { index: 20, name: '风火家人', unicode: '䷤', upperTrigram: 6, lowerTrigram: 5, upperName: '巽', lowerName: '离', attribute: '风火', summary: '家庭和睦，各守其分，齐家之道', guaci: '家人，利女贞。彖曰：家人，女正位乎内，男正位乎外。', tuanCi: '男女正，天地之大义也。家人有严君焉，父母之谓也。', xiangCi: '风自火出，家人；君子以言有物，而行有恒。', modernAdvice: '家庭、团队内部的和谐至关重要。各司其职、各守其分。家正则天下定，内部稳定才能向外发展。' },
  { index: 36, name: '巽为风', unicode: '䷸', upperTrigram: 6, lowerTrigram: 6, upperName: '巽', lowerName: '巽', attribute: '风风', summary: '柔顺渗透，谦逊顺从，潜移默化', guaci: '巽，小亨，利有攸往，利见大人。彖曰：重巽以申命，刚巽乎中正而志行。', tuanCi: '柔皆顺乎刚，是以小亨，利有攸往，利见大人。', xiangCi: '随风，巽；君子以申命行事。', modernAdvice: '以柔克刚、潜移默化之卦。不可强攻，应以柔顺渗透的方式。循序渐进，如春风化雨。' },
  { index: 4, name: '风天小畜', unicode: '䷈', upperTrigram: 6, lowerTrigram: 7, upperName: '巽', lowerName: '乾', attribute: '风天', summary: '小有积蓄，力量不足，待时而动', guaci: '小畜，亨。密云不雨，自我西郊。彖曰：小畜，柔得位而上下应之。', tuanCi: '健而巽，刚中而志行，乃亨。', xiangCi: '风行天上，小畜；君子以懿文德。', modernAdvice: '时机未到，力量尚小。此时不宜冒进，应积蓄实力、修炼内功。耐心等待，云密自有雨时。' },
  { index: 55, name: '天地否', unicode: '䷋', upperTrigram: 7, lowerTrigram: 0, upperName: '乾', lowerName: '坤', attribute: '天地', summary: '天地不交，闭塞不通，否极泰来', guaci: '否之匪人，不利君子贞，大往小来。彖曰：否之匪人，不利君子贞，大往小来，则是天地不交而万物不通也。', tuanCi: '天地不交，万物不通；上下不交，天下无邦也。', xiangCi: '天地不交，否；君子以俭德辟难，不可荣以禄。', modernAdvice: '闭塞不通，上下不交。此时不宜大动作，应节俭避难。但否极泰来，坚持等待转机。' },
  { index: 24, name: '天雷无妄', unicode: '䷘', upperTrigram: 7, lowerTrigram: 1, upperName: '乾', lowerName: '震', attribute: '天雷', summary: '真实无妄，顺其自然，不可妄为', guaci: '无妄，元亨利贞，其匪正有眚，不利有攸往。彖曰：无妄，刚自外来，而为主于内。', tuanCi: '动而健，刚中而应，大亨以正，天之命也。', xiangCi: '天下雷行，物与无妄；君子以茂对时，育万物。', modernAdvice: '真实无妄，顺其自然。不可有非分之想、不可妄动妄为。脚踏实地、真诚待人，自有天佑。' },
  { index: 40, name: '天水讼', unicode: '䷅', upperTrigram: 7, lowerTrigram: 2, upperName: '乾', lowerName: '坎', attribute: '天水', summary: '争讼谨慎，以和为贵，避免冲突', guaci: '讼，有孚，窒惕，中吉，终凶。利见大人，不利涉大川。', tuanCi: '讼，上刚下险，险而健，讼。', xiangCi: '天与水违行，讼；君子以作事谋始。', modernAdvice: '争讼之卦，冲突难免。但讼终凶，以和为贵。能调解则调解，不可逞强争胜。' },
  { index: 8, name: '天泽履', unicode: '䷉', upperTrigram: 7, lowerTrigram: 3, upperName: '乾', lowerName: '兑', attribute: '天泽', summary: '如履薄冰，谨慎行事，循规蹈矩', guaci: '履虎尾，不咥人，亨。彖曰：履，柔履刚也。', tuanCi: '说而应乎乾，是以履虎尾，不咥人，亨。', xiangCi: '上天下泽，履；君子以辨上下，定民志。', modernAdvice: '处境如履虎尾，需极度谨慎。遵守规则、尊重上级、小心言行，方能避免被"虎"所伤。' },
  { index: 48, name: '天山遁', unicode: '䷠', upperTrigram: 7, lowerTrigram: 4, upperName: '乾', lowerName: '艮', attribute: '天山', summary: '退避隐忍，明哲保身，以退为进', guaci: '遁，亨，小利贞。彖曰：遁亨，遁而亨也。刚当位而应，与时行也。', tuanCi: '小利贞，浸而长也。遁之时义大矣哉。', xiangCi: '天下有山，遁；君子以远小人，不恶而严。', modernAdvice: '退避之卦，以退为进。时机不利时，隐忍退让是明智之举。明哲保身，等待时机再出击。' },
  { index: 17, name: '天火同人', unicode: '䷌', upperTrigram: 7, lowerTrigram: 5, upperName: '乾', lowerName: '离', attribute: '天火', summary: '志同道合，团结协作，共创大业', guaci: '同人于野，亨，利涉大川，利君子贞。彖曰：同人，柔得位得中，而应乎乾，曰同人。', tuanCi: '同人曰，同人于野，亨，利涉大川，乾行也。', xiangCi: '天与火，同人；君子以类族辨物。', modernAdvice: '最利团队合作、寻找伙伴。志同道合者聚集在一起，可以共创大业。开放包容，广结善缘。' },
  { index: 32, name: '天风姤', unicode: '䷫', upperTrigram: 7, lowerTrigram: 6, upperName: '乾', lowerName: '巽', attribute: '天风', summary: '不期而遇，机缘巧合，阴阳相遇', guaci: '姤，女壮，勿用取女。彖曰：姤，遇也，柔遇刚也。', tuanCi: '天地相遇，品物咸章也。刚遇中正，天下大行也。', xiangCi: '天下有风，姤；后以施命诰四方。', modernAdvice: '不期而遇的缘分。可能遇到意想不到的人或事。但"女壮"警示：过于强势的女性或力量需谨慎对待。' },
  { index: 0, name: '乾为天', unicode: '䷀', upperTrigram: 7, lowerTrigram: 7, upperName: '乾', lowerName: '乾', attribute: '天天', summary: '刚健中正，自强不息，领导创造', guaci: '元亨利贞。彖曰：大哉乾元，万物资始，乃统天。云行雨施，品物流形。', tuanCi: '乾道变化，各正性命，保合大和，乃利贞。', xiangCi: '天行健，君子以自强不息。', modernAdvice: '当前时机极佳，适合主动出击、领导创新。事业上大胆推进，感情中主动表达。注意：刚健过甚则折，适当示弱反能长久。' },
];
// 第三部分：卦象推演与解卦技法
// ========================================================================

export interface Yao {
  index: number;
  value: 6 | 7 | 8 | 9;
  yin: boolean;
  changing: boolean;
  label: string;
}

export interface Hexagram {
  name: string;
  yaoLines: Yao[];
  upperTrigram: number;
  lowerTrigram: number;
  variant?: Hexagram;
}

export interface DivinationResult {
  original: Hexagram;
  changed: Hexagram | null;
  changingYao: Yao[];
  coinsHistory: number[][];
}

/** 掷币 */
function flipCoin(): 2 | 3 {
  return Math.random() < 0.5 ? 2 : 3;
}

/** 单爻生成 */
function castLine(): { coins: [number, number, number]; sum: 6 | 7 | 8 | 9 } {
  const c1 = flipCoin();
  const c2 = flipCoin();
  const c3 = flipCoin();
  const sum = (c1 + c2 + c3) as 6 | 7 | 8 | 9;
  return { coins: [c1, c2, c3], sum };
}

/** 三爻转卦索引 */
function linesToTrigramIndex(lines: [boolean, boolean, boolean]): number {
  return (!lines[0] ? 1 : 0) + (!lines[1] ? 2 : 0) + (!lines[2] ? 4 : 0);
}

/** 获取卦信息 */
function getHexagramInfo(upperIdx: number, lowerIdx: number): HexagramData | null {
  const key = upperIdx * 8 + lowerIdx;
  return HEXAGRAM_DATA[key] || null;
}

/** 获取卦符 Unicode */
export function getHexagramUnicode(upper: number, lower: number): string {
  return String.fromCodePoint(0x4DC0 + upper * 8 + lower);
}

/** 获取卦象可视化 */
export function getHexagramVisual(hex: Hexagram): string {
  const lines = [...hex.yaoLines].reverse().map(y => {
    if (y.changing) return y.yin ? '⚏' : '⚌';
    return y.yin ? '⚋' : '⚊';
  });
  return lines.join('\n');
}

/** 获取上下卦名称 */
export function getTrigramNames(hex: Hexagram): { upper: string; lower: string } {
  const upper = EIGHT_TRIGRAMS[hex.upperTrigram];
  const lower = EIGHT_TRIGRAMS[hex.lowerTrigram];
  return {
    upper: `${upper.symbol}${upper.name}`,
    lower: `${lower.symbol}${lower.name}`,
  };
}

/** 构建卦象 */
export function buildHexagram(yaoLines: Yao[], forcedUpper?: number, forcedLower?: number): Hexagram {
  const lowerLines: [boolean, boolean, boolean] = [
    yaoLines[0].yin, yaoLines[1].yin, yaoLines[2].yin,
  ];
  const upperLines: [boolean, boolean, boolean] = [
    yaoLines[3].yin, yaoLines[4].yin, yaoLines[5].yin,
  ];

  const lowerIdx = forcedLower !== undefined ? forcedLower : linesToTrigramIndex(lowerLines);
  const upperIdx = forcedUpper !== undefined ? forcedUpper : linesToTrigramIndex(upperLines);
  const info = getHexagramInfo(upperIdx, lowerIdx);

  return {
    name: info?.name || '未知卦',
    yaoLines,
    upperTrigram: upperIdx,
    lowerTrigram: lowerIdx,
  };
}

/** 主函数：完整摇卦 */
export function castHexagram(preCastCoins?: number[][]): DivinationResult {
  const yaoLines: Yao[] = [];
  const coinsHistory: number[][] = [];

  for (let i = 0; i < 6; i++) {
    let coins: [number, number, number];
    let sum: 6 | 7 | 8 | 9;

    if (preCastCoins && preCastCoins[i]) {
      coins = preCastCoins[i] as [number, number, number];
      sum = (coins[0] + coins[1] + coins[2]) as 6 | 7 | 8 | 9;
    } else {
      const result = castLine();
      coins = result.coins;
      sum = result.sum;
    }

    coinsHistory.push(coins);

    // 奇数为阳，偶数为阴
    const yin = sum % 2 === 0;
    const changing = sum === 6 || sum === 9;

    let label: string;
    switch (sum) {
      case 6: label = '老阴 ⚋ (变)'; break;
      case 7: label = '少阳 ⚊'; break;
      case 8: label = '少阴 ⚋'; break;
      case 9: label = '老阳 ⚊ (变)'; break;
    }

    yaoLines.push({
      index: i,
      value: sum,
      yin,
      changing,
      label,
    });
  }

  const original = buildHexagram(yaoLines);

  let changed: Hexagram | null = null;
  const changingYao = yaoLines.filter(y => y.changing);

  if (changingYao.length > 0) {
    const variantLines = yaoLines.map(y => ({
      ...y,
      yin: !y.yin,
      changing: false,
      value: (y.value === 6 ? 9 : y.value === 9 ? 6 : y.value) as 6 | 7 | 8 | 9,
      label: y.value === 6 ? '老阴→少阳' : y.value === 9 ? '老阳→少阴' : y.label,
    }));
    changed = buildHexagram(variantLines);
    original.variant = changed;
  }

  return { original, changed, changingYao, coinsHistory };
}

/** 获取六十四卦详细数据 */
export function getHexagramData(upperIdx: number, lowerIdx: number): HexagramData | null {
  const key = upperIdx * 8 + lowerIdx;
  return HEXAGRAM_DATA[key] || null;
}

// ========================================================================
// 互卦 / 错卦 / 综卦 / 体用生克
// ========================================================================

/** 互卦：取六爻中间四爻（二至五爻），二三四为下互，三四五为上互 */
export function getInterlockingHexagram(yaoLines: Yao[]): { name: string; upperTrigram: number; lowerTrigram: number } | null {
  if (yaoLines.length < 5) return null;

  // 下互 = 二爻(1)、三爻(2)、四爻(3)
  const lowerBits: [boolean, boolean, boolean] = [yaoLines[1].yin, yaoLines[2].yin, yaoLines[3].yin];
  // 上互 = 三爻(2)、四爻(3)、五爻(4)
  const upperBits: [boolean, boolean, boolean] = [yaoLines[2].yin, yaoLines[3].yin, yaoLines[4].yin];

  const lowerIdx = linesToTrigramIndex(lowerBits);
  const upperIdx = linesToTrigramIndex(upperBits);
  const info = getHexagramInfo(upperIdx, lowerIdx);

  return { name: info?.name || '未知卦', upperTrigram: upperIdx, lowerTrigram: lowerIdx };
}

/** 错卦（旁通卦）：六爻全部阴阳反转 */
export function getWrongHexagram(yaoLines: Yao[]): { name: string; upperTrigram: number; lowerTrigram: number } | null {
  if (yaoLines.length < 6) return null;

  const lowerBits: [boolean, boolean, boolean] = [!yaoLines[0].yin, !yaoLines[1].yin, !yaoLines[2].yin];
  const upperBits: [boolean, boolean, boolean] = [!yaoLines[3].yin, !yaoLines[4].yin, !yaoLines[5].yin];

  const lowerIdx = linesToTrigramIndex(lowerBits);
  const upperIdx = linesToTrigramIndex(upperBits);
  const info = getHexagramInfo(upperIdx, lowerIdx);

  return { name: info?.name || '未知卦', upperTrigram: upperIdx, lowerTrigram: lowerIdx };
}

/** 综卦（覆卦）：六爻顺序颠倒（上下翻转 180°） */
export function getReverseHexagram(yaoLines: Yao[]): { name: string; upperTrigram: number; lowerTrigram: number } | null {
  if (yaoLines.length < 6) return null;

  const reversed = [...yaoLines].reverse();

  const lowerBits: [boolean, boolean, boolean] = [reversed[0].yin, reversed[1].yin, reversed[2].yin];
  const upperBits: [boolean, boolean, boolean] = [reversed[3].yin, reversed[4].yin, reversed[5].yin];

  const lowerIdx = linesToTrigramIndex(lowerBits);
  const upperIdx = linesToTrigramIndex(upperBits);
  const info = getHexagramInfo(upperIdx, lowerIdx);

  return { name: info?.name || '未知卦', upperTrigram: upperIdx, lowerTrigram: lowerIdx };
}

/** 体用生克分析 */
export interface BodyUseResult {
  body: { trigramName: string; wuxing: string; index: number };
  use: { trigramName: string; wuxing: string; index: number };
  relation: string;
  interpretation: string;
}

/** 体用生克：}
 * 体 = 下卦（内卦，代表主体），用 = 上卦（外卦，代表客体/环境）
 * 生克关系：
 * - 用生体：吉，环境有利
 * - 体生用：泄气，付出较多
 * - 体克用：虽劳但吉，主体可控
 * - 用克体：凶，环境不利 */
export function getBodyUseAnalysis(hexagram: Hexagram): BodyUseResult {
  const lowerTrigram = EIGHT_TRIGRAMS[hexagram.lowerTrigram];
  const upperTrigram = EIGHT_TRIGRAMS[hexagram.upperTrigram];

  const body = { trigramName: lowerTrigram.name, wuxing: lowerTrigram.wuxing, index: hexagram.lowerTrigram };
  const use = { trigramName: upperTrigram.name, wuxing: upperTrigram.wuxing, index: hexagram.upperTrigram };

  const bodyWuxing = lowerTrigram.wuxing;
  const useWuxing = upperTrigram.wuxing;

  // 用生体
  if (WUXING_GENERATE[useWuxing] === bodyWuxing) {
    return { body, use, relation: '用生体', interpretation: '吉。环境生助主体，外在力量有利，做事顺遂，贵人相助。' };
  }
  // 体生用
  if (WUXING_GENERATE[bodyWuxing] === useWuxing) {
    return { body, use, relation: '体生用', interpretation: '中平。主体需向外付出，虽有所损耗但为主动行为，付出终有回报。' };
  }
  // 体克用
  if (WUXING_OVERCOME[bodyWuxing] === useWuxing) {
    return { body, use, relation: '体克用', interpretation: '小吉。主体可掌控外部环境，虽需努力但结果可控，事在人为。' };
  }
  // 用克体
  if (WUXING_OVERCOME[useWuxing] === bodyWuxing) {
    return { body, use, relation: '用克体', interpretation: '凶。外部环境不利主体，压力较大，需谨慎应对，不宜冒进。' };
  }
  // 五行相同
  return { body, use, relation: '体用比和', interpretation: '大吉。内外一致，天人合一，和谐顺畅，诸事顺遂。' };
}
