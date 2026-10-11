import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-outfit",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = "RankYou Duo | 相手のこと、どれだけ分かってる？";
const description = "2人で遊べる価値観ランキングゲーム。スマホ1台、登録不要ですぐ遊べます。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "RankYou Duo",
  keywords: ["2人用ゲーム", "価値観", "ランキング", "パーティーゲーム", "カップル", "友達", "スマホゲーム"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "RankYou Duo",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  appleWebApp: {
    capable: true,
    title: "RankYou Duo",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0a10",
  // iOSアプリではピンチ・ダブルタップでの拡大を止め、ネイティブアプリらしくする（Web版は拡大可のまま）
  ...(process.env.CAPACITOR_BUILD === "1" && { maximumScale: 1, userScalable: false }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
