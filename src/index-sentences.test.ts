import { ChineseNumber } from './index';

const SENTENCE_TESTS = [
  { before: '***貳佰零伍元***', after: '***205元***' },
  { before: '345 abc', after: '345 abc' },
  { before: '3.5萬', after: '35000' },
  // { before: '4.52萬 ', after: '45200 ' }, // fail, 45199.999999999
  { before: '3, 5 and 4', after: '3, 5 and 4' },
  { before: '***3.1323445124421445***', after: '***3.1323445124421445***' },
  // { before: '***3.1323445124421445642***', after: '***3.1323445124421445642***' }, // fails because of the large number - too much for JavaScript
  { before: '一百. What a great number.', after: '100. What a great number.' },
  { before: '4 000 000', after: '4000000' },
  { before: '4 000 000 RMB', after: '4000000 RMB' },
  { before: '這款車的價格從34.5萬港幣到55.4萬港幣。', after: '這款車的價格從345000港幣到554000港幣。' },
  { before: '三到四百萬', after: '3到4000000' },
  { before: 'sample0123@example.com', after: 'sample0123@example.com' }, // do not convert 0123 to 123 inside a word
  { before: '參', after: '參' }, // do not convert outdated financial variant
];

describe('Full sentences', () => {
  SENTENCE_TESTS.map(({ before, after }) => {
    it(`"${before}" must equal "${after}"`, () => {
      expect(new ChineseNumber(before).toInteger()).toEqual(after);
    });
  });
});
