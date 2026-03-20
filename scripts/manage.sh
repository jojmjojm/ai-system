#!/bin/bash
# AISM management script
set -e
PROJECT_DIR="/home/admxn/aism"

case "${1}" in
  start)
    sudo systemctl start aism
    echo "AISM started"
    ;;
  stop)
    sudo systemctl stop aism
    echo "AISM stopped"
    ;;
  restart)
    sudo systemctl restart aism
    echo "AISM restarted"
    ;;
  status)
    sudo systemctl status aism --no-pager
    ;;
  logs)
    sudo journalctl -u aism -f --no-pager -n 50
    ;;
  deploy)
    echo "Building frontend..."
    cd "$PROJECT_DIR" && npm run build
    echo "Restarting API..."
    sudo systemctl restart aism
    echo "Deploy complete!"
    ;;
  install)
    echo "Installing systemd service..."
    sudo cp "$PROJECT_DIR/deploy/aism.service" /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable aism
    echo "Installing dependencies..."
    cd "$PROJECT_DIR" && npm install
    cd "$PROJECT_DIR/api" && npm install
    echo "Building frontend..."
    cd "$PROJECT_DIR" && npm run build
    echo "Setting permissions..."
    chmod o+x /home/admxn /home/admxn/aism
    chmod -R o+r /home/admxn/aism/dist
    echo "Starting service..."
    sudo systemctl start aism
    echo "Install complete! Add Caddy config from deploy/Caddyfile.aism"
    ;;
  health)
    curl -s http://localhost:3001/api/health | python3 -m json.tool
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs|deploy|install|health}"
    ;;
esac
