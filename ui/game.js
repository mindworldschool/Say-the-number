/**
 * Game Screen
 * Main training session with number display and input
 */

import { logger } from '../core/logger.js';
import {
  startGame,
  setCurrentNumber,
  recordAnswer,
  isGameFinished,
  endGame
} from '../core/state.js';
import { Abacus } from '../components/Abacus.js';
import { generateRandomNumber } from '../utils/numberGenerator.js';
import { validateAnswer } from '../utils/validation.js';
import toast from '../components/Toast.js';
import { playSound } from '../utils/soundManager.js';

const CONTEXT = 'GameScreen';

// Game phases
const PHASES = {
  PREPARE: 'prepare',
  DISPLAY: 'display',
  INPUT: 'input',
  FEEDBACK: 'feedback'
};

/**
 * Render game screen
 * @param {HTMLElement} container - Container element
 * @param {Object} context - Rendering context with t, state, navigate
 * @returns {Function} Cleanup function
 */
export function renderGame(container, context) {
  const { t, state, navigate } = context;
  
  logger.info(CONTEXT, 'Starting game session');
  
  // Initialize game
  startGame();
  
  // Game state
  let currentPhase = PHASES.PREPARE;
  let abacusInstance = null;
  let phaseTimeout = null;
  
  // Create screen
  const screen = document.createElement('div');
  screen.className = 'screen';
  
  // Game status bar
  const statusBar = createStatusBar(t, state);
  
  // Game zone (main area)
  const gameZone = document.createElement('div');
  gameZone.className = 'game-zone';
  
  // Message area
  const messageArea = document.createElement('div');
  messageArea.className = 'game-message';
  
  // Abacus container
  const abacusContainer = document.createElement('div');
  abacusContainer.className = 'abacus-container';
  abacusContainer.style.display = 'none';
  
  // Input zone
  const inputZone = document.createElement('div');
  inputZone.className = 'game-input-zone';
  inputZone.style.display = 'none';
  
  const inputLabel = document.createElement('label');
  inputLabel.className = 'form-group__label';
  inputLabel.textContent = t('game.answerPrompt');
  
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'form-group__input';
  input.placeholder = t('game.answerPlaceholder');
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn--primary';
  submitBtn.textContent = t('game.submitButton');
  submitBtn.addEventListener('click', handleSubmit);
  
  inputZone.append(inputLabel, input, submitBtn);
  
  // Feedback area
  const feedbackArea = document.createElement('div');
  feedbackArea.className = 'feedback';
  feedbackArea.style.display = 'none';
  
  gameZone.append(messageArea, abacusContainer, inputZone, feedbackArea);
  screen.append(statusBar, gameZone);
  container.appendChild(screen);
  
  // Initialize abacus
  abacusInstance = new Abacus(abacusContainer, state.settings.digits);
  
  // Start first round
  startRound();
  
  // === GAME LOGIC ===
  
  function startRound() {
    logger.debug(CONTEXT, `Starting round ${state.gameState.currentExample + 1}`);
    
    // Reset UI
    input.value = '';
    feedbackArea.style.display = 'none';
    inputZone.style.display = 'none';
    abacusContainer.style.display = 'none';
    
    // Start with prepare phase
    runPreparePhase();
  }
  
  function runPreparePhase() {
    currentPhase = PHASES.PREPARE;
    messageArea.textContent = t('game.prepare');
    messageArea.className = 'game-message game-message--prepare';

    logger.debug(CONTEXT, 'Prepare phase');

    // Play tick sound
    playSound('tick');

    // Wait 2 seconds before display
    phaseTimeout = setTimeout(() => {
      runDisplayPhase();
    }, 2000);
  }
  
  function runDisplayPhase() {
    currentPhase = PHASES.DISPLAY;
    
    // Generate random number
    const number = generateRandomNumber(state.settings.digits);
    setCurrentNumber(number);
    
    logger.debug(CONTEXT, `Display phase - showing number: ${number}`);
    
    // Show message
    messageArea.textContent = t('game.watch');
    messageArea.className = 'game-message';
    
    // Show abacus with number
    abacusContainer.style.display = 'flex';
    abacusInstance.setValue(number);
    
    // Display for configured time
    const displayTime = state.settings.displayTime * 1000; // Convert to ms
    
    phaseTimeout = setTimeout(() => {
      runInputPhase();
    }, displayTime);
  }
  
  function runInputPhase() {
    currentPhase = PHASES.INPUT;
    
    logger.debug(CONTEXT, 'Input phase');
    
    // Hide abacus
    abacusContainer.style.display = 'none';
    
    // Show input
    messageArea.textContent = t('game.answerPrompt');
    messageArea.className = 'game-message';
    inputZone.style.display = 'block';
    
    // Focus input
    input.focus();
  }
  
  function handleSubmit() {
    if (currentPhase !== PHASES.INPUT) return;
    
    const userInput = input.value.trim();
    const correctNumber = state.gameState.currentNumber;
    
    // Validate answer
    const validation = validateAnswer(userInput, correctNumber);
    
    if (!validation.isValid) {
      // Show error
      const errorKey = validation.error === 'empty' ? 'errors.emptyAnswer' : 'errors.invalidAnswer';
      toast.error(t(errorKey));
      return;
    }
    
    // Record answer
    recordAnswer(validation.userNumber, validation.isCorrect);
    
    logger.info(CONTEXT, `Answer: ${validation.userNumber}, Correct: ${correctNumber}, Result: ${validation.isCorrect}`);
    
    // Show feedback
    runFeedbackPhase(validation.isCorrect, correctNumber);
  }
  
  function runFeedbackPhase(isCorrect, correctNumber) {
    currentPhase = PHASES.FEEDBACK;

    // Hide input
    inputZone.style.display = 'none';

    // Show feedback
    feedbackArea.style.display = 'block';

    if (isCorrect) {
      feedbackArea.className = 'feedback feedback--correct';
      feedbackArea.textContent = t('game.correct');
      // Play correct sound
      playSound('correct');
    } else {
      feedbackArea.className = 'feedback feedback--incorrect';
      feedbackArea.innerHTML = `
        ${t('game.incorrect')}<br>
        ${t('game.correctWas')} <strong>${correctNumber}</strong>
      `;
      // Play wrong sound
      playSound('wrong');
    }

    // Update status bar
    updateStatusBar(statusBar, t, state);

    // Wait 2 seconds before next round
    phaseTimeout = setTimeout(() => {
      // Check if game is finished
      if (isGameFinished()) {
        endGame();
        logger.info(CONTEXT, 'Game finished');
        navigate('results');
      } else {
        // Play next sound before starting new round
        playSound('next');
        startRound();
      }
    }, 2000);
  }
  
  // Cleanup function
  return () => {
    logger.debug(CONTEXT, 'Cleaning up game screen');
    
    if (phaseTimeout) {
      clearTimeout(phaseTimeout);
    }
    
    if (abacusInstance) {
      abacusInstance.destroy();
    }
  };
}

