#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_FILE="${1:-$ROOT_DIR/segments.txt}"

cd "$ROOT_DIR"

shopt -s nullglob
segments=(segment-*.mp4)

if [ "${#segments[@]}" -eq 0 ]; then
  echo "No segment files found in $ROOT_DIR matching segment-*.mp4" >&2
  exit 1
fi

{
  for segment in "${segments[@]}"; do
    printf "file '%s'\n" "$segment"
  done
} > "$OUTPUT_FILE"

echo "Wrote manifest: $OUTPUT_FILE"
printf "Included %d segment(s)\n" "${#segments[@]}"
