import { useState, useEffect, useRef, type ComponentType } from "react";
import { Layout } from "@/components/layout";
import { useGetProtocolStats, useGetIntentFeed } from "@/lib/api-client";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Shield, Lock, Network, Zap, EyeOff, ArrowRight, Clock } from "lucide-react";
import { SiEthereum } from "react-icons/si";
import { AsciiTypewriter } from "@/components/ascii-bg";
import { ScrambleText, ScrambleHeading } from "@/components/scramble-text";
import { SdkDemo } from "@/components/sdk-demo";
import { useScramble } from "@/hooks/use-scramble";
import logoUrl from "/logo.png";

const LEFT_KEYWORDS = ["Encrypted", "Anonymous", "Untraceable", "Obfuscated", "Shielded", "Private"];
const RIGHT_KEYWORDS = ["ZK-Proven", "Composable", "Permissionless", "Decentralized", "Open", "Trustless"];

const FRAMEWORKS = ["Virtuals Protocol", "Eliza Framework", "Coinbase AgentKit"];


function FloatingOrb({ className }: { className?: string }) {
  return (
    <div className={`rounded-full blur-3xl pointer-events-none ${className}`} />
  );
}

/* ── Horizontal light beams background ── */
const BEAMS = [
  { top: "18%",  h: 3,   blur: 22, opacity: 0.90, color: "#ffffff", w: "52%", skew: -7 },
  { top: "21%",  h: 18,  blur: 55, opacity: 0.55, color: "hsl(300,80%,62%)", w: "48%", skew: -7 },
  { top: "20%",  h: 8,   blur: 38, opacity: 0.70, color: "hsl(328,90%,68%)", w: "44%", skew: -7 },
  { top: "33%",  h: 2,   blur: 14, opacity: 0.80, color: "#ffffff", w: "42%", skew: -7 },
  { top: "35%",  h: 14,  blur: 50, opacity: 0.45, color: "hsl(280,75%,55%)", w: "46%", skew: -7 },
  { top: "34%",  h: 6,   blur: 28, opacity: 0.65, color: "hsl(328,90%,62%)", w: "40%", skew: -7 },
  { top: "48%",  h: 2,   blur: 12, opacity: 0.75, color: "#ffffff", w: "38%", skew: -7 },
  { top: "50%",  h: 12,  blur: 48, opacity: 0.40, color: "hsl(300,80%,58%)", w: "44%", skew: -7 },
  { top: "49%",  h: 5,   blur: 24, opacity: 0.58, color: "hsl(328,90%,60%)", w: "36%", skew: -7 },
  { top: "62%",  h: 2,   blur: 14, opacity: 0.70, color: "#ffffff", w: "34%", skew: -7 },
  { top: "64%",  h: 10,  blur: 44, opacity: 0.35, color: "hsl(280,70%,52%)", w: "40%", skew: -7 },
  { top: "63%",  h: 4,   blur: 22, opacity: 0.52, color: "hsl(328,90%,58%)", w: "32%", skew: -7 },
];

function HeroBeams() {
  return (
    <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
      {/* Ambient purple-pink glow mass behind beams */}
      <div
        className="absolute"
        style={{
          top: "10%", left: "-5%",
          width: "55%", height: "80%",
          background: "radial-gradient(ellipse 70% 65% at 35% 50%, hsl(300,70%,28%) 0%, hsl(328,80%,18%) 45%, transparent 100%)",
          filter: "blur(60px)",
          opacity: 0.55,
        }}
      />
      {/* Individual beams */}
      {BEAMS.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: b.top,
            left: "-8%",
            width: b.w,
            height: `${b.h}px`,
            background: `linear-gradient(90deg, transparent 0%, ${b.color} 30%, ${b.color} 65%, transparent 100%)`,
            filter: `blur(${b.blur}px)`,
            opacity: b.opacity,
            transform: `skewY(${b.skew}deg)`,
            transformOrigin: "left center",
          }}
        />
      ))}
      {/* Edge fade — right side stays dark */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, transparent 45%, #080808 78%)",
        }}
      />
      {/* Top + bottom fade to page bg */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #080808 0%, transparent 12%, transparent 88%, #080808 100%)",
        }}
      />
    </div>
  );
}

/* ── Cipher keyword — encrypts to blocks then resolves char-by-char ── */
function GlitchKeyword({ word, initDelay = 0 }: { word: string; initDelay?: number }) {
  const [display, setDisplay] = useState(word);
  const [encrypting, setEncrypting] = useState(false);

  useEffect(() => {
    let cancel = false;
    let resolveTimer: ReturnType<typeof setInterval> | null = null;

    function schedule() {
      const wait = 3000 + initDelay * 380 + Math.random() * 3500;
      setTimeout(() => {
        if (cancel) return;

        // Step 1: flash to full blocks instantly
        setEncrypting(true);
        setDisplay("█".repeat(word.length));

        // Step 2: resolve left-to-right, one char per tick
        let i = 0;
        resolveTimer = setInterval(() => {
          if (cancel) { clearInterval(resolveTimer!); return; }
          i++;
          setDisplay(word.slice(0, i) + "█".repeat(word.length - i));
          if (i >= word.length) {
            clearInterval(resolveTimer!);
            setEncrypting(false);
            schedule();
          }
        }, 55);
      }, wait);
    }

    schedule();
    return () => {
      cancel = true;
      if (resolveTimer) clearInterval(resolveTimer);
    };
  }, [word, initDelay]);

  return (
    <span
      className="text-[10px] font-mono tracking-wide py-0.5 block select-none"
      style={{
        color: encrypting ? "hsl(328,90%,55%)" : "rgba(255,255,255,0.18)",
        transition: "color 0.08s linear",
      }}
    >
      {display}
    </span>
  );
}

function ZkProofCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.7 }}
      className="border border-white/8 font-mono w-44 flex-shrink-0"
      style={{ background: "linear-gradient(160deg,#0d040d 0%,#080808 100%)" }}
    >
      <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
        <span className="text-[9px] tracking-widest text-white/20">ZK_PROOF</span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      </div>
      {[
        { label: "CIRCUIT", value: "RISC_ZERO" },
        { label: "STATUS", value: "DESIGN_PHASE", highlight: true },
        { label: "CHAIN", value: "BASE_8453" },
        { label: "INTENT", value: "0x████████" },
        { label: "LATENCY", value: "<120ms" },
      ].map(({ label, value, highlight }) => (
        <div key={label} className="px-3 py-2 border-b border-white/4 last:border-0">
          <div className="text-[8px] text-white/18 tracking-widest mb-0.5">{label}</div>
          <div className={`text-[10px] ${highlight ? "text-primary" : "text-white/45"}`}>{value}</div>
        </div>
      ))}
    </motion.div>
  );
}

/* ── ZK proof overlay for hero video card ── */
const INTENT_HASHES = ["0x3f7a…c91b", "0xb82d…4e0f", "0xa14c…77d3", "0x5e3b…f208", "0xd961…aa1c"];
const LATENCIES     = ["87ms", "94ms", "112ms", "76ms", "103ms", "91ms"];

function ZkProofOverlay() {
  const [idx, setIdx]     = useState(0);
  const [latIdx, setLatIdx] = useState(0);
  const [tick, setTick]   = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i  => (i  + 1) % INTENT_HASHES.length);
      setLatIdx(i => (i + 1) % LATENCIES.length);
      setTick(t => t + 1);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  const rows = [
    { label: "CIRCUIT",  value: "RISC_ZERO_V1.2",           highlight: false },
    { label: "STATUS",   value: "DESIGN_PHASE",              highlight: true  },
    { label: "CHAIN",    value: "BASE_8453",                 highlight: false },
    { label: "INTENT",   value: INTENT_HASHES[idx],          highlight: false, cycle: true },
    { label: "LATENCY",  value: LATENCIES[latIdx],           highlight: false, cycle: true },
    { label: "PROOF_SZ", value: "32 bytes",                  highlight: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="relative z-30 font-mono border-t border-primary/15"
      style={{ background: "rgba(8,8,8,0.98)" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
        <span className="text-[8px] tracking-[0.3em] text-primary/60">ZK_PROOF_STREAM</span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      </div>

      {/* Rows */}
      {rows.map(({ label, value, highlight, cycle }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 + i * 0.06, duration: 0.4 }}
          className="flex items-center justify-between px-3 py-[3px]"
        >
          <span className="text-[8px] tracking-widest text-white/20">{label}</span>
          <motion.span
            key={cycle ? `${label}-${tick}` : label}
            initial={cycle ? { opacity: 0, y: -4 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`text-[9px] tracking-wider ${highlight ? "text-primary" : "text-white/50"}`}
          >
            {value}
          </motion.span>
        </motion.div>
      ))}

      {/* ASCII progress bar */}
      <div className="px-3 pt-1.5 pb-3">
        <ProofProgressBar tick={tick} />
      </div>
    </motion.div>
  );
}

function ProofProgressBar({ tick }: { tick: number }) {
  const [fill, setFill] = useState(0);
  const LEN = 20;
  useEffect(() => {
    setFill(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setFill(i);
      if (i >= LEN) clearInterval(iv);
    }, 90);
    return () => clearInterval(iv);
  }, [tick]);
  return (
    <div className="text-[8px] tracking-[0.12em] select-none" aria-hidden>
      <span className="text-primary/70">{"▓".repeat(fill)}</span>
      <span className="text-white/10">{"░".repeat(Math.max(0, LEN - fill))}</span>
      <span className="text-white/18 ml-1">{Math.round((fill / LEN) * 100)}%</span>
    </div>
  );
}

/* ── About data ── */
const PRINCIPLES = [
  { num: "01", title: "PRIVACY IS INFRASTRUCTURE", body: "Privacy for AI agents is not a nice-to-have. It is the primitive on which everything else — strategy, yield, autonomy — depends. We build the pipe. Not the app." },
  { num: "02", title: "CRYPTOGRAPHY, NOT POLICY",  body: "We do not ask you to trust us. We give you math. ZK proofs validating ZHAD0 intents are verifiable by anyone, on-chain, without trust in any operator." },
  { num: "03", title: "BASE-NATIVE FIRST",          body: "Base is where AI agent infrastructure is being built. We go deep on one chain, do it right, and expand when the time is right." },
  { num: "04", title: "OPEN AND EARNED",            body: "The protocol is open-source. Ghost Relayers earn their role by staking. Governance is earned by holding. Nothing is granted — everything is permissionless." },
];

const TEAM = [
  { handle: "0xDecker", role: "PROTOCOL_LEAD",       bio: "Former cryptography researcher at Ethereum Foundation. Led ZK infrastructure at zkSync. Obsessed with invisible infrastructure.", location: "Berlin"    },
  { handle: "0xElix",   role: "SYSTEMS_ENGINEER",    bio: "Ex-L2 core at Optimism. Built the relay subsystem from scratch. Believes MEV is theft.", location: "Singapore" },
  { handle: "0xZero",   role: "ZK_RESEARCH",         bio: "RISC Zero ecosystem contributor. PhD in applied cryptography from ETH Zürich. Designed the intent-validity circuit.", location: "Zürich"    },
  { handle: "0xForge",  role: "PROTOCOL_ECONOMICS",  bio: "Tokenomics design at three major DeFi protocols. Designed the $ZHAD0 slash-and-earn mechanism from first principles.", location: "Remote"    },
];

