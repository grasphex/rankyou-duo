import { ImageResponse } from "next/og";
import { LogoMark } from "./brand-art";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0b0a10" }}>
        <LogoMark size={180} />
      </div>
    ),
    size,
  );
}
