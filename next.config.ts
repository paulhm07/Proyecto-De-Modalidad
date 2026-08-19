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
  // En Next.js 16, turbopack config va al nivel superior (no bajo experimental)
  turbopack: {
    resolveAlias: {
      canvas: "",
    },
  },
  // Headers para archivos PWA críticos:
  //  - sw.js y manifest.webmanifest NO deben cachearse agresivamente
  //    (el navegador debe poder detectar actualizaciones del Service Worker).
  //  - manifest necesita el Content-Type correcto para que el navegador lo valide.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/pwa/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
