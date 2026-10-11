import { ImageResponse } from "next/og";
import { LogoMark } from "./brand-art";

export const alt = "RankYou Duo - 2人で遊べる価値観ランキングゲーム";
// iOSアプリ用の静的出力（output: "export"）でもビルド時に画像を生成する
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rows = [
  { rank: 1, width: 300, color: "#ff6f91" },
  { rank: 2, width: 250, color: "#b18cff" },
  { rank: 3, width: 200, color: "#3fd5e8" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 80,
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 0% 0%, rgba(177,140,255,0.35), transparent 55%), radial-gradient(circle at 100% 100%, rgba(255,111,145,0.3), transparent 55%), #0b0a10",
          color: "#f7f5fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <LogoMark size={120} />
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, letterSpacing: -2 }}>
            RankYou Duo
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#a39db4" }}>
            How well do you know each other?
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {rows.map((r) => (
            <div key={r.rank} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  display: "flex",
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: 800,
                  background: r.color,
                  color: "#0b0a10",
                }}
              >
                {r.rank}
              </div>
              <div
                style={{
                  display: "flex",
                  width: r.width,
                  height: 72,
                  borderRadius: 22,
                  background: "#211e2c",
                  border: "2px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
