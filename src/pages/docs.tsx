import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import {
  ArrowRight, Lock, Shield, Zap, Cpu, Terminal, Code, BookOpen,
  Network, EyeOff, CheckCircle, Key, Database, Globe, Layers,
  ChevronRight, Copy, Check,
} from "lucide-react";
import { SiNpm, SiGithub } from "react-icons/si";
import { AsciiTypewriter } from "@/components/ascii-bg";
import { ScrambleHeading } from "@/components/scramble-text";

/* ── helpers ── */
function FadeUp({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">
      <AsciiTypewriter text={children} speed={45} />
    </div>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 leading-tight">
      <ScrambleHeading>{children}</ScrambleHeading>
    </h2>
  );
}

/* ── copy button ── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
      className="text-white/20 hover:text-white/60 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

/* ── Architecture flow ── */
const ARCH_STEPS = [
  {
    num: "01",
    icon: Code,
    label: "AGENT_INTENT",
    title: "Agent submits intent",
    body: "Your AI agent constructs a structured intent payload — swap, bridge, LP position, or any on-chain action. The intent is serialized to the ZHAD0 IntentSchema v1 ABI locally and never exposed to any external party at this stage.",
    color: "hsl(328,90%,60%)",
    accent: "border-primary/30 bg-primary/5",
    tag: "OFF-CHAIN",
  },
  {
    num: "02",
    icon: Lock,
    label: "THRESHOLD_ENCRYPTION",
    title: "Encrypt with threshold keys",
    body: "The intent payload is encrypted using AES-256-GCM with a key derived from the Ghost Relay network's distributed threshold key ceremony. No single relayer holds a complete decryption key — execution requires a threshold of ⅔ relayers to cooperate.",
    color: "hsl(280,80%,60%)",
    accent: "border-violet-500/30 bg-violet-500/5",
    tag: "AES-256-GCM + TSS",
  },
  {
    num: "03",
    icon: Cpu,
    label: "ZK_PROOF_GENERATION",
    title: "Generate ZK validity proof",
    body: "A RISC Zero zkVM guest program executes locally on the agent's machine. It generates a succinct proof that the encrypted intent satisfies all four invariants — signature validity, nonce monotonicity, gas ceiling, and schema conformance — without revealing any intent data.",
    color: "hsl(200,90%,55%)",
    accent: "border-blue-400/30 bg-blue-400/5",
    tag: "RISC ZERO V1.2",
  },
  {
    num: "04",
    icon: Network,
    label: "GHOST_RELAY_NETWORK",
    title: "Route through Ghost Relay",
    body: "The encrypted blob and ZK proof are broadcast to the Ghost Relay P2P network. Staked relayer nodes verify the proof on-chain via the RelayRegistry contract. The first ⅔-threshold group to agree on verification collectively decrypts and prepares the execution transaction.",
    color: "hsl(160,70%,50%)",
    accent: "border-emerald-400/30 bg-emerald-400/5",
    tag: "P2P NETWORK",
  },
  {
    num: "05",
    icon: Globe,
    label: "BASE_EXECUTION",
    title: "Execute privately on Base",
    body: "The relay network submits the execution transaction to Base mainnet. The transaction appears as a standard relay call — the original agent wallet, intent contents, and strategy remain completely opaque. MEV bots see nothing. The agent's on-chain footprint is a proof, not a position.",
    color: "hsl(30,90%,55%)",
    accent: "border-orange-400/30 bg-orange-400/5",
    tag: "BASE_L2 · PLANNED",
  },
];

