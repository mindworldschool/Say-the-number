/**
 * Number Generator utility
 * Generates random numbers for the training session
 */

import { logger } from '../core/logger.js';

const CONTEXT = 'NumberGenerator';

/**
 * Generate a random number with specified settings
 * @param {number} digits - Number of digits (1-9) - used only if no special ranges are active
 * @param {Object} numberRanges - Special number ranges (if any active, standard range is ignored)
 * @returns {number} Random number
 */
export function generateRandomNumber(digits, numberRanges = {}) {
  if (digits < 1 || digits > 9) {
    logger.error(CONTEXT, `Invalid digits value: ${digits}. Must be between 1 and 9.`);
    throw new Error('Digits must be between 1 and 9');
  }

  // Collect all available number pools
  const pools = [];

  // Check if any special ranges are active
  const hasSpecialRanges = numberRanges.range10_19 || numberRanges.round10_90 || numberRanges.round100_900;

  // Only add special ranges if they are active
  if (numberRanges.range10_19) {
    pools.push({
      type: 'range10_19',
      numbers: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
    });
  }

  if (numberRanges.round10_90) {
    pools.push({
      type: 'round10_90',
      numbers: [10, 20, 30, 40, 50, 60, 70, 80, 90]
    });
  }

  if (numberRanges.round100_900) {
    pools.push({
      type: 'round100_900',
      numbers: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    });
  }

  // If no special ranges are active, use standard digit range
  if (!hasSpecialRanges) {
    pools.push({
      type: 'standard',
      numbers: getStandardRange(digits)
    });
  }

  // Select random pool
  const pool = pools[Math.floor(Math.random() * pools.length)];

  // Select random number from pool
  const number = pool.numbers[Math.floor(Math.random() * pool.numbers.length)];

  logger.debug(CONTEXT, `Generated number from ${pool.type}: ${number}`);

  return number;
}

/**
 * Get standard range of numbers for given digits
 * @param {number} digits - Number of digits
 * @returns {number[]} Array of numbers
 */
function getStandardRange(digits) {
  // Special case for single digit
  if (digits === 1) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  // For multi-digit numbers
  const min = Math.pow(10, digits - 1); // e.g., digits=3 -> 100
  const max = Math.pow(10, digits) - 1;   // e.g., digits=3 -> 999

  // Generate array of all numbers in range (might be large, so we'll use sampling)
  // For performance, we'll generate a random number directly
  const count = max - min + 1;
  const numbers = [];

  // For small ranges, generate all numbers
  if (count <= 100) {
    for (let i = min; i <= max; i++) {
      numbers.push(i);
    }
  } else {
    // For large ranges, sample 100 random numbers
    for (let i = 0; i < 100; i++) {
      numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
  }

  return numbers;
}

/**
 * Generate an array of random numbers (series)
 * @param {number} digits - Number of digits for each number
 * @param {number} count - How many numbers to generate
 * @param {Object} numberRanges - Additional number ranges to include
 * @returns {number[]} Array of random numbers
 */
export function generateNumberArray(digits, count, numberRanges = {}) {
  const numbers = [];

  for (let i = 0; i < count; i++) {
    numbers.push(generateRandomNumber(digits, numberRanges));
  }

  logger.debug(CONTEXT, `Generated series of ${count} numbers with ${digits} digits`);

  return numbers;
}

/**
 * Get min and max values for a given number of digits
 * @param {number} digits - Number of digits
 * @returns {Object} Object with min and max values
 */
export function getRange(digits) {
  if (digits === 1) {
    return { min: 0, max: 9 };
  }

  return {
    min: Math.pow(10, digits - 1),
    max: Math.pow(10, digits) - 1
  };
}

/**
 * Determine the number of digits needed for abacus based on active ranges
 * @param {number} defaultDigits - Default number of digits from settings
 * @param {Object} numberRanges - Active number ranges
 * @returns {number} Number of digits for abacus (1-9)
 */
export function getAbacusDigits(defaultDigits, numberRanges = {}) {
  // Check if any special ranges are active
  const hasSpecialRanges = numberRanges.range10_19 || numberRanges.round10_90 || numberRanges.round100_900;

  if (!hasSpecialRanges) {
    // No special ranges - use default
    return defaultDigits;
  }

  // Determine max digits needed based on active ranges
  let maxDigits = 1;

  if (numberRanges.range10_19 || numberRanges.round10_90) {
    maxDigits = Math.max(maxDigits, 2); // 10-99 need 2 digits
  }

  if (numberRanges.round100_900) {
    maxDigits = Math.max(maxDigits, 3); // 100-999 need 3 digits
  }

  return maxDigits;
}
