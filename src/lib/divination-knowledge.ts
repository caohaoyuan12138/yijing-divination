/**
 * 古代占卜典籍知识库 - 为 AI 解读提供学术支撑
 */

export interface ClassicalReference {
  book: string;
  category: string;
  content: string;
}

const CLASSICAL_KNOWLEDGE: Record<string, ClassicalReference> = {
  乾: {
    book: '周易',
    category: '八卦',
    content: '乾为天，刚健中正。《周易·乾卦》："天行健，君子以自强不息。" 乾卦象征创造、领导、积极向上。在人事中代表父亲、君主、领导者。'
  },
  坤: {
    book: '周易',
    category: '八卦',
    content: '坤为地，柔顺包容。《周易·坤卦》："地势坤，君子以厚德载物。" 坤卦象征包容、承载、滋养万物。在人事中代表母亲、臣民、包容者。'
  },
  震: {
    book: '周易',
    category: '八卦',
    content: '震为雷，震动奋起。《周易·震卦》："荐雷，震，君子以恐惧修省。" 震卦象征行动、奋起、震惊。在人事中代表长子、行动者。'
  },
  巽: {
    book: '周易',
    category: '八卦',
    content: '巽为风，渗透柔顺。《周易·巽卦》："随风，巽，君子以申命行事。" 巽卦象征渗透、柔顺、无孔不入。在人事中代表长女、智者。'
  },
  坎: {
    book: '周易',
    category: '八卦',
    content: '坎为水，险陷重重。《周易·坎卦》："水流而不盈，行险而不失其信。" 坎卦象征险阻、智慧、流动。在人事中代表中男、智者。'
  },
  离: {
    book: '周易',
    category: '八卦',
    content: '离为火，光明美丽。《周易·离卦》："明两作，离，大人以继明照于四方。" 离卦象征光明、美丽、依附。在人事中代表中女、艺术家。'
  },
  艮: {
    book: '周易',
    category: '八卦',
    content: '艮为山，止其所止。《周易·艮卦》："兼山，艮，君子以思不出其位。" 艮卦象征停止、安定、沉思。在人事中代表少男、隐士。'
  },
  兑: {
    book: '周易',
    category: '八卦',
    content: '兑为泽，喜悦沟通。《周易·兑卦》："丽泽，兑，君子以朋友讲习。" 兑卦象征喜悦、沟通、口舌。在人事中代表少女、演说家。'
  }
};

