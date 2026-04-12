#!/usr/bin/env bash
# Этап 7: проверки на VPS после bootstrap (и опционально после certbot).
# Запуск: bash deploy/verify-on-server.sh
# Для внешнего /health по HTTPS (после DNS + certbot): curl -sf https://jetsurf-wts.ru/health

set -euo pipefail
HOST_HDR="${VERIFY_HOST:-jetsurf-wts.ru}"

echo "== API :4000 /health (loopback) =="
curl -sfS "http://127.0.0.1:4000/health" || {
  echo "FAIL: Express не отвечает. systemctl status jetsurf-api" >&2
  exit 1
}
echo "OK"

echo "== Next :3000 (loopback, заголовок) =="
curl -sfSI "http://127.0.0.1:3000" | head -n1 || {
  echo "FAIL: Next не отвечает. systemctl status jetsurf-web" >&2
  exit 1
}

echo "== nginx -> /health (нужен Host: $HOST_HDR) =="
if curl -sfS "http://127.0.0.1/health" -H "Host: ${HOST_HDR}" >/dev/null; then
  echo "OK"
else
  echo "WARN: nginx /health не ответил (проверьте sites-enabled и server_name)." >&2
fi

echo ""
echo "Этап 6 (HTTPS): когда DNS указывает на этот VPS, выполните:"
echo "  certbot --nginx -d jetsurf-wts.ru -d www.jetsurf-wts.ru"
echo "Потом с ПК: curl -sf https://jetsurf-wts.ru/health"
echo "Логи: journalctl -u jetsurf-api -n 50 --no-pager"
