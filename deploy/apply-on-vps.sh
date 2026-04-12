#!/usr/bin/env bash
# Запуск на VPS от root после git pull в /var/www/jetsurf-wts:
#   cd /var/www/jetsurf-wts && bash deploy/apply-on-vps.sh
#
# Делает: картинки в public/images, unit-файлы systemd, enable + restart служб.
# HTTPS: отдельно один раз certbot (см. вывод в конце).
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Запустите от root: sudo bash $0" >&2
  exit 1
fi

echo "[1/5] Каталоги и фоновые изображения…"
mkdir -p "$ROOT/web/public/images"
IMG_BG="$ROOT/web/public/images/hero-bg.jpg"
IMG_CARD="$ROOT/web/public/images/hero-card.jpg"
URL_BG="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&q=85&auto=format&fit=crop"
URL_CARD="https://i.imgur.com/EYSNOHh.jpeg"
dl() {
  local url="$1" dest="$2"
  local t
  t="$(mktemp)"
  if curl -fsSL --connect-timeout 25 "$url" -o "$t" 2>/dev/null; then
    mv "$t" "$dest"
    return 0
  fi
  rm -f "$t"
  return 1
}
if command -v curl >/dev/null 2>&1; then
  dl "$URL_BG" "$IMG_BG" || echo "[warn] hero-bg не скачался — залейте файл с ПК в $IMG_BG"
  dl "$URL_CARD" "$IMG_CARD" || echo "[warn] hero-card не скачался — залейте с ПК в $IMG_CARD"
else
  echo "[warn] curl не найден — положите файлы в web/public/images/ вручную"
fi
chown -R www-data:www-data "$ROOT/web/public/images"

echo "[2/5] systemd unit-файлы…"
install -m0644 "$ROOT/deploy/systemd/jetsurf-api.service" /etc/systemd/system/jetsurf-api.service
install -m0644 "$ROOT/deploy/systemd/jetsurf-web.service" /etc/systemd/system/jetsurf-web.service
systemctl daemon-reload

echo "[3/5] Включение автозапуска…"
systemctl enable nginx.service
systemctl enable jetsurf-api.service
systemctl enable jetsurf-web.service

echo "[4/5] Пересборка фронта и перезапуск приложений…"
sudo -u www-data env \
  HOME="$ROOT" \
  XDG_CACHE_HOME="$ROOT/.cache" \
  NPM_CONFIG_CACHE="$ROOT/.npm-cache" \
  bash -c "cd '$ROOT/web' && npm run build"
systemctl restart jetsurf-api.service
systemctl restart jetsurf-web.service

echo "[5/5] Статус…"
systemctl is-active nginx jetsurf-api jetsurf-web

echo ""
echo "Готово. Проверьте server/.env (TELEGRAM_*, CORS_ORIGIN) и web/.env.production (NEXT_PUBLIC_SITE_URL=https://jetsurf-wts.ru)."
echo ""
echo "HTTPS (один раз, подставьте свой email):"
echo "  certbot --nginx -d jetsurf-wts.ru -d www.jetsurf-wts.ru --non-interactive --agree-tos -m ВАШ@EMAIL --redirect"
echo "Если сертификат уже есть: certbot renew --dry-run"
echo ""
echo "Проверка Telegram с VPS:"
echo "  curl -sS -o /dev/null -w '%{http_code}\\n' --connect-timeout 10 https://api.telegram.org/"
echo "(должен быть 200 или 301; если таймаут — пишите в поддержку хостинга)"
