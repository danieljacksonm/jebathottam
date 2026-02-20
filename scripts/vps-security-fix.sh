#!/bin/bash
# Run on VPS as: sudo bash vps-security-fix.sh
# Fixes: malicious cron, high CPU from Webmin, and locks down recurrence.

set -e
echo "=== 1. Stop cron and Webmin ==="
systemctl stop cron 2>/dev/null || true
systemctl stop webmin 2>/dev/null || true
sleep 1

echo "=== 2. Kill malware processes ==="
pkill -9 -f 'apt\.log' 2>/dev/null || true
pkill -9 -f '\.bash_history' 2>/dev/null || true
pkill -9 -f '/tmp/sshd' 2>/dev/null || true
sleep 1

echo "=== 3. Remove malware files and prevent recreate ==="
chattr -i /var/tmp/apt.log 2>/dev/null || true
rm -f /var/tmp/apt.log
touch /var/tmp/apt.log && chattr +i /var/tmp/apt.log
rm -f /tmp/sshd
chattr -i /root/.bash_history 2>/dev/null || true
# Only remove if it's executable (malware). Real one is small text.
if [ -f /root/.bash_history ]; then
  if file /root/.bash_history | grep -q ELF; then
    rm -f /root/.bash_history
  fi
fi

echo "=== 4. Remove malicious cron from ALL locations ==="
# Root crontab
chattr -i /var/spool/cron/crontabs/root 2>/dev/null || true
crontab -r 2>/dev/null || true
truncate -s 0 /var/spool/cron/crontabs/root 2>/dev/null || true
chattr +i /var/spool/cron/crontabs/root 2>/dev/null || true

# System crontab
if grep -q 'apt\.log\|\.bash_history' /etc/crontab 2>/dev/null; then
  sed -i '/apt\.log\|\.bash_history/d' /etc/crontab
fi

# Cron.d
for f in /etc/cron.d/*; do
  [ -f "$f" ] && grep -q 'apt\.log\|\.bash_history' "$f" 2>/dev/null && rm -f "$f"
done

echo "=== 5. Restrict cron (only root and dani can have crontabs) ==="
echo -e "root\ndani" > /etc/cron.allow
touch /etc/cron.deny

echo "=== 6. Disable Webmin from starting (stops xhr.cgi / stats.pl CPU use) ==="
systemctl disable webmin 2>/dev/null || true

echo "=== 7. Start cron only (leave Webmin stopped) ==="
systemctl start cron

echo "=== 8. Verify ==="
echo "Root crontab:"
crontab -l 2>/dev/null || echo "(empty)"
echo "Cron.allow:"
cat /etc/cron.allow
echo ""
echo "Done. Webmin is stopped (CPU from xhr.cgi/stats.pl will stop). Cron is clean and locked. Re-run this script if cron comes back."
