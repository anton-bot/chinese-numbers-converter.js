import { SUPPORTED_CHINESE_NUMBERS } from './types/SupportedChineseNumber';

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

  private addMissingUnits(str: string): string {
    return 'TODO FIXME';
  }

  private isArabicNumber(character: string): boolean {
    return true; // TODO FIXME
  }

  private isChineseNumber(character: string): boolean {
    return true; // TODO FIXME
  }

  private isCommaOrSpace(character: string): boolean {
    return true; // TODO FIXME
  }

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
  private isNumberOrSpace(character: string): boolean {
    // Make sure `character`.length is exactly 1:
    if (character === null || character === undefined || character.length !== 1) {
      throw new Error('isNumberOrSpace() must receive exactly one character for checking.');
    }

    // Check for Arabic numbers, commas and spaces; then check if the
    // character is on the list of Chinese number characters:
    return character.match(/[0-9,.\s]/) || SUPPORTED_CHINESE_NUMBERS.includes(character)
        ? true
        : false;
  }

  private sourceStringEndsWithAfterManNumber(str: string): string | undefined {
    return; // TODO FIXME
  }
}
