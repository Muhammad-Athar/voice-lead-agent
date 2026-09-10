#!/usr/bin/env bash
# Push workflows/*.json to the Oracle n8n (placeholders substituted from .env), then restart n8n so activations reload.
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; source .env; set +a
SSH="ssh -i $HOME/.ssh/oracle_n8n -o ConnectTimeout=15 ubuntu@152.67.183.135"
TMP=$(mktemp -d)
for f in workflows/*.json; do
  sed -e "s#__SLACK_WEBHOOK_URL__#${SLACK_WEBHOOK_URL:-}#g" -e "s#__SALES_EMAIL__#${SALES_EMAIL:-}#g" -e "s#__SHEET_ID__#${SHEET_ID:-}#g" \
      -e "s#__SALES_CALENDAR_ID__#${SALES_CALENDAR_ID:-primary}#g" -e "s#__HUBSPOT_CRED_ID__#${HUBSPOT_CRED_ID:-}#g" -e "s#__GCAL_CRED_ID__#${GCAL_CRED_ID:-}#g" "$f" > "$TMP/$(basename "$f")"
done
scp -q -i "$HOME/.ssh/oracle_n8n" "$TMP"/*.json ubuntu@152.67.183.135:/tmp/
$SSH 'cd ~/n8n && for f in /tmp/voice-lead-*.json; do sudo docker compose cp "$f" n8n:/tmp/; sudo docker compose exec -T n8n n8n import:workflow --input=/tmp/$(basename $f) >/dev/null && echo "imported $(basename $f)"; done
  for id in VoiceLeadPost001 VoiceLeadTool001; do sudo docker compose exec -T n8n n8n update:workflow --id=$id --active=true >/dev/null 2>&1; done
  sudo docker compose restart n8n >/dev/null 2>&1 && echo "n8n restarted"'
rm -rf "$TMP"
