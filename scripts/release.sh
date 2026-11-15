#!/bin/bash
# Builds the site and commits the output to the `deploy` branch.
# The web host serves a clone of that branch: finish with `git pull` there.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
    echo "Working tree is not clean. Commit or stash first." >&2
    exit 1
fi

SOURCE="$(git rev-parse --short HEAD)"
WORK=".scratch/deploy"

npm run build:site

git fetch -q origin deploy 2>/dev/null || true
git worktree remove --force "$WORK" 2>/dev/null || true
if git show-ref --verify --quiet refs/remotes/origin/deploy; then
    git worktree add -q -B deploy "$WORK" origin/deploy
else
    git worktree add -q --orphan -b deploy "$WORK"
fi

# Replace the branch contents with the new build.
find "$WORK" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/. "$WORK/"

git -C "$WORK" add -A
if git -C "$WORK" diff --cached --quiet; then
    echo "No changes to deploy."
else
    git -C "$WORK" commit -q -m "Deploy $SOURCE"
    git -C "$WORK" push -q -u origin deploy
    echo "Pushed deploy branch for $SOURCE."
fi
git worktree remove --force "$WORK"
echo "Now on the host: cd ~/apps/tetsubi-md && git pull"
