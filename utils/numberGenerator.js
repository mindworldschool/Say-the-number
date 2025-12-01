/**
 * Number Generator utility
 * Generates random numbers for the training session
 */

import { logger } from '../core/logger.js';

const CONTEXT = 'NumberGenerator';

/**
 * Generate a random number with specified number of digits
 * @param {number} digits - Number of digits (1-9)
 * @returns {number} Random number
 * 
 * Examples:
 * - digits=1: returns 0-9
 * - digits=2: returns 10-99
 * - digits=3: returns 100-999
 */
export function generateRandomNumber(digits) {
  if (digits < 1 || digits > 9) {
    logger.error(CONTEXT, `Invalid digits value: ${digits}. Must be between 1 and 9.`);
    throw new Error('Digits must be between 1 and 9');
  }

  // Special case for single digit
  if (digits === 1) {
    return Math.floor(Math.random() * 10); // 0-9
  }

  // For multi-digit numbers
  const min = Math.pow(10, digits - 1); // e.g., digits=3 -> 100
  const max = Math.pow(10, digits) - 1;   // e.g., digits=3 -> 999

  const number = Math.floor(Math.random() * (max - min + 1)) + min;
  
  logger.debug(CONTEXT, `Generated ${digits}-digit number: ${number}`);
  
  return number;
}

/**
 * Generate an array of random numbers
 * @param {number} digits - Number of digits for each number
 * @param {number} count - How many numbers to generate
 * @returns {number[]} Array of random numbers
 */
export function generateNumberArray(digits, count) {
  const numbers = [];
  
  for (let i = 0; i < count; i++) {
    numbers.push(generateRandomNumber(digits));
  }
  
  logger.debug(CONTEXT, `Generated array of ${count} numbers with ${digits} digits`);
  
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
