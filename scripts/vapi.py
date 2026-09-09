#!/usr/bin/env python3
"""Tiny Vapi admin helper (stdlib only). Reads .env from the project root.

Usage:
  scripts/vapi.py register-gemini       # store GEMINI_API_KEY in Vapi as a BYOK credential
  scripts/vapi.py upsert-assistant      # create or update the assistant from vapi/assistant.json
  scripts/vapi.py get-assistant         # print the live assistant config
  scripts/vapi.py list-calls [n]        # last n calls with analysis (default 5)
  scripts/vapi.py get-call <id>         # full call object
  scripts/vapi.py register-tools        # create/update function tools from vapi/tools.json (uses N8N_WEBHOOK_BASE), attach to assistant
  scripts/vapi.py enable-booking        # restore the real booking section in the system prompt (after tools are registered)
"""
import json, os, sys, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://api.vapi.ai"
ID_FILE = ROOT / "vapi" / "assistant.id"


def load_env():
    for line in (ROOT / ".env").read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


def req(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(
        f"{API}{path}", data=data, method=method,
        headers={"Authorization": f"Bearer {os.environ['VAPI_PRIVATE_KEY']}",
                 "Content-Type": "application/json",
                 "User-Agent": "voice-lead-agent/1.0 (curl-compatible)"})
    try:
        with urllib.request.urlopen(r) as resp:
            return json.loads(resp.read() or b"null")
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode()}", file=sys.stderr)
        sys.exit(1)


def register_gemini():
    existing = [c for c in req("GET", "/credential") if c.get("provider") == "google"]
    if existing:
        print("google credential already present:", existing[0]["id"]); return
    c = req("POST", "/credential", {"provider": "google", "apiKey": os.environ["GEMINI_API_KEY"],
                                    "name": "gemini-byok"})
    print("created google credential:", c["id"])


def upsert_assistant():
    cfg = json.loads((ROOT / "vapi" / "assistant.json").read_text())
    if ID_FILE.exists():
        aid = ID_FILE.read_text().strip()
        a = req("PATCH", f"/assistant/{aid}", cfg)
        print("updated assistant", a["id"])
    else:
        a = req("POST", "/assistant", cfg)
        ID_FILE.write_text(a["id"])
        print("created assistant", a["id"])


def get_assistant():
    print(json.dumps(req("GET", f"/assistant/{ID_FILE.read_text().strip()}"), indent=2))


def list_calls(n=5):
    calls = req("GET", f"/call?limit={n}&assistantId={ID_FILE.read_text().strip()}")
    for c in calls:
        print(f"\n== {c['id']}  {c.get('type')}  {c.get('status')}  {c.get('endedReason')}  "
              f"{c.get('startedAt','?')[:19]}  cost=${c.get('cost',0):.3f}")
        an = c.get("analysis") or {}
        print("summary:", an.get("summary"))
        print("structured:", json.dumps(an.get("structuredData")))
        print("success:", an.get("successEvaluation"))


def get_call(cid):
    print(json.dumps(req("GET", f"/call/{cid}"), indent=2))


def register_tools():
    base = os.environ.get("N8N_WEBHOOK_BASE", "").rstrip("/")
    if not base: print("N8N_WEBHOOK_BASE not set in .env"); sys.exit(1)
    tools = json.loads((ROOT / "vapi" / "tools.json").read_text().replace("__N8N_WEBHOOK_BASE__", base))
    existing = {t.get("function", {}).get("name"): t for t in req("GET", "/tool") if t.get("type") == "function"}
    ids = []
    for t in tools:
        name = t["function"]["name"]
        if name in existing:
            body = {k: v for k, v in t.items() if k != "type"}
            r = req("PATCH", f"/tool/{existing[name]['id']}", body); print("updated tool", name, r["id"])
        else:
            r = req("POST", "/tool", t); print("created tool", name, r["id"])
        ids.append(r["id"])
    aid = ID_FILE.read_text().strip()
    a = req("GET", f"/assistant/{aid}")
    model = a["model"]; model["toolIds"] = ids
    req("PATCH", f"/assistant/{aid}", {"model": model})
    print("assistant toolIds set:", ids)


def enable_booking():
    cfg_path = ROOT / "vapi" / "assistant.json"; cfg = json.loads(cfg_path.read_text())
    c = cfg["model"]["messages"][0]["content"]
    booking = (ROOT / "vapi" / "prompt-booking-section.txt").read_text()
    i, j = c.index("# Booking"), c.index("# Style rules")
    cfg["model"]["messages"][0]["content"] = c[:i] + booking + c[j:]
    cfg_path.write_text(json.dumps(cfg, indent=2, ensure_ascii=False))
    print("booking section restored in vapi/assistant.json — now run upsert-assistant")


if __name__ == "__main__":
    load_env()
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    {"register-gemini": register_gemini, "upsert-assistant": upsert_assistant,
     "get-assistant": get_assistant,
     "list-calls": lambda: list_calls(int(sys.argv[2]) if len(sys.argv) > 2 else 5),
     "get-call": lambda: get_call(sys.argv[2]),
     "register-tools": register_tools, "enable-booking": enable_booking}.get(cmd, lambda: print(__doc__))()
