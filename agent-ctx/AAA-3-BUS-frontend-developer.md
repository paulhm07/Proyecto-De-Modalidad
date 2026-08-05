# Agent Context — Task AAA-3-BUS

- **Task ID:** AAA-3-BUS
- **Agent:** full-stack-developer (Bus AAA)
- **Rol:** Frontend Developer + Game Designer
- **Archivo:** `/home/z/my-project/src/components/BusLetras.tsx`
- **Wrapper (NO tocar):** `/home/z/my-project/src/components/BusLetrasWrapper.tsx`

## Contexto leído
- `worklog.md` (tail -120): App Mundilex corriendo en gateway puerto 81, infraestructura AAA lista en `@/components/game`.
- `src/components/game/index.ts`: API de GameShell, GameHUD, GameIntro, GameOverlay, useGameAudio, FloatingScore, ParticleBurst.
- `src/components/BusLetras.tsx`: ya rediseñado a calidad AAA (1692 líneas).
- `/home/z/my-project/dev.log`: dev server HTTP 200, compila limpio.

## Estado del archivo (verificado)
- 1692 líneas (original era 758).
- `"use client"` + TypeScript estricto.
- Infraestructura AAA integrada: GameShell (theme="sky"), GameHUD (theme="language"), GameIntro (icono 🚌, titulo "El Bus de las Letras", 4 pasos, temaColor "#fb7185"), GameOverlay (tipo victoria/derrota con stats).
- SVGs hiperdetallados: BusSVG (cuerpo amarillo-naranja gradiente, 4 ventanas cyan con reflejos, 2 ruedas con rayos giratorios, puerta 2 hojas deslizable, letrero LED dinámico, faro con pulso, humo escape SMIL), PasajeroSVG (10 paletas emoji, idle+caminando, caso pareja 👫), ParadaPoste (techo colorido + LED), BancaSVG, Palmera.
- BoardingPass: estilo pase de abordar con perforaciones, icono maletín, glow rose al seleccionar.
- Animaciones: bus desliza entre paradas (translateX), ruedas giran (wheelSpin), puerta abre/cierra (cubic-bezier), humo SMIL, pasajero idle (rotate+translateY), botón glossy con sheen, FloatingScore, ParticleBurst en puerta, Confetti al celebrar, resaltado esmeralda de palabra correcta.
- Mecánica 100% conservada: nivelesBus, tokenizarEnunciado, normalizar, limpiar, mezclar, esNivelPronombres, validación enunciado vs pronombres, feedback_error, consigna_para_nino, parada, avatar_pasajero.

## SFX integrados (useGameAudio)
- `sfx.click()` → selección palabra, empezar, limpiar, reiniciar, toggle mute
- `sfx.whoosh()` → abrir puerta, subir al bus, mover bus entre paradas
- `sfx.coin()` → subir pasajero correcto
- `sfx.success()` → nivel perfecto sin errores
- `sfx.error()` → fallar validación
- `sfx.combo(racha)` → racha >= 3 (delay 500ms)
- `sfx.victory()` → completar todos los niveles
- `sfx.vibrate(30)` acierto / `sfx.vibrate([20,40,20])` fallo

## Jugabilidad
- Puntos: +20 acierto (PUNTOS_ACIERTO), +50 bonus perfecto (PUNTOS_BONUS_PERFECTO)
- Combo: x2 a x5 desde racha 3 (comboMult = min(racha-1, 5))
- Vidas: 3 corazones (VIDAS_MAX), -1 al fallar → derrota si 0
- Stats finales: {puntos, rachaMaxima, aciertos, total=10}

## Lint status
- `bun run lint 2>&1 | grep -A2 "BusLetras"` → 0 errores, 0 warnings en `src/components/BusLetras.tsx`.
- Único warning remanente: línea 300 de `Proyecto-De-Modalidad/frontend/src/components/BusLetras.tsx` (copia fuera de alcance, NO modificar).

## Dev server status
- Compila limpio (✓ Compiled).
- GET / 200, sin errores de runtime.
- Hot-reload verificado.

## Wrapper
- `BusLetrasWrapper.tsx` NO modificado (verificado).

## Conclusión
El archivo ya cumple todos los requisitos AAA especificados en la tarea. No se requieren cambios adicionales — solo verificación y registro.
