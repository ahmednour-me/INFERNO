#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# INFERNO USB Forge — Build .deb and AppImage packages
# ─────────────────────────────────────────────────────────────────────────────
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${CYAN}[info]${NC} $*"; }
ok()    { echo -e "${GREEN}[ok]${NC}   $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $*"; }
error() { echo -e "${RED}[err]${NC}  $*"; exit 1; }

DIST_DIR="./dist-packages"
mkdir -p "$DIST_DIR"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     INFERNO USB Forge — Package Builder  ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# Check requirements
command -v cargo  &>/dev/null || error "cargo not found. Run ./install-deps.sh first"
command -v npm    &>/dev/null || error "npm not found. Run ./install-deps.sh first"
command -v node   &>/dev/null || error "node not found. Run ./install-deps.sh first"

info "Node: $(node --version)  |  npm: $(npm --version)  |  Rust: $(rustc --version)"
echo ""

# Install JS dependencies
info "Installing npm packages..."
npm install --legacy-peer-deps
ok "npm install complete"

# Build frontend
info "Building frontend (Vite)..."
npm run build
ok "Frontend build complete"

BUILD_BOTH=${1:-"both"}  # "both" | "deb" | "appimage"

case "$BUILD_BOTH" in
  deb)
    info "Building .deb package..."
    source $HOME/.cargo/env && cargo tauri build --bundles deb
    ;;
  appimage)
    info "Building AppImage..."
    source $HOME/.cargo/env && cargo tauri build --bundles appimage
    ;;
  *)
    info "Building .deb + AppImage..."
    source $HOME/.cargo/env && cargo tauri build --bundles deb,appimage
    ;;
esac

# Collect output
info "Collecting output packages..."
find ./src-tauri/target/release/bundle \( -name "*.deb" -o -name "*.AppImage" \) 2>/dev/null \
  | while read f; do
      cp "$f" "$DIST_DIR/"
      ok "Copied: $(basename $f)"
    done

echo ""
ok "Build complete! Packages in: $DIST_DIR/"
ls -lh "$DIST_DIR/" 2>/dev/null || warn "No packages found in $DIST_DIR"
echo ""
info "Install .deb: sudo dpkg -i $DIST_DIR/inferno-usb-forge*.deb"
info "Run AppImage: chmod +x $DIST_DIR/*.AppImage && ./$DIST_DIR/*.AppImage"
echo ""
