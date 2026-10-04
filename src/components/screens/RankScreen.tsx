"use client";

import { useState } from "react";
import type { Question } from "@/data/questions";
import { shuffle, type PlayerIndex } from "@/lib/game";
import { RankingList } from "@/components/RankingList";
import { BottomBar, Button, CategoryBadge, PLAYER_THEME, PlayerChip, other } from "@/components/ui";

/**
 * 本人回答と相手の予想で共通の並べ替え画面。
 * 初期順は毎回ランダムにし、本人の並びが予想画面に引き継がれないようにする。
 */
export function RankScreen({
  mode,
  question,
  players,
  answerer,
  onSubmit,
}: {
  mode: "answer" | "guess";
  question: Question;
  players: [string, string];
  answerer: PlayerIndex;
  onSubmit: (order: string[]) => void;
}) {
  const [order, setOrder] = useState(() => shuffle(question.items));
  const guesser = other(answerer);
  const actor = mode === "answer" ? answerer : guesser;

  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <PlayerChip
            player={actor}
            name={players[actor]}
            suffix={mode === "answer" ? "が回答中" : "が予想中"}
          />
          <CategoryBadge category={question.category} />
        </div>

        <h1 className="mt-3 text-[24px] leading-snug font-black min-[360px]:text-[28px]">{question.question}</h1>

        <p className="mt-2 text-[15px] font-bold">
          {mode === "answer" ? (
            <span className="text-muted">あなた自身の順位を決めてください</span>
          ) : (
            <>
              <span className={PLAYER_THEME[answerer].text}>{players[answerer]}</span>
              <span className="text-muted"> さんならどう並べる？</span>
            </>
          )}
        </p>
      </div>

      <div className="mt-4">
        <RankingList order={order} onChange={setOrder} />
      </div>

      <BottomBar>
        <Button onClick={() => onSubmit(order)}>
          {mode === "answer" ? "これで決定" : "予想を決定"}
        </Button>
      </BottomBar>
    </div>
  );
}
