/**
 * Main Entry Point for Number Recognition Trainer
 * Handles routing and app initialization
 */

import { logger } from './core/logger.js';
import { initI18n, t, setLanguage, onLanguageChange, getAvailableLanguages, getCurrentLanguage } from './core/i18n.js';
import { state, setRoute, setLanguagePreference } from './core/state.js';
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
 * Смена языка из шапки общей оболочки (trainer-shell)
 */
function initLanguageSwitcher() {
  // Кнопки UA / EN / RU / ES рисует оболочка и сообщает о смене событием
  document.addEventListener('mw:langchange', (e) => {
    const code = e.detail && e.detail.lang;
    if (code) setLanguage(code);
  });

  onLanguageChange((newLang) => {
    // Synchronize state with language change
    setLanguagePreference(newLang);

    const footer = document.getElementById('appFooter');
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

    // Synchronize state with current language
    const currentLang = getCurrentLanguage();
    setLanguagePreference(currentLang);

    logger.info(CONTEXT, `Language initialized: ${currentLang}`);

    // Футер (шапку переводит оболочка)
    const footer = document.getElementById('appFooter');
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