/**
 * Create status bar with progress and score
 * @param {Function} t - Translation function
 * @param {Object} state - Application state
 * @returns {HTMLElement}
 */
function createStatusBar(t, state) {
  const bar = document.createElement('div');
  bar.className = 'game-status';
  
  // Progress
  const progressItem = document.createElement('div');
  progressItem.className = 'game-status__item';
  
  const progressLabel = document.createElement('div');
  progressLabel.className = 'game-status__label';
  progressLabel.textContent = t('game.score');
  
  const progressValue = document.createElement('div');
  progressValue.className = 'game-status__value';
  progressValue.textContent = t('game.progress')
    .replace('{current}', state.gameState.currentExample + 1)
    .replace('{total}', state.settings.totalExamples);
  
  progressItem.append(progressLabel, progressValue);
  
  // Correct answers
  const correctItem = document.createElement('div');
  correctItem.className = 'game-status__item';
  
  const correctLabel = document.createElement('div');
  correctLabel.className = 'game-status__label';
  correctLabel.textContent = t('game.correctCount');
  
  const correctValue = document.createElement('div');
  correctValue.className = 'game-status__value game-status__value--success';
  correctValue.textContent = state.gameState.correctAnswers;
  
  correctItem.append(correctLabel, correctValue);
  
  // Incorrect answers
  const incorrectItem = document.createElement('div');
  incorrectItem.className = 'game-status__item';
  
  const incorrectLabel = document.createElement('div');
  incorrectLabel.className = 'game-status__label';
  incorrectLabel.textContent = t('game.incorrectCount');
  
  const incorrectValue = document.createElement('div');
  incorrectValue.className = 'game-status__value game-status__value--error';
  incorrectValue.textContent = state.gameState.incorrectAnswers;
  
  incorrectItem.append(incorrectLabel, incorrectValue);
  
  bar.append(progressItem, correctItem, incorrectItem);
  
  return bar;
}

/**
 * Update status bar values
 * @param {HTMLElement} bar - Status bar element
 * @param {Function} t - Translation function
 * @param {Object} state - Application state
 */
function updateStatusBar(bar, t, state) {
  const values = bar.querySelectorAll('.game-status__value');
  
  // Update progress
  values[0].textContent = t('game.progress')
    .replace('{current}', state.gameState.currentExample + 1)
    .replace('{total}', state.settings.totalExamples);
  
  // Update correct count
  values[1].textContent = state.gameState.correctAnswers;
  
  // Update incorrect count
  values[2].textContent = state.gameState.incorrectAnswers;
}
