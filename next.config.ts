import type { NextConfig } from "next";

// The backend (localhost:9000) doesn't send CORS headers, so browser
// requests to it are blocked cross-origin. Routing them through this
// same-origin proxy path sidesteps CORS entirely — the rewrite happens
// server-side, where CORS doesn't apply.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:9000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
