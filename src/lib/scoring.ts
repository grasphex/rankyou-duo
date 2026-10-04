export type ItemResult = {
  item: string;
  /** 本人の順位 (1〜5) */
  actualRank: number;
  /** 相手の予想順位 (1〜5) */
  guessedRank: number;
  /** abs(正解順位 - 予想順位) */
  diff: number;
};

export type RoundScore = {
  items: ItemResult[];
  totalDiff: number;
  score: number;
};

/**
 * 理解度スコアを計算する。
 * score = 100 - (各項目の順位差の合計 × 10)、最低0点。
 *
 * @param answer 本人の並び (先頭が1位)
 * @param guess  相手の予想した並び (先頭が1位)
 * @returns 本人の順位順に並んだ項目ごとの結果とスコア
 */
export function scoreRanking(answer: readonly string[], guess: readonly string[]): RoundScore {
  if (answer.length !== guess.length) {
    throw new Error("answer and guess must have the same length");
  }

  const items: ItemResult[] = answer.map((item, i) => {
    const guessIndex = guess.indexOf(item);
    if (guessIndex === -1) {
      throw new Error(`item "${item}" is missing from guess`);
    }
    const actualRank = i + 1;
    const guessedRank = guessIndex + 1;
    return { item, actualRank, guessedRank, diff: Math.abs(actualRank - guessedRank) };
  });

  const totalDiff = items.reduce((sum, r) => sum + r.diff, 0);
  const score = Math.max(0, 100 - totalDiff * 10);

  return { items, totalDiff, score };
}

export type Verdict = { message: string; emoji: string };

/** ラウンドの理解度に応じたメッセージ */
export function roundVerdict(score: number): Verdict {
  if (score >= 90) return { message: "相手のこと知りすぎ！", emoji: "🤯" };
  if (score >= 75) return { message: "かなり分かってる！", emoji: "🔥" };
  if (score >= 50) return { message: "まあまあ理解してる！", emoji: "👍" };
  if (score >= 25) return { message: "まだ知らない一面があるかも？", emoji: "🤔" };
  return { message: "本当に知り合い？笑", emoji: "😂" };
}

/** 最終結果の2人の称号 */
export function duoTitle(average: number): string {
  if (average >= 90) return "以心伝心のふたり";
  if (average >= 75) return "息ぴったりのふたり";
  if (average >= 50) return "いい感じのふたり";
  if (average >= 25) return "まだまだ発見があるふたり";
  return "これから知っていくふたり";
}
