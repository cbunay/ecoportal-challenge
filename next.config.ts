import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  redirects: async () => [
    { source: "/", destination: "/calendar/month", permanent: false },
  ],
};

export default nextConfig;
