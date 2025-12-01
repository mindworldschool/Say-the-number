/**
 * Sound Manager
 * Handles audio playback for the application
 */

import { logger } from '../core/logger.js';

const CONTEXT = 'SoundManager';

// Sound effects paths
const SOUNDS = {
  tick: './assets/sfx_tick.mp3',
  correct: './assets/sfx_correct.mp3',
  wrong: './assets/sfx_wrong.mp3',
  next: './assets/sfx_next.mp3',
  fanfare: './assets/sfx_fanfare.mp3',
  timeout: './assets/sfx_timeout.mp3'
};

// Preloaded audio objects
const audioCache = {};

// Settings
let enabled = true;
let volume = 0.7;

/**
 * Preload all sounds
 */
export function preloadSounds() {
  Object.entries(SOUNDS).forEach(([key, path]) => {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = volume;
      audioCache[key] = audio;
      logger.debug(CONTEXT, `Preloaded sound: ${key}`);
    } catch (error) {
      logger.error(CONTEXT, `Failed to preload sound ${key}:`, error);
    }
  });
}

/**
 * Play a sound effect
 * @param {string} soundName - Name of the sound to play
 * @param {Object} options - Playback options
 * @param {number} options.volume - Volume override (0.0-1.0)
 * @param {boolean} options.loop - Whether to loop the sound
 * @returns {Promise<void>}
 */
export async function playSound(soundName, options = {}) {
  if (!enabled) {
    logger.debug(CONTEXT, 'Sound is disabled');
    return;
  }

  if (!SOUNDS[soundName]) {
    logger.warn(CONTEXT, `Unknown sound: ${soundName}`);
    return;
  }

  try {
    // Get or create audio object
    let audio = audioCache[soundName];

    if (!audio) {
      audio = new Audio(SOUNDS[soundName]);
      audioCache[soundName] = audio;
    }

    // Reset audio to start
    audio.currentTime = 0;

    // Apply options
    audio.volume = options.volume !== undefined ? options.volume : volume;
    audio.loop = options.loop || false;

    // Play sound
    await audio.play();
    logger.debug(CONTEXT, `Playing sound: ${soundName}`);
  } catch (error) {
    logger.error(CONTEXT, `Failed to play sound ${soundName}:`, error);
  }
}

/**
 * Stop a currently playing sound
 * @param {string} soundName - Name of the sound to stop
 */
export function stopSound(soundName) {
  const audio = audioCache[soundName];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    logger.debug(CONTEXT, `Stopped sound: ${soundName}`);
  }
}

/**
 * Stop all currently playing sounds
 */
export function stopAllSounds() {
  Object.entries(audioCache).forEach(([key, audio]) => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  logger.debug(CONTEXT, 'Stopped all sounds');
}

/**
 * Enable or disable sound
 * @param {boolean} state - Whether sound should be enabled
 */
export function setSoundEnabled(state) {
  enabled = state;
  logger.info(CONTEXT, `Sound ${enabled ? 'enabled' : 'disabled'}`);

  if (!enabled) {
    stopAllSounds();
  }
}

/**
 * Set global volume
 * @param {number} vol - Volume level (0.0-1.0)
 */
export function setVolume(vol) {
  volume = Math.max(0, Math.min(1, vol));

  // Update all cached audio objects
  Object.values(audioCache).forEach(audio => {
    if (audio) {
      audio.volume = volume;
    }
  });

  logger.debug(CONTEXT, `Volume set to: ${volume}`);
}

/**
 * Get current sound enabled state
 * @returns {boolean}
 */
export function isSoundEnabled() {
  return enabled;
}

/**
 * Get current volume
 * @returns {number}
 */
export function getVolume() {
  return volume;
}

// Preload sounds on module load
preloadSounds();
