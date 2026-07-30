import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the whole site is a single pre-rendered page + assets.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
