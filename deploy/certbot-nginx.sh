#!/usr/bin/env bash
# Этап 6: выпуск сертификата Let's Encrypt (на VPS, от root, когда DNS уже на этот сервер).
# bash deploy/certbot-nginx.sh

set -euo pipefail
certbot --nginx -d jetsurf-wts.ru -d www.jetsurf-wts.ru
