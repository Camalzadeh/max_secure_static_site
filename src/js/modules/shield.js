export function initShield() {
  'use strict';

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, true);

  document.addEventListener('keydown', (e) => {
    const ctrlOrMeta = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey;

    if (e.keyCode === 123 || e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (ctrlOrMeta && shift && (e.keyCode === 73 || e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (ctrlOrMeta && shift && (e.keyCode === 74 || e.key === 'j' || e.key === 'J')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (ctrlOrMeta && shift && (e.keyCode === 67 || e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (ctrlOrMeta && (e.keyCode === 85 || e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (ctrlOrMeta && (e.keyCode === 83 || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (ctrlOrMeta && (e.keyCode === 80 || e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (alt && ctrlOrMeta && (e.keyCode === 73 || e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, true);

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    return false;
  }, true);

  let lastWidth = window.outerWidth;
  let lastHeight = window.outerHeight;
  
  const detectConsoleDocking = () => {
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    if ((widthDiff > threshold || heightDiff > threshold) && 
        (window.outerWidth !== lastWidth || window.outerHeight !== lastHeight)) {
      if (window.SecurityShield && window.SecurityShield.triggerDebugger) {
        window.SecurityShield.triggerDebugger();
      }
    }
    
    lastWidth = window.outerWidth;
    lastHeight = window.outerHeight;
  };

  window.addEventListener('resize', detectConsoleDocking);
}
