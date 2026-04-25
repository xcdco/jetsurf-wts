# Telegram Relay

Небольшой ретранслятор для Telegram Bot API.

## Быстрый старт

1. Скопируйте папку на второй VPS.
2. Установите зависимости:
   `npm install`
3. Создайте `.env` на основе `.env.example`.
4. Запустите:
   `npm start`

## Настройки

- `PORT` - порт, на котором слушает ретранслятор.
- `TELEGRAM_TARGET_BASE` - куда проксировать (обычно `https://api.telegram.org`).
- `TELEGRAM_RELAY_ALLOWED_TOKEN` - допустимый токен бота; если пусто, принимаются любые токены.

## Маршруты

- `GET /health`
- `GET|POST /bot<token>/<method>`

Пример:

`http://104.128.131.70/bot123456:ABCDEF/sendMessage`
