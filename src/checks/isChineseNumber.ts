import { SUPPORTED_CHINESE_NUMBERS } from '../types/SupportedChineseNumber';

/**
 * Checks whether a character is a Chinese number character.
 * @param {number|string} - A single character to be checked.
 * @returns {boolean} True if it's a Chinese number character or Chinese-style
 * Arabic numbers (０-９).
 */
export function isChineseNumber(character: number | string): boolean {
  if (character === null || character === undefined || character.toString().length !== 1) {
    throw new Error('Function isChineseNumber expects exactly one character.');
  }

  return SUPPORTED_CHINESE_NUMBERS.includes(character.toString());
}