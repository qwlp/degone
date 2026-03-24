#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST_FILE="$ROOT_DIR/segments.txt"
OUTPUT_FILE="$ROOT_DIR/degone-presentation-final.mp4"
REENCODE=false

usage() {
  cat <<'EOF'
Usage:
  ./scripts/concat-segments.sh [--reencode] [--output /path/to/output.mp4]

Options:
  --reencode       Re-encode during concat for mismatched input segments
  --output PATH    Write the final MP4 to PATH
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --reencode)
      REENCODE=true
      shift
      ;;
    --output)
      if [ "$#" -lt 2 ]; then
        echo "--output requires a path" >&2
        exit 1
      fi
      OUTPUT_FILE="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

cd "$ROOT_DIR"

if [ ! -f "$MANIFEST_FILE" ]; then
  "$ROOT_DIR/scripts/generate-segments-manifest.sh" "$MANIFEST_FILE"
fi

if [ "$REENCODE" = true ]; then
  ffmpeg -y \
    -f concat \
    -safe 0 \
    -i "$MANIFEST_FILE" \
    -c:v libx264 \
    -pix_fmt yuv420p \
    -r 30 \
    -c:a aac \
    "$OUTPUT_FILE"
else
  ffmpeg -y \
    -f concat \
    -safe 0 \
    -i "$MANIFEST_FILE" \
    -c copy \
    "$OUTPUT_FILE"
fi

echo "Created final video: $OUTPUT_FILE"
