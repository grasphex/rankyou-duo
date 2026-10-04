import type { Question } from "@/data/questions";
import { TOTAL_ROUNDS, type PlayerIndex } from "@/lib/game";
import { BottomBar, Button, Card, CategoryBadge, Eyebrow, Name, PLAYER_THEME, other } from "@/components/ui";

export function IntroScreen({
  round,
  question,
  players,
  answerer,
  onBegin,
  onSwap,
}: {
  round: number;
  question: Question;
  players: [string, string];
  answerer: PlayerIndex;
  onBegin: () => void;
  onSwap: () => void;
}) {
  const guesser = other(answerer);
  const t = PLAYER_THEME[answerer];

  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-6 text-center">
        <Eyebrow>
          Round {round + 1} / {TOTAL_ROUNDS}
        </Eyebrow>
        <h1 className="animate-pop mt-4 text-[32px] leading-tight font-black">
          <span className={t.text}>{players[answerer]}</span>
          <span className="text-2xl"> さんの番</span>
        </h1>
        <p className="mt-2 text-[15px] font-medium text-muted">
          スマホを持って、自分の順位を決めよう
        </p>
      </div>

      <Card className="relative mt-6 overflow-hidden p-6">
        <div className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl`} />
        <CategoryBadge category={question.category} />
        <h2 className="relative mt-4 text-[26px] leading-snug font-black">{question.question}</h2>
        <ul className="relative mt-5 flex flex-wrap gap-2">
          {question.items.map((item) => (
            <li key={item} className="rounded-full bg-surface-2 px-3.5 py-2 text-sm font-bold text-ink/90 ring-1 ring-line">
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <p className="mt-5 flex items-center justify-center gap-1.5 rounded-2xl bg-surface/60 px-4 py-3 text-center text-sm font-medium text-muted">
        <span aria-hidden>🙈</span>
        <span>
          <Name player={guesser} name={players[guesser]} /> さんは画面を見ないでね
        </span>
      </p>

      <BottomBar>
        <Button onClick={onBegin}>順位を決める</Button>
        <Button variant="ghost" onClick={onSwap}>
          ↻ 別のお題にする
        </Button>
      </BottomBar>
    </div>
  );
}
