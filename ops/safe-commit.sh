#!/usr/bin/env bash
set -euo pipefail

if [ "${1-}" = "" ] || [ "${2-}" = "" ]; then
  echo "使い方: ./ops/safe-commit.sh \"コミットメッセージ\" 対象ファイル1 [対象ファイル2 ...]"
  exit 1
fi

message="$1"
shift

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

if ! git diff --cached --quiet; then
  echo "中断: すでにステージ済みの変更があります。先に整理してください。"
  git diff --cached --name-only
  exit 1
fi

for path in "$@"; do
  if [ ! -e "$path" ]; then
    echo "中断: 対象ファイルが見つかりません -> $path"
    exit 1
  fi
done

git add -- "$@"

mapfile -t staged < <(git diff --cached --name-only)
expected_count="$#"
actual_count="${#staged[@]}"

if [ "$actual_count" -ne "$expected_count" ]; then
  echo "中断: 確定対象の件数が想定と一致しません。"
  echo "想定: $expected_count / 実際: $actual_count"
  echo "実際の対象:"
  printf ' - %s\n' "${staged[@]}"
  git reset -- "$@"
  exit 1
fi

echo "確定対象:"
printf ' - %s\n' "${staged[@]}"
echo "メッセージ: $message"
read -r -p "この内容で確定する場合は YES を入力: " answer

if [ "$answer" != "YES" ]; then
  echo "中断しました。ステージを戻します。"
  git reset -- "$@"
  exit 1
fi

git commit -m "$message"
echo "完了: 安全コミットを実行しました。"
