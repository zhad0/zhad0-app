import { Layout } from "@/components/layout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const FAQS = [
  {
    category: "GENERAL",
    items: [
      {
        q: "What is ZHAD0?",
        a: "ZHAD0 is a ZK-powered privacy middleware for autonomous AI agents operating on Base L2. It encrypts agent transaction intents off-chain, generates zero-knowledge proofs of their validity using RISC Zero, and executes them through a decentralized Ghost Relay network — making agent activity invisible to MEV bots and on-chain observers.",
      },
      {
        q: "Why do AI agents need privacy?",
        a: "AI agents executing financial strategies on public blockchains expose their every move to front-running bots, competitors, and surveillance. MEV bots can extract value from predictable agent transactions before they're executed. ZHAD0 eliminates this attack surface completely.",
      },
      {
        q: "Which chains will ZHAD0 support?",
        a: "ZHAD0 is designed for Base L2 (Chain ID: 8453) at launch. Base was chosen for its 2-second block time, EVM compatibility, and its native ecosystem for AI agent infrastructure. NOTE: ZHAD0 is not yet deployed on any network — no contracts on Base mainnet or Base Sepolia today. Target launch: see roadmap.",
      },
      {
        q: "Is ZHAD0 audited?",
        a: "Not yet. No external security audit has been completed. The audit program is planned to begin once the ZK circuit and Base contracts reach v1 candidate. The codebase is open-source and publicly inspectable on GitHub. Do not treat any 'AUDITED' marketing language elsewhere on this site as confirmation — it does not exist yet.",
      },
    ],
  },
  {
    category: "TOKEN",
    items: [
      {
        q: "What will $ZHAD0 be used for?",
        a: "The $ZHAD0 token is designed to serve three functions at mainnet: (1) Ghost Relayer staking — operators stake ≥10,000 ZHAD0 to run a node; (2) Governance — token holders vote on protocol parameters and treasury allocation; (3) Slashing bond — staked ZHAD0 is slashed per protocol violation. NOTE: the token has not been deployed, distributed, or made available for sale. No public sale, no airdrop, no contract on Base.",
      },
      {
        q: "What is the planned total supply?",
        a: "The proposed total supply is 100,000,000 (100M) ZHAD0. Planned distribution: 30% Relayer Rewards, 20% Team (4-year vest, 1-year cliff), 15% Early Backers, 15% Ecosystem, 10% Treasury, 10% Public. Subject to change before TGE.",
      },
      {
        q: "How will token holders earn?",
        a: "At mainnet, 20% of every relay fee is planned to be distributed pro-rata to staked ZHAD0 holders, denominated in ETH. This mechanism is not active today — no fees, no rewards, no token in existence.",
      },
    ],
  },
  {
    category: "GHOST_RELAY",
    items: [
      {
        q: "What is a Ghost Relayer?",
        a: "A Ghost Relayer is the planned node-operator role: a staked node that receives encrypted intent blobs, validates ZK proofs on-chain, and submits execution transactions to Base — without ever seeing intent contents. The network does not exist today; this describes the v1 design.",
      },
      {
        q: "Can I run a Ghost Relayer node today?",
        a: "No. There is no relayer software released, no staking contract deployed, and no testnet relay roster. Node-operator onboarding is planned post-audit, post-mainnet. Projected economics (60% of relay fees, 15–25% APR on a 10,000 ZHAD0 stake) are design targets, not realised returns.",
      },
      {
        q: "What are the planned slashing conditions?",
        a: "Per the v1 design: a relayer's stake is slashed 10% per verified violation — (1) submitting an intent with an invalid ZK proof, (2) coordinating with other relayers to deanonymize agent transactions, or (3) attempting to censor specific agents. Slashing is not active because the contracts are not deployed.",
      },
    ],
  },
  {
    category: "TECHNICAL",
    items: [
      {
        q: "What ZK proof system does ZHAD0 use?",
        a: "ZHAD0 uses RISC Zero's zkVM, a general-purpose zero-knowledge virtual machine that generates STARK-based proofs. The intent-validity circuit enforces four invariants (signature validity, nonce monotonicity, gas ceiling compliance, schema correctness) without revealing intent contents.",
      },
      {
        q: "How does the threshold encryption work?",
        a: "ZHAD0 uses Distributed Key Generation (DKG) over BLS12-381 to establish a threshold public key shared across Ghost Relayers. A 2-of-3 quorum must cooperate to decrypt any intent — preventing any single relayer from reading intent contents even if compromised.",
      },
      {
        q: "Can I integrate ZHAD0 with Virtuals Protocol or Eliza today?",
        a: "Not yet. Virtuals, Eliza, and Coinbase AgentKit are planned integration targets for SDK v1 (roadmap: Q4 2026). The current @zhad0/sdk package is a DESIGN_PREVIEW — it ships real client-side AES-256-GCM encryption and the wrapAgent() API surface, but ZK proofs and relayer submission are simulated until the Ghost Relay network and on-chain verifier are live on Base. No mainnet, no published npm package, no production integrations yet.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        data-testid={`faq-${q.slice(0, 20).toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "")}`}
      >
        <span className="text-sm font-mono text-white/70 group-hover:text-white transition-colors leading-snug">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-white/25 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm font-mono text-white/40 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16" style={{ backgroundColor: "#080808" }}>
        {/* Header */}
        <header className="mb-14 border-b border-white/5 pb-10">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">FREQUENTLY_ASKED</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">FAQ</h1>
          <p className="text-white/35 font-mono text-sm max-w-lg leading-relaxed">
            Common questions about the ZHAD0 protocol, Ghost Relay network, and $ZHAD0 token.
          </p>
        </header>

        {/* FAQ sections */}
        <div className="space-y-10">
          {FAQS.map((section, si) => (
            <motion.section
              key={section.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="text-[10px] font-mono tracking-widest text-primary mb-4">{section.category}</div>
              <div className="border border-white/5 px-6" style={{ background: "#0c0c0c" }}>
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 border border-white/5 p-8 flex flex-col sm:flex-row gap-4 items-center" style={{ background: "#0c0c0c" }}>
          <div className="flex-1">
            <div className="text-[10px] font-mono tracking-widest text-primary mb-2">STILL_HAVE_QUESTIONS?</div>
            <p className="text-xs font-mono text-white/35">Read the full protocol documentation or join the community on Farcaster.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/docs" className="inline-flex items-center gap-2 bg-primary text-black px-5 py-3 text-xs font-mono font-bold tracking-widest hover:bg-primary/90 transition-all" data-testid="btn-faq-docs">
              READ DOCS <ArrowRight className="w-3 h-3" />
            </Link>
            <a href="https://warpcast.com/zhad0" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/10 text-white/40 px-5 py-3 text-xs font-mono font-bold tracking-widest hover:border-primary/30 hover:text-white/70 transition-all">
              FARCASTER
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
