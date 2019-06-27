 /** For converting strings like 8千3萬 into 8千3百萬. */
 export const REVERSE_MULTIPLIERS = {
  '10': '十',
  '100': '百',
  '1000': '千',
  '10000': '萬',
} as const;
