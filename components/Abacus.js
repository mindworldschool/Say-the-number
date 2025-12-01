/**
 * Abacus Component - Beautiful SVG graphics with dragging support
 * Structure: Each rod has 1 upper bead (Heaven = 5) and 4 lower beads (Earth = 1+1+1+1)
 * Formula: S = 5 * U + L, where U = upper (0 or 1), L = lower (0-4)
 *
 * Display-only version for number recognition training
 */

import { logger } from '../core/logger.js';

const CONTEXT = 'Abacus';

export class Abacus {
  /**
   * @param {HTMLElement} container - Container for mounting
   * @param {number} digits - Number of digits (1-9)
   */
  constructor(container, digits = 2) {
    this.container = container;
    this.digitCount = digits;
    this.columns = this.digitCount;

    // State of beads: { heaven: 'up'|'down', earth: ['up'|'down', ...] }
    this.beads = {};

    this.init();
  }

  /**
   * Initialize abacus
   */
  init() {
    // Initialize all beads to starting position
    for (let col = 0; col < this.digitCount; col++) {
      this.beads[col] = {
        heaven: 'up', // upper bead at top (inactive)
        earth: ['down', 'down', 'down', 'down'] // lower beads at bottom (inactive)
      };
    }

    this.render();
    logger.debug(CONTEXT, `Abacus created with ${this.digitCount} rods`);
  }

  /**
   * Render the abacus
   */
  render() {
    const width = this.digitCount * 72 + 40;

    this.container.innerHTML = `
      <svg id="abacus-svg" width="${width}" height="300" style="user-select: none;">
        ${this.renderDefs()}
        ${this.renderFrame()}
        ${this.renderRods()}
        ${this.renderMiddleBar()}
        ${this.renderBeads()}
      </svg>
    `;
  }

  /**
   * SVG Definitions (gradients, filters)
   */
  renderDefs() {
    return `
      <defs>
        <!-- Shadow for beads -->
        <filter id="beadShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="3" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.6"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Shadow for frame -->
        <filter id="frameShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
          <feOffset dx="0" dy="4" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Gradient for frame -->
        <linearGradient id="topFrameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#A0522D" stop-opacity="1" />
          <stop offset="50%" stop-color="#8B4513" stop-opacity="1" />
          <stop offset="100%" stop-color="#6B3410" stop-opacity="1" />
        </linearGradient>

        <!-- Gradient for metal bar -->
        <linearGradient id="metalBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#949494" stop-opacity="1" />
          <stop offset="30%" stop-color="#ababab" stop-opacity="1" />
          <stop offset="50%" stop-color="#757575" stop-opacity="1" />
          <stop offset="70%" stop-color="#8c8c8c" stop-opacity="1" />
          <stop offset="100%" stop-color="#606060" stop-opacity="1" />
        </linearGradient>

        <!-- Gradient for beads -->
        <radialGradient id="beadGradient" cx="45%" cy="40%">
          <stop offset="0%" stop-color="#ffb366" stop-opacity="1" />
          <stop offset="50%" stop-color="#ff7c00" stop-opacity="1" />
          <stop offset="100%" stop-color="#cc6300" stop-opacity="1" />
        </radialGradient>
      </defs>
    `;
  }

  /**
   * Render abacus frame
   */
  renderFrame() {
    const width = this.digitCount * 72 + 20;
    return `
      <!-- Top frame -->
      <rect x="10" y="10" width="${width}" height="30" fill="url(#topFrameGradient)" filter="url(#frameShadow)" rx="5"/>
      <rect x="15" y="13" width="${width - 10}" height="4" fill="rgba(255, 255, 255, 0.15)" rx="2"/>

      <!-- Bottom frame -->
      <rect x="10" y="264" width="${width}" height="30" fill="url(#topFrameGradient)" filter="url(#frameShadow)" rx="5"/>
      <rect x="15" y="267" width="${width - 10}" height="4" fill="rgba(255, 255, 255, 0.15)" rx="2"/>
    `;
  }

  /**
   * Render rods
   */
  renderRods() {
    let rods = '';
    for (let col = 0; col < this.digitCount; col++) {
      const x = 50 + col * 72;
      rods += `<line x1="${x}" y1="40" x2="${x}" y2="264" stroke="#654321" stroke-width="8"/>`;
    }
    return rods;
  }

  /**
   * Render middle separator bar
   */
  renderMiddleBar() {
    const width = this.digitCount * 72 + 20;
    return `
      <rect x="10" y="91" width="${width}" height="10" fill="url(#metalBarGradient)" rx="2"/>
      <rect x="15" y="92" width="${width - 10}" height="2" fill="rgba(255, 255, 255, 0.6)" rx="1"/>
      <rect x="10" y="101" width="${width}" height="2" fill="rgba(0, 0, 0, 0.3)" rx="1"/>
    `;
  }

