#!/bin/bash
# AISM Safe Deploy — rebuild + restart
set -e
echo "🔧 AISM Deploy starter..."
echo ""

cd /home/admxn/aism

# Build frontend
echo "1/3  Bygger frontend..."
npm run build --silent 2>&1 | tail -3
echo "     ✅ Frontend bygget"

# Restart API
echo "2/3  Genstarter API..."
sudo systemctl restart aism
echo "     ✅ API genstartet"

# Health check
echo "3/3  Tjekker health..."
sleep 1
HEALTH=$(curl -s --max-time 5 http://localhost:3001/api/health 2>/dev/null)
if echo "$HEALTH" | grep -q '"ok"'; then
  echo "     ✅ Alt kører!"
else
  echo "     ❌ Health check fejlede — tjek logs:"
  echo "     sudo journalctl -u aism -n 20 --no-pager"
  exit 1
fi

echo ""
echo "✅ Deploy færdig!"
