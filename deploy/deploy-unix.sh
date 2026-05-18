#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
EXAMPLE_FILE="$SCRIPT_DIR/.env.example"

if [ ! -f "$ENV_FILE" ] && [ -f "$EXAMPLE_FILE" ]; then
  cp "$EXAMPLE_FILE" "$ENV_FILE"
fi

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"

if [ -n "${PYTHON_BIN:-}" ]; then
  PYTHON="$PYTHON_BIN"
elif command -v python3 >/dev/null 2>&1; then
  PYTHON="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON="python"
else
  echo "Python was not found. Install Python 3.10+ or set PYTHON_BIN in deploy/.env." >&2
  exit 1
fi

cd "$ROOT_DIR"

if [ ! -x ".venv/bin/python" ]; then
  echo "Creating virtual environment..."
  "$PYTHON" -m venv .venv
fi

PYTHON="$ROOT_DIR/.venv/bin/python"

echo "Installing dependencies..."
"$PYTHON" -m pip install --upgrade pip
"$PYTHON" -m pip install -r server/requirements.txt

export HOST PORT

echo ""
echo "Zhiyou Kangsai website is ready."
echo "Listen URL: http://$HOST:$PORT"
echo "Local URL:  http://127.0.0.1:$PORT"
echo "Press Ctrl+C to stop."
echo ""

exec "$PYTHON" server/server.py
