#!/usr/bin/env bash
set -e
Bump="${1:-patch}"
npm version "$Bump"
git push --follow-tags
V="v$(node -p "require('./package.json').version")"
gh release create "$V" --generate-notes
