import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    useCache: true,
    ppr: true,
  },
  async rewrites() {
    return [
      {
        source: "/r/:path*",
        destination: "/registry/:path*.json",
      },
    ];
  },
};

export default nextConfig;
