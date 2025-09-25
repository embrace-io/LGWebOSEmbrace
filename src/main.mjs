// Minimal webOS lifecycle and remote key handling example with Embrace integration
import "https://cdn.jsdelivr.net/npm/@embrace-io/web-sdk@2.2";

const { initSDK, log, session } = EmbraceWebSdk;

const statusEl = document.getElementById("status");
const messageEl = document.getElementById("message");

if (statusEl) {
  statusEl.innerHTML =
    "Status: JavaScript is running!<br>🔍 Testing Embrace SDK...";
}

log.message("WebOS app started successfully", "info");

function logToScreen(message) {
  statusEl.innerHTML += "<br>" + message;
  console.log(message);
}

// Test basic functionality first
try {
  initSDK({
    appID: "ixvsw",
  });

  logToScreen("✅ Embrace SDK initialized successfully");
} catch (error) {
  logToScreen("❌ Embrace SDK init failed: " + error.message);
  console.error("Embrace init error:", error);
}

function setStatus(text) {
  statusEl.textContent = "Status: " + text;
}

function onKeyDown(e) {
  const key = e.key || e.keyCode;

  // Log key press event to Embrace
  try {
    log.message("Key pressed: " + key, "info");
    logToScreen("📝 Logged breadcrumb: " + key);
  } catch (error) {
    logToScreen("❌ Breadcrumb failed: " + error.message);
  }

  switch (key) {
    case "ArrowLeft":
    case 37:
      messageEl.textContent = "Left";
      break;
    case "ArrowRight":
    case 39:
      messageEl.textContent = "Right";
      break;
    case "Enter":
    case 13:
      messageEl.textContent = "Enter/OK";
      // Test error logging on Enter key
      log.message("Test error: User pressed Enter", "error");
      break;
    case "Backspace":
    case 8:
      messageEl.textContent = "Back";
      // Test throwing an actual error to see if Embrace catches it
      logToScreen("💥 Throwing test exception...");
      setTimeout(() => {
        throw new Error("WebOS test error from Backspace key");
      });
      break;
    case "Escape":
    case "Home":
    case 461: // Home key on LG remote
      messageEl.textContent = "Ending session...";

      const sessionSpan = session.getSessionSpan();
      if (sessionSpan) {
        // Log session end
        logToScreen("🔄 Ending session & sending data to Embrace");
        session.endSessionSpan();
        logToScreen("✅ Session ended, data sent!");
      } else {
        logToScreen("No active session");
      }

      break;
    default:
      messageEl.textContent = "Key pressed: " + key;
  }
}

window.addEventListener("keydown", onKeyDown);

// webOS-specific events can be handled if webOS APIs are available
document.addEventListener("visibilitychange", () => {
  setStatus(document.hidden ? "Hidden" : "Visible");
});

// Log app startup to Embrace
log.message("App loaded in WebOS environment", "info");
