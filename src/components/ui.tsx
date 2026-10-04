import type { PlayerIndex } from "@/lib/game";

export const PLAYER_THEME = [
  {
    text: "text-p1",
    bg: "bg-p1",
    dot: "bg-p1",
    soft: "bg-p1/15 text-p1",
    border: "border-p1/40",
    ring: "focus:border-p1 focus:ring-p1/25",
    glow: "from-p1/35",
  },
  {
    text: "text-p2",
    bg: "bg-p2",
    dot: "bg-p2",
    soft: "bg-p2/15 text-p2",
    border: "border-p2/40",
    ring: "focus:border-p2 focus:ring-p2/25",
    glow: "from-p2/35",
  },
] as const;

export function other(p: PlayerIndex): PlayerIndex {
  return p === 0 ? 1 : 0;
}

export function Name({ player, name }: { player: PlayerIndex; name: string }) {
  return <span className={`font-extrabold ${PLAYER_THEME[player].text}`}>{name}</span>;
}

/** プレイヤー名のピル（色ドット付き） */
export function PlayerChip({
  player,
  name,
  suffix,
  size = "md",
}: {
  player: PlayerIndex;
  name: string;
  suffix?: string;
  size?: "md" | "lg";
}) {
  const t = PLAYER_THEME[player];
  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full ${t.soft} ${
        size === "lg" ? "px-4 py-2 text-lg" : "px-3 py-1 text-sm"
      } font-bold`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${t.dot}`} />
      <span className="truncate">{name}</span>
      {suffix && <span className="shrink-0 font-semibold text-ink/80">{suffix}</span>}
    </span>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const styles = {
    primary:
      "bg-brand min-h-16 text-lg text-white shadow-[0_10px_30px_-8px_rgb(255_111_145/0.6)] active:shadow-none",
    secondary: "min-h-14 bg-surface-2 text-base text-ink ring-1 ring-line",
    ghost: "min-h-12 text-[15px] text-muted active:text-ink",
  }[variant];
  return (
    <button
      type="button"
      className={`w-full rounded-full px-6 font-extrabold tracking-wide transition active:scale-[0.97] disabled:opacity-40 ${styles} ${className}`}
      {...props}
    />
  );
}

/** 画面下部に固定するアクション領域 */
export function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 -mx-5 mt-auto bg-gradient-to-t from-bg via-bg/95 to-transparent px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-[28px] bg-surface ring-1 ring-line ${className}`}>{children}</div>;
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1 text-xs font-bold tracking-wider text-muted ring-1 ring-line">
      # {category}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-xs font-semibold tracking-[0.25em] text-faint uppercase">{children}</p>
  );
}

/** 進捗リング（0〜100） */
export function ScoreRing({
  value,
  size = 200,
  stroke = 14,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b18cff" />
            <stop offset="0.55" stopColor="#ff6f91" />
            <stop offset="1" stopColor="#ffa45c" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(100, Math.max(0, value)) / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
