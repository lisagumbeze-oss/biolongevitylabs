import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'biolongevitylabs.com',
      },
      {
        protocol: 'https',
        hostname: 'biolongevitylabss.com',
      },
      {
        protocol: 'https',
        hostname: 'mlavgymrtxzc.i.optimole.com',
      },
    ],
  },
};

export default nextConfig;
