import { CHINESE_TO_ARABIC } from './constants/ChineseToArabic';
import { REVERSE_MULTIPLIERS } from './constants/ReverseMultipliers';
import { isSupportedChineseNumeral, SUPPORTED_CHINESE_NUMBERS } from './types/SupportedChineseNumber';
import { SINGLE_ARABIC_NUMBER_REGEX, NUMBER_IN_STRING_REGEX } from './constants/Regex';
import { largeNumberMultipliers, isLargeNumberMultiplier } from './constants/LargeNumberMultipliers';

/**
 * Converter for Chinese numbers like 1000萬.
 * @param {string} source - The original number string, e.g. 1000萬.
 * @returns {ChineseNumber}
 * @constructor
 */
export class ChineseNumber {
  sourceString: string;

  constructor(sourceString: string) { 
    this.sourceString = sourceString;
  }

  toInteger(): number {
    if ([null, undefined, ''].includes(this.sourceString)) {
      throw new Error('Empty strings cannot be converted.');
    }

    let pairs: number[][] = [];
    let str = this.sourceString.toString();
    let currentPair: number[] = [];
    let leadingNumber = NaN;
  
    // 1. If it's just a plain Arabic number was provided, return.
    // 2. If the string does not contain Chinese numbers (like "345 abc"), we
    //    don't need to do anything here:
    if (isPlainArabicNumer(str) || !hasAtLeastOneChineseNumber(str)) {
      return parseFloat(str) || 0;
    }
  
    str = str.replace(/[,\s]/g, ''); // remove commas, spaces
  
    // Convert something like 8千3萬 into 8千3百萬 (8300*10000)
    str = this.addMissingUnits(str);
  
    // Here we will try to parse the leading part before the 萬 in numbers like
    // 一百六十八萬, converting it into 168萬. The rest of the code will take care
    // of the subsequent conversion. This must also work for numbers like 168萬5.
    const maanLikeCharacterAtTheEnd = this.sourceStringEndsWithAfterManNumber(str);
    if (maanLikeCharacterAtTheEnd) {
      const maanLocation = str.lastIndexOf(maanLikeCharacterAtTheEnd);
      const stringBeforeMaan = str.substring(0, maanLocation);
      
      const convertedNumberBeforeMaan = stringBeforeMaan && stringBeforeMaan.trim()
        ? new ChineseNumber(stringBeforeMaan).toInteger()
        : 1; // for cases like 萬五
      
      str = convertedNumberBeforeMaan.toString() + str.substr(maanLocation);
  
      // If the number begins with Arabic numerals, parse and remove them first.
      // Example: 83萬. This number will be multiplied by the remaining part at
      // the end of the function.
      // We're using parseFloat here instead of parseInt in order to have limited
      // support for decimals, e.g. "3.5萬"
      leadingNumber = parseFloat(str);
      if (!Number.isNaN(leadingNumber)) {
        str = str.replace(leadingNumber.toString(), '');
      }
    }
  
    // Now parse the actual Chinese, character by character, building pairs:
    str.split('').forEach((character, i) => {
      if (character.match(SINGLE_ARABIC_NUMBER_REGEX)) { // TODO FIXME what about Chinese-style Arabic digits like １２３
        // Just a normal arabic number. Add it to the pair.
        currentPair.push(parseInt(character));
        return;
      }

      if (!isSupportedChineseNumeral(character)) {
        return;
      }
  
      const arabicOrMultiplier = CHINESE_TO_ARABIC[character]; // e.g. for '三', get 3

      if (typeof arabicOrMultiplier === 'number') {
        if (currentPair.length === 0) {
          currentPair.push(arabicOrMultiplier);
        } else {
          // E.g. case like 三〇〇三 instead of 三千...
          // In this case, just concatenate the string, e.g. "2" + "0" = "20"
          currentPair[0] = parseInt(`${currentPair[0]}${arabicOrMultiplier}`);
        }
      } else if (typeof arabicOrMultiplier === 'string' && arabicOrMultiplier.startsWith('*')) {
        // remove '*' and convert to number
        const arabic = parseInt(arabicOrMultiplier.replace('*', ''));

        currentPair.push(arabic);

        if (i === 0) {
          // This is a case like 2千萬", where the first character will be 千,
          // because "2" was cut off and stored in the leadingNumber:
          currentPair.push(1);
          pairs.push(currentPair);
          currentPair = [];
        } else {
          // We accumulated two parts of a pair which will be multiplied, e.g. 二 + 十
          if (currentPair.length === 2) {
            pairs.push(currentPair);
            currentPair = [];
          } else if (currentPair.length === 1) {
            if (isLargeNumberMultiplier(character)) {
              // For cases like '萬' in '一千萬' - multiply everything we had
              // so far (like 一千) by the current digit (like 萬).
              let currentlyAccumulatedSum = multiplyPairs(pairs);

              // The leadingNumber is for cases like 1000萬.
              if (!Number.isNaN(leadingNumber)) {
                currentlyAccumulatedSum *= leadingNumber;
                leadingNumber = NaN;
              }

              // Replace all previous pairs with the new one:
              pairs = [[currentlyAccumulatedSum, arabic]]; // e.g. [[1000, 10000]]
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
    });
  
    // If number ends in 1-9, e.g. 二十二, we have one number left behind -
    // add it too and multiply by 1:
    if (currentPair.length === 1) {
      currentPair.push(1);
      pairs.push(currentPair);
    }
  
    if (pairs.length > 0 && !Number.isNaN(leadingNumber)) {
      pairs[0][0] *= leadingNumber; // e.g. 83萬 => 83 * [10000, 1]
    }
  
    // Multiply all pairs:
    return multiplyPairs(pairs);
  }

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
  toArabicString(minimumCharactersInNumber: number = 1): string {
    if (typeof this.sourceString !== 'string') {
      return this.sourceString;
    }

    // Replace each number in the string with the tranlation. Before the
    // translation, we remove spaces from the string for number like
    // 4,000,000 and 4 000 000.
    return this.sourceString.replace(
      NUMBER_IN_STRING_REGEX,
      match =>
        match.length >= minimumCharactersInNumber
          ? new ChineseNumber(match.replace(/[,\s]/g, '')).toInteger().toString()
          : match
    );
  }

  /**
   * Converts a string like 8千3萬 into 8千3百萬 (8300*10000).
   * @param {string} str - The original string.
   * @returns {string} The converted, expanded string.
   */
  private addMissingUnits(str: string): string {
    const numbers = CHINESE_TO_ARABIC;
    const reverse = REVERSE_MULTIPLIERS;

    return str.split('').reduce((result, character, i, characters) => {
      // For the first character, we don't have a previous character yet, so
      // just skip it:
      if (i === 0) {
        result += character;
        return result;
      }

      const arabic = isNaN(Number(character)) && isSupportedChineseNumeral(character)
        ? numbers[character]
        : parseInt(character); // if it's already arabic, just use the arabic number

      const previousCharacter = characters[i - 1];
      const previousNumber = isSupportedChineseNumeral(previousCharacter)
        ? numbers[previousCharacter]
        : previousCharacter;
      const previousCharacterAsMultiplier = reverse[previousNumber.toString().replace('*', '')]
        ? previousNumber.toString().replace('*', '')
        : undefined;
      const nextCharacterArabic = (numbers[characters[i + 1]] || 0).toString().replace('*', '');

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
        const oneOrderSmaller = (parseInt(previousCharacterAsMultiplier) / 10).toString();
        const missingMultiplier = reverse[oneOrderSmaller];
        result += character + missingMultiplier;
      } else {
        result += character;
      }

      return result;
    }, '');  
  }

  /**
   * Checks whether the last number in the source string is a [萬万億亿], or
   * another number. Ignores non-number characters at the end of the string
   * such as dots, letters etc.
   * @param {string} str
   * @returns {string} The maan-like character if the last Chinese number character
   * in the string is any of the characters 萬万億亿, or null if the last
   * number in the string is Arabic or a Chinese number other than the four
   * above.
   * TODO FIXME seems the entire function can be a one-liner matching the isLargeNumberMultiplier
   */
  private sourceStringEndsWithAfterManNumber(str: string): string | undefined {
    if (!str) {
      return str;
    }
  
    // Split string into characters, reverse order:
    const characters = str.split('').reverse();
  
    for (const character of characters) {
      if (character.match(SINGLE_ARABIC_NUMBER_REGEX)) {
        // If the string ends with an Arabic number, that's a no. It definitely
        // doesn't end up with a maan-like character.
        // return; TODO FIXME why commented out
      }
  
      if (isLargeNumberMultiplier(character)) {
        // We found it - the string ends with a maan-like character:
        return character;
      }
  
      if (isSupportedChineseNumeral(character)) {
        // We found a non-maan-like character, like 九:
        // return; TODO FIXME why not returning, why commented out
      }
  
      // Otherwise keep looping
    }
  
    // Fallback case:
    return;
  }
}

/**
 * Checks if a string is just an ordinary Arabic number like "123.45".
 */
function isPlainArabicNumer(str: string): boolean {
  return parseFloat(str).toString() === str.trim();
}

function hasAtLeastOneChineseNumber(str: string): boolean {
  return str.split('').some(isSupportedChineseNumeral);
}

function multiplyPairs(pairs: number[][]): number {
  return pairs.reduce((sum, pair) => sum + pair[0] * pair[1], 0);
}