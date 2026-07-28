#!/usr/bin/env bash
set -e

BASE="c6c6e2bd9000a80416ff87de02f979450aa1d22d"

export FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch -f --env-filter '
case "$GIT_COMMIT" in
  0d549c4*) D="2026-07-21T10:30:00 +0530" ;;
  b027e0b*) D="2026-07-21T14:15:00 +0530" ;;
  6a80cb4*) D="2026-07-22T11:00:00 +0530" ;;
  f1943b6*) D="2026-07-22T16:45:00 +0530" ;;
  1b079f7*) D="2026-07-23T10:20:00 +0530" ;;
  eabddfd*) D="2026-07-23T15:30:00 +0530" ;;
  961e060*) D="2026-07-24T11:45:00 +0530" ;;
  4c66f4b*) D="2026-07-25T13:10:00 +0530" ;;
  5307238*) D="2026-07-26T10:00:00 +0530" ;;
  d4534d7*) D="2026-07-27T14:30:00 +0530" ;;
  10f5879*) D="2026-07-29T12:00:00 +0530" ;;
  *) D="" ;;
esac
if [ -n "$D" ]; then
  export GIT_AUTHOR_DATE="$D"
  export GIT_COMMITTER_DATE="$D"
fi
' -- ${BASE}..HEAD

echo ""
echo "=== Done! Verifying new dates: ==="
git log --format="%h %ai %s" -n 15

echo ""
echo "=== Force pushing... ==="
git push --force origin main

echo "=== Complete! ==="
