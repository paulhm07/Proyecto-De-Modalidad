import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";
import OfflineIndicator from "@/components/OfflineIndicator";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "Mundilex — Aprende jugando",
  description:
    "Mundilex: plataforma educativa gamificada para estudiantes de 3er grado. Aprende jugando con desafíos, medallas y avatares.",
  manifest: "/manifest.webmanifest",
  applicationName: "Mundilex",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mundilex",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/pwa/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon-32.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#07061f",
  viewportFit: "cover",
};

// Floating runes — math & literary symbols drifting in the blurred background
const RUNAS = [
  { s: "π", top: "8%", left: "6%", size: "3.2rem", color: "rgba(34,211,238,0.18)", delay: "0s" },
  { s: "∑", top: "18%", left: "82%", size: "3rem", color: "rgba(251,191,36,0.16)", delay: "1.5s" },
  { s: "√", top: "62%", left: "4%", size: "2.6rem", color: "rgba(34,211,238,0.15)", delay: "0.8s" },
  { s: "∞", top: "78%", left: "88%", size: "2.8rem", color: "rgba(251,113,133,0.16)", delay: "2.2s" },
  { s: "×", top: "40%", left: "92%", size: "2.2rem", color: "rgba(139,92,246,0.18)", delay: "1.1s" },
  { s: "÷", top: "88%", left: "30%", size: "2.4rem", color: "rgba(34,211,238,0.14)", delay: "0.4s" },
  { s: "+", top: "12%", left: "48%", size: "2.6rem", color: "rgba(251,191,36,0.16)", delay: "1.8s" },
  { s: "=", top: "50%", left: "14%", size: "2.2rem", color: "rgba(139,92,246,0.16)", delay: "2.6s" },
  { s: "A", top: "28%", left: "26%", size: "2.6rem", color: "rgba(251,113,133,0.16)", delay: "0.6s" },
  { s: "¿?", top: "70%", left: "70%", size: "2.4rem", color: "rgba(251,191,36,0.15)", delay: "1.3s" },
  { s: "¡!", top: "34%", left: "64%", size: "2.2rem", color: "rgba(34,211,238,0.15)", delay: "2.0s" },
  { s: "Ñ", top: "84%", left: "54%", size: "2.6rem", color: "rgba(251,113,133,0.15)", delay: "0.9s" },
];

// Golden stardust clusters (twinkling dots)
const ESTRELLAS = [
  { top: "12%", left: "22%", delay: "0s", size: "2px" },
  { top: "24%", left: "68%", delay: "0.8s", size: "3px" },
  { top: "36%", left: "40%", delay: "1.4s", size: "2px" },
  { top: "48%", left: "10%", delay: "0.4s", size: "3px" },
  { top: "16%", left: "88%", delay: "2.0s", size: "2px" },
  { top: "58%", left: "82%", delay: "1.1s", size: "2px" },
  { top: "68%", left: "34%", delay: "0.2s", size: "3px" },
  { top: "80%", left: "62%", delay: "1.7s", size: "2px" },
  { top: "88%", left: "16%", delay: "0.6s", size: "2px" },
  { top: "44%", left: "94%", delay: "2.3s", size: "3px" },
  { top: "6%", left: "54%", delay: "1.2s", size: "2px" },
  { top: "92%", left: "78%", delay: "0.5s", size: "2px" },
  { top: "30%", left: "8%", delay: "1.9s", size: "2px" },
  { top: "64%", left: "50%", delay: "0.3s", size: "3px" },
  { top: "22%", left: "44%", delay: "2.5s", size: "2px" },
  { top: "76%", left: "90%", delay: "1.0s", size: "2px" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* PWA — iOS / Safari meta tags (la API de Metadata de Next no cubre todo) */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mundilex" />
        <meta name="application-name" content="Mundilex" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#07061f" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png" />
        <link rel="mask-icon" href="/logo.svg" color="#fbbf24" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/pwa/icon-192.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* ===== Deep-space background layers ===== */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          {/* Nebula clouds (violet / cyan / coral) */}
          <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-violet-600/30 blur-[110px] animate-float" />
          <div
            className="absolute top-1/3 -right-24 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-[120px] animate-float"
            style={{ animationDelay: "0.7s" }}
          />
          <div
            className="absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full bg-rose-500/20 blur-[110px] animate-float"
            style={{ animationDelay: "1.4s" }}
          />
          <div
            className="absolute -bottom-24 right-1/4 h-[24rem] w-[24rem] rounded-full bg-indigo-600/25 blur-[110px] animate-float"
            style={{ animationDelay: "0.3s" }}
          />

          {/* Golden stardust field (tiled tiny dots) */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(251,191,36,0.7) 1px, transparent 1.6px)",
              backgroundSize: "70px 70px",
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1.4px)",
              backgroundSize: "120px 120px",
              backgroundPosition: "30px 60px",
            }}
          />

          {/* Twinkling golden stars */}
          {ESTRELLAS.map((e, i) => (
            <span
              key={`star-${i}`}
              className="absolute rounded-full bg-amber-300 animate-twinkle"
              style={{
                top: e.top,
                left: e.left,
                width: e.size,
                height: e.size,
                animationDelay: e.delay,
                boxShadow: "0 0 6px rgba(251,191,36,0.9)",
              }}
            />
          ))}

          {/* Floating math & literary runes (blurred, low opacity) */}
          {RUNAS.map((r, i) => (
            <span
              key={`runa-${i}`}
              className="absolute font-bold animate-drift select-none"
              style={{
                top: r.top,
                left: r.left,
                fontSize: r.size,
                color: r.color,
                animationDelay: r.delay,
                filter: "blur(0.5px)",
                textShadow: "0 0 18px currentColor",
              }}
            >
              {r.s}
            </span>
          ))}

          {/* Vignette to deepen the edges */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(2,1,12,0.65) 100%)",
            }}
          />
        </div>

        <main className="flex-1 relative z-0">{children}</main>

        {/* PWA — registro del Service Worker, banner offline y prompt de instalación */}
        <PWARegister />
        <OfflineIndicator />
        <InstallPrompt />

        <footer className="mt-auto border-t border-cyan-400/25 bg-violet-950/40 py-4 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs font-semibold text-cyan-200/80">
            Mundilex · Cristal del Saber · Hecho con cariño para estudiantes de 3er grado ·
            <span className="ml-1 text-amber-300/90">Aprende jugando</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
