import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

// 開発サーバーは既定で localhost 以外からの dev 用JSを拒否する。
// 127.0.0.1 や同じWi-Fiのスマホ（LAN IP）から開いても動くよう許可する。
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((n) => n && n.family === "IPv4" && !n.internal)
  .map((n) => n!.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", ...lanAddresses],
};

export default nextConfig;
