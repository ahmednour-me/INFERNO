#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# INFERNO USB Forge — System Dependency Installer
# Supports: Debian/Ubuntu, Fedora/RHEL, Arch Linux, openSUSE
# ─────────────────────────────────────────────────────────────────────────────
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${CYAN}[info]${NC} $*"; }
ok()    { echo -e "${GREEN}[ok]${NC}   $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $*"; }
error() { echo -e "${RED}[err]${NC}  $*"; exit 1; }

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     INFERNO USB Forge — Dep Installer    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# Detect distro
detect_distro() {
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "$ID"
  elif [ -f /etc/debian_version ]; then
    echo "debian"
  elif [ -f /etc/arch-release ]; then
    echo "arch"
  else
    echo "unknown"
  fi
}

DISTRO=$(detect_distro)
info "Detected distro: $DISTRO"

install_system_deps() {
  case "$DISTRO" in
    ubuntu|debian|linuxmint|pop)
      info "Installing system packages via apt..."
      sudo apt-get update -qq
      sudo apt-get install -y \
        libwebkit2gtk-4.1-dev \
        libgtk-3-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev \
        libssl-dev \
        patchelf \
        pkg-config \
        build-essential \
        curl \
        wget \
        file \
        udisks2 \
        smartmontools \
        coreutils \
        util-linux
      ;;
    fedora|rhel|centos)
      info "Installing system packages via dnf..."
      sudo dnf install -y \
        webkit2gtk4.1-devel \
        gtk3-devel \
        libayatana-appindicator-gtk3-devel \
        librsvg2-devel \
        openssl-devel \
        patchelf \
        pkg-config \
        gcc \
        curl \
        wget \
        file \
        udisks2 \
        smartmontools \
        coreutils \
        util-linux
      ;;
    arch|manjaro|endeavouros)
      info "Installing system packages via pacman..."
      sudo pacman -Syu --noconfirm \
        webkit2gtk-4.1 \
        gtk3 \
        libayatana-appindicator \
        librsvg \
        openssl \
        patchelf \
        pkg-config \
        base-devel \
        curl \
        wget \
        udisks2 \
        smartmontools \
        coreutils \
        util-linux
      ;;
    opensuse*|sles)
      info "Installing system packages via zypper..."
      sudo zypper install -y \
        webkit2gtk3-devel \
        gtk3-devel \
        librsvg-devel \
        libopenssl-devel \
        patchelf \
        pkg-config \
        gcc \
        curl \
        udisks2 \
        smartmontools \
        coreutils \
        util-linux
      ;;
    *)
      warn "Unknown distro '$DISTRO'. Install manually: webkit2gtk, gtk3, udisks2, smartmontools"
      ;;
  esac
}

install_rust() {
  if command -v rustup &>/dev/null; then
    ok "Rust already installed: $(rustc --version)"
    rustup update stable
  else
    info "Installing Rust via rustup..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable
    source "$HOME/.cargo/env"
    ok "Rust installed: $(rustc --version)"
  fi
}

install_node() {
  if command -v node &>/dev/null; then
    ok "Node.js already installed: $(node --version)"
  else
    info "Installing Node.js via nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install --lts
    nvm use --lts
    ok "Node.js installed: $(node --version)"
  fi
}

install_tauri_cli() {
  if cargo tauri --version &>/dev/null 2>&1; then
    ok "Tauri CLI already installed"
  else
    info "Installing Tauri CLI..."
    cargo install tauri-cli --version "^2"
    ok "Tauri CLI installed"
  fi
}

install_system_deps
install_rust
install_node
install_tauri_cli

echo ""
ok "All dependencies installed."
info "Run the following to start development:"
echo ""
echo "  cd $(pwd)"
echo "  npm install"
echo "  npm run tauri:dev"
echo ""
echo "To build distributable packages:"
echo "  npm run tauri:build        # .deb + AppImage"
echo "  npm run tauri:build:deb    # .deb only"
echo "  npm run tauri:build:appimage # AppImage only"
echo ""
