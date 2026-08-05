# AAA-7-CAZADOR — full-stack-developer (Cazador AAA)

## Tarea
Rediseño AAA de `src/components/CazadorSilabas.tsx` usando infraestructura AAA compartida (GameShell, GameHUD, GameIntro, GameOverlay, useGameAudio, FloatingScore, ParticleBurst).

## Work Log
- Leído worklog.md (AAA-3-BUS, AAA-2-CAMION) para contexto.
- Leído CazadorSilabas.tsx original (488 líneas), CazadorSilabasWrapper.tsx (32 líneas, no modificar).
- Leído infraestructura AAA: GameShell/GameHUD/GameIntro/GameOverlay/useGameAudio/FloatingScore/ParticleBurst.
- Rediseñado CazadorSilabas.tsx (~770 líneas) con 3 estados (intro/jugando/completado).
- Visuales AAA nuevos:
  - SkyScene: 4 NubeSVG con drift horizontal, AvionSVG hiperdetallado (hélice giratoria, luz parpadeante), ArcoirisSVG sutil de 6 arcos.
  - GloboView premium: PNG existente + halo radial blur + glossy overlay + reflejo inferior + sílaba Fredoka bold con textShadow multi-capa + cuerda SVG curva + onda de choque al explotar + animaciones globo-sway y globo-pop-aaa.
  - LedSyllableDisplay: cartel LED matrix con patrón de puntos, dots pulsantes, sílabas con 3 estados (done/current/pending).
  - ProgressSilabas: glassmorphism con chips.
- Jugabilidad AAA:
  - Puntos: +10×comboMult / +20 con errores / +30 sin error.
  - Combo: x2..x5 (racha de palabras sin error).
  - Timer 20s por palabra con tick SFX bajo 5s.
  - Vidas 3 corazones, -1 al error o timeout.
  - FloatingScore y ParticleBurst en globo correcto.
  - Botón "Reiniciar palabra" opcional.
- SFX integrados con useGameAudio: pop, success, error, combo, victory, tick, click, vibrate.
- Mecánica pedagógica 100% conservada: 8 palabras hardcodeadas, sílabas, spawn, validación por orden.
- Wrapper NO modificado (patrón BusLetras: handleSalir delega al botón del Wrapper vía querySelector).

## Stage Summary
- 1 archivo rediseñado: src/components/CazadorSilabas.tsx (488 → ~770 líneas).
- Arquitectura AAA: GameShell (sky) + GameIntro (NUEVO, 🎈+4 pasos) + GameHUD (language) + GameOverlay (victoria/derrota).
- 4 SVGs decorativos nuevos (Nube, Avion, Arcoiris, cuerda de globo).
- GloboView premium con marco glossy, brillo, cuerda SVG, onda de choque.
- LED syllable display + glassmorphism progress.
- Combo x2..x5, timer 20s, +30 bonus sin error, FloatingScore, ParticleBurst.
- Audio unificado con useGameAudio (pop/success/error/combo/victory/tick/click/vibrate).
- Lint: 0 errores, 0 warnings en CazadorSilabas.tsx (verificado `npx eslint --max-warnings 0` exit 0).
- Dev server: compila limpio (261ms), HTTP 200, sin errores runtime.
- Wrapper NO modificado.
