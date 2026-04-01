#!/usr/bin/env bash
# Fetch dial-in info from the ministry app (for use on the VPS bridge).
# Usage: APP_URL=https://your-site.com ./fetch-dial-in-info.sh
# Output: JSON to stdout; optionally export JITSI_ROOM and DIAL_IN_PIN for use in Asterisk/Jigasi.

set -e
APP_URL="${APP_URL:-https://your-ministry-site.com}"
API="${APP_URL%/}/api/sip/dial-in-info"

if ! command -v curl &>/dev/null; then
  echo "curl is required" >&2
  exit 1
fi

RESP=$(curl -sS -f "$API" 2>/dev/null) || { echo "Failed to fetch $API" >&2; exit 1; }
echo "$RESP"

# Optional: export for use in shell scripts / Asterisk
# Uncomment and source this file or eval the following to set env:
# JITSI_ROOM=$(echo "$RESP" | grep -o '"jitsi_room_name":"[^"]*"' | cut -d'"' -f4)
# DIAL_IN_PIN=$(echo "$RESP" | grep -o '"pin":"[^"]*"' | cut -d'"' -f4)
# export JITSI_ROOM DIAL_IN_PIN
