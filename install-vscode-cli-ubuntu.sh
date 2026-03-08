#!/usr/bin/env bash
# install-vscode-cli-ubuntu.sh
# Installs the Visual Studio Code CLI (code) on Ubuntu via the official Microsoft APT repository.

set -euo pipefail

# ── helpers ──────────────────────────────────────────────────────────────────
info()  { printf '\033[1;34m[INFO]\033[0m  %s\n' "$*"; }
ok()    { printf '\033[1;32m[ OK ]\033[0m  %s\n' "$*"; }
die()   { printf '\033[1;31m[ERR ]\033[0m  %s\n' "$*" >&2; exit 1; }

# ── root check ───────────────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  die "This script must be run as root.  Try: sudo $0"
fi

# ── dependencies ─────────────────────────────────────────────────────────────
info "Installing prerequisites (apt-transport-https, curl, gnupg)..."
apt-get update -qq
apt-get install -y -qq apt-transport-https curl gnupg ca-certificates

# ── Microsoft GPG key ────────────────────────────────────────────────────────
KEYRING=/usr/share/keyrings/microsoft-archive-keyring.gpg

info "Adding Microsoft GPG key to $KEYRING..."
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
  | gpg --dearmor -o "$KEYRING"
chmod 644 "$KEYRING"

# ── APT source ───────────────────────────────────────────────────────────────
SOURCES_FILE=/etc/apt/sources.list.d/vscode.list

info "Adding VS Code APT repository to $SOURCES_FILE..."
echo "deb [arch=amd64,arm64,armhf signed-by=$KEYRING] \
https://packages.microsoft.com/repos/code stable main" \
  > "$SOURCES_FILE"

# ── install ──────────────────────────────────────────────────────────────────
info "Updating package index..."
apt-get update -qq

info "Installing code (VS Code CLI)..."
apt-get install -y code

# ── verify ───────────────────────────────────────────────────────────────────
if command -v code &>/dev/null; then
  ok "VS Code CLI installed successfully: $(code --version | head -1)"
else
  die "Installation finished but 'code' command was not found in PATH."
fi
