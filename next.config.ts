import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/calendar",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
