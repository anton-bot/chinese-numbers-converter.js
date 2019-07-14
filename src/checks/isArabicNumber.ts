import { ARABIC_NUMBERS } from '../constants/ArabicNumbers';

/**
 * Checks whether a character is an Arabic number [0-9] and not a Chinese
 * number or another character.
 * @returns {boolean} True if character is from 0 to 9.
 */
export function isArabicNumber(character: string): boolean {
  if (character === null || character === undefined || character.toString().length !== 1) {
    throw new Error('Function isArabicNumber expects exactly one character.');
  }

  return ARABIC_NUMBERS.includes(character);
}
