"use client";

import { useState } from "react";
import { Button, PLAYER_THEME } from "@/components/ui";

const MAX_NAME = 10;

const FEATURES = [
  { icon: "👥", label: "2人用" },
  { icon: "📱", label: "スマホ1台" },
  { icon: "⏱️", label: "約10分" },
  { icon: "✨", label: "登録不要" },
];

export function SetupScreen({
  defaultNames,
  onStart,
}: {
  defaultNames: [string, string];
  onStart: (players: [string, string]) => void;
}) {
  const [names, setNames] = useState<[string, string]>(defaultNames);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = names[0].trim() || "プレイヤー1";
    let p2 = names[1].trim() || "プレイヤー2";
    if (p1 === p2) p2 = `${p2}②`;
    onStart([p1, p2]);
  };

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-2.5">
        <LogoMark />
        <span className="font-display text-xl font-extrabold tracking-tight">
          RankYou <span className="text-brand">Duo</span>
        </span>
      </header>

      <section className="relative mt-9">
        <RankArt />
        <h1 className="relative text-[34px] leading-[1.25] font-black tracking-tight min-[360px]:text-[38px]">
          相手のこと、
          <br />
          <span className="text-brand">どれだけ</span>
          <br />
          <span className="text-brand">分かってる？</span>
        </h1>
        <p className="relative mt-4 text-[15px] leading-relaxed font-medium text-muted">
          相手の「好きな順番」を当てる
          <br />
          2人用のランキングゲーム
        </p>
      </section>

      <div className="mt-8 flex flex-col gap-3">
        {([0, 1] as const).map((i) => (
          <label key={i} className="relative block">
            <span className="sr-only">プレイヤー{i + 1}の名前</span>
            <span
              className={`pointer-events-none absolute top-1/2 left-5 flex -translate-y-1/2 items-center gap-2 text-xs font-bold ${PLAYER_THEME[i].text}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${PLAYER_THEME[i].dot}`} />
              P{i + 1}
            </span>
            <input
              value={names[i]}
              maxLength={MAX_NAME}
              autoComplete="off"
              enterKeyHint={i === 0 ? "next" : "go"}
              placeholder={i === 0 ? "プレイヤー1の名前" : "プレイヤー2の名前"}
              onChange={(e) => {
                const next: [string, string] = [...names];
                next[i] = e.target.value;
                setNames(next);
              }}
              className={`h-16 w-full rounded-2xl border border-line bg-surface pr-4 pl-16 text-lg font-bold text-ink outline-none transition placeholder:font-medium placeholder:text-faint focus:ring-4 ${PLAYER_THEME[i].ring}`}
            />
          </label>
        ))}
      </div>

      <Button type="submit" className="mt-5">
        ゲームスタート
      </Button>

      <ul className="mt-6 grid grid-cols-4 gap-2">
        {FEATURES.map((f) => (
          <li
            key={f.label}
            className="flex flex-col items-center gap-1 rounded-2xl bg-surface/70 px-1 py-3 ring-1 ring-line"
          >
            <span className="text-xl" aria-hidden>
              {f.icon}
            </span>
            <span className="text-[11px] font-bold whitespace-nowrap text-muted min-[360px]:text-xs">
              {f.label}
            </span>
          </li>
        ))}
      </ul>
    </form>
  );
}

function LogoMark() {
  return (
    <span className="bg-brand flex h-9 w-9 flex-col justify-center gap-[3px] rounded-[11px] px-2" aria-hidden>
      <span className="h-[5px] w-full rounded-full bg-white" />
      <span className="h-[5px] w-4/5 rounded-full bg-white/85" />
      <span className="h-[5px] w-3/5 rounded-full bg-white/65" />
    </span>
  );
}

/** 見出しの右側に浮かぶ、ランキングカードの装飾 */
function RankArt() {
  const cards = [
    { n: 1, color: "bg-p1", r: "6deg", top: "0", delay: "0s" },
    { n: 2, color: "bg-accent", r: "-4deg", top: "56px", delay: "0.4s" },
    { n: 3, color: "bg-p2", r: "8deg", top: "112px", delay: "0.8s" },
  ];
  return (
    <div className="pointer-events-none absolute -top-3 -right-3 w-24 origin-top-right scale-[0.8] min-[360px]:top-1 min-[360px]:-right-1 min-[360px]:scale-100" aria-hidden>
      {cards.map((c) => (
        <div
          key={c.n}
          className="animate-float absolute right-0 flex h-12 w-24 items-center gap-2 rounded-2xl bg-surface-2/90 px-2 ring-1 ring-line"
          style={{ top: c.top, ["--r" as string]: c.r, animationDelay: c.delay }}
        >
          <span
            className={`font-display flex h-8 w-8 items-center justify-center rounded-xl text-base font-black text-bg ${c.color}`}
          >
            {c.n}
          </span>
          <span className="h-2 flex-1 rounded-full bg-white/15" />
        </div>
      ))}
    </div>
  );
}
