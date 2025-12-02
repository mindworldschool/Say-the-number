/**
 * Settings Screen
 * Configuration for number recognition training
 */

import { logger } from '../core/logger.js';
import { updateSettings } from '../core/state.js';

const CONTEXT = 'SettingsScreen';

/**
 * Render settings screen
 * @param {HTMLElement} container - Container element
 * @param {Object} context - Rendering context with t, state, navigate
 * @returns {Function} Cleanup function
 */
export function renderSettings(container, context) {
  const { t, state, navigate } = context;
  
  logger.debug(CONTEXT, 'Rendering settings screen');
  
  const screen = document.createElement('div');
  screen.className = 'screen';
  
  // Header
  const header = document.createElement('div');
  header.className = 'screen__header';
  
  const title = document.createElement('h2');
  title.className = 'screen__title';
  title.textContent = t('settings.title');
  
  const description = document.createElement('p');
  description.className = 'screen__description';
  description.textContent = t('settings.description');
  
  header.append(title, description);
  
  // Content
  const content = document.createElement('div');
  content.className = 'screen__content';

  // Digits selector
  const digitsGroup = createDigitsSelector(t, state.settings.digits);

  // Display time slider
  const timeGroup = createTimeSlider(t, state.settings.displayTime);

  // Series count selector
  const seriesGroup = createSeriesCountSelector(t, state.settings.seriesCount);

  // Number ranges checkboxes
  const rangesGroup = createNumberRangesGroup(t, state.settings.numberRanges);

  // Total examples selector
  const examplesGroup = createExamplesSelector(t, state.settings.totalExamples);

  content.append(digitsGroup, timeGroup, seriesGroup, rangesGroup, examplesGroup);
  
  // Footer
  const footer = document.createElement('div');
  footer.className = 'screen__footer';
  
  const startButton = document.createElement('button');
  startButton.className = 'btn btn--primary btn--large';
  startButton.textContent = t('settings.startButton');
  startButton.addEventListener('click', handleStart);
  
  footer.appendChild(startButton);
  
  screen.append(header, content, footer);
  container.appendChild(screen);
  
  // Event handlers
  function handleStart() {
    // Get current values
    const digits = parseInt(digitsGroup.querySelector('select').value, 10);
    const displayTime = parseFloat(timeGroup.querySelector('.slider').value);
    const seriesCount = parseInt(seriesGroup.querySelector('select').value, 10);
    const totalExamples = parseInt(examplesGroup.querySelector('select').value, 10);

    // Get number ranges
    const range10_19 = rangesGroup.querySelector('input[name="range10_19"]').checked;
    const round10_90 = rangesGroup.querySelector('input[name="round10_90"]').checked;
    const round100_900 = rangesGroup.querySelector('input[name="round100_900"]').checked;

    const numberRanges = {
      range10_19,
      round10_90,
      round100_900
    };

    // Update settings
    updateSettings({ digits, displayTime, seriesCount, numberRanges, totalExamples });

    logger.info(CONTEXT, 'Starting game with settings:', {
      digits,
      displayTime,
      seriesCount,
      numberRanges,
      totalExamples
    });

    // Navigate to game
    navigate('game');
  }
  
  // Cleanup function
  return () => {
    logger.debug(CONTEXT, 'Cleaning up settings screen');
  };
}

/**
 * Create digits selector
 * @param {Function} t - Translation function
 * @param {number} currentValue - Current selected value
 * @returns {HTMLElement}
 */
function createDigitsSelector(t, currentValue) {
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const label = document.createElement('label');
  label.className = 'form-group__label';
  label.textContent = t('settings.digitsLabel');
  
  const select = document.createElement('select');
  select.className = 'form-group__select';
  
  const options = t('settings.digitsOptions');
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    if (option.value === currentValue) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
  
  group.append(label, select);
  return group;
}

/**
 * Create time slider
 * @param {Function} t - Translation function
 * @param {number} currentValue - Current value in seconds
 * @returns {HTMLElement}
 */
