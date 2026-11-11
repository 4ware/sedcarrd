#!/usr/bin/env bash
# Creates the local S3 buckets (dev + test) on the docker "storage" service and allows browser
# uploads from local dev servers (CORS). Safe to run repeatedly.
#   bun run storage:setup
set -euo pipefail
cd "$(dirname "$0")/.."
set -a
# shellcheck disable=SC1091
. ./.env
set +a

: "${S3_ENDPOINT:?S3_ENDPOINT missing in .env}"
sign=(--aws-sigv4 "aws:amz:${S3_REGION:-us-east-1}:s3" --user "${S3_ACCESS_KEY_ID}:${S3_SECRET_ACCESS_KEY}")

cors='<CORSConfiguration><CORSRule>
<AllowedOrigin>http://localhost:*</AllowedOrigin><AllowedOrigin>http://127.0.0.1:*</AllowedOrigin>
<AllowedMethod>PUT</AllowedMethod><AllowedMethod>GET</AllowedMethod><AllowedMethod>HEAD</AllowedMethod>
<AllowedHeader>*</AllowedHeader><ExposeHeader>ETag</ExposeHeader><MaxAgeSeconds>3000</MaxAgeSeconds>
</CORSRule></CORSConfiguration>'
md5=$(printf '%s' "$cors" | openssl md5 -binary | base64)

for bucket in "${S3_BUCKET:?S3_BUCKET missing in .env}" "${S3_TEST_BUCKET:?S3_TEST_BUCKET missing in .env}"; do
  status=$(curl -s -o /dev/null -w '%{http_code}' -X PUT "${sign[@]}" "$S3_ENDPOINT/$bucket")
  case "$status" in
    200) echo "created bucket $bucket" ;;
    409) echo "bucket $bucket exists" ;;
    *) echo "could not create bucket $bucket (HTTP $status)" >&2; exit 1 ;;
  esac
  curl -sf -o /dev/null -X PUT "${sign[@]}" -H "Content-MD5: $md5" -H 'Content-Type: application/xml' \
    --data-binary "$cors" "$S3_ENDPOINT/$bucket?cors"
  echo "  CORS set for local dev origins"
done
