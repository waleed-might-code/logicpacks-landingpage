# Installs LogicPacks for Windows (x64) and its lp helper, in one line in PowerShell:
#   irm https://logicpacks.io/install.ps1 | iex
# Downloads the app installer named in https://downloads.logicpacks.io/win/latest.json, checks its
# SHA-256, installs it silently for this user (no admin), puts lp.exe on your PATH and checks that
# `lp help` runs. Re-running it upgrades in place. Works in Windows PowerShell 5.1 and PowerShell 7.
# The app is not code-signed yet, so Windows may show a SmartScreen prompt for it.
# Optional: $env:LOGICPACKS_NO_OPEN = 1 to not open the app afterwards.
# Runs inside the caller's PowerShell (iex), so it throws instead of calling exit.
& {
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Say($text) { Write-Host $text }
function Fail($text) { throw "LogicPacks install: $text" }

if (-not [Environment]::Is64BitOperatingSystem) { Fail 'LogicPacks needs 64-bit Windows 10 or 11.' }
$Base = if ($env:LOGICPACKS_DOWNLOADS) { $env:LOGICPACKS_DOWNLOADS } else { 'https://downloads.logicpacks.io' }
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

Say 'Finding the latest LogicPacks for Windows...'
$Release = Invoke-RestMethod -UseBasicParsing -Uri "$Base/win/latest.json"
if (-not $Release.url -or -not $Release.sha256) { Fail 'the release manifest is incomplete.' }

$Work = Join-Path ([System.IO.Path]::GetTempPath()) ('logicpacks-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $Work | Out-Null
$Setup = Join-Path $Work "LogicPacks-$($Release.version)-x64.exe"
try {
  Say "Downloading LogicPacks $($Release.version) ($([math]::Round($Release.size / 1MB)) MB)..."
  # curl.exe (built into Windows 10 1803 and later) shows progress and is much faster than
  # Invoke-WebRequest in Windows PowerShell 5.1; fall back to Invoke-WebRequest without it.
  $Curl = Get-Command curl.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($Curl) {
    # curl writes its progress to stderr: keep that from counting as a PowerShell error.
    $ErrorActionPreference = 'Continue'
    & $Curl.Source -fL --retry 3 --progress-bar -o $Setup $Release.url
    $ErrorActionPreference = 'Stop'
    if ($LASTEXITCODE -ne 0) { Fail "the download failed (curl exit code $LASTEXITCODE)." }
  } else {
    Invoke-WebRequest -UseBasicParsing -Uri $Release.url -OutFile $Setup
  }
  $Actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $Setup).Hash.ToLower()
  if ($Actual -ne $Release.sha256.ToLower()) { Fail "checksum mismatch (expected $($Release.sha256), got $Actual). Nothing was installed." }
  Say 'Checksum OK.'

  # An upgrade replaces the app's files: quit a running copy first.
  $Running = Get-Process -Name 'LogicPacks' -ErrorAction SilentlyContinue
  if ($Running) {
    Say 'Quitting the running LogicPacks...'
    $Running | Stop-Process -Force
    Start-Sleep -Seconds 2
  }

  Say 'Installing for this user (no admin needed). If Windows shows a SmartScreen prompt for the unsigned app, choose More info, then Run anyway.'
  $Installer = Start-Process -FilePath $Setup -ArgumentList '/S' -Wait -PassThru
  if ($Installer.ExitCode -ne 0) { Fail "the installer exited with code $($Installer.ExitCode)." }
} finally {
  Remove-Item -Recurse -Force -LiteralPath $Work -ErrorAction SilentlyContinue
}

$Entry = Get-ChildItem 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall' -ErrorAction SilentlyContinue |
  ForEach-Object { Get-ItemProperty $_.PSPath } | Where-Object { $_.DisplayName -like 'LogicPacks*' } | Select-Object -First 1
$InstallDir = if ($Entry -and $Entry.InstallLocation) { $Entry.InstallLocation } else { Join-Path $env:LOCALAPPDATA 'Programs\LogicPacks' }
$App = Join-Path $InstallDir 'LogicPacks.exe'
if (-not (Test-Path -LiteralPath $App)) { Fail "LogicPacks.exe is not in $InstallDir after installing." }
Say "Installed LogicPacks $($Release.version) in $InstallDir"

# The installer copies lp.exe to %USERPROFILE%\.logicpacks\helper\bin and adds it to the user PATH.
# Pick up that PATH here, and drop Windows PowerShell's lp alias (Out-Printer) in this session.
$BinDir = Join-Path $env:USERPROFILE '.logicpacks\helper\bin'
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'User') + ';' + [Environment]::GetEnvironmentVariable('Path', 'Machine')
if (-not (Test-Path -LiteralPath (Join-Path $BinDir 'lp.exe'))) {
  Say 'The app did not place lp.exe; installing the helper on its own...'
  Invoke-RestMethod -UseBasicParsing -Uri 'https://logicpacks.io/helper.ps1' | Invoke-Expression
}
# lp.exe, found through the PATH (Windows PowerShell 5.1 maps plain lp to Out-Printer: see the end).
$Help = (& lp.exe help 2>&1) -join "`n"
if ($Help -notmatch 'LogicPacks') { Fail 'lp help did not run. Open a new PowerShell and try lp.exe help.' }
Say "lp help: OK ($(& lp.exe version), $((Get-Command lp.exe).Source))"

if (-not $env:LOGICPACKS_NO_OPEN) {
  Say 'Opening LogicPacks.'
  # Through Explorer, so the app does not attach to this console and print its logs here.
  Start-Process -FilePath (Join-Path $env:WINDIR 'explorer.exe') -ArgumentList "`"$App`""
}
Say 'Done. Add a folder as a project in the app, then run lp login to connect your agent to it.'
if ($PSVersionTable.PSVersion.Major -lt 6) { Say 'In new Windows PowerShell windows, type lp.exe (lp there is the Out-Printer alias); cmd, Git Bash and PowerShell 7 take lp.' }
}
# Windows PowerShell 5.1 has a built-in alias lp (Out-Printer) that wins over lp.exe. iex runs this
# line in your session, so plain lp works here; in new Windows PowerShell windows type lp.exe.
if (Test-Path Alias:lp) { Remove-Item Alias:lp -Force -ErrorAction SilentlyContinue }
