(function () {
  'use strict';

  const clearConsole = () => {
    try {
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

    setInterval(clearConsole, 300);
  };

  // neutralizeConsole();

  const triggerDebugger = () => {
    try {
      const debuggerFunc = function() {}.constructor("debugger");
      // debuggerFunc();
    } catch (e) {}
  };

  const startDebuggerLoop = () => {
    setInterval(() => {
      triggerDebugger();
    }, 200);
  };

  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // startDebuggerLoop();
  }

  const verifyAPIIntegrity = () => {
    const criticalAPIs = [
      { obj: window, prop: 'fetch', name: 'fetch' },
      { obj: document, prop: 'getElementById', name: 'getElementById' },
      { obj: Function.prototype, prop: 'toString', name: 'toString' }
    ];

    for (let api of criticalAPIs) {
      try {
        const funcStr = api.obj[api.prop].toString();
        if (!funcStr.includes('[native code]') && !funcStr.includes('function') && funcStr.length > 0) {
          while (true) {
            triggerDebugger();
          }
        }
      } catch (e) {
        while (true) {}
      }
    }
  };

  setInterval(verifyAPIIntegrity, 2000);

  window.SecurityShield = Object.freeze({
    triggerDebugger: triggerDebugger,
    verifyAPIIntegrity: verifyAPIIntegrity,
    active: true
  });

})();
