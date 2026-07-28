$ErrorActionPreference = "Stop"

# Map: old_hash -> new_date (ISO format with IST offset)
# We rewrite commits from 0d549c4 through 10f5879
# Parent of 0d549c4 is c6c6e2b (Jul 19, untouched)

$commitMap = @{
    "0d549c4faf23483267fb7379c9af1987f2b4012e" = "2026-07-21T10:30:00 +0530"
    "b027e0bfa8b9e00664b33690dc7a04522151b4db" = "2026-07-21T14:15:00 +0530"
    "6a80cb415068d798e2a04ed76bddf73cba92dc50" = "2026-07-22T11:00:00 +0530"
    "f1943b6a6a25696b90b80c9bf725e63af6d5bcd7" = "2026-07-22T16:45:00 +0530"
    "1b079f7d901639cefccec4e030dc44c5517b97bf" = "2026-07-23T10:20:00 +0530"
    "eabddfd374d688fb723986a36b6e4909bbc45ee4" = "2026-07-23T15:30:00 +0530"
    "961e060d08e80fe9df8a7624877f4a627c33bdef" = "2026-07-24T11:45:00 +0530"
    "4c66f4bf474e0574eb604469bbe3b53f6dcdf75b" = "2026-07-25T13:10:00 +0530"
    "5307238a2d6ff167a91c1d35a95bd48786663b4b" = "2026-07-26T10:00:00 +0530"
    "d4534d7040efefec8bf82621ba87809765afb534" = "2026-07-27T14:30:00 +0530"
    "10f587901472bf0aa838ab9e091967c25de296ae" = "2026-07-29T12:00:00 +0530"
}

# Build the filter-branch commit-filter script
$filterScript = 'case "$GIT_COMMIT" in'
foreach ($hash in $commitMap.Keys) {
    $newDate = $commitMap[$hash]
    $filterScript += "`n  $hash)"
    $filterScript += "`n    export GIT_AUTHOR_DATE=`"$newDate`""
    $filterScript += "`n    export GIT_COMMITTER_DATE=`"$newDate`""
    $filterScript += "`n    ;;"
}
$filterScript += "`nesac"
$filterScript += "`ngit commit-tree `"$@`""

Write-Host "Filter script:"
Write-Host $filterScript
Write-Host ""

# Write to temp file for git to use
$tempFile = Join-Path $env:TEMP "git-redate-filter.sh"
$filterScript | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline

Write-Host "Running git filter-branch..."
Write-Host "Rewriting 11 commits from Jul 21 to Jul 29..."

# The parent of the first commit to rewrite
$parentHash = "c6c6e2bd9000a80416ff87de02f979450aa1d22d"

git filter-branch -f --commit-filter "
case `$GIT_COMMIT in
  0d549c4faf23483267fb7379c9af1987f2b4012e)
    export GIT_AUTHOR_DATE='2026-07-21T10:30:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-21T10:30:00 +0530'
    ;;
  b027e0bfa8b9e00664b33690dc7a04522151b4db)
    export GIT_AUTHOR_DATE='2026-07-21T14:15:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-21T14:15:00 +0530'
    ;;
  6a80cb415068d798e2a04ed76bddf73cba92dc50)
    export GIT_AUTHOR_DATE='2026-07-22T11:00:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-22T11:00:00 +0530'
    ;;
  f1943b6a6a25696b90b80c9bf725e63af6d5bcd7)
    export GIT_AUTHOR_DATE='2026-07-22T16:45:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-22T16:45:00 +0530'
    ;;
  1b079f7d901639cefccec4e030dc44c5517b97bf)
    export GIT_AUTHOR_DATE='2026-07-23T10:20:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-23T10:20:00 +0530'
    ;;
  eabddfd374d688fb723986a36b6e4909bbc45ee4)
    export GIT_AUTHOR_DATE='2026-07-23T15:30:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-23T15:30:00 +0530'
    ;;
  961e060d08e80fe9df8a7624877f4a627c33bdef)
    export GIT_AUTHOR_DATE='2026-07-24T11:45:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-24T11:45:00 +0530'
    ;;
  4c66f4bf474e0574eb604469bbe3b53f6dcdf75b)
    export GIT_AUTHOR_DATE='2026-07-25T13:10:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-25T13:10:00 +0530'
    ;;
  5307238a2d6ff167a91c1d35a95bd48786663b4b)
    export GIT_AUTHOR_DATE='2026-07-26T10:00:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-26T10:00:00 +0530'
    ;;
  d4534d7040efefec8bf82621ba87809765afb534)
    export GIT_AUTHOR_DATE='2026-07-27T14:30:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-27T14:30:00 +0530'
    ;;
  10f587901472bf0aa838ab9e091967c25de296ae)
    export GIT_AUTHOR_DATE='2026-07-29T12:00:00 +0530'
    export GIT_COMMITTER_DATE='2026-07-29T12:00:00 +0530'
    ;;
esac
git commit-tree `"`$@`"
" -- $parentHash..HEAD
