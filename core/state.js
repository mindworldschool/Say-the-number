/**
 * State management for Number Recognition Trainer
 * Simplified state for the new trainer
 */

import { logger } from './logger.js';

const CONTEXT = 'State';
const STORAGE_KEY = 'number_recognition_state';

// Default state
const defaultState = {
  language: 'ua',
  route: 'settings',
  
  // Settings
  settings: {
    digits: 3,           // Разрядность: 1-9
    displayTime: 1.0,    // Время показа: 0.1-3.0 секунд
    totalExamples: 10    // Количество примеров: 5, 10, 20, 50, 100
  },
  
  // Game state
  gameState: {
    currentExample: 0,      // Текущий пример (0-based)
    correctAnswers: 0,      // Количество правильных ответов
    incorrectAnswers: 0,    // Количество неправильных ответов
    currentNumber: null,    // Текущее показываемое число
    userAnswer: null,       // Ответ пользователя
    startTime: null,        // Время начала тренировки
    endTime: null           // Время окончания тренировки
  }
};

// Current state
export let state = { ...defaultState };

/**
 * Load state from localStorage
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default to ensure all keys exist
      state = {
        ...defaultState,
        ...parsed,
        settings: { ...defaultState.settings, ...parsed.settings },
        gameState: { ...defaultState.gameState } // Don't restore game state
      };
      logger.debug(CONTEXT, 'State loaded from localStorage:', state);
    }
  } catch (error) {
    logger.error(CONTEXT, 'Failed to load state:', error);
    state = { ...defaultState };
  }
}

/**
 * Save state to localStorage
 */
function saveState() {
  try {
    // Don't save gameState - only settings and language
    const toSave = {
      language: state.language,
      route: state.route,
      settings: state.settings
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    logger.debug(CONTEXT, 'State saved to localStorage');
  } catch (error) {
    logger.error(CONTEXT, 'Failed to save state:', error);
  }
}

/**
 * Set current route
 * @param {string} route - Route name: 'settings' | 'game' | 'results'
 */
export function setRoute(route) {
  state.route = route;
  saveState();
  logger.debug(CONTEXT, `Route changed to: ${route}`);
}

/**
 * Update settings
 * @param {Object} newSettings - New settings to merge
 */
export function updateSettings(newSettings) {
  state.settings = { ...state.settings, ...newSettings };
  saveState();
  logger.debug(CONTEXT, 'Settings updated:', state.settings);
}

/**
 * Set language preference
 * @param {string} lang - Language code: 'ua' | 'en' | 'ru' | 'es'
 */
export function setLanguagePreference(lang) {
  state.language = lang;
  saveState();
  logger.debug(CONTEXT, `Language preference set to: ${lang}`);
}

/**
 * Start new game session
 */
export function startGame() {
  state.gameState = {
    currentExample: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    currentNumber: null,
    userAnswer: null,
    startTime: Date.now(),
    endTime: null
  };
  logger.info(CONTEXT, 'Game started');
}

/**
 * Set current number being displayed
 * @param {number} number - The number to display
 */
export function setCurrentNumber(number) {
  state.gameState.currentNumber = number;
  logger.debug(CONTEXT, `Current number set to: ${number}`);
}

/**
 * Record user answer
 * @param {number} answer - User's answer
 * @param {boolean} isCorrect - Whether answer is correct
 */
export function recordAnswer(answer, isCorrect) {
  state.gameState.userAnswer = answer;
  
  if (isCorrect) {
    state.gameState.correctAnswers++;
  } else {
    state.gameState.incorrectAnswers++;
  }
  
  state.gameState.currentExample++;
  
  logger.debug(CONTEXT, `Answer recorded: ${answer} (${isCorrect ? 'correct' : 'incorrect'})`);
}

/**
 * Check if game is finished
 * @returns {boolean}
 */
export function isGameFinished() {
  return state.gameState.currentExample >= state.settings.totalExamples;
}

/**
 * End game session
 */
export function endGame() {
  state.gameState.endTime = Date.now();
  logger.info(CONTEXT, 'Game ended');
}

/**
 * Get game results
 * @returns {Object}
 */
export function getGameResults() {
  const { correctAnswers, incorrectAnswers, startTime, endTime } = state.gameState;
  const total = correctAnswers + incorrectAnswers;
  const accuracy = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
  const duration = endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0;
  
  return {
    correct: correctAnswers,
    incorrect: incorrectAnswers,
    total,
    accuracy,
    duration
  };
}

/**
 * Reset state to defaults
 */
export function resetState() {
  state = { ...defaultState };
  saveState();
  logger.info(CONTEXT, 'State reset to defaults');
}

// Load state on module initialization
loadState();

// Log initial state
logger.debug(CONTEXT, 'Initial state:', state);
