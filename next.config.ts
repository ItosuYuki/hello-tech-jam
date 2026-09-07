import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker用のstandaloneモードを有効化
  // standaloneモードはNext.jsアプリケーションと必要な依存関係のみを含む
  // 最小限の実行環境を生成し、Dockerイメージサイズを大幅に削減します
  // next.config.ts
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;

