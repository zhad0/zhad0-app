import { useEffect, useRef, useState } from "react";

const CHARS =
  "0123456789ABCDEF░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌ZKΨπθΔΣ∀∃∈⊕⊗⊂⊃≡≢≈∞⌀01";

interface AsciiConfig {
  color?: string;      // base RGB
  speed?: number;      // ms per tick (lower = faster)
  opacity?: number;    // max glyph opacity
  fontSize?: number;
  density?: number;    // fraction of cols active at once (0-1)
}

export function AsciiBackground({
  color = "232,60,135",
  speed = 80,
  opacity = 0.07,
  fontSize = 13,
  density = 0.35,
  className = "",
}: AsciiConfig & { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let drops: number[] = [];
    let opacities: number[] = [];
    let animId: number;
    let lastTick = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * window.devicePixelRatio;
      canvas!.height = height * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
      cols = Math.floor(width / fontSize);
      drops = Array.from({ length: cols }, () =>
        Math.random() > density ? -Math.floor(Math.random() * (height / fontSize)) : 0
      );
      opacities = Array.from({ length: cols }, () => Math.random() * opacity);
    }

    function tick(now: number) {
      animId = requestAnimationFrame(tick);
      if (now - lastTick < speed) return;
      lastTick = now;

      // Fade trail
      ctx!.fillStyle = "rgba(8,8,8,0.15)";
      ctx!.fillRect(0, 0, width, height);

      ctx!.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < cols; i++) {
        if (Math.random() > density) continue;

        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Brightest glyph at head
        const headAlpha = Math.min(opacity * 2, 0.18);
        ctx!.fillStyle = `rgba(${color},${headAlpha})`;
        ctx!.fillText(char, x, y);

        // Tail fades
        for (let t = 1; t <= 4; t++) {
          const tailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          const tailAlpha = opacity * (1 - t * 0.22);
          if (tailAlpha <= 0) break;
          ctx!.fillStyle = `rgba(${color},${tailAlpha})`;
          ctx!.fillText(tailChar, x, y - t * fontSize);
        }

        // Reset when past bottom
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.4 + Math.random() * 0.6;
      }
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [color, speed, opacity, fontSize, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      style={{ mixBlendMode: "screen" }}
      aria-hidden
    />
  );
}

/* ── Static ASCII grid panel (decorative, no animation) ── */
const GRID_CHARS = "0x░▒│┤ZK∀∃⊕≡01ABCDEF∞⌀Ψπ";

export function AsciiPanel({
  rows = 8,
  cols = 32,
  className = "",
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  const lines = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (__, c) => {
      const idx = (r * cols + c * 7) % GRID_CHARS.length;
      return GRID_CHARS[idx];
    }).join("")
  );

  return (
    <div
      className={`font-mono text-[10px] leading-[1.6] tracking-widest text-primary/8 select-none pointer-events-none whitespace-pre overflow-hidden ${className}`}
      aria-hidden
    >
      {lines.join("\n")}
    </div>
  );
}

/* ── Typewriter that activates on scroll into view ── */
export function AsciiTypewriter({
  text,
  delay = 0,
  speed = 52,
  className = "",
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Start typing when element enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [started, text, delay, speed]);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayed || "\u00A0"}
      <span className="ascii-cursor">_</span>
    </span>
  );
}

/* ── Scrolling marquee strip of hex chars ── */
export function AsciiStrip({ className = "" }: { className?: string }) {
  const strip = Array.from({ length: 120 }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join(" ");

  return (
    <div
      className={`overflow-hidden whitespace-nowrap font-mono text-[11px] tracking-widest text-primary/10 select-none pointer-events-none ${className}`}
      aria-hidden
    >
      <div className="animate-marquee inline-block">{strip}&nbsp;&nbsp;&nbsp;{strip}</div>
    </div>
  );
}
