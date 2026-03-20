#!/bin/bash
# AISM Backup — gemmer vigtige filer
BACKUP_DIR="/home/admxn/backups/aism"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/aism_backup_$TIMESTAMP"

mkdir -p "$BACKUP_PATH"

echo "📦 AISM Backup starter..."
echo ""

# Backup leads
if [ -f /home/admxn/aism/data/leads.json ]; then
  cp /home/admxn/aism/data/leads.json "$BACKUP_PATH/"
  LEAD_COUNT=$(python3 -c "import json; print(len(json.load(open('/home/admxn/aism/data/leads.json'))))" 2>/dev/null || echo "?")
  echo "  ✅ Leads: $LEAD_COUNT leads gemt"
else
  echo "  ⚪ Ingen leads at gemme"
fi

# Backup scan stats
if [ -f /home/admxn/aism/data/scans.json ]; then
  cp /home/admxn/aism/data/scans.json "$BACKUP_PATH/"
  echo "  ✅ Scan-statistik gemt"
fi

# Backup env
cp /home/admxn/aism/.env "$BACKUP_PATH/"
echo "  ✅ Konfiguration gemt"

# Backup source (lightweight — no node_modules)
tar czf "$BACKUP_PATH/source.tar.gz" \
  -C /home/admxn/aism \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=data \
  --exclude=.git \
  src api scripts deploy package.json .env index.html 2>/dev/null
echo "  ✅ Kildekode gemt"

# Cleanup old backups (keep last 10)
ls -dt "$BACKUP_DIR"/aism_backup_* 2>/dev/null | tail -n +11 | xargs rm -rf 2>/dev/null

echo ""
echo "📁 Backup gemt: $BACKUP_PATH"
echo "✅ Færdig!"
