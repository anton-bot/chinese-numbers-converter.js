/** Special mltipliers, starting from man (10,000) and larger. */
export const largeNumberMultipliers = [
  '萬',
  '万',
  '億',
  '亿',
];

export type LargeNumberMultiplier =
  | '萬'
  | '万'
  | '億'
  | '亿'
;

export function isLargeNumberMultiplier(character: string | LargeNumberMultiplier): character is LargeNumberMultiplier {
  return largeNumberMultipliers.includes(character);
}
