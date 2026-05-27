import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoZ } from "./logo-z";
import logoUrl from "/logo.png";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!$%*+=░▒▓|/\\<>[]{}Ψπθ∀∃⊕≡ZK";
const TARGET = "ZHAD0";
const DECODE_DURATION = 1800; // ms total to decode all letters
const HOLD_DURATION   = 3100; // ms to hold fully decoded (~5s total incl decode + fade)
const FADE_DURATION   = 600;  // ms for exit fade

function scrambleChar(target: string, progress: number): string {
  if (progress >= 1) return target;
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/* ─── Matrix rain canvas (same engine as ascii-bg, inlined here) ─── */
function RainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let lastTick = 0;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width  = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const fs = 13;
    const cols = Math.floor(w / fs);
    const drops = Array.from({ length: cols }, () => Math.random() * -(h / fs));

    function tick(now: number) {
      animId = requestAnimationFrame(tick);
      if (now - lastTick < 70) return;
      lastTick = now;

      ctx!.fillStyle = "rgba(8,8,8,0.18)";
      ctx!.fillRect(0, 0, w, h);
      ctx!.font = `${fs}px "JetBrains Mono", monospace`;

      for (let i = 0; i < cols; i++) {
        if (Math.random() > 0.35) continue;
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * fs;
        const y = drops[i] * fs;
        ctx!.fillStyle = `rgba(232,60,135,0.09)`;
        ctx!.fillText(char, x, y);
        for (let t = 1; t <= 5; t++) {
          ctx!.fillStyle = `rgba(232,60,135,${0.04 - t * 0.007})`;
          ctx!.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], x, y - t * fs);
        }
        if (y > h && Math.random() > 0.97) drops[i] = 0;
        drops[i] += 0.35 + Math.random() * 0.5;
      }
    }
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
      aria-hidden
    />
  );
}

/* ─── Single decoded letter ─── */
function DecodedLetter({ char, delay }: { char: string; delay: number }) {
  const [displayed, setDisplayed] = useState("_");
  const [done, setDone] = useState(false);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);
  const LETTER_DECODE = 480; // ms to decode one letter

  useEffect(() => {
    const timeout = setTimeout(() => {
      function frame(ts: number) {
        if (!startRef.current) startRef.current = ts;
        const elapsed = ts - startRef.current;
        const progress = Math.min(elapsed / LETTER_DECODE, 1);

        if (progress < 1) {
          // Every ~40ms flip the scramble
          setDisplayed(scrambleChar(char, progress));
          frameRef.current = requestAnimationFrame(frame);
        } else {
          setDisplayed(char);
          setDone(true);
        }
      }
      frameRef.current = requestAnimationFrame(frame);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [char, delay]);

  return (
    <span
      className="inline-block font-black tracking-tighter transition-colors duration-150"
      style={{
        color: done ? "#ffffff" : "rgba(232,60,135,0.75)",
        textShadow: done
          ? "0 0 60px rgba(255,255,255,0.25), 0 0 120px rgba(232,60,135,0.15)"
          : "0 0 30px rgba(232,60,135,0.6)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {displayed}
    </span>
  );
}

/* ─── Main Loading Screen ─── */
interface Props {
  onDone: () => void;
}

export function LoadingScreen({ onDone }: Props) {
  const [visible, setVisible] = useState(true);
  const [showTagline, setShowTagline] = useState(false);
  const [showBar, setShowBar] = useState(false);

  // Stagger: letter i starts decoding after i * 200ms
  const LETTER_STAGGER = 200;
  const allDecodedAt = LETTER_STAGGER * (TARGET.length - 1) + 480; // when last letter finishes

  useEffect(() => {
    // Show tagline a bit before all letters done
    const t1 = setTimeout(() => setShowTagline(true), allDecodedAt - 100);
    const t2 = setTimeout(() => setShowBar(true), allDecodedAt + 80);
    // Begin exit
    const t3 = setTimeout(() => setVisible(false), allDecodedAt + HOLD_DURATION);
    // Unmount fully after fade
    const t4 = setTimeout(() => onDone(), allDecodedAt + HOLD_DURATION + FADE_DURATION + 100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION / 1000, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#080808" }}
        >
          {/* Matrix rain */}
          <RainCanvas />

          {/* Scanline sweep */}
          <div className="ascii-scanline pointer-events-none" />

          {/* Radial glow center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(232,60,135,0.07) 0%, transparent 70%)",
            }}
          />

          {/* Top-left corner decoration */}
          <div className="hidden sm:block absolute top-8 left-8 font-mono text-[10px] tracking-[0.3em] text-primary/30 pointer-events-none">
            ZHAD0_PROTOCOL // v0.9.4 // BASE_L2
          </div>

          {/* Top-right corner — chain badge */}
          <div className="hidden sm:flex absolute top-8 right-8 items-center gap-2 font-mono text-[10px] tracking-widest text-primary/30 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            CHAIN_ID 8453
          </div>

          {/* Bottom border line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 left-0 right-0 h-px bg-primary/20 origin-left pointer-events-none"
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center select-none">

            {/* Logo mark */}
            <motion.img
              src={logoUrl}
              alt="ZHAD0"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-28 h-28 object-contain mb-4 logo-animate"
            />

            {/* ZHAD0 letters */}
            <div
              className="flex gap-[0.03em] mb-6 px-6 w-full justify-center"
              style={{ fontSize: "clamp(52px, 15vw, 200px)", lineHeight: 1 }}
              aria-label="ZHAD0"
            >
              {TARGET.split("").map((char, i) => (
                <DecodedLetter
                  key={i}
                  char={char}
                  delay={i * LETTER_STAGGER}
                />
              ))}
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={showTagline ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-mono text-[10px] tracking-[0.1em] sm:tracking-[0.4em] text-white/35 uppercase mb-10 text-center px-6"
            >
              ZK-Powered Privacy Layer for AI Agents on Base
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={showBar ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="w-48 h-px bg-white/8 overflow-hidden relative"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={showBar ? { scaleX: 1 } : {}}
                transition={{ duration: (HOLD_DURATION / 1000) * 0.85, ease: "linear" }}
                className="absolute inset-0 bg-primary origin-left"
              />
            </motion.div>

            {/* Initialising label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={showBar ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-3 font-mono text-[10px] tracking-[0.15em] sm:tracking-[0.35em] text-primary/40 text-center px-4"
            >
              INITIALISING GHOST RELAY NETWORK...
            </motion.div>
          </div>

          {/* Bottom-left hex strip */}
          <div className="hidden sm:block absolute bottom-8 left-8 font-mono text-[9px] tracking-widest text-white/10 pointer-events-none">
            {Array.from({ length: 6 }, (_, i) =>
              Array.from({ length: 8 }, () =>
                Math.floor(Math.random() * 16).toString(16).toUpperCase()
              ).join("")
            ).join(" ")}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
