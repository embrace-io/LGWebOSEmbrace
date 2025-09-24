// Minimal webOS lifecycle and remote key handling example with Embrace integration
document.addEventListener('DOMContentLoaded', function() {
  // Test basic functionality first
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.innerHTML = 'Status: JavaScript is running!<br>🔍 Testing Embrace SDK...';
  }

  function logToScreen(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.innerHTML += '<br>' + message;
    }
    console.log(message);
  }

  // Check what's available in window object
  setTimeout(() => {
    logToScreen('🔍 Checking window.EmbraceWebSdk: ' + (typeof window.EmbraceWebSdk));
    logToScreen('🔍 Checking window.Embrace: ' + (typeof window.Embrace));
    logToScreen('🔍 Available globals: ' + Object.keys(window).filter(k => k.toLowerCase().includes('embrace')).join(', '));
  }, 1000);

(function () {

  if (window.EmbraceWebSdk) {
    try {
      window.EmbraceWebSdk.initSDK({
        appId: 'ixvsw'
      });
      logToScreen('✅ Embrace SDK initialized successfully');
      console.log('Embrace SDK initialized for WebOS', window.EmbraceWebSdk);
    } catch (error) {
      logToScreen('❌ Embrace SDK init failed: ' + error.message);
      console.error('Embrace init error:', error);
    }
  } else {
    logToScreen('❌ Embrace SDK not loaded - window.EmbraceWebSdk is ' + (typeof window.EmbraceWebSdk));
    console.warn('Embrace SDK not loaded');
  }
  const statusEl = document.getElementById('status');
  const messageEl = document.getElementById('message');

  function setStatus(text) {
    if (statusEl) statusEl.textContent = 'Status: ' + text;
  }

  function onKeyDown(e) {
    const key = e.key || e.keyCode;

    // Log key press event to Embrace
    if (window.EmbraceWebSdk) {
      try {
        window.EmbraceWebSdk.logBreadcrumb('Key pressed: ' + key);
        logToScreen('📝 Logged breadcrumb: ' + key);
      } catch (error) {
        logToScreen('❌ Breadcrumb failed: ' + error.message);
      }
    }

    switch (key) {
      case 'ArrowLeft':
      case 37:
        messageEl.textContent = 'Left';
        break;
      case 'ArrowRight':
      case 39:
        messageEl.textContent = 'Right';
        break;
      case 'Enter':
      case 13:
        messageEl.textContent = 'Enter/OK';
        // Test error logging on Enter key
        if (window.EmbraceWebSdk) {
          try {
            window.EmbraceWebSdk.logError('Test error: User pressed Enter', 'test-error');
            logToScreen('🚨 Logged error to Embrace');
          } catch (error) {
            logToScreen('❌ Error logging failed: ' + error.message);
          }
        }
        break;
      case 'Backspace':
      case 8:
        messageEl.textContent = 'Back';
        // Test throwing an actual error to see if Embrace catches it
        logToScreen('💥 Throwing test exception...');
        setTimeout(() => {
          throw new Error('WebOS test error from Backspace key');
        }, 100);
        break;
      case 'Escape':
      case 'Home':
      case 461: // Home key on LG remote
        messageEl.textContent = 'Ending session...';
        logToScreen('🔄 Ending session & sending data to Embrace');
        if (window.EmbraceWebSdk) {
          try {
            window.EmbraceWebSdk.endSession();
            logToScreen('✅ Session ended, data sent!');
          } catch (error) {
            logToScreen('❌ End session failed: ' + error.message);
          }
        }
        break;
      default:
        messageEl.textContent = 'Key pressed: ' + key;
    }
  }

  window.addEventListener('keydown', onKeyDown);

  // webOS-specific events can be handled if webOS APIs are available
  document.addEventListener('visibilitychange', () => {
    setStatus(document.hidden ? 'Hidden' : 'Visible');
  });

  // Initialization
  window.addEventListener('load', () => {
    setStatus('Ready');

    // Log app startup to Embrace
    if (window.EmbraceWebSdk) {
      window.EmbraceWebSdk.logBreadcrumb('WebOS app started successfully');
      window.EmbraceWebSdk.logInfo('App loaded in WebOS environment');
    }
  });
})();
});
