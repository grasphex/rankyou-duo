"use client";

import type { Question } from "@/data/questions";
import { TOTAL_ROUNDS, type RoundRecord } from "@/lib/game";
import { roundVerdict, scoreRanking } from "@/lib/scoring";
import { Confetti, useCountUp } from "@/components/effects";
import { BottomBar, Button, Card, CategoryBadge, Eyebrow, Name, PLAYER_THEME, ScoreRing, other } from "@/components/ui";

export function ResultScreen({
  round,
  record,
  question,
  players,
  onNext,
}: {
  round: number;
  record: RoundRecord;
  question: Question;
  players: [string, string];
  onNext: () => void;
}) {
  const answerer = record.answerer;
  const guesser = other(answerer);
  const { items, totalDiff } = scoreRanking(record.answer, record.guess);
  const actualRankOf = new Map(items.map((r) => [r.item, r.actualRank]));
  const matches = items.filter((r) => r.diff === 0).length;
  const { value, done } = useCountUp(record.score);
  const verdict = roundVerdict(record.score);
  const isLast = round + 1 >= TOTAL_ROUNDS;

  return (
    <div className="flex flex-1 flex-col">
      {done && record.score >= 75 && <Confetti count={record.score === 100 ? 72 : 40} />}

      <div className="flex flex-col items-center pt-5 text-center">
        <Eyebrow>Round {round + 1} Result</Eyebrow>
        <p className="mt-2 text-sm font-medium text-muted">
          <Name player={guesser} name={players[guesser]} /> → <Name player={answerer} name={players[answerer]} /> の理解度
        </p>

        <div className="mt-4">
          <ScoreRing value={value} size={168} stroke={13}>
            <span className="text-xs font-bold tracking-widest text-muted">理解度</span>
            <span className="font-display text-[56px] leading-none font-black tabular-nums">
              {value}
              <span className="text-2xl font-extrabold text-muted">%</span>
            </span>
          </ScoreRing>
        </div>

        <p
          className={`mt-4 min-h-9 text-xl font-black transition-all duration-300 min-[360px]:text-2xl ${
            done ? "animate-pop" : "opacity-0"
          }`}
        >
          <span aria-hidden>{verdict.emoji}</span> {verdict.message}
        </p>
      </div>

      <Card className="mt-6 p-4 min-[360px]:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base leading-snug font-extrabold">{question.question}</h2>
          <CategoryBadge category={question.category} />
        </div>

        {/* 本人 VS 予想 */}
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-x-2 text-center">
          <p className={`truncate text-xs font-extrabold ${PLAYER_THEME[answerer].text}`}>
            {players[answerer]}の本音
          </p>
          <p className="font-display text-xs font-black text-faint">VS</p>
          <p className={`truncate text-xs font-extrabold ${PLAYER_THEME[guesser].text}`}>
            {players[guesser]}の予想
          </p>
        </div>

        <ol className="mt-2 flex flex-col gap-2">
          {record.answer.map((actualItem, i) => {
            const guessedItem = record.guess[i];
            const hit = actualItem === guessedItem;
            const guessedActual = actualRankOf.get(guessedItem) ?? 0;
            const diff = Math.abs(guessedActual - (i + 1));
            return (
              <li
                key={i}
                className={`animate-rise grid grid-cols-[1fr_auto_1fr] items-stretch gap-x-2 rounded-2xl p-1.5 ${
                  hit ? "bg-good/12 ring-1 ring-good/40" : "bg-surface-2"
                }`}
                style={{ animationDelay: `${0.25 + i * 0.12}s` }}
              >
                <span className="flex items-center rounded-xl px-2 py-2 text-left text-sm leading-tight font-bold break-words">
                  {actualItem}
                </span>
                <span
                  className={`font-display flex w-9 flex-col items-center justify-center rounded-xl leading-none ${
                    hit ? "bg-good text-bg" : "bg-white/6 text-muted"
                  }`}
                >
                  <span className="text-lg font-black">{i + 1}</span>
                  <span className="text-[9px] font-bold">{hit ? "一致" : "位"}</span>
                </span>
                <span className="flex flex-col items-end justify-center px-2 py-1.5 text-right">
                  <span className="text-sm leading-tight font-bold break-words">{guessedItem}</span>
                  {!hit && (
                    <span className="mt-1 flex items-center gap-1 text-[11px] font-bold whitespace-nowrap text-muted">
                      本人{guessedActual}位
                      <span
                        className={`rounded-full px-1.5 py-px ${
                          diff === 1 ? "bg-warn/15 text-warn" : "bg-p1/15 text-p1"
                        }`}
                      >
                        ±{diff}
                      </span>
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line pt-3 text-xs font-bold text-muted">
          <span>
            一致 <span className="text-good">{matches}</span> / 5
          </span>
          <span>
            ズレ合計 {totalDiff} → 100 − {totalDiff}×10 = <span className="text-ink">{record.score}</span>
          </span>
        </div>
      </Card>

      <BottomBar>
        <Button onClick={onNext}>{isLast ? "最終結果を見る" : "次のラウンドへ"}</Button>
        {!isLast && (
          <p className="pt-2 text-center text-xs font-medium text-muted">
            次は <Name player={guesser} name={players[guesser]} /> さんが答える番
          </p>
        )}
      </BottomBar>
    </div>
  );
}
