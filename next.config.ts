import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

// 開発サーバーは既定で localhost 以外からの dev 用JSを拒否する。
// 127.0.0.1 や同じWi-Fiのスマホ（LAN IP）から開いても動くよう許可する。
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((n) => n && n.family === "IPv4" && !n.internal)
  .map((n) => n!.address);

// iOSアプリ（Capacitor）用ビルドでは静的HTMLを out/ に書き出し、アプリに同梱する。
// Vercel向けの通常ビルドはこれまでどおり。
const isCapacitorBuild = process.env.CAPACITOR_BUILD === "1";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", ...lanAddresses],
  ...(isCapacitorBuild && {
    output: "export",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
