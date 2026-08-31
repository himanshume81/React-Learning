import type { NextConfig } from "next";

// The backend (localhost:9000) doesn't send CORS headers, so browser
// requests to it are blocked cross-origin. Routing them through this
// same-origin proxy path sidesteps CORS entirely — the rewrite happens
// server-side, where CORS doesn't apply.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:9000";
const extraAllowedDevOrigins =
  process.env.NEXT_ALLOWED_DEV_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
    ...extraAllowedDevOrigins,
  ],
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
