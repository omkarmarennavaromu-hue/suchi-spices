#!/usr/bin/env bash
#
# Push this repository to GitHub.
#
#   GITHUB_TOKEN=<fine-grained PAT> ./push-to-github.sh <owner> <repo-name> [private|public]
#
# The token is read from the environment, never written to disk. The remote is
# reset to a clean URL immediately after a successful push so the credential is
# not left sitting in .git/config.
#
# Recommended token: GitHub → Settings → Developer settings → Personal access
# tokens → Fine-grained. Scope it to a single repository, grant only
# "Contents: Read and write", and set the shortest expiry you can live with.
# Revoke it once the push is done.

set -euo pipefail

if [ $# -lt 2 ]; then
  echo "usage: GITHUB_TOKEN=<token> $0 <owner> <repo-name> [private|public]" >&2
  exit 1
fi

OWNER="$1"
REPO="$2"
VISIBILITY="${3:-public}"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "error: GITHUB_TOKEN is not set." >&2
  exit 1
fi

CLEAN_URL="https://github.com/${OWNER}/${REPO}.git"
AUTH_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${OWNER}/${REPO}.git"

revert_remote() {
  git remote set-url origin "$CLEAN_URL" 2>/dev/null || true
}
trap revert_remote EXIT

echo "→ checking whether ${OWNER}/${REPO} exists…"
if ! curl -fsS -o /dev/null \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${OWNER}/${REPO}"; then
  echo "→ creating ${OWNER}/${REPO} (${VISIBILITY})…"
  curl -fsS -X POST \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"${REPO}\",\"private\":$([ "$VISIBILITY" = "private" ] && echo true || echo false),\"description\":\"Suchi Spices — a universe of flavour. Campaign assets and immersive brand site.\"}" \
    > /dev/null
fi

echo "→ pushing main…"
git remote remove origin 2>/dev/null || true
git remote add origin "$AUTH_URL"
git push -u origin main

revert_remote
trap - EXIT

echo "✓ done — https://github.com/${OWNER}/${REPO}"
