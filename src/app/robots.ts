import type { MetadataRoute } from "next";

// iOSアプリ用の静的出力（output: "export"）でもビルド時に生成する
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
