import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "static.thairath.co.th" },
    ],
  },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
