#!/bin/bash
# AISM Status — quick overview
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AISM.dk Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# App service
if systemctl is-active --quiet aism; then
  echo "  API:     ✅ Kører"
else
  echo "  API:     ❌ Stoppet"
fi

# Health check
HEALTH=$(curl -s --max-time 3 http://localhost:3001/api/health 2>/dev/null)
if echo "$HEALTH" | grep -q '"ok"'; then
  echo "  Health:  ✅ OK"
else
  echo "  Health:  ❌ Fejl"
fi

# Caddy
if systemctl is-active --quiet caddy; then
  echo "  Caddy:   ✅ Kører"
else
  echo "  Caddy:   ❌ Stoppet"
fi

# Stats
STATS=$(curl -s --max-time 3 http://localhost:3001/api/stats 2>/dev/null)
SCANS=$(echo "$STATS" | python3 -c "import sys,json; print(json.load(sys.stdin).get('scans',0))" 2>/dev/null || echo "?")
LEADS=$(echo "$STATS" | python3 -c "import sys,json; print(json.load(sys.stdin).get('leads',0))" 2>/dev/null || echo "?")

echo ""
echo "  Scans:   $SCANS"
echo "  Leads:   $LEADS"

# Latest lead
LEADS_FILE="/home/admxn/aism/data/leads.json"
if [ -f "$LEADS_FILE" ]; then
  LATEST=$(python3 -c "
import json
with open('$LEADS_FILE') as f:
  leads = json.load(f)
if leads:
  l = leads[-1]
  print(f\"  Seneste: {l['name']} <{l['email']}> — {l.get('createdAt','?')[:16]}\")
else:
  print('  Seneste: Ingen leads endnu')
" 2>/dev/null)
  echo "$LATEST"
else
  echo "  Seneste: Ingen leads endnu"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
