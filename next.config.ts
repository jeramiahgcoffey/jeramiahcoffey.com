import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.jeramiahcoffey.com" }],
        destination: "https://jeramiahcoffey.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
