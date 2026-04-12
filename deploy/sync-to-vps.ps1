# Этап 1: копирование web, server, deploy на VPS (PowerShell, OpenSSH scp).
# Перед первым запуском на VPS: ssh root@HOST "mkdir -p /opt/jetsurf/app"
# Запуск из корня репозитория:  .\deploy\sync-to-vps.ps1
# Или с параметрами: .\deploy\sync-to-vps.ps1 -VpsHost 132.243.16.52

param(
  [string]$VpsHost = "132.243.16.52",
  [string]$User = "root",
  [string]$RemotePath = "/opt/jetsurf/app"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
  Write-Host "Нужен OpenSSH (scp). Установите OpenSSH Client." -ForegroundColor Red
  exit 1
}

$remote = "${User}@${VpsHost}:${RemotePath}/"
Write-Host "Копирование web, server, deploy -> $remote" -ForegroundColor Cyan
scp -r web server deploy "${User}@${VpsHost}:${RemotePath}/"
Write-Host "Готово. На сервере: ls $RemotePath/deploy/bootstrap-vps.sh" -ForegroundColor Green
