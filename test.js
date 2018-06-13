const should = require('should');
const ChineseNumber = require('./chinese-numbers');

(async () => {
  // To allow to connect the Chrome debugger:
  await new Promise(resolve => setTimeout(resolve, 5000));

  await runTests();
  await runSentenceTests();
})();

async function runTests() {
  const TESTS = [
    { before: '345', after: 345 },
    { before: '345 abc', after: 345 },
    { before: '一', after: 1 },
    { before: '兩百四十五', after: 245 },
    { before: '二十二', after: 22 },
    { before: '二萬五', after: 25000 },
    { before: '二萬二', after: 22000 },
    { before: '8千3', after: 8300 },
    { before: '345 萬', after: 3450000 },
    { before: '345萬', after: 3450000 },
    { before: '3.5萬', after: 35000 },
    { before: '3萬5', after: 35000 },
    { before: '五萬', after: 50000 },
    { before: ' 二〇一二年', after: 2012 },
    { before: '***貳佰零伍元***', after: 205 },
    { before: '1000 and one', after: 1000 },
    { before: 'haha no numbers here', after: 0 },
    { before: '九龍', after: 9 },
    { before: '2千萬', after: 20000000 },
    { before: '2千萬五', after: 20005000 },
    { before: '一千萬', after: 10000000 },
    { before: '1000萬', after: 10000000 },
    { before: '8千4百萬', after: 84000000 },
    { before: '8千3萬', after: 83000000 },
    { before: '萬五', after: 15000 },
    { before: '一百六十八萬', after: 1680000 },
    { before: '一百六十八萬五', after: 1685000 },
    { before: '一百六十八萬五', after: 1685000 },
    { before: '一百六十八萬六千', after: 1686000 },
    { before: '一百六十八萬五千兩百四十五', after: 1685245 },
    { before: '3.1323445124421445642', after: 3.1323445124421445642 },
    // { before: '2億5', after: 250000000 }, // fail, 200000005
  ];

  for (let test of TESTS) {
    console.log(`Testing if ${test.before}=${test.after}...`);
    new ChineseNumber(test.before).toInteger().should.equal(test.after);
  }

  console.log('All single number tests successful.');
}

async function runSentenceTests() {
  const TESTS = [
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
  ];

  for (let test of TESTS) {
    console.log(`Testing if ${test.before}=${test.after}...`);
    new ChineseNumber(test.before).toArabicString().should.equal(test.after);
  }

  console.log('All sentence tests successful.');
}
