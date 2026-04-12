# Этап 5: проверка DNS с Windows (после настройки в reg.ru).
param(
  [string]$Domain = "jetsurf-wts.ru",
  [string]$ExpectedV4 = "132.243.16.52"
)

Write-Host "A (IPv4) для $Domain" -ForegroundColor Cyan
$a = Resolve-DnsName -Name $Domain -Type A -ErrorAction SilentlyContinue | Where-Object { $_.Type -eq "A" }
if (-not $a) {
  Write-Host "Запись A не найдена или DNS ещё не обновился." -ForegroundColor Yellow
} else {
  $a | ForEach-Object { Write-Host "  $($_.IPAddress)" }
  $match = $a | Where-Object { $_.IPAddress -eq $ExpectedV4 }
  if ($match) { Write-Host "Совпадает с ожидаемым VPS $ExpectedV4" -ForegroundColor Green }
  else { Write-Host "Ожидался A -> $ExpectedV4 (ваш VPS)." -ForegroundColor Yellow }
}

Write-Host "AAAA (IPv6) для $Domain" -ForegroundColor Cyan
$aaaa = Resolve-DnsName -Name $Domain -Type AAAA -ErrorAction SilentlyContinue | Where-Object { $_.Type -eq "AAAA" }
if (-not $aaaa) {
  Write-Host "AAAA нет или не резолвится (можно добавить позже)." -ForegroundColor Yellow
} else {
  $aaaa | ForEach-Object { Write-Host "  $($_.IPAddress)" }
}
