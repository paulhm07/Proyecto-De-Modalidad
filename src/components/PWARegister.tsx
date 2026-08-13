"use client";

import { useEffect } from "react";

/**
 * Registra el Service Worker de Mundilex.
 * - Solo en producción (o cuando exista sw.js).
 * - En dev: registra pero avisa por consola para no romper HMR.
 * - Escucha 'controllerchange' para forzar reload tras actualización.
 */
export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        // Detectar actualización del SW: si hay uno nuevo esperando, recargar.
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              // Hay un SW nuevo esperando. Forzar activación y recargar.
              nw.postMessage("SKIP_WAITING");
            }
          });
        });

        // Tras tomar control el nuevo SW, recargar la página una sola vez.
        let reloading = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (reloading) return;
          reloading = true;
          window.location.reload();
        });
      } catch (err) {
        console.warn("[PWA] No se pudo registrar el Service Worker:", err);
      }
    };

    // Registrar tras carga completa para no competir con recursos críticos.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
