/**
 * Converter for Chinese numbers like 1000萬.
 * @param {string} source - The original number string, e.g. 1000萬.
 * @returns {ChineseNumber}
 * @constructor
 */
var ChineseNumber = function (source) {
  this.source = source;
  return this;
};

/**
 * Returns the result of the conversion of Chinese number into an `Integer`.
 * @returns {number} The Chinese number converted to integer.
 */
ChineseNumber.prototype.toInteger = function () {
  var numbers = {
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
    '２': 2,

    '參': 3,
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
    '呀': '*10',
    '廿': '*20',
    '卅': '*30',
    '卌': '*40',
    '佰': '*100',
    '百': '*100',
    '皕': '*200',
    '仟': '*1000',
    '千': '*1000',
    '萬': '*10000',
    '萬': '*10000',
    '万': '*10000',
    '億': '*100000000',
    '億': '*100000000',
    '亿': '*100000000',
  };

  var result = 0;
  var pairs = [];
  var len = this.source.length;
  var str = this.source.toString();
  var currentPair = [];

  str = str.replace(/[,\s]/g, ''); // remove commas, spaces

  // If the number begins with arabic numerals, parse and remove them first.
  // Example: 83萬. This number will be multiplied by the remaining part at
  // the end of the function.
  // We're using parseFloat here instead of parseInt in order to have limited
  // support for decimals, e.g. "3.5萬"
  var leadingNumber = parseFloat(str);
  if (!isNaN(leadingNumber)) {
    str = str.replace(leadingNumber.toString(), '');
  }

  // Now parse the actual Chinese, character by character:
  for (var i = 0; i < len; i++) {
    if (numbers[str[i]] !== undefined) {
      var arabic = numbers[str[i]]; // e.g. for '三', get 3

      if (typeof (arabic) === 'number') {
        if (currentPair.length !== 0) {
          // E.g. case like 三〇〇三 instead of 三千...
          // In this case, just concatenate the string, e.g. "2" + "0" = "20"
          currentPair[0] = parseInt(currentPair[0].toString() + arabic.toString());
        } else {
          currentPair.push(arabic);
        }
      } else if (typeof (arabic) === 'string' && arabic.indexOf('*') === 0) {
        // case like '*10000'
        var action = arabic[0];

        // remove '*' and convert to number
        arabic = parseInt(arabic.replace('*', ''));

        currentPair.push(arabic);

        // accumulated two parts of a pair which will be multipled, e.g. 二 + 十
        if (currentPair.length === 2) {
          pairs.push(currentPair);
          currentPair = [];
        } else if (currentPair.length === 1) { // e.g. 十 in 十二
          currentPair.push(1);
          pairs.push(currentPair);
          currentPair = [];
        }
      }
    }
  }

  // If number ends in 1-9, e.g. 二十二, we have one number left behind - 
  // add it too and multiply by 1:
  if (currentPair.length === 1) {
    currentPair.push(1);
    pairs.push(currentPair);
  }

  // Multiply all pairs:
  pairs.forEach(function (pair) {
    result += pair[0] * pair[1];
  });

  // For cases like 83萬
  if (!isNaN(leadingNumber)) {
    if (pairs.length === 0) {
      result = leadingNumber; // otherwise multiplying by zero, e.g. "800 " => 0 * 800
    } else {
      result *= leadingNumber;
    }
  }

  return result;
}
