import { useState, useCallback, useRef, useEffect } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!$%*+=<>/\\|ZK∀⊕≡Ψπ";
const BLOCKS = "░▒▓█▄▀▌▐■";

export function useScramble(original: string, duration = 500) {
  const [display, setDisplay] = useState(original);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current === null) setDisplay(original);
  }, [original]);

  const trigger = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    let startTs: number | null = null;

    // Phase boundary: first 35% scramble → blocks, then 35-100% resolve left-to-right
    const PHASE1 = 0.35;

    function frame(ts: number) {
      if (startTs === null) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);

      const next = original
        .split("")
        .map((char, i) => {
          if (/[\s_.,/:()\\|[\]{}<>→•–—]/.test(char)) return char;

          if (progress < PHASE1) {
            // Phase 1: scramble everything into block chars
            const p = progress / PHASE1;
            const blockCount = Math.floor(p * original.length);
            if (i < blockCount) return BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          } else {
            // Phase 2: resolve left-to-right from blocks back to real char
            const p = (progress - PHASE1) / (1 - PHASE1);
            const resolved = Math.floor(p * original.length);
            if (i < resolved) return char;
            return BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
          }
        })
        .join("");

      setDisplay(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setDisplay(original);
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [original, duration]);

  return { display, trigger };
}