const HEXAGRAM_DETAILS: Record<string, { guaCi: string; xiangCi: string; meaning: string }> = {
  乾: {
    guaCi: '元亨利贞',
    xiangCi: '天行健，君子以自强不息',
    meaning: '乾卦象征天，具有刚健、创造、领导的特质。元亨利贞四德俱全，是大吉之卦。但需防"亢龙有悔"，盛极必衰。'
  },
  坤: {
    guaCi: '元亨，利牝马之贞',
    xiangCi: '地势坤，君子以厚德载物',
    meaning: '坤卦象征地，具有包容、承载、滋养的特质。柔顺守正，利于配合，以柔克刚。'
  },
  屯: {
    guaCi: '元亨利贞，勿用有攸往',
    xiangCi: '云雷屯，君子以经纶',
    meaning: '屯卦象征初生，万事开头难。雷雨交加，艰难初创，需要耐心经营，不可轻举妄动。'
  },
  蒙: {
    guaCi: '亨，匪我求童蒙，童蒙求我',
    xiangCi: '山下出泉，蒙，君子以果行育德',
    meaning: '蒙卦象征启蒙，去除蒙昧。教育需要启发式，学生主动求教，教师因材施教。'
  },
  需: {
    guaCi: '有孚，光亨，贞吉，利涉大川',
    xiangCi: '云上于天，需，君子以饮食宴乐',
    meaning: '需卦象征等待，时机未到。云在天上，待时而动。需要养精蓄锐，不可急躁冒进。'
  },
  讼: {
    guaCi: '有孚，窒惕，中吉，终凶',
    xiangCi: '天与水违行，讼，君子以作事谋始',
    meaning: '讼卦象征争讼，矛盾冲突。天与水相背，意见不合。宜解不宜结，以和为贵。'
  },
  师: {
    guaCi: '贞，丈人吉，无咎',
    xiangCi: '地中有水，师，君子以容民畜众',
    meaning: '师卦象征军队，统率众人。需要严明纪律，委任贤能，以正治国。'
  },
  比: {
    guaCi: '吉，原筮，元永贞，无咎',
    xiangCi: '地上有水，比，先王以建万国，亲诸侯',
    meaning: '比卦象征亲比，团结合作。地上有水，亲密无间。得道多助，失道寡助。'
  },
  小畜: {
    guaCi: '亨，密云不雨，自我西郊',
    xiangCi: '风行天上，小畜，君子以懿文德',
    meaning: '小畜卦象征积蓄不足。风在天上，云雨未至。力量薄弱，宜修内功，等待时机。'
  },
  履: {
    guaCi: '履虎尾，不咥人，亨',
    xiangCi: '上天下泽，履，君子以辨上下，定民志',
    meaning: '履卦象征践履，如履薄冰。需要循规蹈矩，谨慎行事，方可无咎。'
  },
  泰: {
    guaCi: '小往大来，吉亨',
    xiangCi: '天地交，泰，后以财成天地之道，相天地之宜',
    meaning: '泰卦象征通泰，天地交泰。阴阳和合，万物通达。盛世之象，把握机遇。'
  },
  否: {
    guaCi: '否之匪人，不利君子贞，大往小来',
    xiangCi: '天地不交，否，君子以俭德辟难，不可荣以禄',
    meaning: '否卦象征闭塞，天地不交。阴阳不和，万物不通。韬光养晦，明哲保身。'
  },
  同人: {
    guaCi: '同人于野，亨，利涉大川，利君子贞',
    xiangCi: '天与火，同人，君子以类族辨物',
    meaning: '同人卦象征团结，志同道合。天火同光，合作共赢。求同存异，广交朋友。'
  },
  大有: {
    guaCi: '元亨',
    xiangCi: '火在天上，大有，君子以遏恶扬善，顺天休命',
    meaning: '大有卦象征富有，如日中天。盛大丰有，前程似锦。居安思危，回馈社会。'
  },
  谦: {
    guaCi: '亨，君子有终',
    xiangCi: '地中有山，谦，君子以裒多益寡，称物平施',
    meaning: '谦卦象征谦虚，唯一六爻皆吉的卦。地中有山，谦受益。谦虚带来好运。'
  },
  豫: {
    guaCi: '利建侯行师',
    xiangCi: '雷出地奋，豫，先王以作乐崇德，殷荐之上帝',
    meaning: '豫卦象征愉悦，心情舒畅。雷出地奋，万物欢欣。顺势而为，享受生活。'
  },
  随: {
    guaCi: '元亨利贞，无咎',
    xiangCi: '泽中有雷，随，君子以向晦入宴息',
    meaning: '随卦象征顺从，随机应变。泽中有雷，随时而动。识时务，随机应变。'
  },
  蛊: {
    guaCi: '元亨，利涉大川，先甲三日，后甲三日',
    xiangCi: '山下有风，蛊，君子以振民育德',
    meaning: '蛊卦象征整治，拨乱反正。山下有风，物腐虫生。需要革故鼎新，重振旗鼓。'
  },
  临: {
    guaCi: '元亨利贞，至于八月有凶',
    xiangCi: '泽上有地，临，君子以教思无穷，容保民无疆',
    meaning: '临卦象征监临，居高临下。泽上有地，居高临下。亲民爱民，不可高高在上。'
  },
  观: {
    guaCi: '盥而不荐，有孚颙若',
    xiangCi: '风行地上，观，先王以省方，观民设教',
    meaning: '观卦象征观察，审时度势。风行地上，观察万物。审时度势，以观后效。'
  },
  噬嗑: {
    guaCi: '亨，利用狱',
    xiangCi: '雷电噬嗑，先王以明罚敕法',
    meaning: '噬嗑卦象征咬合，刑罚严明。雷电交加，明罚敕法。刚正不阿，赏罚分明。'
  },
  贲: {
    guaCi: '亨，小利有攸往',
    xiangCi: '山下有火，贲，君子以明庶政，无敢折狱',
    meaning: '贲卦象征修饰，文质彬彬。山下有火，文采斐然。注重外表，但不可虚伪。'
  },
  剥: {
    guaCi: '不利有攸往',
    xiangCi: '山附于地，剥，上以厚下安宅',
    meaning: '剥卦象征剥落，盛极必衰。山附于地，基础不稳。顺势而退，以守为攻。'
  },
  复: {
    guaCi: '亨，出入无疾，朋来无咎',
    xiangCi: '雷在地中，复，先王以至日闭关',
    meaning: '复卦象征回复，重新开始。雷在地中，一阳来复。把握新的开始，谨慎行事。'
  },
  无妄: {
    guaCi: '元亨利贞，其匪正有眚，不利有攸往',
    xiangCi: '天下雷行，物与无妄，先王以茂对时，育万物',
    meaning: '无妄卦象征真实，顺应天道。天下雷行，真实无妄。真诚待人，实事求是。'
  },
  大畜: {
    guaCi: '利贞，不家食吉，利涉大川',
    xiangCi: '天在山中，大畜，君子以多识前言往行，以畜其德',
    meaning: '大畜卦象征积蓄，厚积薄发。天在山中，积累深厚。宜充实自己，等待时机。'
  },
  颐: {
    guaCi: '贞吉，观颐，自求口实',
    xiangCi: '山下有雷，颐，君子以慎语言，节饮食',
    meaning: '颐卦象征颐养，休养生息。山下有雷，养生之道。节俭养生，谨言慎行。'
  },
  大过: {
    guaCi: '栋桡，利有攸往，亨',
    xiangCi: '泽灭木，大过，君子以独立不惧，遁世无闷',
    meaning: '大过卦象征压力，非常时期。泽灭木，压力巨大。需要非常手段，力挽狂澜。'
  },
  坎: {
    guaCi: '习坎，有孚，维心亨，行有尚',
    xiangCi: '水流而不盈，行险而不失其信',
    meaning: '坎卦象征险陷，困难重重。水流险中，不失诚信。诚信待人，化险为夷。'
  },
  离: {
    guaCi: '利贞，亨，畜牝牛，吉',
    xiangCi: '明两作，离，大人以继明照于四方',
    meaning: '离卦象征光明，美丽辉煌。明两作离，光明相继。光明磊落，热情待人。'
  },
  咸: {
    guaCi: '亨，利贞，取女吉',
    xiangCi: '山上有泽，咸，君子以虚受人',
    meaning: '咸卦象征感应，情感沟通。山上有泽，相互感应。真诚感应，莫强求。'
  },
  恒: {
    guaCi: '亨，无咎，利贞，利有攸往',
    xiangCi: '雷风，恒，君子以立不易方',
    meaning: '恒卦象征恒久，坚持正道。雷风相恒，持之以恒。坚持正道，持之以恒。'
  },
  遁: {
    guaCi: '亨，小利贞',
    xiangCi: '天下有山，遁，君子以远小人，不恶而严',
    meaning: '遁卦象征退避，明哲保身。天下有山，退隐山林。见机而作，明哲保身。'
  },
  大壮: {
    guaCi: '利贞',
    xiangCi: '雷在天上，大壮，君子以非礼弗履',
    meaning: '大壮卦象征强大，力量强盛。雷在天上，光明正大。光明正大，不可妄为。'
  },
  晋: {
    guaCi: '康侯用锡马蕃庶，昼日三接',
    xiangCi: '明出地上，晋，君子以自昭明德',
    meaning: '晋卦象征晋升，步步高升。明出地上，自昭明德。发挥才能，服务大众。'
  },
  明夷: {
    guaCi: '利艰贞',
    xiangCi: '明入地中，明夷，君子以莅众，用晦而明',
    meaning: '明夷卦象征受损，韬光养晦。明入地中，光明受损。韬光养晦，明哲保身。'
  },
  家人: {
    guaCi: '利女贞',
    xiangCi: '风自火出，家人，君子以言有物，而行有恒',
    meaning: '家人卦象征家庭，各司其职。风自火出，家有礼法。修身齐家，以身作则。'
  },
  睽: {
    guaCi: '小事吉',
    xiangCi: '上火下泽，睽，君子以同而异',
    meaning: '睽卦象征乖离，意见不合。上火下泽，各走各路。求同存异，委曲求全。'
  },
  蹇: {
    guaCi: '利西南，不利东北，利见大人，贞吉',
    xiangCi: '山上有水，蹇，君子以反身修德',
    meaning: '蹇卦象征寸步难行，困难重重。山上有水，行路艰难。反求诸己，寻求援助。'
  },
  解: {
    guaCi: '利西南，无所往，其来复吉',
    xiangCi: '雷雨作，解，君子以赦过宥罪',
    meaning: '解卦象征解除，化险为夷。雷雨作解，困难解除。宽恕他人，和谐相处。'
  },
  损: {
    guaCi: '有孚，元吉，无咎，可贞，利有攸往',
    xiangCi: '山下有泽，损，君子以惩忿窒欲',
    meaning: '损卦象征减损，舍小取大。山下有泽，损下益上。小不忍则乱大谋。'
  },
  益: {
    guaCi: '利有攸往，利涉大川',
    xiangCi: '风雷，益，君子以见善则迁，有过则改',
    meaning: '益卦象征增益，损上益下。风雷相益，广结善缘。广结善缘，帮助他人。'
  },
  夬: {
    guaCi: '扬于王庭，孚号，有厉，告自邑',
    xiangCi: '泽上于天，夬，君子以施禄及下，德则忌',
    meaning: '夬卦象征决断，当机立断。泽上于天，决堤溃坝。当机立断，莫犹豫。'
  },
  姤: {
    guaCi: '女壮，勿用取女',
    xiangCi: '天下有风，姤，后以施命诰四方',
    meaning: '姤卦象征邂逅，阴阳相遇。天下有风，相遇相知。审时度势，莫错失良机。'
  },
  萃: {
    guaCi: '亨，王假有庙，利见大人，亨，利贞',
    xiangCi: '泽上于地，萃，君子以除戎器，戒不虞',
    meaning: '萃卦象征聚集，团结合作。泽上于地，聚集会合。团结合作，共创辉煌。'
  },
  升: {
    guaCi: '元亨，用见大人，勿恤，南征吉',
    xiangCi: '地中生木，升，君子以顺德，积小以高大',
    meaning: '升卦象征上升，步步高升。地中生木，积累成长。积累经验，稳步提升。'
  },
  困: {
    guaCi: '亨，贞，大人吉，无咎，有言不信',
    xiangCi: '泽无水，困，君子以致命遂志',
    meaning: '困卦象征困顿，穷途末路。泽无水，困顿穷途。坚持原则，不轻易放弃。'
  },
  井: {
    guaCi: '改邑不改井，无丧无得，往来井井',
    xiangCi: '木上有水，井，君子以劳民劝相',
    meaning: '井卦象征井养，不求回报。木上有水，井养万物。修身养德，服务大众。'
  },
  革: {
    guaCi: '巳日乃孚，元亨利贞，悔亡',
    xiangCi: '泽中有火，革，君子以治历明时',
    meaning: '革卦象征变革，破旧立新。泽中有火，变革之时。因势利导，勇于创新。'
  },
  鼎: {
    guaCi: '元吉，亨',
    xiangCi: '木上有火，鼎，君子以正位凝命',
    meaning: '鼎卦象征稳重，三足鼎立。木上有火，稳重图变。稳中求变，创新发展。'
  },
  震: {
    guaCi: '亨，震来虩虩，笑言哑哑',
    xiangCi: '荐雷，震，君子以恐惧修省',
    meaning: '震卦象征震动，震惊惶恐。荐雷相续，恐惧修省。谨慎行事，防患未然。'
  },
  艮: {
    guaCi: '艮其背，不获其身，行其庭，不见其人，无咎',
    xiangCi: '兼山，艮，君子以思不出其位',
    meaning: '艮卦象征停止，适可而止。兼山相叠，止于正道。适可而止，不要妄动。'
  },
  渐: {
    guaCi: '女归吉，利贞',
    xiangCi: '山上有木，渐，君子以居贤德，善俗',
    meaning: '渐卦象征渐进，循序渐进。山上有木，逐渐成长。按部就班，莫急于求成。'
  },
  归妹: {
    guaCi: '征凶，无攸利',
    xiangCi: '泽上有雷，归妹，君子以永终知敝',
    meaning: '归妹卦象征嫁娶，选择不当。泽上有雷，选择不当。审慎选择，不要冲动。'
  },
  丰: {
    guaCi: '亨，王假之，勿忧，宜日中',
    xiangCi: '雷电皆至，丰，君子以折狱致刑',
    meaning: '丰卦象征丰盛，如日中天。雷电皆至，丰盛壮大。居安思危，防微杜渐。'
  },
  旅: {
    guaCi: '小亨，旅贞吉',
    xiangCi: '山上有火，旅，君子以明慎用刑，而不留狱',
    meaning: '旅卦象征行旅，客居他乡。山上有火，行旅在外。谨慎行事，广交朋友。'
  },
  巽: {
    guaCi: '小亨，利有攸往，利见大人',
    xiangCi: '随风，巽，君子以申命行事',
    meaning: '巽卦象征顺风，谦逊柔顺。随风相从，谦逊行事。谦逊柔顺，以柔克刚。'
  },
  兑: {
    guaCi: '亨，利贞',
    xiangCi: '丽泽，兑，君子以朋友讲习',
    meaning: '兑卦象征喜悦，和谐沟通。丽泽相连，喜悦沟通。真诚交流，广结善缘。'
  },
  涣: {
    guaCi: '亨，王假有庙，利涉大川，利贞',
    xiangCi: '风行水上，涣，先王以享于帝，立庙',
    meaning: '涣卦象征涣散，需要凝聚。风行水上，涣散分离。凝聚人心，共渡难关。'
  },
  节: {
    guaCi: '亨，苦节不可贞',
    xiangCi: '泽上有水，节，君子以制数度，议德行',
    meaning: '节卦象征节制，适可而止。泽上有水，节制有度。适度节制，过犹不及。'
  },
  中孚: {
    guaCi: '豚鱼吉，利涉大川，利贞',
    xiangCi: '泽上有风，中孚，君子以议狱缓死',
    meaning: '中孚卦象征诚信，一诺千金。泽上有风，诚信感召。真诚待人，一诺千金。'
  },
  小过: {
    guaCi: '亨，利贞，可小事，不可大事',
    xiangCi: '山上有雷，小过，君子以行过乎恭，丧过乎哀，用过乎俭',
    meaning: '小过卦象征小有过越，量力而行。山上有雷，小有过越。量力而行，不要好高骛远。'
  },
  既济: {
    guaCi: '亨，小利贞，初吉终乱',
    xiangCi: '水在火上，既济，君子以思患而预防之',
    meaning: '既济卦象征完成，大功告成。水在火上，既济成功。居安思危，防微杜渐。'
  },
  未济: {
    guaCi: '亨，小狐汔济，濡其尾，无攸利',
    xiangCi: '火在水上，未济，君子以慎辨物居方',
    meaning: '未济卦象征未成，仍需努力。火在水上，未济未成。坚持到底，不要放弃。'
  }
};

