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
        source: "/r/:file",
        destination: "/registry/:file.json",
      },
    ];
  },
};

export default nextConfig;
