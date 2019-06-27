import { CHARACTER_LIST } from '../types/SupportedChineseNumber';

/** 
 * Matches Chinese numbers, Arabic numbers, and numbers that have no more than
 * one space, dot or comma inside, like 3.45萬. It also ignores leading zeroes
 * at the start of the number - see simplified demo here: https://regex101.com/r/7bPFy4/1
 */
export const NUMBER_IN_STRING_REGEX: RegExp = new RegExp(
  '(?![0]+)(?:(?:\\d+(?:[.,\\s]\\d+)*)*)(?:[\\d' + CHARACTER_LIST + ']+)', 'g'
);

export const SINGLE_ARABIC_NUMBER_REGEX = /\d/;
