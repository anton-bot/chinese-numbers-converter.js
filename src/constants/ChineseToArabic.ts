import { SupportedChineseNumber } from '../types/SupportedChineseNumber';

export const CHINESE_TO_ARABIC: Record<SupportedChineseNumber, number | string> = {
  '零': 0,
  '〇': 0,
  '０': 0,
  '洞': 0,

  '壹': 1,
  '一': 1,
  '幺': 1,
  '１': 1,

  '貳': 2,
  '贰': 2,
  '二': 2,
  '两': 2,
  '兩': 2,
  '倆': 2,
  '俩': 2,
  '２': 2,

  // Outdated financial number variant which is commonly used as a normal word,
  // which causes false positives:
  // '參': 3,

  '叁': 3,
  '三': 3,
  '仨': 3,
  '３': 3,

  '肆': 4,
  '四': 4,
  '４': 4,

  '伍': 5,
  '五': 5,
  '５': 5,

  '陸': 6,
  '陆': 6,
  '六': 6,
  '６': 6,

  '柒': 7,
  '七': 7,
  '拐': 7,
  '７': 7,

  '捌': 8,
  '八': 8,
  '８': 8,

  '玖': 9,
  '九': 9,
  '勾': 9,
  '９': 9,

  '拾': '*10',
  '十': '*10',
  // '呀': '*10', // causes problems with casual "ah" at the end of sentence
  '廿': '*20',
  '卅': '*30',
  '卌': '*40',
  '佰': '*100',
  '百': '*100',
  '皕': '*200',
  '仟': '*1000',
  '千': '*1000',
  '萬': '*10000',
  '万': '*10000',
  '億': '*100000000',
  '亿': '*100000000',
};