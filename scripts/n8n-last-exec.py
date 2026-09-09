#!/usr/bin/env python3
"""Print per-node status of the latest local n8n execution for a workflow id (default VoiceLeadPost001)."""
import sqlite3, json, sys, zlib
wf = sys.argv[1] if len(sys.argv) > 1 else "VoiceLeadPost001"
con = sqlite3.connect("/Users/stellteck/.n8n/database.sqlite")
row = con.execute("select id,status,startedAt,stoppedAt from execution_entity where workflowId=? order by id desc limit 1", (wf,)).fetchone()
if not row: print("no executions"); sys.exit(0)
print(f"execution {row[0]} status={row[1]} {row[2]} -> {row[3]}")
raw = con.execute("select data from execution_data where executionId=?", (row[0],)).fetchone()[0]
try: data = json.loads(raw)
except Exception: data = json.loads(zlib.decompress(raw))
def unflat(arr):
    def rec(v):
        if isinstance(v, str) and v.isdigit(): return rec(arr[int(v)])
        if isinstance(v, list): return [rec(x) for x in v]
        if isinstance(v, dict): return {k: rec(x) for k, x in v.items()}
        return v
    return rec(arr[0])
d = unflat(data) if isinstance(data, list) else data
for node, runs in d.get("resultData", {}).get("runData", {}).items():
    r = runs[0]; err = r.get("error"); out = (r.get("data") or {}).get("main", [[]])[0] or []
    print(f"- {node}: {'ERROR ' + str(err.get('message'))[:220] if err else 'ok, items=' + str(len(out))}")
    if "--verbose" in sys.argv and out: print("    ", json.dumps(out[0].get("json"))[:600])
le = d.get("resultData", {}).get("error")
if le: print("WORKFLOW ERROR:", str(le.get("message") if isinstance(le, dict) else le)[:300])
