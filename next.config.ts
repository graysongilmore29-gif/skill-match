import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/skill-vs-slots",
        destination: "/vs-casino",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
