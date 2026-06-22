import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-15da519210e34e4684d96a0ee4f478a3.r2.dev",
      },
    ],
  },
};

export default nextConfig;
