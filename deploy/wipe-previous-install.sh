#!/usr/bin/env bash
#
# Этап -1 (на VPS, от root): снять прошлую установку JetSurf — systemd, nginx vhost,
# опционально дерево приложения и старый путь /var/www/jetsurf-wts (install-vps.sh).
#
# Обязательно: I_UNDERSTAND_DATA_LOSS=1
# Удалить код и артефакты сборки: WIPE_APP_DIR=1  (каталог по умолчанию /opt/jetsurf/app)
# Удалить старый legacy-путь:            WIPE_LEGACY_VAR_WWW=1
#
# Пример «всё снести и потом ставить заново»:
#   I_UNDERSTAND_DATA_LOSS=1 WIPE_APP_DIR=1 WIPE_LEGACY_VAR_WWW=1 bash deploy/wipe-previous-install.sh
# Затем заново скопируйте проект и: RESET_VPS=1 bash deploy/bootstrap-vps.sh
#
set -euo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Запустите от root: sudo bash $0" >&2
  exit 1
fi

if [[ "${I_UNDERSTAND_DATA_LOSS:-}" != "1" ]]; then
  echo "Установите I_UNDERSTAND_DATA_LOSS=1 (см. комментарии в начале скрипта)." >&2
  exit 1
fi

APP_DIR="${APP_DIR:-/opt/jetsurf/app}"
LEGACY_ROOT="${LEGACY_ROOT:-/var/www/jetsurf-wts}"

echo "[1/4] Остановка и отключение jetsurf-api / jetsurf-web…"
systemctl stop jetsurf-api.service 2>/dev/null || true
systemctl stop jetsurf-web.service 2>/dev/null || true
systemctl disable jetsurf-api.service 2>/dev/null || true
systemctl disable jetsurf-web.service 2>/dev/null || true

rm -f /etc/systemd/system/jetsurf-api.service /etc/systemd/system/jetsurf-web.service
systemctl daemon-reload

echo "[2/4] Удаление nginx vhost JetSurf…"
for f in \
  /etc/nginx/sites-enabled/jetsurf-wts.conf \
  /etc/nginx/sites-available/jetsurf-wts.conf \
  /etc/nginx/sites-enabled/jetsurf-wts.ru.conf \
  /etc/nginx/sites-available/jetsurf-wts.ru.conf; do
  rm -f "$f"
done

if [[ -d /etc/nginx/sites-enabled ]] && [[ -z "$(ls -A /etc/nginx/sites-enabled 2>/dev/null || true)" ]]; then
  if [[ -f /etc/nginx/sites-available/default ]]; then
    echo "[nginx] Включаю default-сайт (пустой sites-enabled)."
    ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
  fi
fi

if command -v nginx >/dev/null 2>&1; then
  nginx -t && systemctl reload nginx 2>/dev/null || systemctl restart nginx 2>/dev/null || true
fi

echo "[3/4] Опциональное удаление каталогов…"
if [[ "${WIPE_APP_DIR:-}" == "1" ]]; then
  echo "  Удаление $APP_DIR …"
  rm -rf "$APP_DIR"
  mkdir -p "$APP_DIR"
fi

if [[ "${WIPE_LEGACY_VAR_WWW:-}" == "1" ]]; then
  echo "  Удаление $LEGACY_ROOT …"
  rm -rf "$LEGACY_ROOT"
fi

echo "[4/4] Готово. Дальше: скопируйте проект в $APP_DIR, настройте .env, затем bash deploy/bootstrap-vps.sh"
echo "  (при необходимости сначала RESET_VPS=1 для снятия чужого nginx/apache)."
