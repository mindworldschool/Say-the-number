/**
 * Game Screen
 * Main training session with number display and input
 */

import { logger } from '../core/logger.js';
import {
  startGame,
  setCurrentNumber,
  setCurrentSeries,
  recordAnswer,
  recordSeriesAnswers,
  isGameFinished,
  endGame
} from '../core/state.js';
import { Abacus } from '../components/Abacus.js';
import { generateRandomNumber, generateNumberArray } from '../utils/numberGenerator.js';
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
  let showAgainTimeout = null;

  // Series mode state
  const isSeriesMode = state.settings.seriesCount > 1;
  let currentSeries = [];
  let currentSeriesIndex = 0;
  
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
  
  // Feedback area
  const feedbackArea = document.createElement('div');
  feedbackArea.className = 'feedback';
  feedbackArea.style.display = 'none';
  
  // Кнопка выхода
  const exitBtn = document.createElement('button');
  exitBtn.className = 'btn btn--exit';
  exitBtn.textContent = t('game.exitButton');
  exitBtn.addEventListener('click', () => {
    if (phaseTimeout) clearTimeout(phaseTimeout);
    if (showAgainTimeout) clearTimeout(showAgainTimeout);
    navigate('settings');
  });
  
  gameZone.append(messageArea, abacusContainer, inputZone, feedbackArea, exitBtn);
  screen.append(statusBar, gameZone);
  container.appendChild(screen);
  
  // Initialize abacus
  abacusInstance = new Abacus(abacusContainer, state.settings.digits);
  
  // Start first round
  startRound();
  
  // === GAME LOGIC ===
  
  function startRound() {
    logger.debug(CONTEXT, `Starting round ${state.gameState.currentExample + 1}`);

    // Reset series index for new round
    currentSeriesIndex = 0;

    // Reset UI
    feedbackArea.style.display = 'none';
    feedbackArea.innerHTML = '';
    inputZone.style.display = 'none';
    inputZone.innerHTML = '';
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

    if (isSeriesMode) {
      // Series mode: generate series if this is the first number
      if (currentSeriesIndex === 0) {
        currentSeries = generateNumberArray(
          state.settings.digits,
          state.settings.seriesCount,
          state.settings.numberRanges
        );
        setCurrentSeries(currentSeries);
        logger.debug(CONTEXT, `Generated series:`, currentSeries);
      }

      // Show current number in series
      const number = currentSeries[currentSeriesIndex];
      logger.debug(CONTEXT, `Display phase - showing number ${currentSeriesIndex + 1}/${currentSeries.length}: ${number}`);

      // Show message with series progress
      messageArea.textContent = t('game.watchSeries')
        .replace('{current}', currentSeriesIndex + 1)
        .replace('{total}', currentSeries.length);
      messageArea.className = 'game-message';

      // Show abacus with number
      abacusContainer.style.display = 'flex';
      abacusInstance.setValue(number);

      // Display for configured time
      const displayTime = state.settings.displayTime * 1000;

      phaseTimeout = setTimeout(() => {
        currentSeriesIndex++;

        // If more numbers in series, show next one
        if (currentSeriesIndex < currentSeries.length) {
          // Hide abacus briefly between numbers
          abacusContainer.style.display = 'none';
          phaseTimeout = setTimeout(() => {
            runDisplayPhase();
          }, 500); // 0.5s pause between numbers
        } else {
          // Series complete, go to input phase
          runInputPhase();
        }
      }, displayTime);
    } else {
      // Single number mode (original behavior)
      const number = generateRandomNumber(state.settings.digits, state.settings.numberRanges);
      setCurrentNumber(number);

      logger.debug(CONTEXT, `Display phase - showing number: ${number}`);

      // Show message
      messageArea.textContent = t('game.watch');
      messageArea.className = 'game-message';

      // Show abacus with number
      abacusContainer.style.display = 'flex';
      abacusInstance.setValue(number);

      // Display for configured time
      const displayTime = state.settings.displayTime * 1000;

      phaseTimeout = setTimeout(() => {
        runInputPhase();
      }, displayTime);
    }
  }
  
  function runInputPhase() {
    currentPhase = PHASES.INPUT;

    logger.debug(CONTEXT, 'Input phase');

    // Hide abacus
    abacusContainer.style.display = 'none';

    // Clear input zone
    inputZone.innerHTML = '';

    if (isSeriesMode) {
      // Series mode: create multiple inputs
      messageArea.textContent = t('game.answerPromptSeries');
      messageArea.className = 'game-message';

      const inputsContainer = document.createElement('div');
      inputsContainer.className = 'series-inputs';

      for (let i = 0; i < currentSeries.length; i++) {
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'series-input-wrapper';

        const inputLabel = document.createElement('label');
        inputLabel.className = 'series-input-label';
        inputLabel.textContent = t('game.answerPlaceholderSeries').replace('{index}', i + 1);

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-group__input series-input';
        input.dataset.index = i;

        // Submit on Enter in last field
        if (i === currentSeries.length - 1) {
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          });
        } else {
          // Move to next field on Enter
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const nextInput = inputsContainer.querySelector(`input[data-index="${i + 1}"]`);
              if (nextInput) nextInput.focus();
            }
          });
        }

        inputWrapper.append(inputLabel, input);
        inputsContainer.appendChild(inputWrapper);
      }

      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn btn--primary';
      submitBtn.textContent = t('game.submitButton');
      submitBtn.addEventListener('click', handleSubmit);

      inputZone.append(inputsContainer, submitBtn);

      // Focus first input
      const firstInput = inputsContainer.querySelector('input[data-index="0"]');
      if (firstInput) firstInput.focus();
    } else {
      // Single number mode
      messageArea.textContent = t('game.answerPrompt');
      messageArea.className = 'game-message';

      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'form-group__input';
      input.placeholder = t('game.answerPlaceholder');
      input.id = 'single-input';

      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn btn--primary';
      submitBtn.textContent = t('game.submitButton');
      submitBtn.addEventListener('click', handleSubmit);

      // Submit on Enter
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      });

      inputZone.append(input, submitBtn);

      // Focus input
      input.focus();
    }

    inputZone.style.display = 'flex';
  }
  
  function handleSubmit() {
    if (currentPhase !== PHASES.INPUT) return;

    if (isSeriesMode) {
      // Series mode: collect all answers
      const inputs = inputZone.querySelectorAll('.series-input');
      const userAnswers = [];
      let hasError = false;

      // Collect and validate all inputs
      inputs.forEach((input, index) => {
        const value = input.value.trim();
        if (value === '') {
          hasError = true;
          toast.error(t('errors.emptyAnswer'));
          input.focus();
          return;
        }

        const userNumber = parseInt(value, 10);
        if (isNaN(userNumber)) {
          hasError = true;
          toast.error(t('errors.invalidAnswer'));
          input.focus();
          return;
        }

        userAnswers.push(userNumber);
      });

      if (hasError) return;

      // Check correctness of each answer
      let correctCount = 0;
      const results = userAnswers.map((answer, index) => {
        const isCorrect = answer === currentSeries[index];
        if (isCorrect) correctCount++;
        return {
          index,
          userAnswer: answer,
          correctAnswer: currentSeries[index],
          isCorrect
        };
      });

      // Record answers
      recordSeriesAnswers(userAnswers, correctCount);

      logger.info(CONTEXT, `Series answers: ${correctCount}/${currentSeries.length} correct`, results);

      // Show feedback
      runFeedbackPhaseSeries(results, correctCount);
    } else {
      // Single number mode (original behavior)
      const input = inputZone.querySelector('#single-input');
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
  }
  
  function runFeedbackPhase(isCorrect, correctNumber) {
    currentPhase = PHASES.FEEDBACK;

    // Hide input
    inputZone.style.display = 'none';

    // Show feedback
    feedbackArea.style.display = 'block';
    feedbackArea.innerHTML = '';

    // Update status bar
    updateStatusBar(statusBar, t, state);

    if (isCorrect) {
      feedbackArea.className = 'feedback feedback--correct';
      feedbackArea.textContent = t('game.correct');
      playSound('correct');
      
      // Автопереход через 2 сек
      phaseTimeout = setTimeout(() => {
        nextRoundOrFinish();
      }, 2000);
    } else {
      feedbackArea.className = 'feedback feedback--incorrect';
      
      // Текст с правильным ответом
      const feedbackText = document.createElement('div');
      feedbackText.className = 'feedback__text';
      feedbackText.innerHTML = `${t('game.incorrect')}<br>${t('game.correctWas')} <strong>${correctNumber}</strong>`;
      
      // Контейнер для кнопок
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'feedback__buttons';
      
      // Кнопка "Показать снова"
      const showAgainBtn = document.createElement('button');
      showAgainBtn.className = 'btn btn--primary btn--show-again';
      showAgainBtn.textContent = t('game.showAgainButton');
      showAgainBtn.addEventListener('click', () => {
        // Показать абакус с правильным числом
        abacusContainer.style.display = 'flex';
        abacusInstance.setValue(correctNumber);
        showAgainBtn.disabled = true;
        showAgainBtn.textContent = t('game.watching');
        
        // Скрыть через заданное время
        const displayTime = state.settings.displayTime * 1000;
        showAgainTimeout = setTimeout(() => {
          abacusContainer.style.display = 'none';
          showAgainBtn.disabled = false;
          showAgainBtn.textContent = t('game.showAgainButton');
        }, displayTime);
      });
      
      // Кнопка "Пропустить" (сразу перейти дальше)
      const skipBtn = document.createElement('button');
      skipBtn.className = 'btn btn--skip';
      skipBtn.textContent = t('game.skipButton');
      skipBtn.addEventListener('click', () => {
        if (showAgainTimeout) clearTimeout(showAgainTimeout);
        abacusContainer.style.display = 'none';
        nextRoundOrFinish();
      });
      
      buttonsContainer.append(showAgainBtn, skipBtn);
      feedbackArea.append(feedbackText, buttonsContainer);
      
      playSound('wrong');
    }
  }
  
  function runFeedbackPhaseSeries(results, correctCount) {
    currentPhase = PHASES.FEEDBACK;

    // Hide input
    inputZone.style.display = 'none';

    // Show feedback
    feedbackArea.style.display = 'block';
    feedbackArea.innerHTML = '';

    // Update status bar
    updateStatusBar(statusBar, t, state);

    const totalCount = results.length;
    const allCorrect = correctCount === totalCount;

    if (allCorrect) {
      feedbackArea.className = 'feedback feedback--correct';
      feedbackArea.textContent = t('game.correct');
      playSound('correct');

      // Auto-next after 2 seconds
      phaseTimeout = setTimeout(() => {
        nextRoundOrFinish();
      }, 2000);
    } else {
      feedbackArea.className = 'feedback feedback--incorrect';

      // Result summary
      const summaryText = document.createElement('div');
      summaryText.className = 'feedback__text';
      summaryText.textContent = t('game.seriesResult')
        .replace('{correct}', correctCount)
        .replace('{total}', totalCount);

      // Show correct answers
      const answersTitle = document.createElement('div');
      answersTitle.className = 'feedback__answers-title';
      answersTitle.textContent = t('game.correctWereSeries');

      const answersList = document.createElement('div');
      answersList.className = 'feedback__answers-list';

      results.forEach((result, index) => {
        const answerItem = document.createElement('div');
        answerItem.className = result.isCorrect
          ? 'feedback__answer-item feedback__answer-item--correct'
          : 'feedback__answer-item feedback__answer-item--incorrect';

        answerItem.innerHTML = `
          <span class="feedback__answer-number">${index + 1}.</span>
          <span class="feedback__answer-value">${result.correctAnswer}</span>
          ${!result.isCorrect ? `<span class="feedback__answer-user">(${result.userAnswer})</span>` : ''}
        `;

        answersList.appendChild(answerItem);
      });

      // Buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'feedback__buttons';

      // Skip button (go to next round)
      const skipBtn = document.createElement('button');
      skipBtn.className = 'btn btn--skip';
      skipBtn.textContent = t('game.skipButton');
      skipBtn.addEventListener('click', () => {
        if (showAgainTimeout) clearTimeout(showAgainTimeout);
        abacusContainer.style.display = 'none';
        nextRoundOrFinish();
      });

      buttonsContainer.appendChild(skipBtn);

      feedbackArea.append(summaryText, answersTitle, answersList, buttonsContainer);

      playSound('wrong');
    }
  }

  function nextRoundOrFinish() {
    // Скрыть абакус если был показан
    abacusContainer.style.display = 'none';

    if (isGameFinished()) {
      endGame();
      logger.info(CONTEXT, 'Game finished');
      navigate('results');
    } else {
      playSound('next');
      startRound();
    }
  }
  
  // Cleanup function
  return () => {
    logger.debug(CONTEXT, 'Cleaning up game screen');
    
    if (phaseTimeout) {
      clearTimeout(phaseTimeout);
    }
    
    if (showAgainTimeout) {
      clearTimeout(showAgainTimeout);
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
