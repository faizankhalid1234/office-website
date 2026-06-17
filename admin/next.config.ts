import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  allowedDevOrigins: [
    "office-website-production.up.railway.app",
    "localhost:4000",
  ],
};

export default nextConfig;
