# Этап 0: подготовка входа по SSH с Windows (выполнить в PowerShell).
# 1) Включите клиент: Параметры → Приложения → Дополнительные компоненты → OpenSSH Client
# 2) Создайте ключ (один раз):
#    ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\id_ed25519_jetsurf" -N '""'
# 3) Скопируйте публичный ключ на VPS (подставьте IP):
#    type "$env:USERPROFILE\.ssh\id_ed25519_jetsurf.pub" | ssh root@132.243.16.52 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
# 4) Подключение с ключом:
#    ssh -i "$env:USERPROFILE\.ssh\id_ed25519_jetsurf" root@132.243.16.52

param(
  [string]$VpsHost = "132.243.16.52",
  [string]$User = "root"
)

Write-Host "Проверка: ssh.exe в PATH…" -ForegroundColor Cyan
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
  Write-Host "Установите OpenSSH Client (см. комментарии в начале файла)." -ForegroundColor Red
  exit 1
}

$key = Join-Path $env:USERPROFILE ".ssh\id_ed25519_jetsurf"
if (-not (Test-Path $key)) {
  Write-Host "Ключ не найден: $key" -ForegroundColor Yellow
  Write-Host "Создайте: ssh-keygen -t ed25519 -f `"$key`" -N `\"\"`""
  exit 0
}

Write-Host "Подключение: ssh -i `"$key`" ${User}@${VpsHost}" -ForegroundColor Green
ssh -i $key "${User}@${VpsHost}"