const FEATURES = [
  {
    icon: EyeOff,
    title: "MEV Immunity",
    body: "Intent payloads never enter the public mempool. Front-running, sandwich attacks, and back-running are structurally impossible — there is nothing visible to extract from.",
    stat: "100%", statLabel: "front-run resistant",
  },
  {
    icon: Shield,
    title: "ZK-Verified Privacy",
    body: "Privacy is not a policy — it is a cryptographic guarantee. Every relayed intent carries a RISC Zero proof that is publicly verifiable by anyone, at any time, without revealing the original intent.",
    stat: "32B", statLabel: "proof size",
  },
  {
    icon: Key,
    title: "Threshold Key Safety",
    body: "No operator, no relayer, and no ZHAD0 team member can decrypt your intent. Decryption requires cooperation of ⅔ of the staked Ghost Relay network — a liveness property, not a trust one.",
    stat: "⅔ TSS", statLabel: "threshold scheme",
  },
  {
    icon: Zap,
    title: "Sub-120ms Relay",
    body: "Ghost Relay nodes are co-located near Base sequencer infrastructure. Median end-to-end latency from intent submission to Base inclusion is under 120ms — imperceptible to agents and users.",
    stat: "<120ms", statLabel: "median latency",
  },
  {
    icon: Layers,
    title: "Framework-Agnostic SDK",
    body: "A single TypeScript SDK is designed to wrap Eliza, Coinbase AgentKit, and Virtuals Protocol with a one-line integration. These framework adapters are planned for SDK v1 (Q4 2026). Today the SDK ships real client-side AES-256-GCM encryption with simulated ZK proofs for ergonomics testing.",
    stat: "3+", statLabel: "frameworks supported",
  },
  {
    icon: Database,
    title: "Decentralized Relay Mesh",
    body: "Ghost Relayers are permissionless, stake-weighted, and slashable. Any node operator can join by staking $ZHAD0. Collusion is economically irrational and cryptographically detectable.",
    stat: "Permissionless", statLabel: "node entry",
  },
];

const BENEFITS_COMPARE = [
  { aspect: "Agent transactions",    without: "Fully visible on-chain",      with: "Encrypted until execution"     },
  { aspect: "MEV exposure",          without: "100% vulnerable",             with: "Structurally impossible"       },
  { aspect: "Strategy leakage",      without: "Observable by any indexer",   with: "Zero information revealed"     },
  { aspect: "Wallet fingerprinting", without: "Trivial via on-chain graph",  with: "Opaque relay address used"     },
  { aspect: "Intent validation",     without: "Trust the relayer",           with: "ZK proof, on-chain verifiable" },
  { aspect: "Node trust model",      without: "Centralized operator",        with: "⅔ threshold, permissionless"   },
];

const SDK_EXAMPLES = [
  {
    title: "INSTALL",
    lang: "bash",
    code: `# DESIGN_PREVIEW — not yet published to npm.
# Today: import { Zhad0Client } from '@zhad0/sdk'
# (workspace package inside the ZHAD0 monorepo).
#
# Planned post-mainnet:
#   npm install @zhad0/sdk`,
  },
  {
    title: "BASIC_USAGE",
    lang: "typescript",
    code: `import { Zhad0Client } from '@zhad0/sdk';

const client = new Zhad0Client({
  network: 'base-mainnet',
  relayerMode: 'ghost',
  privateKey: process.env.AGENT_PRIVATE_KEY,
});

// Submit a private intent — returns a ZK receipt
const receipt = await client.submitIntent({
  action: 'SWAP',
  tokenIn:   '0xUSDC',
  tokenOut:  '0xWETH',
  amountIn:  '1000000', // 1 USDC
  obfuscate: true,      // ZK-proven privacy
});

console.log('Proof hash:', receipt.proofHash);
console.log('Status:',     receipt.status);
console.log('Latency:',    receipt.relayMs + 'ms');`,
  },
  {
    title: "WITH_COINBASE_AGENTKIT",
    lang: "typescript",
    code: `import { Zhad0Client } from '@zhad0/sdk';
import { AgentKit } from '@coinbase/agentkit';

const zhad0 = new Zhad0Client({ network: 'base-mainnet' });
const agent = new AgentKit({ walletProvider });

// Wrap any AgentKit action with ZHAD0 privacy
const secureAgent = zhad0.wrapAgent(agent);

await secureAgent.executeIntent({
  action:    'TRADE',
  obfuscate: true, // invisible on-chain
});`,
  },
  {
    title: "WITH_ELIZA_FRAMEWORK",
    lang: "typescript",
    code: `import { Zhad0Client } from '@zhad0/sdk';
import { createAgent }  from '@elizaos/core';

const zhad0 = new Zhad0Client({ network: 'base-mainnet' });

// Register ZHAD0 as an Eliza action provider
const agent = createAgent({
  plugins: [zhad0.elizaPlugin()],
});

// All on-chain actions are automatically
// privacy-wrapped via Ghost Relay
await agent.act({ type: 'onchain', payload: { ... } });`,
  },
];

