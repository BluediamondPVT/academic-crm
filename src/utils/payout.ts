/**
 * Parses a payout string or number into a numeric percentage.
 * Examples:
 *   "60%" -> 60
 *   "60 %" -> 60
 *   "60" -> 60
 *   "60% per admission" -> 60
 *   "10% per admission, Flat $500" -> 10
 *   "Flat 500" -> 0
 */
export const parsePayoutPercentage = (payout?: string | number | null): number => {
  if (payout === undefined || payout === null) return 0;
  if (typeof payout === 'number') {
    return isNaN(payout) ? 0 : payout;
  }
  const str = String(payout).trim();
  if (!str) return 0;

  // Match pattern like 60% or 60.5%
  const percentMatch = str.match(/(\d+(\.\d+)?)\s*%/);
  if (percentMatch) {
    return parseFloat(percentMatch[1]);
  }

  // Pure number between 0 and 100
  const pureNumMatch = str.match(/^(\d+(\.\d+)?)$/);
  if (pureNumMatch) {
    const val = parseFloat(pureNumMatch[1]);
    if (val >= 0 && val <= 100) return val;
  }

  // XX percent
  const wordMatch = str.match(/(\d+(\.\d+)?)\s*percent/i);
  if (wordMatch) {
    return parseFloat(wordMatch[1]);
  }

  // Match any number <= 100
  const anyNumMatch = str.match(/(\d+(\.\d+)?)/);
  if (anyNumMatch) {
    const val = parseFloat(anyNumMatch[1]);
    if (val > 0 && val <= 100) return val;
  }

  return 0;
};

/**
 * Calculates our cut based on course totalFee and university/course payout percentage.
 */
export const calculateOurCut = (
  totalFee: number,
  universityPayout?: string | number | null,
  coursePayoutPercentage?: number | null
): { ourCut: number; percentage: number } => {
  const percentage = (typeof coursePayoutPercentage === 'number' && coursePayoutPercentage > 0)
    ? coursePayoutPercentage
    : parsePayoutPercentage(universityPayout);

  const fee = Number(totalFee) || 0;
  const ourCut = percentage > 0 ? Math.round((fee * percentage) / 100) : 0;

  return { ourCut, percentage };
};
