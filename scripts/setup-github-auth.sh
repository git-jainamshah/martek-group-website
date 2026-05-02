#!/usr/bin/env bash
#
# Automates GitHub CLI (gh) setup for Option A: install gh, authenticate,
# wire Git to use gh, and remove stale github.com lines from ~/.git-credentials
# (common cause of "wrong account" pushes when credential.helper = store).
#
# Usage:
#   ./scripts/setup-github-auth.sh              # browser login if needed (recommended)
#   ./scripts/setup-github-auth.sh --push       # same, then git push origin main
#   GH_TOKEN=ghp_xxx ./scripts/setup-github-auth.sh           # fully automated (no browser)
#   GH_TOKEN=ghp_xxx ./scripts/setup-github-auth.sh --push    # automated + push
#
# gh install: prefers repo-local .tools/gh-cli/bin/gh (see README in script comments),
# then PATH, then Homebrew. Do not commit tokens.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Bundled CLI (download once: see ensure_gh)
export PATH="${REPO_ROOT}/.tools/gh-cli/bin:${PATH}"
CREDS_FILE="${HOME}/.git-credentials"
DO_PUSH=false

for arg in "$@"; do
  case "$arg" in
    --push) DO_PUSH=true ;;
    -h|--help)
      echo "Usage: $0 [--push]"
      echo "  --push   Run git push origin main from repo root after auth"
      echo ""
      echo "If GH_TOKEN is set (classic PAT with repo scope), login is non-interactive."
      echo "Otherwise the GitHub browser login flow opens once."
      exit 0
      ;;
  esac
done

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()    { echo -e "${BLUE}ℹ${NC} $*"; }
ok()      { echo -e "${GREEN}✓${NC} $*"; }
warn()    { echo -e "${YELLOW}⚠${NC} $*"; }
fail()    { echo -e "${RED}✗${NC} $*"; exit 1; }

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

ensure_gh() {
  if need_cmd gh; then
    ok "GitHub CLI ready: $(gh --version | head -1)"
    return
  fi
  if need_cmd brew; then
    info "Installing GitHub CLI (gh) via Homebrew..."
    if brew install gh; then
      ok "Installed: $(gh --version | head -1)"
      return
    fi
    warn "Homebrew install failed (try updating brew, or install gh from https://cli.github.com/)."
  fi
  fail "GitHub CLI (gh) not found. Install: https://cli.github.com/ — or place gh at ${REPO_ROOT}/.tools/gh-cli/bin/gh"
}

strip_legacy_github_creds() {
  if [[ ! -f "$CREDS_FILE" ]]; then
    info "No ${CREDS_FILE} — nothing to clean."
    return
  fi
  if ! grep -q 'github.com' "$CREDS_FILE" 2>/dev/null; then
    info "No github.com entries in ${CREDS_FILE}."
    return
  fi
  local backup="${CREDS_FILE}.bak.$(date +%Y%m%d%H%M%S)"
  cp "$CREDS_FILE" "$backup"
  ok "Backed up credentials to ${backup}"
  grep -v 'github.com' "$CREDS_FILE" > "${CREDS_FILE}.tmp" || true
  mv "${CREDS_FILE}.tmp" "$CREDS_FILE"
  ok "Removed github.com lines from ${CREDS_FILE} (avoids wrong cached HTTPS user)."
}

ensure_login() {
  if gh auth status -h github.com >/dev/null 2>&1; then
    ok "Already logged in to github.com"
    gh auth status -h github.com
    return
  fi

  if [[ -n "${GH_TOKEN:-}" ]]; then
    info "GH_TOKEN found — authenticating non-interactively..."
    gh auth login --with-token <<<"$GH_TOKEN"
  else
    info "Opening browser — sign in with your personal GitHub account..."
    gh auth login --web --git-protocol https --hostname github.com
  fi
  ok "Authenticated."
  gh auth status -h github.com
}

setup_git_helper() {
  info "Configuring Git to use gh for GitHub credentials..."
  gh auth setup-git
  ok "gh auth setup-git complete."
}

main() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║  GitHub CLI auth (Option A) — automated setup      ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
  echo ""

  ensure_gh
  strip_legacy_github_creds
  ensure_login
  setup_git_helper

  info "Logged in as: $(gh api user --jq .login 2>/dev/null || echo '(unknown)')"

  if [[ "$DO_PUSH" == true ]]; then
    info "Pushing from ${REPO_ROOT} ..."
    git -C "$REPO_ROOT" push origin main
    ok "git push complete."
  else
    info "Skipped git push. To push: cd \"$REPO_ROOT\" && git push origin main"
    info "Or re-run: ./scripts/setup-github-auth.sh --push"
  fi

  echo ""
  ok "Done."
}

main
