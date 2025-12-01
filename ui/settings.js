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
  
  // Total examples selector
  const examplesGroup = createExamplesSelector(t, state.settings.totalExamples);
  
  content.append(digitsGroup, timeGroup, examplesGroup);
  
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
    const totalExamples = parseInt(examplesGroup.querySelector('select').value, 10);
    
    // Update settings
    updateSettings({ digits, displayTime, totalExamples });
    
    logger.info(CONTEXT, 'Starting game with settings:', { digits, displayTime, totalExamples });
    
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