const RELAY_ENDPOINTS = [
  { method: "POST", path: "/intent/submit",  desc: "Submit encrypted intent blob with ZK proof",  body: "{ blob: hex, proof: hex, agentKey: address }" },
  { method: "GET",  path: "/intent/:id",     desc: "Poll intent status and relay receipt",         body: null },
  { method: "GET",  path: "/relay/health",   desc: "Relay node health — uptime, stake, version",  body: null },
  { method: "GET",  path: "/relay/nodes",    desc: "Active Ghost Relay node roster",               body: null },
  { method: "WS",   path: "/intent/stream",  desc: "WebSocket stream of confirmed ZK receipts",   body: null },
];

const ZK_INVARIANTS = [
  { id: "INV-01", label: "SIGNATURE_VALIDITY",  desc: "Agent ECDSA signature over intent hash is valid against the registered agent public key on RelayRegistry.", icon: Key      },
  { id: "INV-02", label: "NONCE_MONOTONICITY",  desc: "Intent nonce is strictly greater than the last confirmed nonce for this agent, preventing replay attacks.",  icon: Shield   },
  { id: "INV-03", label: "GAS_CEILING",         desc: "Estimated gas does not exceed the per-intent maximum of 2,000,000 gas units, enforced without revealing action.", icon: Zap  },
  { id: "INV-04", label: "SCHEMA_VALIDITY",     desc: "Intent payload deserializes correctly against the canonical IntentSchema v1 ABI — malformed intents are rejected.", icon: Database },
];

const METHOD_COLOR: Record<string, string> = {
  POST: "text-primary",
  GET:  "text-emerald-400",
  WS:   "text-violet-400",
};

const NAV_LINKS = [
  { href: "#overview",      label: "Overview"        },
  { href: "#architecture",  label: "Architecture"    },
  { href: "#how-it-works",  label: "How It Works"    },
  { href: "#features",      label: "Features"        },
  { href: "#benefits",      label: "Benefits"        },
  { href: "#quickstart",    label: "Quickstart"      },
  { href: "#relay-api",     label: "Relay API"       },
  { href: "#zk-circuit",    label: "ZK Circuit"      },
  { href: "#cli",           label: "CLI"             },
];

