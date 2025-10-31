import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/npm/@lobehub/icons-static-png@latest/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
    ],
  },
};

export default nextConfig;
