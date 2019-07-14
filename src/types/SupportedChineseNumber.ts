export type SupportedChineseNumeral =
  | '零'
  | '〇'
  | '０'
  | '洞'
  | '壹'
  | '一'
  | '幺'
  | '１'
  | '貳'
  | '贰'
  | '二'
  | '两'
  | '兩'
  | '倆'
  | '俩'
  | '２'
  | '叁'
  | '三'
  | '仨'
  | '３'
  | '肆'
  | '四'
  | '４'
  | '伍'
  | '五'
  | '５'
  | '陸'
  | '陆'
  | '六'
  | '６'
  | '柒'
  | '七'
  | '拐'
  | '７'
  | '捌'
  | '八'
  | '８'
  | '玖'
  | '九'
  | '勾'
  | '９'
  | '拾'
  | '十'
  | '廿'
  | '卅'
  | '卌'
  | '佰'
  | '百'
  | '皕'
  | '仟'
  | '千'
  | '萬'
  | '万'
  | '億'
  | '亿';

export const SUPPORTED_CHINESE_NUMBERS: string[] = [
  '零',
  '〇',
  '０',
  '洞',
  '壹',
  '一',
  '幺',
  '１',
  '貳',
  '贰',
  '二',
  '两',
  '兩',
  '倆',
  '俩',
  '２',
  '叁',
  '三',
  '仨',
  '３',
  '肆',
  '四',
  '４',
  '伍',
  '五',
  '５',
  '陸',
  '陆',
  '六',
  '６',
  '柒',
  '七',
  '拐',
  '７',
  '捌',
  '八',
  '８',
  '玖',
  '九',
  '勾',
  '９',
  '拾',
  '十',
  '廿',
  '卅',
  '卌',
  '佰',
  '百',
  '皕',
  '仟',
  '千',
  '萬',
  '万',
  '億',
  '亿',
];

export const CHARACTER_LIST: string = SUPPORTED_CHINESE_NUMBERS.join('');

export function isSupportedChineseNumeral(character: string | SupportedChineseNumeral): character is SupportedChineseNumeral {
  return SUPPORTED_CHINESE_NUMBERS.includes(character);
}
