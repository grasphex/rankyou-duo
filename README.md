# RankYou Duo

「相手のこと、どれだけ分かってる？」

スマホ1台を2人で交互に渡して遊ぶ、価値観ランキング当てゲームです。
外部API・DB・認証なし。静的サイトとしてそのまま無料公開できます。

## 遊び方

1. 2人の名前を入れて「ゲームスタート！」
2. 答える人が、お題の5項目を「当てはまる順」に並べて決定
3. 「相手にスマホを渡してください」画面で相手に渡す
4. 相手が「この人ならこう並べる」と予想して決定
5. 結果発表（理解度 = 100 − 順位差の合計 × 10、最低0）
6. 交代しながら全10ラウンド → 最終結果

並べ替えはドラッグ＆ドロップ、または各項目の ▲▼ ボタンで行えます。

## 開発

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## 構成

- `src/data/questions.ts` — お題（12カテゴリ × 10問 = 120問）
- `src/lib/scoring.ts` — 採点ロジック `scoreRanking()`
- `src/lib/game.ts` — ゲーム状態（reducer）と sessionStorage 保存
- `src/components/` — 画面・並べ替えUI
- `src/app/` — メタデータ、favicon（`icon.svg`）、OG画像、manifest

## 公開

Vercel に GitHub リポジトリをインポートするだけで公開できます（環境変数不要）。
