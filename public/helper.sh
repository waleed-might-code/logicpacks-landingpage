#!/usr/bin/env bash
# LogicPacks helper installer: curl -fsSL https://logicpacks.io/helper.sh | bash
# Optional: LP_SERVER=https://your-host LP_TOKEN=... to sign in during install,
# LP_HELPER_URL to install from another copy, LP_HELPER_SHA256 to pin it,
# LP_HELPER_NO_WATCHER=1 / LP_HELPER_NO_HOOKS=1 to skip those steps.
set -euo pipefail

HOME_DIR="${LP_HELPER_HOME:-$HOME/.logicpacks/helper}"
SOURCE="${LP_HELPER_URL:-https://logicpacks.io/helper/lp.mjs}"
BIN_DIR="${LP_BIN_DIR:-$HOME/.local/bin}"

fail() { printf 'LogicPacks helper: %s\n' "$1" >&2; exit 1; }

NODE="$(command -v node || true)"
[ -n "$NODE" ] || fail "Node.js 18 or newer is needed (Claude Code and Codex already use it). Install it from https://nodejs.org and run this again."
NODE_MAJOR="$("$NODE" -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 18 ] || fail "Node.js 18 or newer is needed; found $("$NODE" -v)."

mkdir -p "$HOME_DIR/bin" "$BIN_DIR"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/lp-helper.XXXXXX")"
TMP="$TMP_DIR/lp.mjs"
trap 'rm -rf "$TMP_DIR"' EXIT
case "$SOURCE" in
  http://* | https://*) curl -fsSL "$SOURCE" -o "$TMP" || fail "could not download $SOURCE" ;;
  file://*) cp "${SOURCE#file://}" "$TMP" ;;
  *) cp "$SOURCE" "$TMP" ;;
esac
if [ -n "${LP_HELPER_SHA256:-}" ]; then
  ACTUAL="$(shasum -a 256 "$TMP" 2>/dev/null || sha256sum "$TMP")"
  [ "${ACTUAL%% *}" = "$LP_HELPER_SHA256" ] || fail "checksum mismatch for $SOURCE"
fi
"$NODE" --check "$TMP" 2>/dev/null || fail "$SOURCE is not a valid helper script"
mv "$TMP" "$HOME_DIR/lp.mjs"

# Hooks and the watcher call this wrapper, so they keep working when PATH differs.
cat > "$HOME_DIR/bin/lp" <<WRAPPER
#!/bin/sh
exec "$NODE" "$HOME_DIR/lp.mjs" "\$@"
WRAPPER
chmod 755 "$HOME_DIR/bin/lp"
ln -sf "$HOME_DIR/bin/lp" "$BIN_DIR/lp"

INSTALL_ARGS=()
[ -n "${LP_HELPER_NO_HOOKS:-}" ] && INSTALL_ARGS+=(--no-hooks)
[ -n "${LP_HELPER_NO_WATCHER:-}" ] && INSTALL_ARGS+=(--no-watcher)
"$HOME_DIR/bin/lp" install ${INSTALL_ARGS[@]+"${INSTALL_ARGS[@]}"}

if [ -n "${LP_SERVER:-}" ]; then
  "$HOME_DIR/bin/lp" login --host "$LP_SERVER" ${LP_TOKEN:+--token "$LP_TOKEN"}
else
  printf '\nNext: lp login\n'
fi
case ":$PATH:" in
  *":$BIN_DIR:"*) ;;
  *) printf 'Add %s to your PATH to run lp from any terminal.\n' "$BIN_DIR" ;;
esac
printf 'LogicPacks helper installed. Run lp status to check it.\n'
