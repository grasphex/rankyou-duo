"use client";

import { useEffect, useState } from "react";

/** 0 から target まで数字を増やしていく演出 */
export function useCountUp(target: number, durationMs = 1400, delayMs = 400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now + delayMs;
      const t = Math.min(1, Math.max(0, (now - start) / durationMs));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, delayMs]);

  return { value, done: value === target };
}

const COLORS = ["#f43f5e", "#0ea5e9", "#a855f7", "#f59e0b", "#10b981", "#ec4899"];

export function Confetti({ count = 48 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37) % 100;
        const delay = ((i * 53) % 90) / 100;
        const duration = 2.2 + ((i * 29) % 15) / 10;
        const size = 6 + ((i * 17) % 7);
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              background: COLORS[i % COLORS.length],
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
