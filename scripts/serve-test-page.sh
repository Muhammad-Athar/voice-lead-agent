#!/usr/bin/env bash
# Renders test/web-call.html with the public key + assistant id from .env / vapi/assistant.id
# and serves it on http://localhost:8787 (Ctrl-C to stop).
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; source .env; set +a
OUT=/tmp/voice-lead-agent-test; mkdir -p "$OUT"
sed -e "s/__PUBLIC_KEY__/$VAPI_PUBLIC_KEY/g" -e "s/__ASSISTANT_ID__/$(cat vapi/assistant.id)/g" test/web-call.html > "$OUT/index.html"
echo "→ open http://localhost:8787  (assistant $(cat vapi/assistant.id))"
python3 -m http.server 8787 --bind 127.0.0.1 --directory "$OUT"
