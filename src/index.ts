import { CHINESE_TO_ARABIC } from './constants/ChineseToArabic';
import { REVERSE_MULTIPLIERS } from './constants/ReverseMultipliers';

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
    return 0; // TODO FIXME
  }

  toArabicString(): string {
    return 'TODO FIXME';
  }

  /**
   * Converts a string like 8千3萬 into 8千3百萬 (8300*10000).
   * @param {string} str - The original string.
   * @returns {string} The converted, expanded string.
   */
  private addMissingUnits(str: string): string {
    const characters = str.split('');
    let result = '';
    const numbers = CHINESE_TO_ARABIC;
    const reverse = REVERSE_MULTIPLIERS;
  
    characters.forEach(function (character, i) {
      // For the first character, we don't have a previous character yet, so
      // just skip it:
      if (i === 0) {
        result += character;
        return;
      }

      const arabic = isNaN(Number(character))
        ? numbers[character]
        : parseInt(character); // if it's already arabic, just use the arabic number
      const previousNumber: string | number = numbers[characters[i - 1]] || characters[i - 1];
      const previousCharacterAsMultiplier: string | undefined = reverse[previousNumber.toString().replace('*', '')]
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
    });
  
    return result;
  }

  private sourceStringEndsWithAfterManNumber(str: string): string | undefined {
    return; // TODO FIXME
  }
}
