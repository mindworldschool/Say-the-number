/**
 * Main Entry Point for Number Recognition Trainer
 * Handles routing and app initialization
 */

import { logger } from './core/logger.js';
import { initI18n, t, setLanguage, onLanguageChange, getAvailableLanguages } from './core/i18n.js';
import { state, setRoute } from './core/state.js';
import { renderSettings } from './ui/settings.js';
import { renderGame } from './ui/game.js';
import { renderResults } from './ui/results.js';

const CONTEXT = 'Main';

// Routes configuration
const routes = {
  settings: renderSettings,
  game: renderGame,
  results: renderResults
};

// Current cleanup function
let currentCleanup = null;

/**
 * Navigate to a route
 * @param {string} route - Route name
 */
function navigate(route) {
  if (!routes[route]) {
    logger.error(CONTEXT, `Unknown route: ${route}`);
    return;
  }

  logger.info(CONTEXT, `Navigating to: ${route}`);

  // Run cleanup for previous screen
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  // Update route in state
  setRoute(route);

  // Render new screen
  render();
}

/**
 * Render current route
 */
function render() {
  const container = document.getElementById('app');
  if (!container) {
    logger.error(CONTEXT, 'App container not found');
    return;
  }

  // Clear container
  container.innerHTML = '';

  // Get current route
  const route = state.route || 'settings';
  const renderFunction = routes[route];

  if (!renderFunction) {
    logger.error(CONTEXT, `No render function for route: ${route}`);
    return;
  }

  // Prepare context
  const context = {
    t,
    state,
    navigate
  };

  // Render and store cleanup function
  currentCleanup = renderFunction(container, context);

  logger.debug(CONTEXT, `Rendered route: ${route}`);
}

/**
 * Initialize language switcher
 */
function initLanguageSwitcher() {
  const switcher = document.getElementById('languageSwitcher');
  if (!switcher) return;

  const languages = getAvailableLanguages();

  languages.forEach(({ code, label }) => {
    const button = document.createElement('button');
    button.className = 'language-btn';
    button.textContent = label;
    button.dataset.lang = code;

    if (code === state.language) {
      button.classList.add('language-btn--active');
    }

    button.addEventListener('click', () => {
      setLanguage(code);
    });

    switcher.appendChild(button);
  });

  // Update active button on language change
  onLanguageChange((newLang) => {
    // Update buttons
    switcher.querySelectorAll('.language-btn').forEach(btn => {
      if (btn.dataset.lang === newLang) {
        btn.classList.add('language-btn--active');
      } else {
        btn.classList.remove('language-btn--active');
      }
    });

    // Update header text
    const title = document.getElementById('appTitle');
    const tagline = document.getElementById('appTagline');
    const slogan = document.getElementById('appSlogan');
    const footer = document.getElementById('appFooter');

    if (title) title.textContent = t('header.titleMain');
    if (tagline) tagline.textContent = t('header.tagline');
    if (slogan) slogan.textContent = t('header.slogan');
    if (footer) footer.textContent = t('footer');

    // Re-render current screen
    render();
  });
}

/**
 * Initialize app
 */
async function init() {
  logger.info(CONTEXT, 'Initializing Number Recognition Trainer');

  try {
    // Initialize i18n
    const lang = window.APP_LANG || 'ua';
    await initI18n(lang);

    logger.info(CONTEXT, `Language initialized: ${lang}`);

    // Update header text
    const title = document.getElementById('appTitle');
    const tagline = document.getElementById('appTagline');
    const slogan = document.getElementById('appSlogan');
    const footer = document.getElementById('appFooter');

    if (title) title.textContent = t('header.titleMain');
    if (tagline) tagline.textContent = t('header.tagline');
    if (slogan) slogan.textContent = t('header.slogan');
    if (footer) footer.textContent = t('footer');

    // Initialize language switcher
    initLanguageSwitcher();

    // Initial render
    render();

    logger.info(CONTEXT, 'App initialized successfully');
  } catch (error) {
    logger.error(CONTEXT, 'Failed to initialize app:', error);
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