const WUXING: Record<string, string> = {
  乾: '金',
  兑: '金',
  坤: '土',
  艮: '土',
  震: '木',
  巽: '木',
  坎: '水',
  离: '火'
};

const BAGUA_NATURE: Record<string, string> = {
  乾: '天',
  坤: '地',
  震: '雷',
  巽: '风',
  坎: '水',
  离: '火',
  艮: '山',
  兑: '泽'
};

const SEASON: Record<string, string> = {
  乾: '秋冬之交',
  兑: '秋',
  坤: '夏秋之交',
  艮: '冬春之交',
  震: '春',
  巽: '春夏之交',
  坎: '冬',
  离: '夏'
};

const DIRECTION: Record<string, string> = {
  乾: '西北',
  兑: '西',
  坤: '西南',
  艮: '东北',
  震: '东',
  巽: '东南',
  坎: '北',
  离: '南'
};

/**
 * 获取卦象的详细解读信息
 */
export function getHexagramKnowledge(upperTrigram: number, lowerTrigram: number): {
  name: string;
  upperName: string;
  lowerName: string;
  guaCi: string;
  xiangCi: string;
  meaning: string;
  wuxing: string;
  nature: string;
  season: string;
  direction: string;
  classicalRef: ClassicalReference | null;
} {
  const upperName = ['坤','艮','坎','震','巽','离','兑','乾'][upperTrigram];
  const lowerName = ['坤','艮','坎','震','巽','离','兑','乾'][lowerTrigram];
  const hexName = `${upperName}${lowerName}`;

  const details = HEXAGRAM_DETAILS[hexName] || {
    guaCi: '请参考《周易》原文',
    xiangCi: '请参考《周易·象传》',
    meaning: `${hexName}卦，上卦为${upperName}，下卦为${lowerName}。请结合具体问题进行解读。`
  };

  const classicalRef = CLASSICAL_KNOWLEDGE[upperName] || CLASSICAL_KNOWLEDGE[lowerName] || null;

  return {
    name: hexName,
    upperName,
    lowerName,
    guaCi: details.guaCi,
    xiangCi: details.xiangCi,
    meaning: details.meaning,
    wuxing: `${WUXING[upperName] || '?'}/${WUXING[lowerName] || '?'}`,
    nature: `${BAGUA_NATURE[upperName] || '?'}+${BAGUA_NATURE[lowerName] || '?'}`,
    season: `${SEASON[upperName] || '?'}/${SEASON[lowerName] || '?'}`,
    direction: `${DIRECTION[upperName] || '?'}/${DIRECTION[lowerName] || '?'}`,
    classicalRef
  };
}

