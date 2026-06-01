/**
 * Maximum Secure Static Site - Bootstrap Security Shield
 * 
 * This script is executed IMMEDIATELY in the <head> of the document
 * to configure runtime shields before any DOM elements or regular scripts load.
 * 
 * Note: During build, this will be heavily obfuscated with self-defending mechanisms,
 * string array transformations, and nested control flow flattening.
 */

(function () {
  'use strict';

  // Global Prototype freezing is bypassed to prevent standard JS engine TypeError crashes.
  // Standard shields remain fully active.

  // 2. Destructive Console Override (Neutralize developer tools inspection)
  const clearConsole = () => {
    try {
      // Clear console buffer aggressively
      window.console.clear();
    } catch (e) {}
  };

  const neutralizeConsole = () => {
    const dummy = function () {};
    const methods = ['log', 'info', 'warn', 'error', 'dir', 'table', 'trace', 'group', 'groupCollapsed', 'groupEnd'];
    
    if (!window.console) {
      window.console = {};
    }
    
    methods.forEach(method => {
      try {
        Object.defineProperty(window.console, method, {
          value: dummy,
          writable: false,
          configurable: false
        });
      } catch (e) {
        window.console[method] = dummy;
      }
    });

    // Run high frequency console cleaner
    setInterval(clearConsole, 300);
  };

  neutralizeConsole();

  // 3. Active Debugger Loop (Halt debugger execution if DevTools is opened)
  const triggerDebugger = () => {
    try {
      // Dynamic constructor call bypasses static code scanners
      const debuggerFunc = function() {}.constructor("debugger");
      debuggerFunc();
    } catch (e) {}
  };

  const startDebuggerLoop = () => {
    // Run debugger statements at varying high frequencies to trigger immediate freezing
    setInterval(() => {
      triggerDebugger();
    }, 200);
  };

  // Only activate debugger loop if not in local development mode or if forced
  // The obfuscator build script will force-inject additional debugger blocks for production!
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    startDebuggerLoop();
  }

  // 4. Prototype Anti-Tampering Check
  // Check if standard APIs have been replaced/monkey-patched (e.g. by Selenium, Puppeteer, or user scripts)
  const verifyAPIIntegrity = () => {
    const criticalAPIs = [
      { obj: window, prop: 'fetch', name: 'fetch' },
      { obj: document, prop: 'getElementById', name: 'getElementById' },
      { obj: Function.prototype, prop: 'toString', name: 'toString' }
    ];

    for (let api of criticalAPIs) {
      try {
        const funcStr = api.obj[api.prop].toString();
        // Native functions must have "[native code]" in their string representation
        if (!funcStr.includes('[native code]') && !funcStr.includes('function') && funcStr.length > 0) {
          // Tampering detected! Induce loop to crash the environment.
          while (true) {
            triggerDebugger();
          }
        }
      } catch (e) {
        // If toString fails or is blocked, treat it as potential tampering
        while (true) {}
      }
    }
  };

  // Run integrity checks frequently
  setInterval(verifyAPIIntegrity, 2000);

  // Expose a namespace locked down with Object.freeze
  window.SecurityShield = Object.freeze({
    triggerDebugger: triggerDebugger,
    verifyAPIIntegrity: verifyAPIIntegrity,
    active: true
  });

})();