  /**
   * Render all beads
   */
  renderBeads() {
    let beadsHTML = '';

    for (let col = 0; col < this.digitCount; col++) {
      const x = 50 + col * 72;
      const beadHeight = 36;
      const beadWidth = 32;
      const gapFromBar = 1;

      // Heaven bead (upper)
      const heavenY = this.beads[col].heaven === 'down'
        ? 91 - beadHeight/2 - gapFromBar // active (at bar)
        : 40 + beadHeight/2 + gapFromBar; // inactive (at top)

      beadsHTML += this.renderBead(x, heavenY, beadWidth, beadHeight, col, 'heaven', 0);

      // Earth beads (lower)
      const earthActive = this.beads[col].earth;
      const upCount = earthActive.filter(p => p === 'up').length;
      const downCount = 4 - upCount;

      for (let index = 0; index < 4; index++) {
        let earthY;
        if (earthActive[index] === 'up') {
          // Active bead (at bar from top)
          const activeIndex = earthActive.slice(0, index).filter(p => p === 'up').length;
          earthY = 101 + beadHeight/2 + gapFromBar + activeIndex * beadHeight;
        } else {
          // Inactive bead (at bottom)
          const inactiveIndex = earthActive.slice(0, index).filter(p => p === 'down').length;
          earthY = 264 - beadHeight/2 - gapFromBar - (downCount - 1 - inactiveIndex) * beadHeight;
        }

        beadsHTML += this.renderBead(x, earthY, beadWidth, beadHeight, col, 'earth', index);
      }
    }

    return beadsHTML;
  }

  /**
   * Render single bead
   */
  renderBead(x, y, width, height, col, type, index) {
    const hw = width;
    const hh = height / 2;
    const cutSize = 12;
    const sideRoundness = 2;

    // SVG path for bead shape (octagon with rounded corners)
    const path = `
      M ${x - cutSize} ${y - hh}
      L ${x + cutSize} ${y - hh}
      Q ${x + cutSize + 2} ${y - hh + 2} ${x + hw - sideRoundness} ${y - sideRoundness}
      Q ${x + hw} ${y} ${x + hw - sideRoundness} ${y + sideRoundness}
      Q ${x + cutSize + 2} ${y + hh - 2} ${x + cutSize} ${y + hh}
      L ${x - cutSize} ${y + hh}
      Q ${x - cutSize - 2} ${y + hh - 2} ${x - hw + sideRoundness} ${y + sideRoundness}
      Q ${x - hw} ${y} ${x - hw + sideRoundness} ${y - sideRoundness}
      Q ${x - cutSize - 2} ${y - hh + 2} ${x - cutSize} ${y - hh}
      Z
    `;

    return `
      <g class="bead" data-col="${col}" data-type="${type}" data-index="${index}">
        <path d="${path}" fill="url(#beadGradient)" filter="url(#beadShadow)"/>
        <line x1="${x - width}" y1="${y}" x2="${x + width}" y2="${y}" stroke="rgba(0, 0, 0, 0.075)" stroke-width="2"/>
      </g>
    `;
  }

  /**
   * Get value from abacus
   * @returns {number}
   */
  getValue() {
    let total = 0;
    for (let col = 0; col < this.digitCount; col++) {
      const multiplier = Math.pow(10, this.digitCount - col - 1);
      let colValue = 0;

      // Heaven bead = 5
      if (this.beads[col].heaven === 'down') {
        colValue += 5;
      }

      // Earth beads = 1 each
      this.beads[col].earth.forEach(position => {
        if (position === 'up') colValue += 1;
      });

      total += colValue * multiplier;
    }
    return total;
  }

  /**
   * Set value on abacus
   * @param {number} value - Number to display
   */
  setValue(value) {
    const digits = String(value).padStart(this.digitCount, '0').split('');

    digits.forEach((digit, index) => {
      const num = parseInt(digit, 10);

      // Decompose into 5*U + L
      if (num >= 5) {
        this.beads[index].heaven = 'down';
        const remainder = num - 5;
        this.beads[index].earth = [
          remainder >= 1 ? 'up' : 'down',
          remainder >= 2 ? 'up' : 'down',
          remainder >= 3 ? 'up' : 'down',
          remainder >= 4 ? 'up' : 'down'
        ];
      } else {
        this.beads[index].heaven = 'up';
        this.beads[index].earth = [
          num >= 1 ? 'up' : 'down',
          num >= 2 ? 'up' : 'down',
          num >= 3 ? 'up' : 'down',
          num >= 4 ? 'up' : 'down'
        ];
      }
    });

    this.render();
    logger.debug(CONTEXT, `Set value: ${value}`);
  }

  /**
   * Reset abacus (all beads to starting position)
   */
  clear() {
    for (let col = 0; col < this.digitCount; col++) {
      this.beads[col].heaven = 'up';
      this.beads[col].earth = ['down', 'down', 'down', 'down'];
    }
    this.render();
    logger.debug(CONTEXT, 'Abacus cleared');
  }

  /**
   * Destroy abacus and clean up
   */
  destroy() {
    this.container.innerHTML = '';
    logger.debug(CONTEXT, 'Abacus destroyed');
  }
}
