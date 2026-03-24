#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${1:-8000}"

cd "$ROOT_DIR"

echo "Serving DeGone Presentation from $ROOT_DIR"
echo "Open: http://localhost:$PORT"

exec python3 -m http.server "$PORT"
