import { Layout } from "@/components/layout";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { SiEthereum } from "react-icons/si";
import { AsciiBackground, AsciiPanel, AsciiStrip } from "@/components/ascii-bg";

/* ── SCROLL-REVEAL TEXT (word by word, dim → white) ── */
function RevealText({
  children,
  className = "",
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -10% 0px" });
  const words = children.split(" ");

  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ color: "rgba(255,255,255,0.12)" }}
          animate={inView ? { color: "rgba(255,255,255,1)" } : { color: "rgba(255,255,255,0.12)" }}
          transition={{ duration: 0.5, delay: delay + i * 0.04, ease: "easeOut" }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ── FADE-UP SECTION ── */
function FadeUp({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const TEAM = [
  { handle: "0xDecker", role: "PROTOCOL_LEAD", bio: "Former cryptography researcher at Ethereum Foundation. Led ZK infrastructure at zkSync. Obsessed with invisible infrastructure.", location: "Berlin" },
  { handle: "0xElix", role: "SYSTEMS_ENGINEER", bio: "Ex-L2 core at Optimism. Built the relay subsystem from scratch. Believes MEV is theft.", location: "Singapore" },
  { handle: "0xZero", role: "ZK_RESEARCH", bio: "RISC Zero ecosystem contributor. PhD in applied cryptography from ETH Zürich. Designed the intent-validity circuit.", location: "Zürich" },
  { handle: "0xForge", role: "PROTOCOL_ECONOMICS", bio: "Tokenomics design at three major DeFi protocols. Designed the $ZHAD0 slash-and-earn mechanism from first principles.", location: "Remote" },
];

const MILESTONES = [
  { date: "Q3 2025", label: "INCEPTION", desc: "Protocol concept & whitepaper drafted. Core team assembled.", status: "done" },
  { date: "Q4 2025", label: "TESTNET_ALPHA", desc: "First Ghost Relay cohort launched on Base Sepolia. 10,000+ test intents processed.", status: "done" },
  { date: "Q1 2026", label: "AUDIT_AND_RAISE", desc: "Smart contracts audited by two independent firms. Seed round closed.", status: "done" },
  { date: "Q2 2026", label: "MAINNET_LAUNCH", desc: "Protocol live on Base mainnet. 8 Ghost Relayers active. $ZHAD0 genesis distribution.", status: "active" },
  { date: "Q3 2026", label: "DAO_HANDOFF", desc: "Full governance transferred to $ZHAD0 holders. Core team moves to advisory.", status: "upcoming" },
  { date: "Q4 2026", label: "CROSS_CHAIN", desc: "LayerZero bridge enables intents from Arbitrum, Optimism. 50+ relayer target.", status: "upcoming" },
];

const BACKERS = [
  { name: "PARADIGM ANALOG", type: "LEAD" },
  { name: "MULTICOIN CAPITAL", type: "LEAD" },
  { name: "BASE ECOSYSTEM FUND", type: "STRATEGIC" },
  { name: "HACK VC", type: "STRATEGIC" },
  { name: "ROBOT VENTURES", type: "ANGEL" },
  { name: "NAVAL RAVIKANT", type: "ANGEL" },
];

const PRINCIPLES = [
  {
    num: "01",
    title: "PRIVACY IS INFRASTRUCTURE",
    body: "Privacy for AI agents is not a nice-to-have. It is the primitive on which everything else — strategy, yield, autonomy — depends. We build the pipe. Not the app.",
  },
  {
    num: "02",
    title: "CRYPTOGRAPHY, NOT POLICY",
    body: "We do not ask you to trust us. We give you math. The ZK proofs that validate ZHAD0 intents are verifiable by anyone, on-chain, without trust in any operator.",
  },
  {
    num: "03",
    title: "BASE-NATIVE FIRST",
    body: "Base is where AI agent infrastructure is being built. We are not multi-chain for the sake of it. We go deep on one chain, do it right, and expand when the time is right.",
  },
  {
    num: "04",
    title: "OPEN AND EARNED",
    body: "The protocol is open-source. Ghost Relayers earn their role by staking. Governance is earned by holding. Nothing is granted — everything is permissionless and on-chain.",
  },
];

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -60]);

  return (
    <Layout>
      <div style={{ backgroundColor: "#080808" }}>

        {/* ── HERO — FULL VIEWPORT STATEMENT ── */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col justify-center overflow-hidden"
          style={{ backgroundColor: "#080808" }}
        >
          {/* ASCII rain */}
          <AsciiBackground color="232,60,135" opacity={0.05} speed={100} fontSize={12} density={0.25} />
          <div className="ascii-scanline" />
          {/* Subtle orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, hsl(328 90% 60% / 0.3) 0%, transparent 70%)" }} />
            <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full blur-3xl opacity-10" style={{ background: "radial-gradient(circle, hsl(270 80% 60% / 0.3) 0%, transparent 70%)" }} />
          </div>

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 max-w-7xl mx-auto px-6 pt-10"
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[10px] font-mono tracking-[0.5em] text-primary/60 mb-10"
            >
              OUR VISION
            </motion.div>

            <h1
              className="font-black leading-[0.9] tracking-tighter"
              style={{ fontSize: "clamp(24px, 5.5vw, 110px)" }}
            >
              <RevealText delay={0.1}>
                WE'RE BUILDING THE PRIVACY PRIMITIVE FOR AUTONOMOUS AI AGENTS ON BASE — SO THE NEXT WAVE OF MACHINE FINANCE IS INVISIBLE BY DEFAULT.
              </RevealText>
            </h1>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div className="text-[10px] font-mono text-white/15 tracking-widest">SCROLL</div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
            />
          </motion.div>
        </section>

        {/* ── MISSION STATEMENT ── */}
        <section className="py-16 md:py-40" style={{ backgroundColor: "#080808" }}>
          <div className="max-w-6xl mx-auto px-6">
            <FadeUp>
              <div className="text-[10px] font-mono tracking-[0.5em] text-primary/60 mb-12">THE_PROBLEM_WE_SOLVE</div>
            </FadeUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              <div>
                <h2
                  className="font-black leading-[0.92] tracking-tighter mb-0"
                  style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
                >
                  <RevealText delay={0.05}>AI AGENTS ARE NAKED ON-CHAIN. WE MAKE THEM DISAPPEAR.</RevealText>
                </h2>
              </div>
              <div className="pt-4 space-y-6">
                <FadeUp delay={0.1}>
                  <p className="text-sm font-mono text-white/45 leading-relaxed">
                    Every swap, position, and strategy executed by an AI agent on a public blockchain is visible in real time to MEV bots, competitors, and surveillance networks. These actors front-run agent transactions, extracting value before execution completes.
                  </p>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <p className="text-sm font-mono text-white/45 leading-relaxed">
                    ZHAD0 is the layer between agent frameworks and Base that makes this impossible. Agent intents are encrypted before they touch the network. Zero-knowledge proofs verify their validity without revealing their contents. Ghost Relayers execute them without ever reading them.
                  </p>
                </FadeUp>
                <FadeUp delay={0.3}>
                  <p className="text-sm font-mono text-white/45 leading-relaxed">
                    The result: agents that are economically invisible. Execution without exposure.
                  </p>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRINCIPLES ── */}
        <section className="py-12 md:py-32 border-y border-white/5" style={{ background: "#0a0a0a" }}>
          <div className="max-w-7xl mx-auto px-6">
            <FadeUp>
              <div className="text-[10px] font-mono tracking-[0.5em] text-primary/60 mb-16">FIRST_PRINCIPLES</div>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
              {PRINCIPLES.map(({ num, title, body }, i) => (
                <FadeUp key={num} delay={i * 0.08}>
                  <div className="bg-[#0a0a0a] p-10 group hover:bg-[#100a10] transition-colors h-full">
                    <div className="text-5xl font-black text-white/4 font-mono mb-6">{num}</div>
                    <div className="text-xs font-mono tracking-widest text-primary mb-4">{title}</div>
                    <p className="text-sm font-mono text-white/40 leading-relaxed">{body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── BIG QUOTE / SECOND SCROLL REVEAL ── */}
        <section className="py-16 md:py-40" style={{ backgroundColor: "#080808" }}>
          <div className="max-w-6xl mx-auto px-6">
            <FadeUp>
              <div className="text-[10px] font-mono tracking-[0.5em] text-primary/60 mb-12">WHY_NOW</div>
            </FadeUp>
            <h2
              className="font-black leading-[0.92] tracking-tighter"
              style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
            >
              <RevealText delay={0.05}>
                THE NEXT TRILLION DOLLARS OF ON-CHAIN VOLUME WILL BE EXECUTED BY MACHINES. THOSE MACHINES NEED PRIVACY. ZHAD0 IS THAT PRIVACY LAYER.
              </RevealText>
            </h2>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="py-12 md:py-32 border-t border-white/5" style={{ background: "#080808" }}>
          <div className="max-w-7xl mx-auto px-6">
            <FadeUp>
              <div className="text-[10px] font-mono tracking-[0.5em] text-primary/60 mb-4">THE_TEAM</div>
              <h2
                className="font-black tracking-tighter mb-16"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                <RevealText>BUILT BY RESEARCHERS, ENGINEERS, AND PROTOCOL VETERANS.</RevealText>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEAM.map(({ handle, role, bio, location }, i) => (
                <FadeUp key={handle} delay={i * 0.1}>
                  <div
                    className="border border-white/5 p-8 group hover:border-primary/20 transition-all"
                    style={{ background: "#0c0c0c" }}
                    data-testid={`team-${handle}`}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="text-lg font-mono font-bold text-primary mb-1">{handle}</div>
                        <div className="text-[10px] font-mono tracking-widest text-white/25">{role}</div>
                      </div>
                      <div className="text-[10px] font-mono text-white/15 tracking-widest border border-white/5 px-2.5 py-1">
                        {location}
                      </div>
                    </div>
                    <p className="text-xs font-mono text-white/40 leading-relaxed">{bio}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.3}>
              <div className="mt-6 border border-white/5 p-6 flex items-center gap-4" style={{ background: "#0c0c0c" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <p className="text-xs font-mono text-white/25">
                  The core team operates pseudonymously. We are identified by our on-chain contributions, audit history, and deployed code — not by names.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── ROADMAP ── */}
        <section className="py-12 md:py-32 border-t border-white/5" style={{ background: "#080808" }}>
          <div className="max-w-7xl mx-auto px-6">
            <FadeUp>
              <div className="text-[10px] font-mono tracking-[0.5em] text-primary/60 mb-4">ROADMAP</div>
              <h2
                className="font-black tracking-tighter mb-16"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                <RevealText>FROM TESTNET TO DAO HANDOFF.</RevealText>
              </h2>
            </FadeUp>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[29px] top-0 bottom-0 w-px bg-white/5" />

              <div className="space-y-0">
                {MILESTONES.map(({ date, label, desc, status }, i) => (
                  <FadeUp key={label} delay={i * 0.07}>
                    <div className="relative flex items-start gap-8 py-8 border-b border-white/5 last:border-0 group">
                      {/* Dot */}
                      <div className={`flex-shrink-0 w-[60px] flex flex-col items-center pt-1 z-10`}>
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          status === "done"
                            ? "border-primary bg-primary"
                            : status === "active"
                            ? "border-primary bg-primary animate-pulse"
                            : "border-white/15 bg-transparent"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-4 mb-1">
                          <span className="text-[10px] font-mono text-white/20 tracking-widest">{date}</span>
                          <span className={`text-[10px] font-mono tracking-widest border px-2 py-0.5 ${
                            status === "done"
                              ? "text-primary border-primary/30 bg-primary/10"
                              : status === "active"
                              ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                              : "text-white/20 border-white/10"
                          }`}>
                            {status === "done" ? "COMPLETE" : status === "active" ? "IN PROGRESS" : "UPCOMING"}
                          </span>
                        </div>
                        <div className="text-xs font-mono tracking-widest text-white/60 mb-2">{label}</div>
                        <p className="text-sm font-mono text-white/30 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BACKERS ── */}
        <section className="py-12 md:py-32 border-t border-white/5" style={{ background: "#0a0a0a" }}>
          <div className="max-w-7xl mx-auto px-6">
            <FadeUp>
              <div className="text-[10px] font-mono tracking-[0.5em] text-primary/60 mb-4">BACKED BY</div>
              <h2
                className="font-black tracking-tighter mb-16"
                style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
              >
                <RevealText>THE PEOPLE WHO BET ON INFRASTRUCTURE BEFORE THE WORLD CAUGHT UP.</RevealText>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5">
              {BACKERS.map(({ name, type }, i) => (
                <FadeUp key={name} delay={i * 0.06}>
                  <div
                    className="bg-[#0a0a0a] p-8 group hover:bg-[#100a10] transition-colors"
                    data-testid={`backer-${name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <div className={`text-[10px] font-mono tracking-widest mb-3 ${type === "LEAD" ? "text-primary" : "text-white/20"}`}>
                      {type}
                    </div>
                    <div className="text-sm font-mono font-bold text-white/50 group-hover:text-white/80 transition-colors tracking-wide">
                      {name}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL STATEMENT ── */}
        <section className="py-40 border-t border-white/5" style={{ backgroundColor: "#080808" }}>
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="font-black leading-[0.92] tracking-tighter mb-20"
              style={{ fontSize: "clamp(42px, 7vw, 100px)" }}
            >
              <RevealText delay={0.05}>
                AGENT TRANSACTIONS. INVISIBLE.
              </RevealText>
            </h2>

            {/* Stats row */}
            <FadeUp delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mb-16">
                {[
                  { value: "100M", label: "$ZHAD0 SUPPLY" },
                  { value: "8453", label: "BASE CHAIN ID" },
                  { value: "2-SEC", label: "BLOCK TIME" },
                  { value: "v1.0", label: "PROTOCOL VERSION" },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-[#080808] p-8 font-mono">
                    <div className="text-3xl font-black text-white mb-2">{value}</div>
                    <div className="text-[10px] tracking-widest text-white/25">{label}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* CTA row */}
            <FadeUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  href="/relayer"
                  className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 text-xs font-mono font-bold tracking-widest hover:bg-primary/90 transition-all"
                  data-testid="btn-about-relayer"
                >
                  RUN A GHOST NODE <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/whitepaper"
                  className="inline-flex items-center gap-2 border border-white/10 text-white/40 px-8 py-4 text-xs font-mono font-bold tracking-widest hover:border-primary/30 hover:text-white/70 transition-all"
                  data-testid="btn-about-whitepaper"
                >
                  READ PROTOCOL
                </Link>
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 tracking-widest pt-3">
                  <SiEthereum className="w-3 h-3" />
                  BASE L2 // CHAIN ID 8453
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

      </div>
    </Layout>
  );
}
