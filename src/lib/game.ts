import { questions, type Question } from "@/data/questions";
import { scoreRanking } from "@/lib/scoring";

export const TOTAL_ROUNDS = 10;
export const STORAGE_KEY = "rankyou-duo:v2";

export type PlayerIndex = 0 | 1;

export type Phase = "setup" | "intro" | "answer" | "handoff" | "guess" | "result" | "final";

export type RoundRecord = {
  questionId: number;
  answerer: PlayerIndex;
  answer: string[];
  guess: string[];
  score: number;
};

export type GameState = {
  phase: Phase;
  players: [string, string];
  questionIds: number[];
  round: number;
  /** 本人回答。予想が終わるまでどの画面にも表示しない */
  pendingAnswer: string[] | null;
  records: RoundRecord[];
  /** 「もう一度遊ぶ」で同じお題が出にくくするための履歴 */
  playedIds: number[];
};

export type Action =
  | { type: "start"; players: [string, string] }
  | { type: "swapQuestion" }
  | { type: "beginAnswer" }
  | { type: "submitAnswer"; order: string[] }
  | { type: "beginGuess" }
  | { type: "submitGuess"; order: string[] }
  | { type: "next" }
  | { type: "playAgain" }
  | { type: "quit" }
  | { type: "restore"; state: GameState };

export const initialState: GameState = {
  phase: "setup",
  players: ["", ""],
  questionIds: [],
  round: 0,
  pendingAnswer: null,
  records: [],
  playedIds: [],
};

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const byId = new Map(questions.map((q) => [q.id, q]));

export function getQuestion(id: number): Question {
  const q = byId.get(id);
  if (!q) throw new Error(`unknown question id: ${id}`);
  return q;
}

/** できるだけカテゴリが被らないように、未出題のお題から選ぶ */
function pickQuestions(count: number, exclude: Set<number>): number[] {
  let pool = questions.filter((q) => !exclude.has(q.id));
  if (pool.length < count) pool = [...questions];

  const picked: Question[] = [];
  const usedCategories = new Set<string>();
  for (const q of shuffle(pool)) {
    if (picked.length >= count) break;
    if (!usedCategories.has(q.category)) {
      picked.push(q);
      usedCategories.add(q.category);
    }
  }
  for (const q of shuffle(pool)) {
    if (picked.length >= count) break;
    if (!picked.includes(q)) picked.push(q);
  }
  return shuffle(picked).map((q) => q.id);
}

function pickReplacement(state: GameState): number | null {
  const current = new Set(state.questionIds);
  const categories = new Set(state.questionIds.map((id) => getQuestion(id).category));
  const unused = questions.filter((q) => !current.has(q.id) && !state.playedIds.includes(q.id));
  const fallback = questions.filter((q) => !current.has(q.id));
  const pool = unused.length > 0 ? unused : fallback;
  const freshCategory = pool.filter((q) => !categories.has(q.category));
  const candidates = freshCategory.length > 0 ? freshCategory : pool;
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)].id;
}

function newGame(players: [string, string], playedIds: number[]): GameState {
  return {
    ...initialState,
    phase: "intro",
    players,
    questionIds: pickQuestions(TOTAL_ROUNDS, new Set(playedIds)),
    playedIds,
  };
}

export function answererOf(round: number): PlayerIndex {
  return round % 2 === 0 ? 0 : 1;
}

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
      return newGame(action.players, state.playedIds);

    case "swapQuestion": {
      if (state.phase !== "intro") return state;
      const replacement = pickReplacement(state);
      if (replacement === null) return state;
      const questionIds = [...state.questionIds];
      questionIds[state.round] = replacement;
      return { ...state, questionIds };
    }

    case "beginAnswer":
      return state.phase === "intro" ? { ...state, phase: "answer" } : state;

    case "submitAnswer":
      return state.phase === "answer"
        ? { ...state, phase: "handoff", pendingAnswer: action.order }
        : state;

    case "beginGuess":
      return state.phase === "handoff" ? { ...state, phase: "guess" } : state;

    case "submitGuess": {
      if (state.phase !== "guess" || !state.pendingAnswer) return state;
      const { score } = scoreRanking(state.pendingAnswer, action.order);
      const record: RoundRecord = {
        questionId: state.questionIds[state.round],
        answerer: answererOf(state.round),
        answer: state.pendingAnswer,
        guess: action.order,
        score,
      };
      return { ...state, phase: "result", pendingAnswer: null, records: [...state.records, record] };
    }

    case "next":
      if (state.phase !== "result") return state;
      if (state.round + 1 >= TOTAL_ROUNDS) return { ...state, phase: "final" };
      return { ...state, phase: "intro", round: state.round + 1 };

    case "playAgain": {
      const playedIds = [...new Set([...state.playedIds, ...state.questionIds])];
      return newGame(state.players, playedIds);
    }

    case "restore":
      return action.state;

    case "quit":
      return { ...initialState, players: state.players, playedIds: state.playedIds };
  }
}

/** プレイヤーが「予想する側」だったラウンドの平均スコア */
export function averageScoreAsGuesser(records: RoundRecord[], player: PlayerIndex): number {
  const mine = records.filter((r) => r.answerer !== player);
  if (mine.length === 0) return 0;
  return Math.round(mine.reduce((s, r) => s + r.score, 0) / mine.length);
}

export function loadState(): GameState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed || typeof parsed.phase !== "string" || !Array.isArray(parsed.questionIds)) {
      return initialState;
    }
    parsed.questionIds.forEach(getQuestion);
    return parsed;
  } catch {
    return initialState;
  }
}

export function saveState(state: GameState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ストレージが使えない環境では保存しない
  }
}
