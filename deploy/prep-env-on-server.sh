#!/usr/bin/env bash
# Этап 2: создать server/.env и web/.env.production из примеров, если файлов ещё нет.
# Запуск на VPS из корня репозитория: bash deploy/prep-env-on-server.sh
# После копирования отредактируйте server/.env (токены Telegram).

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f server/.env ]]; then
  cp deploy/env/server.env.production.example server/.env
  echo "[ok] Создан server/.env — заполните TELEGRAM_* и при необходимости CORS_ORIGIN."
else
  echo "[skip] server/.env уже есть."
fi

if [[ ! -f web/.env.production ]]; then
  cp deploy/env/web.env.production.example web/.env.production
  echo "[ok] Создан web/.env.production — при смене домена поправьте URL и пересоберите: npm run build в web/."
else
  echo "[skip] web/.env.production уже есть."
fi
