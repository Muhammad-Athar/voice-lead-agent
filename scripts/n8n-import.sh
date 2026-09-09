#!/usr/bin/env bash
# Import workflows/*.json into the local n8n, substituting __PLACEHOLDERS__ from .env.
# Usage: scripts/n8n-import.sh [workflow-file ...]   (default: all in workflows/)
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; source .env; set +a
N8N=~/n8n-app/node_modules/.bin/n8n
TMP=$(mktemp -d)
files=("$@"); [ ${#files[@]} -eq 0 ] && files=(workflows/*.json)
for f in "${files[@]}"; do
  out="$TMP/$(basename "$f")"
  sed -e "s#__SLACK_WEBHOOK_URL__#${SLACK_WEBHOOK_URL:-}#g" \
      -e "s#__SALES_EMAIL__#${SALES_EMAIL:-}#g" \
      -e "s#__SHEET_ID__#${SHEET_ID:-}#g" \
      -e "s#__SALES_CALENDAR_ID__#${SALES_CALENDAR_ID:-primary}#g" \
      -e "s#__HUBSPOT_CRED_ID__#${HUBSPOT_CRED_ID:-}#g" \
      -e "s#__GCAL_CRED_ID__#${GCAL_CRED_ID:-}#g" \
      "$f" > "$out"
  "$N8N" import:workflow --input="$out" >/dev/null && echo "imported $(basename "$f")"
done
rm -rf "$TMP"
