/**
 * Validation utility
 * Validates user answers and input
 */

import { logger } from '../core/logger.js';

const CONTEXT = 'Validation';

/**
 * Validate user answer against correct number
 * @param {string|number} userInput - User's input
 * @param {number} correctNumber - Correct number
 * @returns {Object} Validation result with isValid and isCorrect flags
 */
export function validateAnswer(userInput, correctNumber) {
  // Check if input is empty
  if (userInput === null || userInput === undefined || userInput === '') {
    logger.debug(CONTEXT, 'Empty input detected');
    return {
      isValid: false,
      isCorrect: false,
      error: 'empty',
      userNumber: null
    };
  }

  // Convert to string and trim
  const input = String(userInput).trim();

  // Check if input is a valid number
  if (!/^-?\d+$/.test(input)) {
    logger.debug(CONTEXT, 'Invalid number format:', input);
    return {
      isValid: false,
      isCorrect: false,
      error: 'invalid',
      userNumber: null
    };
  }

  // Convert to number
  const userNumber = parseInt(input, 10);

  // Check if conversion was successful
  if (isNaN(userNumber)) {
    logger.debug(CONTEXT, 'Failed to parse number:', input);
    return {
      isValid: false,
      isCorrect: false,
      error: 'invalid',
      userNumber: null
    };
  }

  // Check if answer is correct
  const isCorrect = userNumber === correctNumber;

  logger.debug(CONTEXT, `Answer validation: user=${userNumber}, correct=${correctNumber}, isCorrect=${isCorrect}`);

  return {
    isValid: true,
    isCorrect,
    error: null,
    userNumber
  };
}

/**
 * Sanitize user input for number field
 * @param {string} input - Raw input string
 * @returns {string} Sanitized input (only digits and minus sign)
 */
export function sanitizeNumberInput(input) {
  if (!input) return '';
  
  // Allow only digits and minus sign at the beginning
  let sanitized = input.replace(/[^\d-]/g, '');
  
  // Allow minus only at the beginning
  if (sanitized.includes('-')) {
    const minusCount = (sanitized.match(/-/g) || []).length;
    if (minusCount > 1 || sanitized.indexOf('-') !== 0) {
      sanitized = sanitized.replace(/-/g, '');
    }
  }
  
  return sanitized;
}

/**
 * Format number for display (add thousands separators)
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(number) {
  if (number === null || number === undefined) return '';
  return number.toLocaleString();
}

/**
 * Check if input is within valid range for given digits
 * @param {number} number - Number to check
 * @param {number} digits - Number of digits
 * @returns {boolean} True if number is in valid range
 */
export function isInRange(number, digits) {
  if (digits === 1) {
    return number >= 0 && number <= 9;
  }
  
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  
  return number >= min && number <= max;
}
