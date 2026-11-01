#!/bin/bash
# Installs LogicPacks in one line:
#   curl -fsSL https://logicpacks.io/install.sh | bash
# macOS (Apple silicon): downloads the signed, notarized app named in
# https://downloads.logicpacks.io/mac/latest.json, checks its SHA-256, copies it to
# /Applications (or ~/Applications when /Applications is not writable, no sudo), installs the lp
# helper and opens the app. Re-running it upgrades in place.
# Linux (x64) and Intel Macs: installs the lp helper only (there is no app build for them yet).
# Optional: LOGICPACKS_NO_OPEN=1 to not open the app afterwards.
set -euo pipefail

BASE="${LOGICPACKS_DOWNLOADS:-https://downloads.logicpacks.io}"
SITE="${LOGICPACKS_SITE:-https://logicpacks.io}"

say() { printf '%s\n' "$*"; }
fail() { printf 'LogicPacks install: %s\n' "$*" >&2; exit 1; }

install_helper() {
  say "Installing the lp helper..."
  curl -fsSL "$SITE/helper.sh" -o "$WORK/helper.sh" || fail "could not download $SITE/helper.sh"
  LOGICPACKS_DOWNLOADS="$BASE" bash "$WORK/helper.sh" || fail "the lp helper did not install."
}

WORK="$(mktemp -d)"
MOUNT="$WORK/mount"
cleanup() {
  [ -d "$MOUNT" ] && hdiutil detach -quiet "$MOUNT" >/dev/null 2>&1 || true
  rm -rf "$WORK"
}
trap cleanup EXIT

OS="$(uname -s)"
ARCH="$(uname -m)"
if [ "$OS" = "Darwin" ] && [ "$ARCH" = "x86_64" ] && [ "$(sysctl -in sysctl.proc_translated 2>/dev/null || echo 0)" = "1" ]; then ARCH=arm64; fi

case "$OS" in
  Linux)
    say "There is no LogicPacks app for Linux yet: installing the lp helper only."
    install_helper
    say "Done. lp works with the LogicPacks app on a Mac or Windows PC, or with your own host (lp login --host <url>)."
    exit 0 ;;
  Darwin) ;;
  *) fail "this installer is for macOS and Linux. On Windows run in PowerShell: irm $SITE/install.ps1 | iex" ;;
esac

if [ "$ARCH" != "arm64" ]; then
  say "The LogicPacks app is built for Apple silicon Macs (M1 or later): installing the lp helper only."
  install_helper
  exit 0
fi

say "Finding the latest LogicPacks for Mac..."
curl -fsSL "$BASE/mac/latest.json" -o "$WORK/latest.json" || fail "could not reach $BASE"
field() { plutil -extract "$1" raw -o - "$WORK/latest.json"; }
VERSION="$(field version)"
URL="$(field url)"
SHA256="$(field sha256)"
[ -n "$URL" ] && [ -n "$SHA256" ] || fail "the release manifest is incomplete."

say "Downloading LogicPacks $VERSION..."
curl -fL --progress-bar "$URL" -o "$WORK/LogicPacks.dmg" || fail "download failed."

ACTUAL="$(shasum -a 256 "$WORK/LogicPacks.dmg" | awk '{print $1}')"
[ "$ACTUAL" = "$SHA256" ] || fail "checksum mismatch (expected $SHA256, got $ACTUAL). Nothing was installed."
say "Checksum OK."

mkdir -p "$MOUNT"
hdiutil attach -quiet -nobrowse -readonly -mountpoint "$MOUNT" "$WORK/LogicPacks.dmg" || fail "could not open the disk image."
[ -d "$MOUNT/LogicPacks.app" ] || fail "the disk image has no LogicPacks.app."

# /Applications when we can write there, else ~/Applications (no sudo). An existing copy in
# ~/Applications is upgraded where it is.
DEST="${LOGICPACKS_APP_DIR:-}"
if [ -z "$DEST" ]; then
  if [ -d "$HOME/Applications/LogicPacks.app" ] && [ ! -d /Applications/LogicPacks.app ]; then DEST="$HOME/Applications"
  elif [ -w /Applications ]; then DEST=/Applications
  else DEST="$HOME/Applications"; fi
fi
mkdir -p "$DEST"
APP="$DEST/LogicPacks.app"

# An upgrade replaces the app: quit this copy if it is running (other copies are left alone).
if pgrep -f "$APP/Contents/MacOS/" >/dev/null 2>&1; then
  say "Quitting the running LogicPacks..."
  osascript -e 'quit app "LogicPacks"' >/dev/null 2>&1 || true
  for _ in 1 2 3 4 5 6 7 8 9 10; do pgrep -f "$APP/Contents/MacOS/" >/dev/null 2>&1 || break; sleep 1; done
fi

say "Installing to $APP..."
rm -rf "$APP.installing"
ditto "$MOUNT/LogicPacks.app" "$APP.installing" || fail "could not copy the app to $DEST."
rm -rf "$APP"
mv "$APP.installing" "$APP"

spctl -a "$APP" >/dev/null 2>&1 || fail "macOS did not accept the app's signature. Remove $APP and download it from $SITE/download"

install_helper

if [ -z "${LOGICPACKS_NO_OPEN:-}" ]; then
  say "Opening LogicPacks."
  open "$APP"
fi
say "Done. Add a folder as a project, then run lp login to connect your agent to the app."
