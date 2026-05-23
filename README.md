# 引っ越しプランナー（非公開共有）

このリポジトリは **PRIVATE** です。公開サイト化はしていません。

## 使い方（共同確認）
1. このリポジトリを取得（Download ZIP でも可）
2. `move-control-center.html` をブラウザで開く
3. 「平面図で配置」タブで家具配置・寸法を確認
4. 「写真ダブルチェック」で部屋ごとに写真確認

## 主要ファイル
- `move-control-center.html`
- `assets/photos/`（部屋別写真）
- `v2/floorplan-3d.html`（旧3D参考）

## 安全コミット手順（事故防止）
意図しない大量コミットを防ぐため、コミット時は次を使う:

```bash
./ops/safe-commit.sh "コミットメッセージ" move-control-center.html README.md
```

- 事前に対象ファイルを明示しないと進まない
- 対象件数が一致しない場合は自動中断
- 最終確認で `YES` を入力しない限りコミットしない
