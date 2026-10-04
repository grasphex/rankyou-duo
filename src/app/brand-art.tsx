/** apple-icon / OG画像で共通に使うロゴマーク（next/og 用のインラインスタイル） */
export function LogoMark({ size }: { size: number }) {
  const u = size / 64;
  const bar = (top: number, width: number, opacity: number) => (
    <div
      style={{
        position: "absolute",
        left: 14 * u,
        top: top * u,
        width: width * u,
        height: 9 * u,
        borderRadius: 4.5 * u,
        background: "white",
        opacity,
      }}
    />
  );
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: size,
        height: size,
        borderRadius: 16 * u,
        background: "linear-gradient(135deg, #b18cff 0%, #ff6f91 55%, #ffa45c 100%)",
      }}
    >
      {bar(15, 36, 1)}
      {bar(28, 28, 0.85)}
      {bar(41, 20, 0.65)}
    </div>
  );
}
