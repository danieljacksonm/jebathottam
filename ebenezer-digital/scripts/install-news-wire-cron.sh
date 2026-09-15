#!/usr/bin/env bash
# Install / refresh Ebenezer news wire cron (every 10 minutes).
# Run on VPS: sudo bash ~/ebenezer-digital/scripts/install-news-wire-cron.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/home/dani/ebenezer-digital}"
USER_NAME="${CRON_USER:-dani}"
FILE="/etc/cron.d/ebenezer-news-wire"

cat >"$FILE" <<EOF
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# Pull RSS wire every 10 minutes — keeps desk current like a news channel
*/10 * * * * ${USER_NAME} SECRET=\$(grep "^CRON_SECRET=" ${APP_DIR}/.env | cut -d= -f2- | tr -d "\\r"); /usr/bin/curl -fsS -X POST -H "Host: news.ebenezerdigital.info" -H "Authorization: Bearer \$SECRET" http://127.0.0.1:3000/api/cron/news-wire >> /tmp/news-wire-cron.log 2>&1
EOF

chmod 644 "$FILE"
echo "Installed $FILE"
cat "$FILE"