/* ── Architecture flow diagram ── */
function ArchDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative overflow-x-auto">
      {/* horizontal connector line */}
      <div className="absolute top-[60px] left-[10%] right-[10%] h-px bg-white/5 hidden lg:block" />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
        style={{ transformOrigin: "left" }}
        className="absolute top-[60px] left-[10%] right-[10%] h-px bg-gradient-to-r from-primary/60 via-violet-500/40 to-orange-400/40 hidden lg:block"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-white/4 min-w-[700px]">
        {ARCH_STEPS.map(({ num, icon: Icon, label, title, body, color, accent, tag }, i) => (
          <motion.div
            key={num}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
            className={`relative group cursor-default p-6 border-0 hover:bg-white/[0.02] transition-all ${accent} border`}
            style={{ background: "#0a0a0a" }}
          >
            {/* step number */}
            <div
              className="absolute top-4 right-4 font-black font-mono text-[10px] tracking-widest"
              style={{ color: `${color}44` }}
            >{num}</div>

            {/* icon circle */}
            <div
              className="w-12 h-12 flex items-center justify-center mb-5 border"
              style={{ borderColor: `${color}30`, background: `${color}0a` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>

            {/* tag */}
            <div
              className="text-[8px] font-mono tracking-[0.3em] mb-3 px-2 py-0.5 inline-block border"
              style={{ color: `${color}80`, borderColor: `${color}25` }}
            >{tag}</div>

            <div className="text-[9px] font-mono tracking-widest text-white/25 mb-2">{label}</div>
            <div className="text-xs font-bold text-white/80 mb-3 leading-snug">{title}</div>
            <p className="text-[10px] font-mono text-white/28 leading-relaxed">{body}</p>

            {/* Arrow to next — hidden on last */}
            {i < ARCH_STEPS.length - 1 && (
              <div className="hidden lg:flex absolute -right-3 top-[56px] z-10 items-center justify-center w-6 h-6 bg-[#0a0a0a]">
                <ChevronRight className="w-3 h-3 text-white/15" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── How it works — numbered steps with visual bars ── */
function HowItWorksStep({ step, icon: Icon, label, title, body, color, delay }: {
  step: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string;
  title: string; body: string; color: string; delay: number;
}) {
  return (
    <FadeUp delay={delay}>
      <div className="flex gap-6 group">
        {/* left timeline */}
        <div className="flex flex-col items-center flex-shrink-0 w-12">
          <div
            className="w-10 h-10 border flex items-center justify-center flex-shrink-0 mb-2"
            style={{ borderColor: `${color}35`, background: `${color}08` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="flex-1 w-px bg-white/5 group-last:hidden" />
        </div>

        {/* content */}
        <div className="pb-10 flex-1 min-w-0">
          <div
            className="text-[8px] font-mono tracking-[0.3em] mb-1"
            style={{ color: `${color}70` }}
          >STEP_{step} // {label}</div>
          <div className="text-sm font-bold text-white/80 mb-2">{title}</div>
          <p className="text-[11px] font-mono text-white/35 leading-relaxed max-w-2xl">{body}</p>
        </div>
      </div>
    </FadeUp>
  );
}

export default function Docs() {
  const [activeCode, setActiveCode] = useState(0);

  return (
    <Layout>
      <div style={{ backgroundColor: "#080808", minHeight: "100vh" }}>

        {/* ── PAGE HERO ── */}
        <section className="border-b border-white/5 px-6 py-20" style={{ background: "linear-gradient(160deg,#0d050d 0%,#080808 60%)" }}>
          <div className="max-w-7xl mx-auto">
            <FadeUp>
              <div className="text-[10px] font-mono tracking-[0.4em] text-yellow-400/70 mb-5">DEVELOPER_DOCUMENTATION // v0.0.0-design.1 // PRE-MAINNET</div>
              <h1
                className="font-black tracking-tighter leading-[0.88] mb-6"
                style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
              >
                <span className="block text-white">ZHAD0</span>
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(92deg, hsl(328,90%,65%) 0%, hsl(300,75%,65%) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Protocol Docs.
                </span>
              </h1>
              <p className="text-sm font-mono text-white/40 max-w-xl leading-relaxed mb-8">
                Full technical reference for the ZHAD0 privacy layer — architecture, SDK integration, Ghost Relay API, ZK circuit specification, and deployment guides.
              </p>

              {/* quick links */}
              <div className="flex flex-wrap gap-2">
                {NAV_LINKS.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-[10px] font-mono tracking-widest border border-white/8 text-white/35 px-3 py-1.5 hover:border-primary/30 hover:text-primary/80 transition-all"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">

          {/* ── OVERVIEW ── */}
          <section id="overview" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>01 // OVERVIEW</SectionLabel>
              <SectionHeading>What is ZHAD0?</SectionHeading>
            </FadeUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <FadeUp delay={0.08}>
                <div className="space-y-5 text-[13px] font-mono text-white/45 leading-relaxed">
                  <p>
                    <span className="text-white/80">ZHAD0</span> is a ZK-powered privacy layer for AI agents operating on Base L2. It solves a fundamental problem: every swap, position, and strategy executed by an autonomous agent is publicly visible on-chain, making agents trivially front-runnable by MEV bots.
                  </p>
                  <p>
                    ZHAD0 intercepts agent intents before they touch the mempool, encrypts them with a threshold key distributed across the Ghost Relay network, generates a RISC Zero zero-knowledge proof of intent validity, and relays the execution through a decentralized network of staked relayer nodes to Base mainnet.
                  </p>
                  <p>
                    The result: an on-chain execution footprint that reveals <span className="text-primary/80">nothing</span> about the agent's strategy, wallet, or intent — while remaining fully verifiable by anyone via the ZK proof.
                  </p>
                </div>
              </FadeUp>

              {/* key numbers */}
              <FadeUp delay={0.15}>
                <div className="grid grid-cols-2 gap-px bg-white/5">
                  {[
                    { label: "PROOF_SYSTEM",   value: "RISC Zero",   sub: "zkVM v1.2"             },
                    { label: "EXECUTION_CHAIN", value: "Base",       sub: "Chain ID 8453"          },
                    { label: "ENCRYPTION",      value: "AES-256",    sub: "GCM + TSS threshold"    },
                    { label: "RELAY_LATENCY",   value: "<120ms",     sub: "median end-to-end"      },
                    { label: "PROOF_SIZE",      value: "32 bytes",   sub: "succinct zkVM receipt"  },
                    { label: "NODE_ENTRY",      value: "Permissionless", sub: "stake $ZHAD0 to join" },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="bg-[#0c0c0c] p-5">
                      <div className="text-[8px] font-mono tracking-widest text-white/20 mb-2">{label}</div>
                      <div className="text-base font-black text-white mb-0.5">{value}</div>
                      <div className="text-[9px] font-mono text-white/25">{sub}</div>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </section>

          {/* ── ARCHITECTURE FLOW ── */}
          <section id="architecture" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>02 // ARCHITECTURE_FLOW</SectionLabel>
              <SectionHeading>System Architecture</SectionHeading>
              <p className="text-[12px] font-mono text-white/35 max-w-2xl leading-relaxed mb-12">
                Five-stage pipeline — from agent intent construction through ZK proof generation, distributed relay verification, and final execution on Base. Each stage is depicted below with its cryptographic primitive and trust model.
              </p>
            </FadeUp>

            <ArchDiagram />

            {/* data flow legend */}
            <FadeUp delay={0.3}>
              <div className="mt-6 flex flex-wrap gap-6 text-[9px] font-mono text-white/25">
                {[
                  { dot: "bg-primary",       label: "Off-chain (agent machine)" },
                  { dot: "bg-violet-500",    label: "Cryptographic operation"   },
                  { dot: "bg-blue-400",      label: "ZK proof generation"       },
                  { dot: "bg-emerald-400",   label: "P2P relay network"         },
                  { dot: "bg-orange-400",    label: "Base L2 on-chain"          },
                ].map(({ dot, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dot}`} />
                    {label}
                  </div>
                ))}
              </div>
            </FadeUp>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section id="how-it-works" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>03 // HOW_IT_WORKS</SectionLabel>
              <SectionHeading>Step-by-step flow</SectionHeading>
              <p className="text-[12px] font-mono text-white/35 max-w-2xl leading-relaxed mb-14">
                Detailed walkthrough of what happens between your agent calling <code className="text-primary/70">submitIntent()</code> and the transaction landing on Base.
              </p>
            </FadeUp>

            <div className="max-w-3xl">
              {ARCH_STEPS.map(({ num, icon, label, title, body, color }, i) => (
                <HowItWorksStep
                  key={num}
                  step={num}
                  icon={icon}
                  label={label}
                  title={title}
                  body={body}
                  color={color}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </section>

          {/* ── FEATURES ── */}
          <section id="features" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>04 // FEATURES</SectionLabel>
              <SectionHeading>Protocol capabilities</SectionHeading>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {FEATURES.map(({ icon: Icon, title, body, stat, statLabel }, i) => (
                <FadeUp key={title} delay={i * 0.06}>
                  <div className="bg-[#0a0a0a] p-7 group hover:bg-[#0f080f] transition-colors h-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/10 group-hover:border-primary/40 transition-colors pointer-events-none" />

                    <div className="w-10 h-10 border border-primary/15 flex items-center justify-center mb-5 group-hover:border-primary/40 transition-colors">
                      <Icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                    </div>

                    <div className="text-sm font-bold text-white/80 mb-3">{title}</div>
                    <p className="text-[11px] font-mono text-white/30 leading-relaxed mb-5">{body}</p>

                    <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                      <div className="text-lg font-black text-primary">{stat}</div>
                      <div className="text-[9px] font-mono text-white/20 tracking-widest">{statLabel.toUpperCase()}</div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── BENEFITS / COMPARE ── */}
          <section id="benefits" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>05 // BENEFITS</SectionLabel>
              <SectionHeading>Without ZHAD0 vs. with ZHAD0</SectionHeading>
              <p className="text-[12px] font-mono text-white/35 max-w-xl leading-relaxed mb-10">
                A direct comparison of on-chain agent exposure with and without the ZHAD0 privacy layer.
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="border border-white/5 overflow-hidden">
                {/* header */}
                <div className="grid grid-cols-3 text-[9px] font-mono tracking-widest bg-[#0d0d0d] border-b border-white/5">
                  <div className="px-5 py-3 text-white/25">ASPECT</div>
                  <div className="px-5 py-3 text-red-400/50 border-l border-white/5">WITHOUT ZHAD0</div>
                  <div className="px-5 py-3 text-primary/70 border-l border-white/5">WITH ZHAD0</div>
                </div>
                {BENEFITS_COMPARE.map(({ aspect, without, with: withZhad }, i) => (
                  <div
                    key={aspect}
                    className="grid grid-cols-3 border-b border-white/4 last:border-0 hover:bg-white/[0.015] transition-colors"
                  >
                    <div className="px-5 py-4 text-[11px] font-mono text-white/40">{aspect}</div>
                    <div className="px-5 py-4 text-[11px] font-mono text-red-400/50 border-l border-white/5 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-red-500/40 flex-shrink-0" />
                      {without}
                    </div>
                    <div className="px-5 py-4 text-[11px] font-mono text-primary/70 border-l border-white/5 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 flex-shrink-0 text-primary/50" />
                      {withZhad}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </section>

          {/* ── QUICKSTART ── */}
          <section id="quickstart" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>06 // QUICKSTART</SectionLabel>
              <SectionHeading>Get started in 5 minutes</SectionHeading>
              <p className="text-[12px] font-mono text-white/35 max-w-xl leading-relaxed mb-10">
                Install the SDK, initialize the client, and send your first private intent.
              </p>
            </FadeUp>

            {/* tab bar */}
            <FadeUp delay={0.08}>
              <div className="flex gap-px bg-white/5 mb-0 overflow-x-auto">
                {SDK_EXAMPLES.map(({ title }, i) => (
                  <button
                    key={title}
                    onClick={() => setActiveCode(i)}
                    className={`text-[9px] font-mono tracking-widest px-4 py-3 whitespace-nowrap transition-colors ${
                      activeCode === i
                        ? "bg-[#0c0c0c] text-primary/80 border-t border-primary/30"
                        : "bg-[#0a0a0a] text-white/20 hover:text-white/40"
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>

              {SDK_EXAMPLES.map(({ title, lang, code }, i) => (
                <motion.div
                  key={title}
                  initial={false}
                  animate={{ opacity: activeCode === i ? 1 : 0, y: activeCode === i ? 0 : 8 }}
                  className={`border border-white/5 border-t-0 ${activeCode === i ? "block" : "hidden"}`}
                  style={{ background: "#0a0a0a" }}
                >
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                    <div className="text-[9px] font-mono tracking-widest text-white/20">{title}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-white/15 uppercase">{lang}</span>
                      <CopyButton text={code} />
                    </div>
                  </div>
                  <pre className="p-6 text-xs font-mono text-primary/75 leading-relaxed overflow-x-auto whitespace-pre">
                    <code>{code}</code>
                  </pre>
                </motion.div>
              ))}
            </FadeUp>
          </section>

          {/* ── RELAY API ── */}
          <section id="relay-api" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>07 // GHOST_RELAY_API</SectionLabel>
              <SectionHeading>REST & WebSocket endpoints</SectionHeading>
              <p className="text-[12px] font-mono text-white/35 max-w-xl leading-relaxed mb-10">
                <span className="text-yellow-400/70">PLANNED API · NOT YET LIVE.</span> The endpoints below describe the Ghost Relay HTTP/WS interface as it will ship with mainnet. Planned base URL: <code className="text-white/40 line-through">https://relay.zhad0.io/v1</code> · planned auth header: <code className="text-white/50">X-Agent-Key</code>. None of these endpoints respond today.
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="border border-white/5 overflow-hidden">
                <div className="grid grid-cols-12 text-[9px] font-mono tracking-widest text-white/20 px-5 py-3 border-b border-white/5 bg-[#0d0d0d]">
                  <span className="col-span-1">METHOD</span>
                  <span className="col-span-3 ml-6">ENDPOINT</span>
                  <span className="col-span-8">DESCRIPTION</span>
                </div>
                {RELAY_ENDPOINTS.map(({ method, path, desc, body }) => (
                  <div key={path} className="grid grid-cols-12 px-5 py-4 border-b border-white/3 hover:bg-white/[0.015] transition-colors items-start">
                    <span className={`col-span-1 text-[10px] font-bold font-mono ${METHOD_COLOR[method] ?? "text-white/40"}`}>{method}</span>
                    <span className="col-span-3 ml-6 text-[11px] font-mono text-white/55">{path}</span>
                    <div className="col-span-8">
                      <div className="text-[11px] font-mono text-white/30 mb-1">{desc}</div>
                      {body && <div className="text-[10px] font-mono text-white/15">{body}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* response example */}
            <FadeUp delay={0.15}>
              <div className="mt-6 border border-white/5" style={{ background: "#0a0a0a" }}>
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                  <div className="text-[9px] font-mono tracking-widest text-white/20">EXAMPLE_RESPONSE // POST /intent/submit</div>
                  <CopyButton text={`{\n  "intentId": "0x3f7a...c91b",\n  "proofHash": "0xb82d...4e0f",\n  "status": "PENDING_RELAY",\n  "estimatedMs": 94\n}`} />
                </div>
                <pre className="p-5 text-xs font-mono text-emerald-400/60 leading-relaxed overflow-x-auto whitespace-pre">{`{
  "intentId":    "0x3f7a...c91b",
  "proofHash":   "0xb82d...4e0f",
  "status":      "PENDING_RELAY",
  "estimatedMs": 94
}`}</pre>
              </div>
            </FadeUp>
          </section>

          {/* ── ZK CIRCUIT ── */}
          <section id="zk-circuit" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>08 // ZK_CIRCUIT_SPEC</SectionLabel>
              <SectionHeading>Intent-validity circuit</SectionHeading>
              <p className="text-[12px] font-mono text-white/35 max-w-2xl leading-relaxed mb-4">
                The ZHAD0 zkVM guest program is a RISC Zero Rust binary that enforces four cryptographic invariants. The proof is 32 bytes (Groth16 receipt), verifiable on-chain via the <code className="text-primary/70">RelayRegistry.verifyProof()</code> function.
              </p>
              <div className="flex items-center gap-3 mb-10">
                <div className="text-[9px] font-mono tracking-widest border border-primary/20 text-primary/60 px-3 py-1.5">PROOF SYSTEM: RISC ZERO GROTH16</div>
                <div className="text-[9px] font-mono tracking-widest border border-white/10 text-white/25 px-3 py-1.5">CIRCUIT LANG: RUST (no_std)</div>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
              {ZK_INVARIANTS.map(({ id, label, desc, icon: Icon }, i) => (
                <FadeUp key={id} delay={i * 0.07}>
                  <div className="bg-[#0a0a0a] p-7 group hover:bg-[#0f0a10] transition-colors h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-9 h-9 border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:border-primary/40 transition-colors mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-white/18 tracking-widest mb-1">{id}</div>
                        <div className="text-[10px] font-mono tracking-widest text-primary/80">{label}</div>
                      </div>
                    </div>
                    <p className="text-[11px] font-mono text-white/35 leading-relaxed">{desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* circuit diagram */}
            <FadeUp delay={0.3}>
              <div className="mt-6 border border-white/5 p-6" style={{ background: "#0c0c0c" }}>
                <div className="text-[9px] font-mono tracking-widest text-white/20 mb-4">CIRCUIT_DATA_FLOW</div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                  {[
                    { label: "IntentPayload", color: "text-white/50 border-white/15" },
                    { label: "→", color: "text-white/20", plain: true },
                    { label: "RISC Zero Guest", color: "text-blue-400/70 border-blue-400/25" },
                    { label: "→", color: "text-white/20", plain: true },
                    { label: "4× Invariant Checks", color: "text-violet-400/70 border-violet-400/25" },
                    { label: "→", color: "text-white/20", plain: true },
                    { label: "Groth16 Receipt", color: "text-primary/80 border-primary/30" },
                    { label: "→", color: "text-white/20", plain: true },
                    { label: "RelayRegistry.verifyProof()", color: "text-emerald-400/70 border-emerald-400/25" },
                    { label: "→", color: "text-white/20", plain: true },
                    { label: "✓ ON-CHAIN", color: "text-emerald-400/80 border-emerald-400/30" },
                  ].map(({ label, color, plain }, i) =>
                    plain ? (
                      <span key={i} className={color}>{label}</span>
                    ) : (
                      <span key={i} className={`border px-2 py-0.5 ${color}`}>{label}</span>
                    )
                  )}
                </div>
              </div>
            </FadeUp>
          </section>

          {/* ── CLI ── */}
          <section id="cli" className="py-20 border-b border-white/5 scroll-mt-20">
            <FadeUp>
              <SectionLabel>09 // CLI_REFERENCE</SectionLabel>
              <SectionHeading>zhad0-relayer CLI</SectionHeading>
              <p className="text-[12px] font-mono text-white/35 max-w-xl leading-relaxed mb-10">
                Command-line interface for Ghost Relayer node operators. Install via <code className="text-primary/70">npm i -g @zhad0/relayer-cli</code>.
              </p>
            </FadeUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { title: "NODE MANAGEMENT", code: `# Register a new Ghost Relayer node
zhad0-relayer register \\
  --stake 10000 \\
  --payout-address 0x...

# Check node status and uptime
zhad0-relayer status

# View pending rewards
zhad0-relayer rewards

# Claim accumulated relay fees
zhad0-relayer claim` },
                { title: "STAKE OPERATIONS", code: `# Top up stake (increase relay weight)
zhad0-relayer stake add --amount 5000

# Initiate unstake (7-day cooldown)
zhad0-relayer unstake --amount 10000

# Check slash history
zhad0-relayer slashes

# Run pre-flight diagnostics
zhad0-relayer diagnose` },
              ].map(({ title, code }) => (
                <FadeUp key={title}>
                  <div className="border border-white/5" style={{ background: "#0a0a0a" }}>
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                      <div className="text-[9px] font-mono tracking-widest text-white/20">{title}</div>
                      <CopyButton text={code} />
                    </div>
                    <pre className="p-5 text-xs font-mono text-primary/70 leading-relaxed overflow-x-auto whitespace-pre">
                      <code>{code}</code>
                    </pre>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="py-20">
            <FadeUp>
              <div
                className="relative border border-primary/15 p-10 overflow-hidden"
                style={{ background: "linear-gradient(135deg, rgba(232,60,135,0.06) 0%, #0a0a0a 60%)" }}
              >
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-primary/30 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-primary/20 pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center gap-8 justify-between">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-primary/60 mb-3">READY_TO_BUILD?</div>
                    <h3 className="text-2xl font-black tracking-tighter mb-2">Run a Ghost Node. Shield an Agent.</h3>
                    <p className="text-xs font-mono text-white/30 max-w-sm leading-relaxed">
                      Install the SDK, stake $ZHAD0, or read the whitepaper. The protocol is open — everything is permissionless.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 flex-shrink-0">
                    <Link
                      href="/relayer"
                      className="inline-flex items-center gap-2 bg-primary text-black px-7 py-3.5 text-xs font-mono font-bold tracking-widest hover:bg-primary/90 transition-all"
                    >
                      RUN A NODE <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/whitepaper"
                      className="inline-flex items-center gap-2 border border-white/10 text-white/40 px-7 py-3.5 text-xs font-mono font-bold tracking-widest hover:border-primary/30 hover:text-white/70 transition-all"
                    >
                      WHITEPAPER
                    </Link>
                    <a
                      href="https://github.com/zhad0-protocol"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-white/10 text-white/40 px-7 py-3.5 text-xs font-mono font-bold tracking-widest hover:border-primary/30 hover:text-white/70 transition-all"
                    >
                      <SiGithub className="w-3 h-3" /> GITHUB
                    </a>
                  </div>
                </div>
              </div>
            </FadeUp>
          </section>

        </div>
      </div>
    </Layout>
  );
}
