/**
 * Results Screen
 * Display training results and statistics
 */

import { logger } from '../core/logger.js';
import { getGameResults } from '../core/state.js';

const CONTEXT = 'ResultsScreen';

/**
 * Render results screen
 * @param {HTMLElement} container - Container element
 * @param {Object} context - Rendering context with t, state, navigate
 * @returns {Function} Cleanup function
 */
export function renderResults(container, context) {
  const { t, state, navigate } = context;
  
  logger.info(CONTEXT, 'Rendering results screen');
  
  // Get results
  const results = getGameResults();
  
  logger.debug(CONTEXT, 'Results:', results);
  
  const screen = document.createElement('div');
  screen.className = 'screen';
  
  // Header
  const header = document.createElement('div');
  header.className = 'screen__header';
  
  const title = document.createElement('h2');
  title.className = 'screen__title';
  title.textContent = t('results.title');
  
  const description = document.createElement('p');
  description.className = 'screen__description';
  description.textContent = getMotivationalMessage(t, results.accuracy);
  
  header.append(title, description);
  
  // Content - Results Grid
  const content = document.createElement('div');
  content.className = 'screen__content';
  
  const resultsGrid = document.createElement('div');
  resultsGrid.className = 'results-grid';
  
  // Accuracy card
  const accuracyCard = createResultCard(
    t('results.accuracy'),
    `${results.accuracy}%`,
    'primary'
  );
  
  // Correct answers card
  const correctCard = createResultCard(
    t('results.correctAnswers'),
    results.correct,
    'success'
  );
  
  // Incorrect answers card
  const incorrectCard = createResultCard(
    t('results.incorrectAnswers'),
    results.incorrect,
    'error'
  );
  
  // Duration card
  const durationCard = createResultCard(
    t('results.duration'),
    t('results.durationFormat').replace('{seconds}', results.duration),
    'primary'
  );
  
  resultsGrid.append(accuracyCard, correctCard, incorrectCard, durationCard);
  content.appendChild(resultsGrid);
  
  // Footer - Action buttons
  const footer = document.createElement('div');
  footer.className = 'screen__footer';
  
  const newSessionBtn = document.createElement('button');
  newSessionBtn.className = 'btn btn--primary';
  newSessionBtn.textContent = t('results.newSessionButton');
  newSessionBtn.addEventListener('click', () => {
    logger.info(CONTEXT, 'Starting new session');
    navigate('game');
  });
  
  const changeSettingsBtn = document.createElement('button');
  changeSettingsBtn.className = 'btn btn--secondary';
  changeSettingsBtn.textContent = t('results.changeSettingsButton');
  changeSettingsBtn.addEventListener('click', () => {
    logger.info(CONTEXT, 'Going to settings');
    navigate('settings');
  });
  
  footer.append(newSessionBtn, changeSettingsBtn);
  
  screen.append(header, content, footer);
  container.appendChild(screen);
  
  // Cleanup function
  return () => {
    logger.debug(CONTEXT, 'Cleaning up results screen');
  };
}

/**
 * Create a result card
 * @param {string} label - Card label
 * @param {string|number} value - Card value
 * @param {string} type - Card type: 'primary' | 'success' | 'error'
 * @returns {HTMLElement}
 */
function createResultCard(label, value, type = 'primary') {
  const card = document.createElement('div');
  card.className = 'result-card';
  
  const valueEl = document.createElement('div');
  valueEl.className = `result-card__value result-card__value--${type}`;
  valueEl.textContent = value;
  
  const labelEl = document.createElement('div');
  labelEl.className = 'result-card__label';
  labelEl.textContent = label;
  
  card.append(valueEl, labelEl);
  
  return card;
}

/**
 * Get motivational message based on accuracy
 * @param {Function} t - Translation function
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @returns {string}
 */
function getMotivationalMessage(t, accuracy) {
  if (accuracy >= 80) {
    return t('results.excellent');
  } else if (accuracy >= 50) {
    return t('results.good');
  } else {
    return t('results.needPractice');
  }
}
