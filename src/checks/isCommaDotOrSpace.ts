/**
 * Checks whether the character is a comma or space, i.e. a character that
 * can occur within a number (1,000,000) but is not a number itself.
 * @returns {boolean} True if the character is a comma or space.
 */
export function isCommaDotOrSpace(character: string): boolean {
  if (character === null || character === undefined || character.toString().length !== 1) {
    throw new Error('Function isCommaDotOrSpace expects exactly one character.');
  }

  // Non-digit characters that occur within a contiguous number, e.g. 6,000:
  const CHARACTERS_WITHIN_NUMBER = ',. ';

  return CHARACTERS_WITHIN_NUMBER.includes(character);
}