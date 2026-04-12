#!/usr/bin/env bash
# Запуск на чистом Ubuntu 24.04 от root: bash install-vps.sh
# Перед запуском скопируйте весь проект в /var/www/jetsurf-wts (папки web/ и server/).

set -euo pipefail

SITE="${SITE:-jetsurf-wts.ru}"
ROOT="/var/www/jetsurf-wts"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Запустите от root: sudo bash install-vps.sh"
  exit 1
fi

if [[ ! -f "$ROOT/web/package.json" ]] || [[ ! -f "$ROOT/server/package.json" ]]; then
  echo "Ожидается структура: $ROOT/web и $ROOT/server"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx curl ca-certificates git rsync

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v 2>/dev/null | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Подстраховка для сборки Next на 2 ГБ RAM (если не удалось — пропускается)
if [[ ! -f /swapfile ]]; then
  if fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile; then
    grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
fi

install -d -m 755 "$ROOT/server/data"

# Сломанный node_modules / кэш от прошлых запусков (в т.ч. от root) дают TAR_ENTRY_ERROR и EACCES на /var/www/.npm
rm -rf /var/www/.npm 2>/dev/null || true
rm -rf "$ROOT/web/node_modules" "$ROOT/web/.next" "$ROOT/server/node_modules" 2>/dev/null || true
install -d -m 755 "$ROOT/.npm-cache" "$ROOT/.cache"
# После git clone владелец — root; www-data не может писать в дерево без этого.
chown -R www-data:www-data "$ROOT"

# Явный кэш npm: иначе иногда берётся /var/www/.npm (home www-data = /var/www), уже с файлами root.
NPM_ENV=(env HOME="$ROOT" XDG_CACHE_HOME="$ROOT/.cache" NPM_CONFIG_CACHE="$ROOT/.npm-cache")

echo "=== npm ci + build (web) ==="
sudo -u www-data "${NPM_ENV[@]}" bash -c "cd '$ROOT/web' && npm ci --no-audit --no-fund && npm run build"

echo "=== npm ci (server) ==="
sudo -u www-data "${NPM_ENV[@]}" bash -c "cd '$ROOT/server' && npm ci --no-audit --no-fund"

if [[ ! -f "$ROOT/server/.env" ]]; then
  echo "Создайте $ROOT/server/.env (см. server/.env.example) и перезапустите: systemctl restart jetsurf-api"
  install -m 640 /dev/null "$ROOT/server/.env"
  chown www-data:www-data "$ROOT/server/.env"
fi

if [[ ! -f "$ROOT/web/.env.production" ]]; then
  cat >"$ROOT/web/.env.production" <<EOF
NEXT_PUBLIC_SITE_URL=https://${SITE}
# Пусто = форма шлёт на тот же домен /api/leads (nginx → Express)
NEXT_PUBLIC_API_URL=
EOF
  chown www-data:www-data "$ROOT/web/.env.production"
  chmod 640 "$ROOT/web/.env.production"
fi

chown -R www-data:www-data "$ROOT"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
install -m 644 "$SCRIPT_DIR/nginx-jetsurf-wts.conf" "/etc/nginx/sites-available/${SITE}.conf"
ln -sf "/etc/nginx/sites-available/${SITE}.conf" "/etc/nginx/sites-enabled/${SITE}.conf"
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t

install -m 644 "$SCRIPT_DIR/systemd/jetsurf-api.service" /etc/systemd/system/jetsurf-api.service
install -m 644 "$SCRIPT_DIR/systemd/jetsurf-web.service" /etc/systemd/system/jetsurf-web.service
systemctl daemon-reload
systemctl enable jetsurf-api jetsurf-web
systemctl restart jetsurf-api
systemctl restart jetsurf-web
systemctl reload nginx || systemctl restart nginx

echo ""
echo "Готово. Дальше:"
echo "1) DNS: A @ → ваш IPv4, AAAA @ → IPv6, то же для www (или CNAME www → @)."
echo "2) SSL: certbot --nginx -d ${SITE} -d www.${SITE}"
echo "3) Заполните $ROOT/server/.env и: systemctl restart jetsurf-api"
echo "4) Смените пароль root — он был в открытом виде в переписке."
