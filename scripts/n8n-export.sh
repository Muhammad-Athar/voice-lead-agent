#!/usr/bin/env bash
# Export the project's workflows from local n8n back into workflows/, scrubbing secrets to __PLACEHOLDERS__.
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; source .env; set +a
N8N=~/n8n-app/node_modules/.bin/n8n
declare -A IDS=( [VoiceLeadPost001]=voice-lead-post-call.json [VoiceLeadTool001]=voice-lead-calendar-tools.json )
for id in "${!IDS[@]}"; do
  f="workflows/${IDS[$id]}"
  "$N8N" export:workflow --id="$id" --output="$f.tmp" >/dev/null 2>&1 || { echo "skip $id (not in n8n)"; continue; }
  python3 - "$f.tmp" "$f" <<'EOF'
import json,sys,os
d=json.load(open(sys.argv[1])); w=d[0] if isinstance(d,list) else d
s=json.dumps(w,indent=2,ensure_ascii=False)
for k,ph in [("SLACK_WEBHOOK_URL","__SLACK_WEBHOOK_URL__"),("SALES_EMAIL","__SALES_EMAIL__"),("SHEET_ID","__SHEET_ID__"),("HUBSPOT_CRED_ID","__HUBSPOT_CRED_ID__"),("GCAL_CRED_ID","__GCAL_CRED_ID__")]:
    v=os.environ.get(k,"")
    if v: s=s.replace(v,ph)
open(sys.argv[2],"w").write(s+"\n"); os.remove(sys.argv[1]); print("exported",sys.argv[2])
EOF
done