/**
 * 获取五行生克关系
 */
export function getWuxingRelation(element1: string, element2: string): string {
  const generate: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const overcome: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

  if (generate[element1] === element2) return '生';
  if (generate[element2] === element1) return '被生';
  if (overcome[element1] === element2) return '克';
  if (overcome[element2] === element1) return '被克';
  return '比和';
}

/**
 * 获取变爻解读
 */
export function getChangingYaoInterpretation(value: number, position: number): string {
  const positionNames = ['初', '二', '三', '四', '五', '上'];
  const posName = positionNames[position] || '未知';

  if (value === 6) {
    return `${posName}爻为老阴（六），阴极生阳，此爻有变。象征事物将向对立面转化，需要特别注意。`;
  } else if (value === 9) {
    return `${posName}爻为老阳（九），阳极生阴，此爻有变。象征事物将向对立面转化，需要特别注意。`;
  } else if (value === 7) {
    return `${posName}爻为少阳（七），阳爻守正，此爻安定。`;
  } else if (value === 8) {
    return `${posName}爻为少阴（八），阴爻守正，此爻安定。`;
  }
  return `${posName}爻状态不明`;
}

/**
 * 获取完整的卦象解读文本（供 AI 参考）
 */
export function getFullHexagramInterpretation(upperTrigram: number, lowerTrigram: number): string {
  const knowledge = getHexagramKnowledge(upperTrigram, lowerTrigram);

  let text = `【卦象详解】\n`;
  text += `卦名：${knowledge.name}\n`;
  text += `上卦：${knowledge.upperName}（${BAGUA_NATURE[knowledge.upperName]}）\n`;
  text += `下卦：${knowledge.lowerName}（${BAGUA_NATURE[knowledge.lowerName]}）\n`;
  text += `卦辞：${knowledge.guaCi}\n`;
  text += `象辞：${knowledge.xiangCi}\n`;
  text += `五行：上${knowledge.wuxing.split('/')[0]} 下${knowledge.wuxing.split('/')[1]}\n`;
  text += `自然：${knowledge.nature}\n`;
  text += `方位：${knowledge.direction}\n`;
  text += `含义：${knowledge.meaning}\n`;

  if (knowledge.classicalRef) {
    text += `\n【典籍参考·${knowledge.classicalRef.book}】\n`;
    text += knowledge.classicalRef.content + '\n';
  }

  return text;
}
