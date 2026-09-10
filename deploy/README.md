# Deploy — Oracle Always-Free VM (Ubuntu 24.04, E2.1.Micro)
Stack: n8n 2.33.3 + Caddy (auto Let's Encrypt) behind https://n8n.152-67-183-135.sslip.io
Files live in ~/n8n on the VM. Secrets in ~/n8n/.env (not in git): N8N_HOST, N8N_ENCRYPTION_KEY.
- deploy:  docker compose up -d
- logs:    docker compose logs -f n8n
- update:  docker compose pull && docker compose up -d
- DB:      ~/n8n/data/database.sqlite (migrated from the local dev instance; same encryption key)
