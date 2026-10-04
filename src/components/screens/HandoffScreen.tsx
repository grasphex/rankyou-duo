import type { PlayerIndex } from "@/lib/game";
import { BottomBar, Button, Name, PLAYER_THEME, other } from "@/components/ui";

/**
 * 本人回答と予想の間に必ず挟む画面。
 * 回答内容・順位・お題の項目など、前の画面の情報は一切表示しない。
 */
export function HandoffScreen({
  players,
  answerer,
  onReady,
}: {
  players: [string, string];
  answerer: PlayerIndex;
  onReady: () => void;
}) {
  const guesser = other(answerer);
  const t = PLAYER_THEME[guesser];

  return (
    <div className="flex flex-1 flex-col">
      {/* 画面全体の色を変えて「渡す場面」だと一目で分かるようにする */}
      <div
        className={`pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b ${t.glow} via-bg to-bg`}
        aria-hidden
      />

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative">
          <div className={`absolute inset-0 rounded-full ${t.bg} opacity-30 blur-3xl`} />
          <div className="animate-handoff relative text-[88px] leading-none" aria-hidden>
            📱
          </div>
        </div>

        <h1 className="animate-pop mt-10 text-[32px] leading-[1.35] font-black min-[360px]:text-[36px]">
          <span className={t.text}>{players[guesser]}</span>
          <span className="text-2xl"> さんに</span>
          <br />
          スマホを渡してね
        </h1>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface/80 px-4 py-2.5 text-sm font-medium text-muted ring-1 ring-line">
          <span aria-hidden>🤫</span>
          <span>
            <Name player={answerer} name={players[answerer]} /> さんの答えはヒミツ
          </span>
        </p>
      </div>

      <BottomBar>
        <Button onClick={onReady}>{players[guesser]} です！予想する</Button>
      </BottomBar>
    </div>
  );
}
