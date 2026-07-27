#!/usr/bin/env bash
#
# Copy one Postgres database into another - used to seed QA / DEV from a
# snapshot of production.
#
#   ./scripts/clone-db.sh "<SOURCE_URL>" "<TARGET_URL>"
#
# Safety rails, because this command destroys the target:
#   * refuses to run if source and target are the same database
#   * refuses to write into a target that looks like production
#   * requires you to type the target host to confirm
#
# Requires pg_dump / psql v16+ (Neon runs PG 16/17):
#   macOS:  brew install libpq && brew link --force libpq
#   Ubuntu: sudo apt install postgresql-client-16

set -euo pipefail

SRC="${1:-}"
DST="${2:-}"

red()  { printf '\033[31m%s\033[0m\n' "$1"; }
grn()  { printf '\033[32m%s\033[0m\n' "$1"; }
ylw()  { printf '\033[33m%s\033[0m\n' "$1"; }

if [[ -z "$SRC" || -z "$DST" ]]; then
  red "Usage: ./scripts/clone-db.sh \"<SOURCE_URL>\" \"<TARGET_URL>\""
  echo
  echo "Example:"
  echo "  ./scripts/clone-db.sh \"\$PROD_DATABASE_URL\" \"\$QA_DATABASE_URL\""
  exit 1
fi

# --- host/db extraction (no credentials printed anywhere) ---
host_of() { sed -E 's#^[a-z]+://[^@]*@([^/:?]+).*#\1#' <<<"$1"; }
db_of()   { sed -E 's#^[a-z]+://[^/]+/([^?]+).*#\1#'    <<<"$1"; }

SRC_HOST="$(host_of "$SRC")"; SRC_DB="$(db_of "$SRC")"
DST_HOST="$(host_of "$DST")"; DST_DB="$(db_of "$DST")"

echo
echo "  source : ${SRC_HOST}/${SRC_DB}"
echo "  target : ${DST_HOST}/${DST_DB}   <-- will be ERASED and replaced"
echo

# --- guard 1: never clone a database onto itself ---
if [[ "$SRC_HOST/$SRC_DB" == "$DST_HOST/$DST_DB" ]]; then
  red "Refusing to run: source and target are the same database."
  exit 1
fi

# --- guard 2: never write into something that looks like production ---
if [[ "$DST_DB $DST_HOST" == *prod* || "$DST_DB" == "neondb" && "${ALLOW_PROD_TARGET:-}" != "yes" ]]; then
  red "Refusing to run: the target looks like a production database."
  ylw "If this really is the QA/DEV database, re-run with ALLOW_PROD_TARGET=yes"
  exit 1
fi

# --- guard 3: human confirmation ---
ylw "This will DROP every table in the target and replace it with a copy of the source."
read -r -p "Type the target host to confirm (${DST_HOST}): " CONFIRM
if [[ "$CONFIRM" != "$DST_HOST" ]]; then
  red "Confirmation did not match. Nothing was changed."
  exit 1
fi

DUMP="$(mktemp -t marrelay-dump-XXXXXX.sql)"
trap 'rm -f "$DUMP"' EXIT

echo
grn "1/3  Dumping source..."
pg_dump --no-owner --no-privileges --clean --if-exists --quote-all-identifiers \
        --file="$DUMP" "$SRC"

grn "2/3  Restoring into target..."
psql --quiet --set ON_ERROR_STOP=on --file="$DUMP" "$DST" >/dev/null

grn "3/3  Verifying..."
psql --quiet --tuples-only --no-align "$DST" -c "
  SELECT 'leads: '    || (SELECT COUNT(*) FROM leads)
       || ' | users: ' || (SELECT COUNT(*) FROM users)
       || ' | invoices: ' || (SELECT COUNT(*) FROM invoices);
" || ylw "Verification query failed - check the tables manually."

echo
grn "Done. ${DST_HOST}/${DST_DB} is now a copy of ${SRC_HOST}/${SRC_DB}."
echo
ylw "Reminder: the copy contains real customer data. Treat QA with the same care"
ylw "as production, or anonymise it before sharing access widely."