function createTimeSlider(t, currentValue) {
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const label = document.createElement('label');
  label.className = 'form-group__label';
  label.textContent = t('settings.timeLabel');
  
  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'slider-container';
  
  const valueDisplay = document.createElement('div');
  valueDisplay.className = 'slider-value';
  valueDisplay.textContent = `${currentValue.toFixed(1)} ${t('settings.timeUnit')}`;
  
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'slider';
  slider.min = '0.1';
  slider.max = '5.0';
  slider.step = '0.1';
  slider.value = currentValue;
  
  // Update display on change
  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    valueDisplay.textContent = `${value.toFixed(1)} ${t('settings.timeUnit')}`;
  });
  
  sliderContainer.append(valueDisplay, slider);
  group.append(label, sliderContainer);
  
  return group;
}

/**
 * Create examples selector
 * @param {Function} t - Translation function
 * @param {number} currentValue - Current selected value
 * @returns {HTMLElement}
 */
function createExamplesSelector(t, currentValue) {
  const group = document.createElement('div');
  group.className = 'form-group';

  const label = document.createElement('label');
  label.className = 'form-group__label';
  label.textContent = t('settings.totalExamplesLabel');

  const select = document.createElement('select');
  select.className = 'form-group__select';

  const options = t('settings.totalExamplesOptions');
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    if (option.value === currentValue) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  group.append(label, select);
  return group;
}

/**
 * Create series count selector
 * @param {Function} t - Translation function
 * @param {number} currentValue - Current selected value
 * @returns {HTMLElement}
 */
function createSeriesCountSelector(t, currentValue) {
  const group = document.createElement('div');
  group.className = 'form-group';

  const label = document.createElement('label');
  label.className = 'form-group__label';
  label.textContent = t('settings.seriesCountLabel');

  const select = document.createElement('select');
  select.className = 'form-group__select';

  const options = t('settings.seriesCountOptions');
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    if (option.value === currentValue) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  group.append(label, select);
  return group;
}

/**
 * Create number ranges checkboxes group
 * @param {Function} t - Translation function
 * @param {Object} currentRanges - Current selected ranges
 * @returns {HTMLElement}
 */
function createNumberRangesGroup(t, currentRanges) {
  const group = document.createElement('div');
  group.className = 'form-group';

  const label = document.createElement('label');
  label.className = 'form-group__label';
  label.textContent = t('settings.numberRangesLabel');

  const checkboxesContainer = document.createElement('div');
  checkboxesContainer.className = 'form-group__checkboxes';

  // Range 10-19
  const range10_19Wrapper = document.createElement('label');
  range10_19Wrapper.className = 'checkbox-label';

  const range10_19Input = document.createElement('input');
  range10_19Input.type = 'checkbox';
  range10_19Input.name = 'range10_19';
  range10_19Input.checked = currentRanges.range10_19;

  const range10_19Text = document.createElement('span');
  range10_19Text.textContent = t('settings.range10_19Label');

  range10_19Wrapper.append(range10_19Input, range10_19Text);

  // Round 10-90
  const round10_90Wrapper = document.createElement('label');
  round10_90Wrapper.className = 'checkbox-label';

  const round10_90Input = document.createElement('input');
  round10_90Input.type = 'checkbox';
  round10_90Input.name = 'round10_90';
  round10_90Input.checked = currentRanges.round10_90;

  const round10_90Text = document.createElement('span');
  round10_90Text.textContent = t('settings.round10_90Label');

  round10_90Wrapper.append(round10_90Input, round10_90Text);

  // Round 100-900
  const round100_900Wrapper = document.createElement('label');
  round100_900Wrapper.className = 'checkbox-label';

  const round100_900Input = document.createElement('input');
  round100_900Input.type = 'checkbox';
  round100_900Input.name = 'round100_900';
  round100_900Input.checked = currentRanges.round100_900;

  const round100_900Text = document.createElement('span');
  round100_900Text.textContent = t('settings.round100_900Label');

  round100_900Wrapper.append(round100_900Input, round100_900Text);

  checkboxesContainer.append(range10_19Wrapper, round10_90Wrapper, round100_900Wrapper);
  group.append(label, checkboxesContainer);

  return group;
}
