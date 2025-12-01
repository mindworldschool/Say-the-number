/**
 * Abacus Component - Display only (no interaction)
 * Shows numbers on abacus for recognition training
 */

import { logger } from '../core/logger.js';

const CONTEXT = 'Abacus';

export class Abacus {
  /**
   * @param {HTMLElement} container - Container for mounting
   * @param {number} digits - Number of digits (1-9)
   */
  constructor(container, digits = 1) {
    this.container = container;
    this.digits = digits;
    this.columns = digits + 1; // Always one more column than digits
    
    // State of each column: { upper: 0|1, lower: 0-4 }
    this.state = Array.from({ length: this.columns }, () => ({
      upper: 0, // 0 = bottom (inactive), 1 = top (active)
      lower: 0  // 0-4 beads from bottom are active
    }));
    
    this.render();
    logger.debug(CONTEXT, `Abacus created with ${this.columns} columns (${this.digits} digits)`);
  }
  
  /**
   * Set number to display on abacus
   * @param {number} number - Number to display
   */
  setValue(number) {
    if (number < 0) {
      logger.warn(CONTEXT, 'Negative numbers not supported');
      return;
    }
    
    // Convert number to string and pad with zeros
    const numStr = String(number).padStart(this.columns, '0');
    
    // Set each column from right to left
    for (let i = 0; i < this.columns; i++) {
      const digit = parseInt(numStr[numStr.length - this.columns + i], 10);
      this.setColumnValue(i, digit);
    }
    
    logger.debug(CONTEXT, `Set value: ${number}`);
  }
  
  /**
   * Set value for a specific column
   * @param {number} colIndex - Column index (0 = leftmost)
   * @param {number} value - Value 0-9
   */
  setColumnValue(colIndex, value) {
    if (value < 0 || value > 9) {
      logger.error(CONTEXT, `Invalid column value: ${value}`);
      return;
    }
    
    // Calculate upper and lower bead positions
    // Formula: value = upper * 5 + lower
    const upper = value >= 5 ? 1 : 0;
    const lower = value % 5;
    
    this.state[colIndex] = { upper, lower };
    this.updateColumn(colIndex);
  }
  
  /**
   * Update visual representation of a column
   * @param {number} colIndex - Column index
   */
  updateColumn(colIndex) {
    const column = this.container.children[colIndex];
    if (!column) return;
    
    const { upper, lower } = this.state[colIndex];
    
    // Update upper bead
    const upperBead = column.querySelector('.abacus__bead--upper');
    if (upperBead) {
      if (upper === 1) {
        upperBead.classList.add('abacus__bead--active');
        upperBead.style.top = '75px'; // Move down (active)
      } else {
        upperBead.classList.remove('abacus__bead--active');
        upperBead.style.top = '10px'; // Move up (inactive)
      }
    }
    
    // Update lower beads
    const lowerBeads = column.querySelectorAll('.abacus__bead--lower');
    lowerBeads.forEach((bead, idx) => {
      if (idx < lower) {
        // Active beads - move up
        bead.classList.add('abacus__bead--active');
        bead.style.bottom = `${120 - idx * 25}px`;
      } else {
        // Inactive beads - move down
        bead.classList.remove('abacus__bead--active');
        bead.style.bottom = `${10 + (3 - idx) * 25}px`;
      }
    });
  }
  
  /**
   * Clear abacus (set all to 0)
   */
  clear() {
    for (let i = 0; i < this.columns; i++) {
      this.setColumnValue(i, 0);
    }
    logger.debug(CONTEXT, 'Abacus cleared');
  }
  
  /**
   * Render the abacus
   */
  render() {
    this.container.innerHTML = '';
    this.container.className = 'abacus';
    
    // Create columns
    for (let colIndex = 0; colIndex < this.columns; colIndex++) {
      const column = this.createColumn(colIndex);
      this.container.appendChild(column);
    }
    
    logger.debug(CONTEXT, 'Abacus rendered');
  }
  
  /**
   * Create a single column
   * @param {number} colIndex - Column index
   * @returns {HTMLElement}
   */
  createColumn(colIndex) {
    const col = document.createElement('div');
    col.className = 'abacus__column';
    col.dataset.column = colIndex;
    
    // Create rod
    const rod = document.createElement('div');
    rod.className = 'abacus__rod';
    
    // Create divider
    const divider = document.createElement('div');
    divider.className = 'abacus__divider';
    rod.appendChild(divider);
    
    // Create upper bead (Heaven - represents 5)
    const upperBead = document.createElement('div');
    upperBead.className = 'abacus__bead abacus__bead--upper';
    upperBead.style.top = '10px';
    rod.appendChild(upperBead);
    
    // Create lower beads (Earth - each represents 1)
    for (let i = 0; i < 4; i++) {
      const lowerBead = document.createElement('div');
      lowerBead.className = 'abacus__bead abacus__bead--lower';
      lowerBead.style.bottom = `${10 + (3 - i) * 25}px`;
      rod.appendChild(lowerBead);
    }
    
    col.appendChild(rod);
    return col;
  }
  
  /**
   * Destroy the abacus and clean up
   */
  destroy() {
    this.container.innerHTML = '';
    logger.debug(CONTEXT, 'Abacus destroyed');
  }
}
