"use client";

import { useEffect, useReducer } from "react";
import {
  TOTAL_ROUNDS,
  answererOf,
  gameReducer,
  getQuestion,
  initialState,
  loadState,
  saveState,
} from "@/lib/game";
import { SetupScreen } from "@/components/screens/SetupScreen";
import { IntroScreen } from "@/components/screens/IntroScreen";
import { RankScreen } from "@/components/screens/RankScreen";
import { HandoffScreen } from "@/components/screens/HandoffScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";
import { FinalScreen } from "@/components/screens/FinalScreen";

export default function Game() {
  // サーバーとブラウザで同じ初期画面（スタート画面）を描画し、
  // マウント後に sessionStorage から途中のゲームを復元する
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { phase, players, round } = state;

  useEffect(() => {
    dispatch({ type: "restore", state: loadState() });
  }, []);

  useEffect(() => {
    // 復元前の初期状態で保存データを上書きしない
    if (state !== initialState) saveState(state);
  }, [state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, round]);

  const inGame = phase !== "setup" && phase !== "final";
  const question = state.questionIds.length ? getQuestion(state.questionIds[round]) : null;
  const answerer = answererOf(round);

  const quit = () => {
    if (window.confirm("ゲームをやめてスタート画面に戻りますか？")) dispatch({ type: "quit" });
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5">
      {inGame && (
        <header className="flex items-center gap-3 pt-4">
          <Progress current={round} />
          <span className="font-display shrink-0 text-xs font-bold text-muted tabular-nums">
            {round + 1}/{TOTAL_ROUNDS}
          </span>
          <button
            type="button"
            onClick={quit}
            aria-label="ゲームをやめる"
            className="-mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-faint transition active:bg-white/10 active:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>
      )}

      <main key={`${phase}-${round}`} className="animate-screen flex flex-1 flex-col">
        {phase === "setup" && (
          <SetupScreen
            defaultNames={players}
            onStart={(p) => dispatch({ type: "start", players: p })}
          />
        )}

        {phase === "intro" && question && (
          <IntroScreen
            round={round}
            question={question}
            players={players}
            answerer={answerer}
            onBegin={() => dispatch({ type: "beginAnswer" })}
            onSwap={() => dispatch({ type: "swapQuestion" })}
          />
        )}

        {phase === "answer" && question && (
          <RankScreen
            mode="answer"
            question={question}
            players={players}
            answerer={answerer}
            onSubmit={(order) => dispatch({ type: "submitAnswer", order })}
          />
        )}

        {phase === "handoff" && (
          <HandoffScreen
            players={players}
            answerer={answerer}
            onReady={() => dispatch({ type: "beginGuess" })}
          />
        )}

        {phase === "guess" && question && (
          <RankScreen
            mode="guess"
            question={question}
            players={players}
            answerer={answerer}
            onSubmit={(order) => dispatch({ type: "submitGuess", order })}
          />
        )}

        {phase === "result" && question && state.records[round] && (
          <ResultScreen
            round={round}
            record={state.records[round]}
            question={question}
            players={players}
            onNext={() => dispatch({ type: "next" })}
          />
        )}

        {phase === "final" && (
          <FinalScreen
            players={players}
            records={state.records}
            onPlayAgain={() => dispatch({ type: "playAgain" })}
            onQuit={() => dispatch({ type: "quit" })}
          />
        )}
      </main>
    </div>
  );
}

function Progress({ current }: { current: number }) {
  return (
    <div className="flex flex-1 gap-1" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={TOTAL_ROUNDS}>
      {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < current ? "bg-white/45" : i === current ? "bg-brand" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}
