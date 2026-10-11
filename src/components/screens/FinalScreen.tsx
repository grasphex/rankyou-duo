"use client";

import { useEffect, useState } from "react";
import { averageScoreAsGuesser, getQuestion, type PlayerIndex, type RoundRecord } from "@/lib/game";
import { duoTitle } from "@/lib/scoring";
import { getShareMethod, haptic, shareResult } from "@/lib/native";
import { Confetti, useCountUp } from "@/components/effects";
import { BottomBar, Button, Card, Eyebrow, Name, PLAYER_THEME, ScoreRing, other } from "@/components/ui";

export function FinalScreen({
  players,
  records,
  onPlayAgain,
  onQuit,
}: {
  players: [string, string];
  records: RoundRecord[];
  onPlayAgain: () => void;
  onQuit: () => void;
}) {
  const avgs = [averageScoreAsGuesser(records, 0), averageScoreAsGuesser(records, 1)] as const;
  const overall = records.length
    ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length)
    : 0;
  const perfects = records.filter((r) => r.score === 100).length;
  const winner: PlayerIndex | null = avgs[0] === avgs[1] ? null : avgs[0] > avgs[1] ? 0 : 1;
  const { value, done } = useCountUp(overall, 1800, 500);

  useEffect(() => {
    if (done) haptic("success");
  }, [done]);

  return (
    <div className="flex flex-1 flex-col">
      {done && <Confetti count={overall >= 50 ? 72 : 36} />}

      <div className="pt-7 text-center">
        <Eyebrow>Final Result</Eyebrow>
        <h1 className="mt-2 text-2xl font-black">10ラウンド終了！</h1>
      </div>

      {/* それぞれの理解度 */}
      <div className="mt-6 flex flex-col gap-3">
        {([0, 1] as const).map((p) => {
          const target = other(p);
          return (
            <Card
              key={p}
              className={`animate-rise relative flex items-center gap-3 p-4 ${
                winner === p ? "ring-2 ring-warn/70" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="flex min-w-0 items-center gap-1.5 text-[15px] font-extrabold">
                  <span className={`truncate ${PLAYER_THEME[p].text}`}>{players[p]}</span>
                  <span className="shrink-0 text-faint">→</span>
                  <span className={`truncate ${PLAYER_THEME[target].text}`}>{players[target]}</span>
                </p>
                <p className="mt-0.5 text-xs font-medium text-muted">理解度（平均）</p>
              </div>
              {winner === p && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-warn px-2.5 py-0.5 text-[11px] font-black text-bg">
                  👑 よく分かってる
                </span>
              )}
              <p className="font-display shrink-0 text-[40px] leading-none font-black tabular-nums">
                {avgs[p]}
                <span className="text-base font-extrabold text-muted">点</span>
              </p>
            </Card>
          );
        })}
      </div>

      {/* 二人の理解度 */}
      <Card className="relative mt-4 flex flex-col items-center overflow-hidden px-4 pt-6 pb-5 text-center">
        <div className="bg-brand pointer-events-none absolute -top-24 h-48 w-48 rounded-full opacity-25 blur-3xl" />
        <p className="relative text-sm font-extrabold text-muted">二人の理解度</p>
        <div className="relative mt-3">
          <ScoreRing value={value} size={200} stroke={16}>
            <span className="font-display text-[72px] leading-none font-black tabular-nums">
              {value}
              <span className="text-[28px] font-extrabold text-muted">%</span>
            </span>
          </ScoreRing>
        </div>
        <p className={`relative mt-4 text-[22px] font-black ${done ? "animate-pop" : "opacity-0"}`}>
          <span className="text-brand">{duoTitle(overall)}</span>
        </p>
        <p className="relative mt-2 text-sm font-medium text-muted">
          {winner === null ? (
            "2人とも同じくらい分かってた！"
          ) : (
            <>
              <Name player={winner} name={players[winner]} /> さんの方が相手を分かってた！
            </>
          )}
          {perfects > 0 && <span className="text-good">　完全一致 {perfects}回</span>}
        </p>
        <ShareButton overall={overall} />
      </Card>

      <details className="group mt-4 rounded-[28px] bg-surface/70 px-5 py-4 ring-1 ring-line">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-extrabold text-muted">
          ラウンドごとの結果
          <span className="transition group-open:rotate-180">⌄</span>
        </summary>
        <ul className="mt-3 flex flex-col gap-2">
          {records.map((r, i) => {
            const guesser = other(r.answerer);
            return (
              <li key={i} className="flex items-center gap-3 rounded-2xl bg-surface-2 px-3 py-2.5">
                <span className="font-display w-5 shrink-0 text-sm font-black text-faint">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{getQuestion(r.questionId).question}</span>
                  <span className="text-[11px] font-medium text-muted">
                    <Name player={guesser} name={players[guesser]} /> が予想
                  </span>
                </span>
                <span className="font-display shrink-0 text-lg font-black tabular-nums">
                  {r.score}
                  <span className="text-xs text-muted">%</span>
                </span>
              </li>
            );
          })}
        </ul>
      </details>

      <BottomBar>
        <Button onClick={onPlayAgain}>もう一度遊ぶ</Button>
        <Button variant="ghost" onClick={onQuit}>
          名前を変えて最初から
        </Button>
      </BottomBar>
    </div>
  );
}

const SHARE_URL = "https://rankyou.grasphex.com";

/** 最終結果のシェア。共有手段がないブラウザでは表示しない */
function ShareButton({ overall }: { overall: number }) {
  // 最終結果画面はゲーム後にブラウザ上でだけ描画されるため、初期化時に判定できる
  const [method] = useState(getShareMethod);
  const [copied, setCopied] = useState(false);

  if (!method) return null;

  const share = async () => {
    const result = await shareResult({
      title: "RankYou Duo",
      text: `RankYou Duoで2人の理解度は${overall}%でした！\n相手のこと、どれだけ分かってる？`,
      url: SHARE_URL,
    });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="relative mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/8 px-5 text-sm font-extrabold text-ink ring-1 ring-line transition active:scale-[0.97] active:bg-white/14"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {copied ? "コピーしました" : method === "copy" ? "結果をコピー" : "結果をシェア"}
    </button>
  );
}
