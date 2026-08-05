/**
 * Infraestructura AAA compartida para mini-juegos de Mundilex.
 * ------------------------------------------------------------
 * Importa desde "@/components/game":
 *   import { GameShell, GameHUD, GameIntro, GameOverlay, useGameAudio, FloatingScore, ParticleBurst } from "@/components/game";
 */

export { GameShell, type ShellTheme, type GameShellProps } from "./GameShell";
export { GameHUD, type HudTheme, type GameHUDProps } from "./GameHUD";
export { GameIntro, type GameIntroProps } from "./GameIntro";
export { GameOverlay, type EndStats, type GameOverlayProps } from "./GameOverlay";
export { useGameAudio, type GameAudio } from "./useGameAudio";
export {
  FloatingScore,
  type FloatingScoreItem,
  nextScoreId,
} from "./FloatingScore";
export { ParticleBurst, type BurstConfig } from "./ParticleBurst";
