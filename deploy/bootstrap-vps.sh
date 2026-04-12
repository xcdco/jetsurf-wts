#!/usr/bin/env bash
#
# Первичная настройка Ubuntu 24.04 под JetSurf (Next + Express + nginx + systemd).
# Запуск: sudo bash deploy/bootstrap-vps.sh
#
# Этап -1 (снять старую установку JetSurf на этом VPS): deploy/wipe-previous-install.sh
#
# Переменные:
#   RESET_VPS=1          — остановить и снять типовой веб-стек (nginx/apache/caddy), очистить default-сайты.
#   RESET_VPS_DOCKER=1   — вместе с RESET_VPS: docker stop + prune (осторожно, удалит контейнеры/образы).
#
# Код проекта должен лежать в /opt/jetsurf/app (этот скрипт — внутри репозитория: deploy/bootstrap-vps.sh).
#
set -euo pipefail

if [[ "${EUID:-0}" -ne 0 ]]; then
  echo "Запустите от root: sudo bash $0" >&2
  exit 1
fi

APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_ROOT"

if [[ "${RESET_VPS:-}" == "1" ]]; then
  echo "[reset] Остановка веб-служб и очистка default nginx…"
  systemctl stop nginx 2>/dev/null || true
  systemctl stop apache2 2>/dev/null || true
  systemctl stop caddy 2>/dev/null || true
  apt-get remove -y --purge 'nginx*' apache2 apache2-utils caddy 2>/dev/null || true
  apt-get autoremove -y 2>/dev/null || true
  rm -rf /etc/nginx/sites-enabled/* /etc/nginx/sites-available/default 2>/dev/null || true
  if [[ "${RESET_VPS_DOCKER:-}" == "1" ]]; then
    echo "[reset] Docker stop + system prune -a…"
    if command -v docker >/dev/null 2>&1; then
      docker ps -aq | xargs -r docker stop
      docker system prune -af
    fi
  fi
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates gnupg nginx certbot python3-certbot-nginx git rsync

if ! command -v node >/dev/null 2>&1; then
  echo "[node] Установка Node.js 22.x (NodeSource)…"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "[user] Системный пользователь jetsurf…"
if ! id jetsurf >/dev/null 2>&1; then
  useradd --system --home-dir /opt/jetsurf --create-home --shell /usr/sbin/nologin jetsurf
fi

mkdir -p /opt/jetsurf

if [[ ! -f server/.env ]] || [[ ! -f web/.env.production ]]; then
  echo "[env] Создание недостающих .env из примеров (deploy/prep-env-on-server.sh)…"
  bash "$APP_ROOT/deploy/prep-env-on-server.sh"
fi

chown -R jetsurf:jetsurf "$APP_ROOT"

if [[ "$APP_ROOT" != "/opt/jetsurf/app" ]]; then
  echo "[warn] Unit-файлы будут указывать на $APP_ROOT (не /opt/jetsurf/app)."
fi

if [[ ! -f server/.env ]]; then
  echo "[env] Создайте server/.env (см. deploy/env/server.env.production.example и server/.env.example)" >&2
  exit 1
fi

if [[ ! -f web/.env.production ]]; then
  echo "[env] Создайте web/.env.production (см. deploy/env/web.env.production.example)" >&2
  exit 1
fi

echo "[npm] Сборка зависимостей и production build…"
sudo -u jetsurf bash -c "cd '$APP_ROOT/server' && npm ci --omit=dev"
sudo -u jetsurf bash -c "cd '$APP_ROOT/web' && npm ci && npm run build"

sed "s#/opt/jetsurf/app#$APP_ROOT#g" "$APP_ROOT/deploy/systemd/jetsurf-api.service" >/etc/systemd/system/jetsurf-api.service
chmod 0644 /etc/systemd/system/jetsurf-api.service
sed "s#/opt/jetsurf/app#$APP_ROOT#g" "$APP_ROOT/deploy/systemd/jetsurf-web.service" >/etc/systemd/system/jetsurf-web.service
chmod 0644 /etc/systemd/system/jetsurf-web.service
install -m0644 "$APP_ROOT/deploy/nginx/jetsurf-wts.conf" /etc/nginx/sites-available/jetsurf-wts.conf
ln -sf /etc/nginx/sites-available/jetsurf-wts.conf /etc/nginx/sites-enabled/jetsurf-wts.conf
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

nginx -t
systemctl daemon-reload
systemctl enable --now jetsurf-api.service
systemctl enable --now jetsurf-web.service
systemctl restart nginx

echo ""
echo "Готово: API :4000, Next :3000, nginx фронт."
echo "Проверка: bash $APP_ROOT/deploy/verify-on-server.sh"
echo "Сертификат (после DNS на этот IP): certbot --nginx -d jetsurf-wts.ru -d www.jetsurf-wts.ru"
echo "В reg.ru у домена: A → 132.243.16.52, AAAA → ваш IPv6; отключите подарочный хостинг/редирект, когда будете готовы."
echo "Если .env создался из примера — заполните TELEGRAM_* в server/.env и при необходимости: systemctl restart jetsurf-api"
