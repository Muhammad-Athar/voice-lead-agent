#!/usr/bin/env python3
"""Per-node status of the latest n8n execution for a workflow.

Usage: scripts/n8n-last-exec.py [WORKFLOW_ID] [--db PATH] [--verbose]
  default WORKFLOW_ID = VoiceLeadPost001, default db = ~/.n8n/database.sqlite
"""
import sqlite3, json, sys, zlib, os

args = [a for a in sys.argv[1:] if not a.startswith("--")]
wf = args[0] if args else "VoiceLeadPost001"
db = sys.argv[sys.argv.index("--db") + 1] if "--db" in sys.argv else os.path.expanduser("~/.n8n/database.sqlite")
verbose = "--verbose" in sys.argv

con = sqlite3.connect(db)
row = con.execute("select id,status,startedAt,stoppedAt from execution_entity where workflowId=? order by id desc limit 1", (wf,)).fetchone()
if not row: print("no executions"); sys.exit(0)
print(f"execution {row[0]} status={row[1]} {row[2]} -> {row[3]}")
raw = con.execute("select data from execution_data where executionId=?", (row[0],)).fetchone()[0]
try: data = json.loads(raw)
except Exception: data = json.loads(zlib.decompress(raw))

def unflat(arr):
    """n8n 'flatted' format: root is arr[0]; inside dicts/lists every value is an index string into arr."""
    def build(v):
        if isinstance(v, dict): return {k: build(arr[int(x)]) if isinstance(x, str) and x.isdigit() else build(x) for k, x in v.items()}
        if isinstance(v, list): return [build(arr[int(x)]) if isinstance(x, str) and x.isdigit() else build(x) for x in v]
        return v
    return build(arr[0])

d = unflat(data) if isinstance(data, list) else data
for node, runs in d.get("resultData", {}).get("runData", {}).items():
    r = runs[0]; err = r.get("error"); out = (r.get("data") or {}).get("main", [[]])[0] or []
    item_err = next((i.get("json", {}).get("error") for i in out if isinstance(i.get("json"), dict) and i["json"].get("error")), None)
    status = ("ERROR " + str(err.get("message"))[:200]) if err else ("ITEM-ERROR " + str(item_err)[:200]) if item_err else f"ok, items={len(out)}"
    print(f"- {node}: {status}")
    if verbose and out: print("    ", json.dumps(out[0].get("json"))[:500])
le = d.get("resultData", {}).get("error")
if le: print("WORKFLOW ERROR:", str(le.get("message") if isinstance(le, dict) else le)[:300])
