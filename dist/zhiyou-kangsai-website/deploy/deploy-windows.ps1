param(
  [string]$HostName = "",
  [string]$Port = "",
  [switch]$NoVenv
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$ConfigPath = Join-Path $PSScriptRoot ".env"
$ExamplePath = Join-Path $PSScriptRoot ".env.example"

function Read-EnvFile($Path) {
  $map = @{}
  if (Test-Path $Path) {
    Get-Content $Path | ForEach-Object {
      $line = $_.Trim()
      if (!$line -or $line.StartsWith("#") -or !$line.Contains("=")) { return }
      $key, $value = $line.Split("=", 2)
      $map[$key.Trim()] = $value.Trim().Trim('"').Trim("'")
    }
  }
  return $map
}

if (!(Test-Path $ConfigPath) -and (Test-Path $ExamplePath)) {
  Copy-Item $ExamplePath $ConfigPath
}

$envMap = Read-EnvFile $ConfigPath
if (!$HostName) { $HostName = $envMap["HOST"] }
if (!$Port) { $Port = $envMap["PORT"] }
if (!$HostName) { $HostName = "0.0.0.0" }
if (!$Port) { $Port = "8000" }

$Python = $envMap["PYTHON_BIN"]
if (!$Python) {
  $candidates = @("python", "py")
  foreach ($candidate in $candidates) {
    try {
      & $candidate --version *> $null
      if ($LASTEXITCODE -eq 0) { $Python = $candidate; break }
    } catch {}
  }
}
if (!$Python) {
  Write-Host "Python was not found. Install Python 3.10+ or set PYTHON_BIN in deploy\\.env." -ForegroundColor Red
  exit 1
}

Set-Location $Root
$venvPython = Join-Path $Root ".venv\Scripts\python.exe"

if (!$NoVenv) {
  if (!(Test-Path $venvPython)) {
    Write-Host "Creating virtual environment..."
    & $Python -m venv .venv
  }
  $Python = $venvPython
}

Write-Host "Installing dependencies..."
& $Python -m pip install --upgrade pip
& $Python -m pip install -r server\requirements.txt

$env:HOST = $HostName
$env:PORT = $Port

Write-Host ""
Write-Host "Zhiyou Kangsai website is ready." -ForegroundColor Cyan
Write-Host "Listen URL: http://$HostName`:$Port"
Write-Host "Local URL:  http://127.0.0.1:$Port"
Write-Host "Press Ctrl+C to stop."
Write-Host ""

& $Python server\server.py
