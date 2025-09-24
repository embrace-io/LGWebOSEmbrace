
#!/usr/bin/env bash
set -euo pipefail

# Deploy script that supports the newer `webos` CLI and falls back to ares-cli
# Usage: ./scripts/deploy.sh [device_ip]

APP_ID="com.embrace.webos.test"
VERSION="1.0.0"
IPK_NAME="${APP_ID}_${VERSION}_any.ipk"

# detect which CLI to use (webos preferred)
USE_WEBOS=false
if command -v webos >/dev/null 2>&1; then
  USE_WEBOS=true
fi

PACKAGE_CMD=""
INSTALL_CMD=""
LAUNCH_CMD=""

if [ "$USE_WEBOS" = true ]; then
  PACKAGE_CMD="webos package ."
  INSTALL_CMD_BASE="webos install"
  LAUNCH_CMD_BASE="webos launch"
else
  PACKAGE_CMD="ares-package ."
  INSTALL_CMD_BASE="ares-install"
  LAUNCH_CMD_BASE="ares-launch"
fi

DEVICE_IP="${1:-}"

echo "Packaging app..."
eval $PACKAGE_CMD

if [ ! -f "$IPK_NAME" ]; then
  IPK_NAME=$(ls *.ipk 2>/dev/null | head -n1 || true)
fi

if [ -z "$IPK_NAME" ]; then
  echo "No .ipk file found after packaging" >&2
  exit 1
fi

echo "IPK: $IPK_NAME"

if [ -z "$DEVICE_IP" ]; then
  echo "No device IP provided. Installing to default device (if configured)."
  eval "$INSTALL_CMD_BASE \"$IPK_NAME\""
else
  echo "Installing to device $DEVICE_IP"
  if [ "$USE_WEBOS" = true ]; then
    eval "$INSTALL_CMD_BASE --device $DEVICE_IP \"$IPK_NAME\""
  else
    eval "$INSTALL_CMD_BASE -d \"$DEVICE_IP\" \"$IPK_NAME\""
  fi
fi

echo "Launching app..."
if [ -z "$DEVICE_IP" ]; then
  eval "$LAUNCH_CMD_BASE \"$APP_ID\""
else
  if [ "$USE_WEBOS" = true ]; then
    eval "$LAUNCH_CMD_BASE --device $DEVICE_IP \"$APP_ID\""
  else
    eval "$LAUNCH_CMD_BASE -d \"$DEVICE_IP\" \"$APP_ID\""
  fi
fi

echo "Done."
