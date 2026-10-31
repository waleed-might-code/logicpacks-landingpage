#!/bin/bash
# Installs LogicPacks for Mac: downloads the signed, notarized app, checks its
# SHA-256, copies it to /Applications and opens it.
#   curl -fsSL https://logicpacks.io/install.sh | bash
set -euo pipefail

BASE="${LOGICPACKS_DOWNLOADS:-https://downloads.logicpacks.io}"
APP="/Applications/LogicPacks.app"

say() { printf '%s\n' "$*"; }
fail() { printf 'LogicPacks install: %s\n' "$*" >&2; exit 1; }

[ "$(uname -s)" = "Darwin" ] || fail "this installer is for macOS. Windows and iOS are coming soon: https://logicpacks.io/download"
[ "$(uname -m)" = "arm64" ] || fail "this build is for Apple silicon Macs (M1 or later)."

WORK="$(mktemp -d)"
MOUNT="$WORK/mount"
cleanup() {
  hdiutil detach -quiet "$MOUNT" >/dev/null 2>&1 || true
  rm -rf "$WORK"
}
trap cleanup EXIT

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

if pgrep -xq LogicPacks; then
  say "Quitting the running LogicPacks..."
  osascript -e 'quit app "LogicPacks"' >/dev/null 2>&1 || true
  sleep 2
fi

say "Installing to $APP..."
if [ -w /Applications ]; then
  rm -rf "$APP"
  ditto "$MOUNT/LogicPacks.app" "$APP"
else
  sudo rm -rf "$APP"
  sudo ditto "$MOUNT/LogicPacks.app" "$APP"
fi

spctl -a "$APP" >/dev/null 2>&1 || fail "macOS did not accept the app's signature. Remove $APP and download it from https://logicpacks.io/download"

say "Opening LogicPacks."
open "$APP"
say "Done. Add a folder as a project, then press Sync to share it with your team."
