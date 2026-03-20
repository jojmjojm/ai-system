# AISM.dk — Din guide

## Daglige kommandoer

```bash
# Se status (er alt OK?)
bash ~/aism/scripts/lasse-status.sh

# Genstart efter ændringer
bash ~/aism/scripts/lasse-deploy.sh

# Tag backup af leads + kode
bash ~/aism/scripts/lasse-backup.sh
```

## Hvis noget fejler

```bash
# Se hvad der er galt
sudo journalctl -u aism -n 30 --no-pager

# Genstart bare det hele
sudo systemctl restart aism && sudo systemctl restart caddy
```

## Se dine leads

```bash
cat ~/aism/data/leads.json | python3 -m json.tool
```

## Få email ved nye leads

Rediger `~/aism/.env` — tilføj din email:
```
NOTIFY_EMAIL=din@email.dk
```
Kør derefter: `bash ~/aism/scripts/lasse-deploy.sh`

## Filer du skal kende

| Fil | Hvad den gør |
|-----|-------------|
| `~/aism/data/leads.json` | Alle leads |
| `~/aism/data/scans.json` | Antal scanninger |
| `~/aism/.env` | Indstillinger |
| `~/aism/src/` | Frontend kode |
| `~/aism/api/` | Backend kode |

## Priser i koden

Priserne vises i `src/components/Pricing.tsx` og `src/components/Results.tsx`.
Rediger der hvis du vil ændre priser.
