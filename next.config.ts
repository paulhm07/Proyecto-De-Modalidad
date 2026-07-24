import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Permitir peticiones cross-origin desde el gateway del sandbox
  allowedDevOrigins: ["*"],
  // Evitar que el proceso se cuelgue por timeouts de turbopack
  experimental: {
    turbopack: {
      resolveAlias: {
        canvas: "",
      },
    },
  },
};

export default nextConfig;
