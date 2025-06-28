// Disable runtime error overlay
(function() {
  // Override error event listeners
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'error' || type === 'unhandledrejection') {
      // Skip adding error listeners from the runtime error plugin
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Hide any existing error overlays
  const hideOverlays = () => {
    const overlays = document.querySelectorAll('[data-testid="error-overlay"], .error-overlay, div[style*="position: fixed"][style*="z-index"]');
    overlays.forEach(overlay => {
      if (overlay.textContent && overlay.textContent.includes('plugin:runtime-error')) {
        overlay.style.display = 'none';
      }
    });
  };

  // Run immediately and on DOM changes
  hideOverlays();
  setInterval(hideOverlays, 100);

  // Override console.error to prevent triggering overlays
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Filter out runtime error plugin messages
    if (args.some(arg => typeof arg === 'string' && arg.includes('plugin:runtime-error'))) {
      return;
    }
    return originalConsoleError.apply(this, args);
  };
})();