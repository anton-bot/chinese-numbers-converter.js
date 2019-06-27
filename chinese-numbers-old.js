const SINGLE_ARABIC_NUMBER_REGEX = /\d/;

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

/** Chinese number characters and their Arabic equivalent. */
ChineseNumber.numbers = {
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
ChineseNumber.characters = Object.keys(ChineseNumber.numbers);
ChineseNumber.characterList = ChineseNumber.characters.join('');
ChineseNumber.afterManMultipliers = ['萬', '万', '億', '亿'];

/** 
 *  Matches Chinee numbers, Arabic numbers, and numbers that have no more than one space, dot or comma inside, like 3.45萬.
 *  It also ignores leading zeroes at the start of the number - see simplified demo here: https://regex101.com/r/7bPFy4/1
 */
ChineseNumber.NUMBER_IN_STRING_REGEX = new RegExp('(?![0]+)(?:(?:\\d+(?:[.,\\s]\\d+)*)*)(?:[\\d' + ChineseNumber.characterList + ']+)', 'g');

/** For converting strings like 8千3萬 into 8千3百萬. */
ChineseNumber.reverseMultipliers = {
  '10': '十',
  '100': '百',
  '1000': '千',
  '10000': '萬',
};

/**
 * Returns the result of the conversion of Chinese number into an `Integer`.
 * @returns {number} The Chinese number converted to integer.
 */
ChineseNumber.prototype.toInteger = function () {
  var result = 0;
  var pairs = [];
  var str = this.source.toString();
  var currentPair = [];

  if (str === null || str === undefined || str === '') {
    throw new Error('Empty strings cannot be converted.');
  }

  // Just a plain Arabic number was provided. Don't do any complicated stuff.
  if (parseFloat(str).toString() === str.trim()) {
    return parseFloat(str) || 0;
  }

  // If the string does not contain Chinese numbers (like "345 abc"), we don't
  // have any business here:
  let atLeastOneChineseNumber = false;
  for (let character of str.split('')) {
    if (ChineseNumber.characters.includes(character)) {
      atLeastOneChineseNumber = true;
      break;
    }
  }
  if (!atLeastOneChineseNumber) {
    return parseFloat(str) || 0;
  }

  str = str.replace(/[,\s]/g, ''); // remove commas, spaces

  // Convert something like 8千3萬 into 8千3百萬 (8300*10000)
  str = this.addMissingUnits(str);

  // Here we will try to parse the leading part before the 萬 in numbers like
  // 一百六十八萬, converting it into 168萬. The rest of the code will take care
  // of the subsequent conversion. This must also work for numbers like 168萬5.
  let maanLikeCharacterAtTheEnd = this.sourceStringEndsWithAfterManNumber(str);
  if (maanLikeCharacterAtTheEnd) {
    let maanLocation = str.lastIndexOf(maanLikeCharacterAtTheEnd);
    let stringBeforeMaan = str.substring(0, maanLocation);
    
    let convertedNumberBeforeMaan;
    if (stringBeforeMaan && stringBeforeMaan.trim()) {
      convertedNumberBeforeMaan = new ChineseNumber(stringBeforeMaan).toInteger();
    } else {
      convertedNumberBeforeMaan = 1; // for cases like 萬五
    }
    
    str = convertedNumberBeforeMaan.toString() + str.substr(maanLocation);

    // If the number begins with Arabic numerals, parse and remove them first.
    // Example: 83萬. This number will be multiplied by the remaining part at
    // the end of the function.
    // We're using parseFloat here instead of parseInt in order to have limited
    // support for decimals, e.g. "3.5萬"
    var leadingNumber = parseFloat(str);
    if (!isNaN(leadingNumber)) {
      str = str.replace(leadingNumber.toString(), '');
    }
  }

  // Now parse the actual Chinese, character by character:
  var len = str.length;
  for (var i = 0; i < len; i++) {
    if (str[i].match(SINGLE_ARABIC_NUMBER_REGEX)) {
      // Just a normal arabic number. Add it to the pair.
      currentPair.push(parseInt(str[i]));
    }

    if (ChineseNumber.numbers[str[i]] !== undefined) {
      var arabic = ChineseNumber.numbers[str[i]]; // e.g. for '三', get 3

      if (typeof (arabic) === 'number') {
        if (currentPair.length !== 0) {
          // E.g. case like 三〇〇三 instead of 三千...
          // In this case, just concatenate the string, e.g. "2" + "0" = "20"
          currentPair[0] = parseInt(currentPair[0].toString() + arabic.toString());
        } else {
          currentPair.push(arabic);
        }
      } else if (typeof (arabic) === 'string' && arabic.startsWith('*')) {
        // case like '*10000'
        var action = arabic[0];

        // remove '*' and convert to number
        arabic = parseInt(arabic.replace('*', ''));

        currentPair.push(arabic);

        if (i === 0 && action === '*') {
          // This is a case like 2千萬", where the first character will be 千,
          // because "2" was cut off and stored in the leadingNumber:
          currentPair.push(1);
          pairs.push(currentPair);
          currentPair = [];
        } else {
          // accumulated two parts of a pair which will be multiplied, e.g. 二 + 十
          if (currentPair.length === 2) {
            pairs.push(currentPair);
            currentPair = [];
          } else if (currentPair.length === 1) {
            if (ChineseNumber.afterManMultipliers.indexOf(str[i]) !== -1) {
              // For cases like '萬' in '一千萬' - multiply everything we had
              // so far (like 一千) by the current digit (like 萬).
              var numbersSoFar = 0;

              pairs.forEach(function (pair) {
                numbersSoFar += pair[0] * pair[1];
              });

              // The leadingNumber is for cases like 1000萬.
              if (!isNaN(leadingNumber)) {
                numbersSoFar *= leadingNumber;
                leadingNumber = NaN;
              }

              // Replace all previous pairs with the new one:
              pairs = [[numbersSoFar, arabic]]; // e.g. [[1000, 10000]]
              currentPair = [];
            } else {
              // For cases like 十 in 十二:
              currentPair.push(1);
              pairs.push(currentPair);
              currentPair = [];
            }
          }
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

  if (pairs.length > 0 && !isNaN(leadingNumber)) {
    pairs[0][0] *= leadingNumber; // e.g. 83萬 => 83 * [10000, 1]
  }

  // Multiply all pairs:
  pairs.forEach(function (pair) {
    result += pair[0] * pair[1];
  });

  // For cases like 83萬
  /*
  if (!isNaN(leadingNumber)) {
    if (pairs.length === 0) {
      // later note: cases like "800 " should be already handled early in the code
      result = leadingNumber; // otherwise multiplying by zero, e.g. "800 " => 0 * 800
    } else {
      result *= leadingNumber;
    }
  }
  */

  return result;
};

/**
 * Checks whether the character is part of a number (either a number itself, or
 * a space/comma), or a part of unrelated text.
 * @param {string} character - A string containing only one character to be
 *    checked.
 * @returns {boolean} True if the `character` is a Chinese or Arabic number
 *    or a character like "comma" and "space", which should not delimit two
 *    numbers; rather, they mean that the number may continue. E.g. "6,000" or
 *    "6 000".
 */
ChineseNumber.isNumberOrSpace = function (character) {
  // Make sure `character`.length is exactly 1:
  if (character === null || character === undefined || character.length !== 1) {
    throw new Error('isNumberOrSpace() must receive exactly one character for checking.');
  }

  // Check for Arabic numbers, commas and spaces:
  if (character.match(/[0-9,.\s]/)) {
    return true;
  }

  // Check if the character is on the list of Chinese number characters:
  if (ChineseNumber.characters.indexOf(character) === -1) {
    return false;
  } else {
    return true;
  }
};

/**
 * Checks whether a character is a Chinese number character.
 * @param {number|string} A single character to be checked.
 * @returns {boolean} True if it's a Chinese number character or Chinese-style
 * Arabic numbers (０-９).
 */
ChineseNumber.isChineseNumber = function (character) {
  if (character === null || character === undefined || character.toString().length !== 1) {
    throw new Error('Function isChineseNumber expects exactly one character.');
  }

  return ChineseNumber.characters.indexOf(character) !== -1;
};

/**
 * Checks whether a character is an Arabic number [0-9] and not a Chinese
 * number or another character.
 * @returns {boolean} True if character is from 0 to 9.
 */
ChineseNumber.isArabicNumber = function (character) {
  if (character === null || character === undefined || character.toString().length !== 1) {
    throw new Error('Function isArabicNumber expects exactly one character.');
  }

  var arabicNumbers = '0123456789０１２３４５６７８９';
  return arabicNumbers.indexOf(character) !== -1; // true if found
};

/**
 * Checks whether the character is a comma or space, i.e. a character that
 * can occur within a number (1,000,000) but is not a number itself.
 * @returns {boolean} True if the character is a comma or space.
 */
ChineseNumber.isCommaOrSpace = function (character) {
  if (character === null || character === undefined || character.toString().length !== 1) {
    throw new Error('Function isCommaOrSpace expects exactly one character.');
  }

  var charactersWithinNumber = ',. ';

  return charactersWithinNumber.indexOf(character) !== -1;
};

/**
 * Converts multiple Chinese numbers in a string into Arabic numbers, and
 * returns the translated string containing the original text but with Arabic
 * numbers only.
 * @param {number} [minimumCharactersInNumber] - Optionally, how many
 *    characters minimum must be in a number to be converted. Sometimes a
 *    good setting would be 2, because otherwise we will convert geographic
 *    names like 九龍站 into 9龍站.
 * @returns {string} The translated string with Arabic numbers only.
 */
ChineseNumber.prototype.toArabicString = function (minimumCharactersInNumber) {
  minimumCharactersInNumber = minimumCharactersInNumber || 1;

  if (typeof this.source !== 'string') {
    return this.source;
  } else {
    // Replace each number in the string with the tranlation. Before the
    // translation, we remove spaces from the string for number like
    // 4,000,000 and 4 000 000.
    return this.source.replace(
      ChineseNumber.NUMBER_IN_STRING_REGEX,
      match => {
        if (match.length >= minimumCharactersInNumber) {
          return new ChineseNumber(match.replace(/[,\s]/g, '')).toInteger();
        } else {
          return match;
        }
      });
  }
};

/**
 * Converts a string like 8千3萬 into 8千3百萬 (8300*10000).
 * @param {string} str - The original string.
 * @returns {string} The converted, expanded string.
 */
ChineseNumber.prototype.addMissingUnits = function (str) {
  var characters = str.split('');
  var result = '';
  var numbers = ChineseNumber.numbers;
  var reverse = ChineseNumber.reverseMultipliers;

  characters.forEach(function (character, i) {
    if (i === 0) {
      // For the first character, we don't have a previous character yet, so
      // just skip it:
      result += character;
    } else {
      var arabic = isNaN(character) ? numbers[character] : parseInt(character); // if it's already arabic, just use the arabic number
      var previousNumber = numbers[characters[i - 1]] || characters[i - 1];
      var previousCharacterAsMultiplier = reverse[previousNumber.toString().replace('*', '')] ? previousNumber.toString().replace('*', '') : undefined;
      var nextCharacterArabic = (numbers[characters[i + 1]] || 0).toString().replace('*', '');

      if (
        // not a multiplier like '*100':
        typeof arabic === 'number' &&

        // in the 1-9 range:
        arabic > 0 && arabic < 10 &&

        // previous character is 10, 100, 1000 or 10000:
        previousCharacterAsMultiplier !== undefined &&

        // e.g. 1000 < 10000 for 8千3萬, or it's the last character in string:
        (parseInt(previousCharacterAsMultiplier) < parseInt(nextCharacterArabic) || characters[i + 1] === undefined) &&

        // For numbers like 十五, there are no other units to be appended at the end
        previousCharacterAsMultiplier !== '10'
      ) {
        // E.g. for 8千3, add 百:
        var oneOrderSmaller = (parseInt(previousCharacterAsMultiplier) / 10).toString();
        var missingMultiplier = reverse[oneOrderSmaller];
        result += character + missingMultiplier;
      } else {
        result += character;
      }
    }
  });

  return result;
};

/**
 * Checks whether the last number in the source string is a [萬万億亿], or
 * another number. Ignores non-number characters at the end of the string
 * such as dots, letters etc.
 * @param {string} str
 * @returns {string} The maan-like character if the last Chinese number character
 * in the string is any of the characters 萬万億亿, or null if the last
 * number in the string is Arabic or a Chinese number other than the four
 * above.
 */
ChineseNumber.prototype.sourceStringEndsWithAfterManNumber = function (str) {
  if (!str) {
    return str;
  }

  // Split string into characters, reverse order:
  let characters = str.split('').reverse();

  for (let character of characters) {
    if (character.match(SINGLE_ARABIC_NUMBER_REGEX)) {
      // If the string ends with an Arabic number, that's a no. It definitely
      // doesn't end up with a maan-like character.
      // return null;
    }

    if (ChineseNumber.afterManMultipliers.includes(character)) {
      // We found it - the string ends with a maan-like character:
      return character;
    }

    if (ChineseNumber.characters.includes(character)) {
      // We found a non-maan-like character, like 九:
      // return null;
    }

    // Otherwise keep looping
  }

  // Fallback case:
  return null;
}

module.exports = ChineseNumber;