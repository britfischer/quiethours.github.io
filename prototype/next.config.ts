import type { NextConfig } from "next";

// Static export, served from the GitHub Pages project path:
// https://britfischer.github.io/quiethours.github.io/app/
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/quiethours.github.io/app";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
