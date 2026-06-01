/**
 * Maximum Secure Static Site - Client Keyboard/Mouse Shield
 * 
 * Intercepts user inputs, hotkeys, and mouse clicks to block F12, Right-Click,
 * and page source viewing, while disabling visual markers of element hierarchies.
 */

export function initShield() {
  'use strict';

  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, true);

  // 2. Intercept and Block Keyboard Inspection Combinations
  document.addEventListener('keydown', (e) => {
    // Check modifier states
    const ctrlOrMeta = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey;

    // F12 key (Code 123)
    if (e.keyCode === 123 || e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Cmd+Option+I (Inspect element)
    // Key codes: 'I' = 73
    if (ctrlOrMeta && shift && (e.keyCode === 73 || e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+J / Cmd+Option+J (Console panel)
    // Key codes: 'J' = 74
    if (ctrlOrMeta && shift && (e.keyCode === 74 || e.key === 'j' || e.key === 'J')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+C / Cmd+Option+C (Select element pointer)
    // Key codes: 'C' = 67
    if (ctrlOrMeta && shift && (e.keyCode === 67 || e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U / Cmd+Option+U (View Source)
    // Key codes: 'U' = 85
    if (ctrlOrMeta && (e.keyCode === 85 || e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page As)
    // Key codes: 'S' = 83
    if (ctrlOrMeta && (e.keyCode === 83 || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+P / Cmd+P (Print Page)
    // Key codes: 'P' = 80
    if (ctrlOrMeta && (e.keyCode === 80 || e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Alt+Cmd+I (macOS Chrome Inspector bypass shield)
    if (alt && ctrlOrMeta && (e.keyCode === 73 || e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // 3. Block Dragging and Dropping (Prevents dragging elements off-screen to analyze them)
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, true);

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    return false;
  }, true);

  // 4. Actively detect browser window resize (Often indicates console docking)
  let lastWidth = window.outerWidth;
  let lastHeight = window.outerHeight;
  
  const detectConsoleDocking = () => {
    const threshold = 160; // Max acceptable difference that isn't a DevTools dock
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    // Check if the difference between outer and inner is large, indicating console panel is open
    if ((widthDiff > threshold || heightDiff > threshold) && 
        (window.outerWidth !== lastWidth || window.outerHeight !== lastHeight)) {
      // DevTools docked detected! Trigger infinite debugger loop.
      if (window.SecurityShield && window.SecurityShield.triggerDebugger) {
        window.SecurityShield.triggerDebugger();
      }
    }
    
    lastWidth = window.outerWidth;
    lastHeight = window.outerHeight;
  };

  window.addEventListener('resize', detectConsoleDocking);
}