const MILESTONES = [
  { date: "Q1 2026", label: "PROTOCOL_DESIGN",  desc: "Architecture, ZK circuit design, whitepaper, and core team assembled.",                                  status: "done"     },
  { date: "Q2 2026", label: "TESTNET_ALPHA",    desc: "Ghost Relay node software in development. Deploying to Base Sepolia for initial relay testing.",          status: "active"   },
  { date: "Q3 2026", label: "MAINNET_LAUNCH",   desc: "Smart contract audit, $ZHAD0 token deployment to Base mainnet, first Ghost Relayers onboarded.",         status: "upcoming" },
  { date: "Q3 2026", label: "DAO_LAUNCH",       desc: "RelayRegistry and ZHADGovernor deployed. On-chain staking and governance active.",                       status: "upcoming" },
  { date: "Q4 2026", label: "SDK_V1",           desc: "LangChain, Eliza, AgentKit drop-in SDK packages. Developer grants program.",                             status: "upcoming" },
  { date: "Q1 2027", label: "CROSS_CHAIN",      desc: "LayerZero bridge enables intents from Arbitrum and Optimism. 50+ relayer target.",                       status: "upcoming" },
];

/* ── RevealText: word-by-word dim → white on scroll ── */
function RevealText({ children, delay = 0, className = "" }: { children: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -10% 0px" });
  return (
    <span ref={ref} className={`inline ${className}`}>
      {children.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ color: "rgba(255,255,255,0.10)" }}
          animate={inView ? { color: "rgba(255,255,255,1)" } : { color: "rgba(255,255,255,0.10)" }}
          transition={{ duration: 0.5, delay: delay + i * 0.045, ease: "easeOut" }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ── FadeUp: viewport-triggered fade + slide ── */
function CountUp({ to, delayMs = 0, duration = 1400 }: { to: number; delayMs?: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    let startTs = 0;
    const startTimer = window.setTimeout(() => {
      const step = (ts: number) => {
        if (!startTs) startTs = ts;
        const p = Math.min(1, (ts - startTs) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delayMs);
    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [to, delayMs, duration]);
  return <>{val.toLocaleString()}</>;
}

function FadeUp({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const BAR_LEN = 18;

function ArchCard({
  step,
  icon: Icon,
  title,
  desc,
  stat,
  statLabel,
  delay = 0,
}: {
  step: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [fill, setFill] = useState(0);
  const { display: titleDisplay, trigger: scrambleTitle } = useScramble(title, 540);

  useEffect(() => {
    if (hovered) {
      scrambleTitle();
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setFill(i);
        if (i >= BAR_LEN) clearInterval(iv);
      }, 36);
      return () => clearInterval(iv);
    } else {
      const t = setTimeout(() => setFill(0), 200);
      return () => clearTimeout(t);
    }
  }, [hovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-[#080808] group overflow-hidden cursor-default ascii-scan-btn"
    >
      {/* Hover border glow */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-all duration-500 pointer-events-none z-20" />

      {/* Giant watermark step number */}
      <div
        className="absolute -bottom-8 -right-2 font-black font-mono leading-none select-none pointer-events-none transition-opacity duration-700"
        style={{
          fontSize: "clamp(160px, 24vw, 260px)",
          color: hovered ? "rgba(232,60,135,0.07)" : "rgba(232,60,135,0.028)",
          lineHeight: 1,
        }}
        aria-hidden
      >
        {step}
      </div>

      {/* Top-left corner bracket decoration */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-primary/20 group-hover:border-primary/50 transition-colors duration-300 pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-primary/10 group-hover:border-primary/30 transition-colors duration-300 pointer-events-none z-20" />

      {/* Content */}
      <div className="relative z-10 p-12 flex flex-col min-h-[500px]">

        {/* Top row: step label + icon box */}
        <div className="flex items-start justify-between mb-10">
          <div className="font-mono text-[10px] tracking-[0.55em] text-white/20 mt-1">_{step}</div>
          <div className="w-14 h-14 border border-primary/20 flex items-center justify-center group-hover:border-primary/70 group-hover:bg-primary/6 transition-all duration-400 relative">
            <Icon className="w-6 h-6 text-primary" />
            {/* Corner ticks on icon box */}
            <span className="absolute -top-px -left-px w-2 h-px bg-primary/40 group-hover:bg-primary/80 transition-colors" />
            <span className="absolute -top-px -left-px w-px h-2 bg-primary/40 group-hover:bg-primary/80 transition-colors" />
          </div>
        </div>

        {/* ASCII progress fill bar */}
        <div className="font-mono text-[11px] mb-8 select-none tracking-[0.18em]" aria-hidden>
          <span className="text-primary">{"\u2588".repeat(fill)}</span>
          <span className="text-white/10">{"░".repeat(Math.max(0, BAR_LEN - fill))}</span>
        </div>

        {/* Title — scrambles on card hover */}
        <h3
          className="font-black font-mono text-white mb-7 leading-tight"
          style={{ fontSize: "clamp(15px, 1.6vw, 19px)", letterSpacing: "0.15em" }}
        >
          {titleDisplay}
        </h3>

        {/* Divider */}
        <div className="w-8 h-px bg-primary/30 mb-6 group-hover:w-16 transition-all duration-500" />

        {/* Description — typewriter on inView */}
        <div className="flex-1">
          <AsciiTypewriter
            text={desc}
            speed={16}
            delay={200}
            className="text-[13px] text-white/35 leading-[1.85] tracking-wide"
          />
        </div>

        {/* Bottom stat row */}
        <div className="mt-10 pt-5 border-t border-white/5 flex items-center justify-between">
          <div className="text-[9px] font-mono text-white/18 tracking-[0.35em] uppercase">{statLabel}</div>
          <div className="text-[9px] font-mono text-primary/55 tracking-widest border border-primary/15 px-2.5 py-1">
            {stat}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const { data: stats } = useGetProtocolStats();
  const { data: intents } = useGetIntentFeed();

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#080808' }}>
        <HeroBeams />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080808] pointer-events-none z-10" />

        {/* Large background logo — sits above gradient so it's visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.4 }}
          className="absolute pointer-events-none select-none"
          style={{ right: "50%", top: "50%", transform: "translate(50%, -50%)", zIndex: 11 }}
          aria-hidden
        >
          <img
            src={logoUrl}
            alt=""
            className="logo-animate"
            style={{
              width: "min(75vw, 700px)",
              height: "min(75vw, 700px)",
              objectFit: "contain",
              opacity: 0.10,
            }}
          />
        </motion.div>

        <div className="relative z-20 flex-1 flex items-center max-w-7xl mx-auto px-6 w-full py-8 gap-8">

          {/* Left keyword column */}
          <div className="hidden lg:flex flex-col gap-1 mr-4 min-w-[100px]" aria-hidden>
            <div className="w-px h-8 bg-white/8 mb-2 ml-1" />
            {LEFT_KEYWORDS.map((w, i) => (
              <motion.div
                key={w}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
              >
                <GlitchKeyword word={w} initDelay={i} />
              </motion.div>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-[10px] font-mono text-primary/50 tracking-wide pt-1 block"
            >
              = ZHAD0
            </motion.span>
            <div className="w-px h-8 bg-white/8 mt-2 ml-1" />
          </div>

          {/* Center — main hero content */}
          <div className="flex-1 text-center min-w-0">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-primary/25 bg-primary/5 px-3 py-1.5 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
              <span className="text-[10px] font-mono tracking-[0.2em] text-primary/80">ZK-POWERED // BASE_L2 // PRE-MAINNET</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-black leading-[0.85] tracking-tighter mb-4"
              style={{ fontSize: "clamp(64px, 11vw, 148px)" }}
            >
              <span className="block text-white">
                <ScrambleHeading delay={600}>INVISIBLE</ScrambleHeading>
              </span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(92deg, hsl(328,90%,65%) 0%, hsl(300,75%,68%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <ScrambleHeading delay={900}>AGENTS.</ScrambleHeading>
              </span>
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="w-10 h-px bg-primary/50 mx-auto mb-6 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-sm text-white/40 font-mono max-w-sm mx-auto mb-10 leading-relaxed"
            >
              ZHAD0 encrypts agent intents off-chain, proves validity via RISC Zero, and relays through a decentralised Ghost network — nobody on Base can trace your agent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center font-mono"
            >
              <Link
                href="/relayer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-black px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-primary/90 transition-all"
                data-testid="btn-hero-relayer"
              >
                <ScrambleText>RUN A GHOST NODE</ScrambleText> <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/network"
                className="inline-flex items-center justify-center border border-white/12 text-white/55 px-7 py-3.5 text-xs font-bold tracking-widest hover:border-primary/40 hover:text-white/90 transition-all"
                data-testid="btn-hero-network"
              >
                <ScrambleText>VIEW TELEMETRY</ScrambleText>
              </Link>
            </motion.div>
          </div>

          {/* Right — hero video + keywords */}
          <div className="hidden lg:flex flex-col items-end gap-2 ml-4 min-w-[180px]">
            {/* Pink-treated video card */}
            <div className="relative overflow-hidden border border-primary/20 w-52 flex-shrink-0">
              {/* screen-blend pink overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(160deg, hsl(328,90%,38%) 0%, hsl(300,78%,28%) 60%, hsl(328,90%,18%) 100%)",
                  mixBlendMode: "screen",
                  opacity: 0.6,
                }}
              />
              {/* corner vignette */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(8,8,8,0.7) 100%)",
                }}
              />
              {/* corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40 pointer-events-none z-30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40 pointer-events-none z-30" />
              <video
                src="/hero.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full object-cover"
                style={{
                  height: "280px",
                  filter: "grayscale(1) contrast(1.15) brightness(0.65)",
                }}
              />
              {/* ZK proof data overlay */}
              <ZkProofOverlay />
            </div>
            <div className="w-px h-8 bg-white/8 mr-1 mt-2" />
            {RIGHT_KEYWORDS.map((w, i) => (
              <motion.div
                key={w}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
              >
                <GlitchKeyword word={w} initDelay={i + 6} />
              </motion.div>
            ))}
            <div className="w-px h-8 bg-white/8 mr-1 mt-1" />
          </div>
        </div>

        {/* Bottom partners / tech strip — infinite marquee */}
        <div className="relative z-20 border-t border-white/5 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-6">
            <div className="text-[10px] font-mono tracking-[0.4em] text-white/30 flex-shrink-0 hidden md:block">
              POWERED_BY //
            </div>

            {/* Marquee viewport with edge fades */}
            <div
              className="relative flex-1 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)",
              }}
            >
              <div
                className="flex items-center w-max"
                style={{ animation: "marquee 64s linear infinite" }}
              >
                {[...Array(4)].map((_, dupIdx) => (
                  <div key={dupIdx} className="flex items-center gap-14 pr-14 flex-shrink-0" aria-hidden={dupIdx !== 0}>
                    {[
                      { src: "/partners/npm.png",       alt: "npm",              h: 22 },
                      { src: "/partners/base.webp",     alt: "Base",             h: 34 },
                      { src: "/partners/coinbase.png",  alt: "Coinbase",         h: 28 },
                      { src: "/partners/risczero.png",  alt: "RISC Zero",        h: 34 },
                      { src: "/partners/virtuals.png",  alt: "Virtuals Protocol", h: 34 },
                      { src: "/partners/icon.png",      alt: "Agent Icon",       h: 30 },
                    ].map(({ src, alt, h }) => (
                      <img
                        key={`${dupIdx}-${alt}`}
                        src={src}
                        alt={dupIdx === 0 ? alt : ""}
                        loading="eager"
                        style={{
                          height: h,
                          width: "auto",
                          objectFit: "contain",
                          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.85)) drop-shadow(0 2px 4px rgba(0,0,0,0.7))",
                        }}
                        className="opacity-85 flex-shrink-0 select-none"
                        draggable={false}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono tracking-[0.4em] text-white/30 flex-shrink-0 hidden md:block">
              // BASE_L2
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ── */}
      <section className="py-32" style={{ backgroundColor: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-6">THE_PROBLEM</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
                <ScrambleHeading>AI agents are</ScrambleHeading><br />
                <span className="text-primary"><ScrambleHeading delay={220}>naked on-chain.</ScrambleHeading></span>
              </h2>
              <p className="text-white/50 font-mono text-sm leading-relaxed mb-8 max-w-md">
                Every swap, position, and strategy is public. MEV bots front-run autonomous agents before they execute. Wallet surveillance exposes long-term strategy. ZHAD0 makes it stop.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: EyeOff, label: "Front-running via MEV extraction" },
                  { icon: Lock, label: "Strategy leakage through wallet transparency" },
                  { icon: Shield, label: "Balance surveillance at rest" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm font-mono text-white/60">
                    <div className="w-8 h-8 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <FloatingOrb className="absolute -top-16 -right-16 w-64 h-64 bg-primary/15 animate-float-slow" />
              <div
                className="relative border border-white/8 p-8 overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(232,60,135,0.05) 0%, rgba(0,0,0,0.4) 100%)" }}
              >
                {/* Horizontal scan line sweeping down the panel */}
                <div
                  className="absolute left-0 right-0 h-px pointer-events-none animate-panel-scan z-10"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(248,113,113,0.5) 30%, rgba(232,60,135,0.6) 70%, transparent 100%)",
                    boxShadow: "0 0 8px rgba(248,113,113,0.45)",
                  }}
                  aria-hidden
                />

                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-mono tracking-widest text-white/30">MEMPOOL_EXPOSURE</div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-red-400/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    LIVE
                  </div>
                </div>

                {[
                  "0x3a1F...→SWAP $48,000 USDC",
                  "0xB2c9...→LP ADD 12.4 ETH",
                  "0xC3d0...→LIMIT $2.1M PEPE",
                  "0xD4e1...→BRIDGE 0.8 BTC",
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
                    className="text-xs font-mono py-2.5 border-b border-white/5 flex items-center justify-between animate-expose-blink px-1 -mx-1"
                  >
                    <span className="text-white/60">{line}</span>
                    <span
                      className="text-[10px] tracking-widest px-1.5 py-0.5 animate-radar-pulse"
                      style={{ animationDelay: `${i * 0.25}s` }}
                    >
                      EXPOSED
                    </span>
                  </motion.div>
                ))}

                <div className="mt-6 pt-4 border-t border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-mono tracking-widest text-primary/60">WITH_ZHAD0</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-primary/70">
                      <Lock className="w-2.5 h-2.5" />
                      ENCRYPTED
                    </div>
                  </div>
                  {["0x████████████████████", "0x████████████████████", "0x████████████████████"].map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.75 + i * 0.12, duration: 0.5 }}
                      className="text-xs font-mono py-2.5 border-b border-white/5 flex items-center justify-between"
                    >
                      <span
                        className="text-white/25 encrypt-shimmer"
                        style={{ animationDelay: `${i * 0.6}s` }}
                      >
                        {line}
                      </span>
                      <span className="text-primary text-[10px] tracking-widest flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                        PRIVATE
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 border-y border-white/5" style={{ background: '#0c0c0c' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">ARCHITECTURE</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter"><ScrambleHeading>How ZHAD0 works.</ScrambleHeading></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            <ArchCard
              step="01"
              icon={Lock}
              title="INTENT_ENCRYPTION"
              desc="Agent intent payloads are encrypted off-chain using threshold keys. The intent content never touches the public mempool."
              stat="AES-256-GCM+TSS"
              statLabel="ENCRYPTION_SCHEME"
              delay={0}
            />
            <ArchCard
              step="02"
              icon={Shield}
              title="ZK_PROOF_GEN"
              desc="A RISC Zero zkVM generates a zero-knowledge proof that the intent is valid without revealing its contents. Validity without visibility."
              stat="RISC_ZERO_V1.2"
              statLabel="PROOF_SYSTEM"
              delay={0.1}
            />
            <ArchCard
              step="03"
              icon={Network}
              title="GHOST_RELAY"
              desc="Decentralized relayers validate proofs and submit execution to Base. No relayer sees the underlying intent. No single point of failure."
              stat="BASE_8453 // L2"
              statLabel="EXECUTION_LAYER"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ── AGENT COMPATIBILITY ── */}
      <section className="py-32" style={{ backgroundColor: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-6">COMPATIBILITY</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">
                <ScrambleHeading>Works with any</ScrambleHeading><br />
                <ScrambleHeading delay={220}>agent framework.</ScrambleHeading>
              </h2>
              <div className="space-y-2 font-mono text-sm">
                {FRAMEWORKS.map((fw) => (
                  <div key={fw} className="flex items-center gap-3 py-4 border-b border-white/5">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-white/80">{fw}</span>
                    <span className="ml-auto text-[10px] tracking-widest text-yellow-400/70 border border-yellow-400/30 px-2 py-0.5">PLANNED · Q4 2026</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 py-4 border-b border-white/5">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full flex-shrink-0" />
                  <span className="text-white/30">Raw JSON-RPC Interface</span>
                  <span className="ml-auto text-[10px] tracking-widest text-white/20 border border-white/10 px-2 py-0.5">UNIVERSAL</span>
                </div>
              </div>
            </div>

            <SdkDemo />
          </div>
        </div>
      </section>

      {/* ── LIVE FEED ── */}
      <section className="py-32 border-y border-white/5" style={{ background: '#0c0c0c' }}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Header row — bigger, with right-side live stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16"
          >
            <div>
              <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-5">
                <AsciiTypewriter text="TESTNET_TELEMETRY" speed={55} />
              </div>
              <h2
                className="font-black tracking-tighter leading-[0.92] mb-5"
                style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
              >
                <ScrambleHeading>Built. Audited.</ScrambleHeading><br />
                <span className="text-primary"><ScrambleHeading delay={250}>Not Yet Live.</ScrambleHeading></span>
              </h2>
              <p className="text-white/30 font-mono text-xs leading-relaxed max-w-sm">
                ZHAD0 is in <span className="text-primary/70">pre-mainnet</span>. Numbers below reflect{" "}
                testnet activity & design targets — not production traffic. The live intent feed activates{" "}
                once Ghost Relayers go online on Base mainnet.
              </p>
            </div>

            {/* Right — testnet counters */}
            <div className="relative flex gap-px border border-white/5 overflow-hidden">
              {/* Honest TESTNET badge over the strip */}
              <div className="absolute top-1 right-1 z-20 text-[8px] font-mono tracking-widest text-yellow-400/70 border border-yellow-400/25 bg-yellow-400/5 px-1.5 py-0.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-yellow-400/80 animate-pulse" />
                TESTNET
              </div>

              {/* Scanline across the whole strip */}
              <div
                className="absolute top-0 bottom-0 w-px pointer-events-none z-10 animate-stat-scan"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(232,60,135,0.6) 50%, transparent 100%)",
                  boxShadow: "0 0 8px rgba(232,60,135,0.5)",
                }}
                aria-hidden
              />

              {[
                { label: "TESTNET_PROOFS", value: 1284, suffix: "",     note: "since v0.4 devnet" },
                { label: "DEV_NODES",      value: 12,   suffix: "",     note: "internal + partners" },
                { label: "TARGET_LATENCY", value: 200,  suffix: "ms",   note: "design goal", prefix: "<" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
                  className="relative bg-[#080808] px-8 py-6 text-center min-w-[140px] group hover:bg-primary/[0.03] transition-colors"
                >
                  <div className="font-black font-mono text-white text-2xl mb-1 tabular-nums">
                    {stat.prefix}<CountUp to={stat.value} delayMs={350 + i * 120} />{stat.suffix}
                  </div>
                  <div className="text-[9px] font-mono tracking-widest text-white/30">{stat.label}</div>
                  <div className="text-[8px] font-mono text-white/15 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {stat.note}
                  </div>
                </motion.div>
              ))}
              <Link
                href="/network"
                className="ascii-scan-btn bg-[#080808] px-6 py-6 flex flex-col items-center justify-center gap-1.5 text-primary border-l border-white/5 hover:bg-primary/5 transition-colors group"
                data-testid="link-view-all"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span className="text-[8px] font-mono tracking-widest text-white/30">DETAILS</span>
              </Link>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="border border-white/5 relative overflow-hidden"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/25 pointer-events-none z-20" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/25 pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/15 pointer-events-none z-20" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/15 pointer-events-none z-20" />

            {/* Sticky column header */}
            <div className="grid grid-cols-5 px-6 py-4 border-b border-white/8 text-[9px] font-mono tracking-[0.35em] text-white/22 bg-[#0c0c0c] relative z-10">
              <span>PROOF_HASH</span>
              <span>FRAMEWORK</span>
              <span>REGION</span>
              <span>LATENCY</span>
              <span className="text-right">STATUS</span>
            </div>

            {/* Stream — not live yet */}
            <div className="h-[440px] flex flex-col items-center justify-center gap-5 border-t border-white/5">
              <div className="w-10 h-10 border border-yellow-400/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-400/40" />
              </div>
              <div className="text-center font-mono">
                <div className="text-[10px] tracking-widest text-white/20 mb-2">MAINNET_NOT_YET_LIVE</div>
                <p className="text-[11px] text-white/15 max-w-xs leading-relaxed">
                  The live intent stream will appear here once the Ghost Relay network is active on Base mainnet.
                </p>
              </div>
              <span className="text-[9px] font-mono tracking-widest border border-yellow-400/20 text-yellow-400/40 px-3 py-1.5">
                COMING SOON
              </span>
            </div>

            {/* Footer bar */}
            <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between bg-[#0c0c0c]">
              <div className="text-[9px] font-mono text-white/18 tracking-widest">
                INTENT STREAM — AWAITING MAINNET
              </div>
              <Link href="/network" className="text-[9px] font-mono tracking-widest text-primary/50 hover:text-primary transition-colors flex items-center gap-1.5">
                NETWORK_OBSERVATORY <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BIG QUOTE / MANIFESTO ── */}
      <section className="py-32 md:py-48 border-t border-white/5" style={{ backgroundColor: "#080808" }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="text-[10px] font-mono tracking-[0.5em] text-primary/50 mb-12">
              <AsciiTypewriter text="WHY_NOW" speed={60} />
            </div>
          </FadeUp>
          <h2
            className="font-black leading-[0.9] tracking-tighter"
            style={{ fontSize: "clamp(32px, 5.5vw, 78px)" }}
          >
            <AsciiTypewriter
              text="THE NEXT TRILLION DOLLARS OF ON-CHAIN VOLUME WILL BE EXECUTED BY MACHINES. THOSE MACHINES NEED PRIVACY. ZHAD0 IS THAT PRIVACY LAYER."
              speed={22}
              className="font-black leading-[0.9] tracking-tighter"
            />
          </h2>
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section className="py-24 md:py-40 border-y border-white/5" style={{ background: "#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="text-[10px] font-mono tracking-[0.5em] text-primary/50 mb-16">
              <AsciiTypewriter text="FIRST_PRINCIPLES" speed={55} />
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {PRINCIPLES.map(({ num, title, body }, i) => (
              <FadeUp key={num} delay={i * 0.09}>
                <div className="relative bg-[#0a0a0a] p-10 group hover:bg-[#100a10] transition-colors h-full overflow-hidden ascii-scan-btn">
                  {/* Watermark num */}
                  <div
                    className="absolute -bottom-4 -right-2 font-black font-mono leading-none select-none pointer-events-none transition-opacity duration-500 group-hover:opacity-100"
                    style={{ fontSize: "clamp(80px, 12vw, 140px)", color: "rgba(232,60,135,0.04)" }}
                    aria-hidden
                  >{num}</div>
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/15 group-hover:border-primary/40 transition-colors pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-xs font-mono tracking-widest text-primary mb-5">{title}</div>
                    <p className="text-sm font-mono text-white/38 leading-relaxed">{body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 md:py-40 border-b border-white/5" style={{ background: "#080808" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="text-[10px] font-mono tracking-[0.5em] text-primary/50 mb-4">
              <AsciiTypewriter text="THE_TEAM" speed={55} />
            </div>
            <h3
              className="font-black tracking-tighter mb-12 leading-[0.92]"
              style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
            >
              <ScrambleHeading duration={1100}>BUILT BY RESEARCHERS, ENGINEERS, AND PROTOCOL VETERANS.</ScrambleHeading>
            </h3>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TEAM.map(({ handle, role, bio, location }, i) => (
              <FadeUp key={handle} delay={i * 0.08}>
                <div
                  className="relative border border-white/5 p-7 group hover:border-primary/20 transition-all h-full overflow-hidden"
                  style={{ background: "#0c0c0c" }}
                  data-testid={`team-${handle}`}
                >
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/15 group-hover:border-primary/50 transition-colors pointer-events-none" />
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm font-mono font-bold text-primary mb-1">
                        <ScrambleText>{handle}</ScrambleText>
                      </div>
                      <div className="text-[9px] font-mono tracking-widest text-white/22">{role}</div>
                    </div>
                    <div className="text-[9px] font-mono text-white/14 tracking-widest border border-white/5 px-2 py-1 flex-shrink-0">
                      {location}
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-white/35 leading-relaxed">{bio}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.35}>
            <div className="mt-3 border border-white/5 px-5 py-4 flex items-center gap-3" style={{ background: "#0c0c0c" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
              <p className="text-[10px] font-mono text-white/22 leading-relaxed">
                Core team operates pseudonymously. Identified by on-chain contributions, audit history, and deployed code — not by names.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="py-24 md:py-40 border-b border-white/5" style={{ background: "#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="text-[10px] font-mono tracking-[0.5em] text-primary/50 mb-4">
              <AsciiTypewriter text="ROADMAP" speed={60} />
            </div>
            <h3
              className="font-black tracking-tighter mb-16 leading-[0.92]"
              style={{ fontSize: "clamp(32px, 5vw, 68px)" }}
            >
              <ScrambleHeading duration={900}>FROM TESTNET TO DAO HANDOFF.</ScrambleHeading>
            </h3>
          </FadeUp>

          <div className="relative">
            {/* Vertical spine */}
            <div className="absolute left-[29px] top-0 bottom-0 w-px bg-white/5" />
            <div className="space-y-0">
              {MILESTONES.map(({ date, label, desc, status }, i) => (
                <FadeUp key={label} delay={i * 0.07}>
                  <div className="relative flex items-start gap-8 py-8 border-b border-white/5 last:border-0 group hover:bg-white/[0.015] transition-colors px-2 -mx-2">
                    {/* Status dot */}
                    <div className="flex-shrink-0 w-[60px] flex flex-col items-center pt-1 z-10">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        status === "done"
                          ? "border-primary bg-primary"
                          : status === "active"
                          ? "border-primary bg-primary animate-pulse"
                          : "border-white/15 bg-transparent"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-4 mb-1.5">
                        <span className="text-[10px] font-mono text-white/20 tracking-widest">{date}</span>
                        <span className={`text-[9px] font-mono tracking-widest border px-2 py-0.5 ${
                          status === "done"
                            ? "text-primary border-primary/30 bg-primary/8"
                            : status === "active"
                            ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/8"
                            : "text-white/18 border-white/8"
                        }`}>
                          {status === "done" ? "COMPLETE" : status === "active" ? "IN_PROGRESS" : "UPCOMING"}
                        </span>
                      </div>
                      <div className="text-xs font-mono tracking-widest text-white/55 mb-2">{label}</div>
                      <p className="text-sm font-mono text-white/28 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          <FadeUp delay={0.3}>
            <div className="mt-10 flex justify-end">
              <Link
                href="/about"
                className="ascii-scan-btn text-[10px] font-mono tracking-widest text-primary/60 border border-primary/20 px-5 py-3 hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"
              >
                FULL_STORY <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PROOF CHAIN STRIP ── */}
      <section className="border-y border-white/5 py-0" style={{ backgroundColor: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {[
              { label: "CONSENSUS_LAYER", value: "Ethereum L1", sub: "root of trust" },
              { label: "EXECUTION_LAYER",  value: "Base L2",    sub: "chain id 8453" },
              { label: "PROOF_SYSTEM",     value: "RISC Zero",  sub: "zkvm v1.2" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="flex items-center gap-5 px-8 py-8 group">
                <div className="w-px h-8 bg-primary/25 group-hover:bg-primary/60 transition-colors flex-shrink-0" />
                <div>
                  <div className="text-[9px] font-mono tracking-[0.4em] text-white/20 mb-1">{label}</div>
                  <div className="text-base font-black tracking-tight text-white/70 group-hover:text-white transition-colors">{value}</div>
                  <div className="text-[9px] font-mono text-primary/40 tracking-widest mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-48" style={{ background: '#080808' }}>
        {/* Ambient glow */}
        <FloatingOrb className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-primary/8 animate-float-slow" />
        <FloatingOrb className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 animate-float" />
        <HeroBeams />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808] pointer-events-none" />

        {/* Background logo */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ right: "50%", top: "50%", transform: "translate(50%, -50%)", zIndex: 2 }}
          aria-hidden
        >
          <img
            src={logoUrl}
            alt=""
            className="logo-animate"
            style={{
              width: "min(75vw, 640px)",
              height: "min(75vw, 640px)",
              objectFit: "contain",
              opacity: 0.07,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            {/* Left — copy */}
            <div>
              <div className="text-[10px] font-mono tracking-[0.5em] text-primary/50 mb-8">
                <AsciiTypewriter text="GHOST_PROTOCOL // NODE_ZERO" speed={48} />
              </div>
              <h2
                className="font-black tracking-tighter leading-[0.88] mb-8"
                style={{ fontSize: "clamp(52px, 7.5vw, 108px)" }}
              >
                <ScrambleHeading>The Network</ScrambleHeading><br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, hsl(328 90% 65%) 0%, hsl(300 90% 58%) 100%)" }}
                >
                  <ScrambleHeading delay={250}>Forgets You.</ScrambleHeading>
                </span>
              </h2>
              <p className="text-white/35 font-mono text-sm leading-[1.9] max-w-sm mb-12">
                Ghost Relayers earn <span className="text-primary/70">60% of every relay fee</span> in ETH.
                Your node validates proofs — never the intents behind them.
                Your identity stays encrypted. The protocol will never ask who you are.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 font-mono">
                <Link
                  href="/relayer"
                  className="ascii-scan-btn inline-flex items-center justify-center gap-2.5 bg-primary text-black px-8 py-4 text-xs font-bold tracking-widest hover:bg-primary/90 transition-all"
                  data-testid="btn-cta-relayer"
                >
                  <ScrambleText>BECOME_A_GHOST</ScrambleText>
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                </Link>
                <Link
                  href="/docs"
                  className="ascii-scan-btn inline-flex items-center justify-center border border-white/10 text-white/45 px-8 py-4 text-xs font-bold tracking-widest hover:border-primary/35 hover:text-white/80 transition-all"
                  data-testid="btn-cta-docs"
                >
                  <ScrambleText>READ_THE_CIPHER</ScrambleText>
                </Link>
              </div>
            </div>

            {/* Right — ghost node terminal widget */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="relative"
            >
              {/* Corner accents */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-primary/40 pointer-events-none" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t border-r border-primary/40 pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b border-l border-primary/20 pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-primary/20 pointer-events-none" />

              <div className="border border-white/8 font-mono" style={{ background: "linear-gradient(160deg,#0d040d 0%,#090909 100%)" }}>
                {/* Terminal title bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6">
                  <span className="text-[9px] tracking-[0.4em] text-white/20">GHOST_NODE_TERMINAL</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] text-primary/50 tracking-widest">STEALTH_ACTIVE</span>
                  </div>
                </div>

                {/* Node data rows */}
                {[
                  { key: "NODE_ID",    val: "0x████████████████", dim: true },
                  { key: "IDENTITY",   val: "[ENCRYPTED]",         dim: true },
                  { key: "STATUS",     val: "GHOST_ACTIVE",        highlight: true },
                  { key: "UPTIME",     val: "99.7%",               dim: false },
                  { key: "PROOFS",     val: "8,429 verified",      dim: false },
                  { key: "EARNINGS",   val: "1.247 ETH",           dim: false },
                  { key: "STAKED",     val: "50,000 $ZHAD0",       dim: false },
                  { key: "LAST_PROOF", val: "<120ms ago",          dim: true },
                ].map(({ key, val, dim, highlight }) => (
                  <div key={key} className="flex items-center justify-between px-5 py-3 border-b border-white/4 last:border-0 group hover:bg-white/[0.02] transition-colors">
                    <span className="text-[9px] tracking-[0.3em] text-white/20 min-w-[110px]">{key}</span>
                    <span className={`text-[11px] tracking-wide ${highlight ? "text-primary" : dim ? "text-white/22" : "text-white/55"}`}>
                      {val}
                    </span>
                  </div>
                ))}

                {/* ASCII fill bar at bottom */}
                <div className="px-5 py-4 border-t border-white/6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-white/18 tracking-widest">PROOF_THROUGHPUT</span>
                    <span className="text-[9px] font-mono text-primary/50">█ 94%</span>
                  </div>
                  <div className="text-[10px] tracking-[0.12em] text-primary/40 select-none">
                    {"█".repeat(17)}<span className="text-white/10">{"░".repeat(3)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
