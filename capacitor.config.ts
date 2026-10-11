import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.grasphex.rankyouduo",
  appName: "RankYou Duo",
  // `npm run build:ios` が書き出す Next.js の静的出力をアプリに同梱する
  webDir: "out",
  // 読み込み前やバウンス時に白が見えないよう、アプリの背景色に合わせる
  backgroundColor: "#0b0a10",
  ios: {
    // WebView を画面全体に広げ、余白は CSS の env(safe-area-inset-*) で取る
    contentInset: "never",
    // リンク長押しのプレビューを出さない
    allowsLinkPreview: false,
    backgroundColor: "#0b0a10",
  },
  plugins: {
    SplashScreen: {
      // LaunchScreen.storyboard と同じ画面を、最初の画面の描画が終わるまで出し続け、
      // 準備ができたら JS から hide() してフェードで切り替える（src/lib/native.ts）
      launchAutoHide: false,
      backgroundColor: "#0b0a10",
      showSpinner: false,
    },
  },
};

export default config;
