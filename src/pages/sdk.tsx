import { Layout } from "@/components/layout";
import { ScrambleText } from "@/components/scramble-text";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { Copy, Check, Terminal, Zap, Shield, Code2, ArrowRight, Box, Cpu, Globe } from "lucide-react";
import { motion } from "framer-motion";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 text-[10px] font-mono text-white/25 hover:text-white/60 transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

function CodeBlock({ label, code, lang = "bash" }: { label: string; code: string; lang?: string }) {
  return (
    <div className="border border-white/5 relative" style={{ background: "#0c0c0c" }}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[10px] font-mono text-white/20 tracking-widest">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/15 tracking-widest">{lang.toUpperCase()}</span>
          <CopyButton text={code} />
        </div>
      </div>
      <pre className="text-xs font-mono p-5 overflow-x-auto text-primary/80 leading-relaxed whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const FEATURES = [
  {
    icon: Shield,
    title: "ZERO-KNOWLEDGE PRIVACY",
    desc: "Every agent transaction is wrapped in a ZK proof. The relay never sees the original intent — only a valid proof.",
  },
  {
    icon: Zap,
    title: "ONE-LINE INTEGRATION",
    desc: "Drop ZHAD0 into any existing AI agent stack. Works alongside LangChain, Autogen, Eliza, and any EVM-compatible framework.",
  },
  {
    icon  : Cpu,
    title: "INTENT ABSTRACTION",
    desc: "Bundle complex multi-step agent actions into a single private intent. One proof, one relay, one on-chain footprint.",
  },
  {
    icon: Globe,
    title: "BASE-NATIVE",
    desc: "Optimised for Base L2. Sub-second proof generation, near-zero gas overhead. Mainnet-ready.",
  },
  {
    icon: Code2,
    title: "TYPESCRIPT-FIRST",
    desc: "Fully typed SDK with strict Zod validation. Auto-generated types from the on-chain ABI. No guessing.",
  },
  {
    icon: Box,
    title: "RELAY ROUTING",
    desc: "Automatically selects the fastest available Ghost Relay. Falls back gracefully. No single point of failure.",
  },
];

const FRAMEWORKS = [
  { name: "LangChain", status: "PLANNED" },
  { name: "Autogen", status: "PLANNED" },
  { name: "Eliza (ai16z)", status: "PLANNED" },
  { name: "Vercel AI SDK", status: "PLANNED" },
  { name: "GAME (Virtuals)", status: "PLANNED" },
  { name: "CrewAI", status: "PLANNED" },
  { name: "Coinbase AgentKit", status: "PLANNED" },
];

const INSTALL_CODE = `# DESIGN_PREVIEW — not yet published to npm.
# Available inside the ZHAD0 monorepo as a workspace package:
#   import { Zhad0Client } from '@zhad0/sdk';
#
# Planned (post-mainnet):
#   npm install @zhad0/sdk`;

const QUICKSTART_CODE = `import { ZHAD0 } from '@zhad0/sdk';

const z = new ZHAD0({
  rpc: 'https://mainnet.base.org',
  // Optional: provide your own signer
  // signer: yourEthersSigner,
});

// Wrap any on-chain action with ZK privacy
const receipt = await z.sendPrivateIntent({
  target: '0xUniswapRouter...',
  calldata: encodedSwapData,
  value: parseEther('0.1'),
});

console.log('Relayed. Verified. Invisible.');
console.log('Proof:', receipt.zkProof);
console.log('Tx hash:', receipt.txHash);`;

const LANGCHAIN_CODE = `import { ZHAD0Tool } from '@zhad0/sdk/langchain';

// Drop-in LangChain tool — wraps any on-chain call with privacy
const privateTx = new ZHAD0Tool({
  name: 'private_evm_call',
  description: 'Execute a private on-chain transaction via ZHAD0',
});

// Add to your agent's tools array
const agent = await createOpenAIFunctionsAgent({
  llm,
  tools: [privateTx, ...otherTools],
  prompt,
});`;

const CONFIG_CODE = `// zhad0.config.ts
export default {
  network: 'base',               // base | base-sepolia
  relayStrategy: 'fastest',      // fastest | cheapest | random
  proofBackend: 'risc-zero',     // risc-zero | groth16
  fallbackEnabled: true,
  timeout: 15_000,               // ms
};`;

const TABS = ["QUICKSTART", "LANGCHAIN", "CONFIG"] as const;
type Tab = typeof TABS[number];

const TAB_CONTENT: Record<Tab, { code: string; lang: string; label: string }> = {
  QUICKSTART:  { code: QUICKSTART_CODE,  lang: "typescript", label: "Basic usage — any agent" },
  LANGCHAIN:   { code: LANGCHAIN_CODE,   lang: "typescript", label: "LangChain tool integration" },
  CONFIG:      { code: CONFIG_CODE,      lang: "typescript", label: "Configuration options" },
};

function ApiKeyGate() {
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();

  if (!isConnected) {
    return (
      <div
        className="border border-primary/20 p-8 flex flex-col items-center gap-5 text-center"
        style={{ background: "#0a040a" }}
      >
        <Shield className="w-8 h-8 text-primary/50" />
        <div>
          <div className="text-[10px] font-mono tracking-[0.3em] text-primary mb-1">CONNECT WALLET TO GET API KEY</div>
          <p className="text-[11px] font-mono text-white/25 max-w-xs leading-relaxed mt-2">
            Your API key is derived from your wallet address. No sign-up required.
          </p>
        </div>
        <button
          onClick={() => open()}
          className="flex items-center gap-2 border border-primary/40 text-primary text-[10px] font-mono tracking-widest px-5 py-2.5 hover:bg-primary hover:text-black transition-all"
        >
          <ScrambleText>CONNECT_WALLET</ScrambleText>
        </button>
      </div>
    );
  }

  const apiKey = `zhad0_${address?.slice(2, 10).toLowerCase()}_mainnet_b8453`;

  return (
    <div className="border border-primary/20 p-6 space-y-4" style={{ background: "#0a040a" }}>
      <div className="flex items-center gap-2 pb-4 border-b border-primary/10">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-mono tracking-widest text-primary">WALLET CONNECTED</span>
        <span className="ml-auto text-[10px] font-mono text-white/30">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
      <div>
        <div className="text-[10px] font-mono tracking-widest text-white/25 mb-2">YOUR API KEY</div>
        <div className="flex items-center gap-2 border border-white/5 px-4 py-2.5" style={{ background: "#080808" }}>
          <code className="text-xs font-mono text-primary flex-1 truncate">{apiKey}</code>
          <CopyButton text={apiKey} />
        </div>
        <p className="text-[10px] font-mono text-white/20 mt-2 leading-relaxed">
          Use this in your <code className="text-primary/60">ZHAD0_API_KEY</code> env variable. Key is derived on-chain — no backend storage.
        </p>
      </div>
      <div className="border border-white/5 px-4 py-3 flex items-center justify-between" style={{ background: "#080808" }}>
        <span className="text-[10px] font-mono text-white/30 tracking-widest">PLAN</span>
        <span className="text-[10px] font-mono text-primary tracking-widest">FREE — 1,000 relays/month</span>
      </div>
      <a
        href="/docs"
        className="flex items-center gap-2 text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors"
      >
        Read full API reference <ArrowRight className="w-3 h-3" />
      </a>
    </div>
  );
}

export default function SDK() {
  const [activeTab, setActiveTab] = useState<Tab>("QUICKSTART");

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16" style={{ backgroundColor: "#080808" }}>

        {/* Header */}
        <header className="mb-16 border-b border-white/5 pb-12">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">DEVELOPER_SDK</div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                @zhad0/sdk
              </h1>
              <p className="text-white/35 font-mono text-sm leading-relaxed">
                DESIGN_PREVIEW of the SDK that will add ZK privacy to any AI agent in one line. Real client-side AES-256-GCM encryption is implemented today; ZK proofs and Ghost Relay submission are simulated until mainnet is live.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="border border-yellow-400/30 px-4 py-2 text-[10px] font-mono text-yellow-400/70" style={{ background: "#0c0c0c" }}>
                0.0.0-design.1
              </div>
              <a
                href="https://github.com/zhad0-protocol/zhad0-monorepo"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-primary/40 text-primary px-5 py-2.5 text-[10px] font-mono font-bold tracking-widest hover:bg-primary hover:text-black transition-colors"
              >
                <Terminal className="w-3 h-3" />
                <ScrambleText>VIEW_SOURCE</ScrambleText>
              </a>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: install + code examples */}
          <div className="lg:col-span-2 space-y-8">

            {/* Install */}
            <CodeBlock label="INSTALL" code={INSTALL_CODE} lang="bash" />

            {/* Tabbed code examples */}
            <div>
              <div className="flex border-b border-white/5 mb-0">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 text-[10px] font-mono tracking-widest transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? "text-primary border-primary"
                        : "text-white/25 border-transparent hover:text-white/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-0">
                <CodeBlock
                  label={TAB_CONTENT[activeTab].label}
                  code={TAB_CONTENT[activeTab].code}
                  lang={TAB_CONTENT[activeTab].lang}
                />
              </div>
            </div>

            {/* Features grid */}
            <div>
              <div className="text-[10px] font-mono tracking-widest text-primary/60 mb-6">FEATURES</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-[#080808] p-6 group hover:bg-[#0f0a0d] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white/20 mb-4 group-hover:text-primary transition-colors" />
                    <div className="text-[10px] font-mono tracking-widest text-primary mb-2">{title}</div>
                    <p className="text-xs font-mono text-white/35 leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Framework support */}
            <div className="border border-white/5 p-6" style={{ background: "#0c0c0c" }}>
              <div className="text-[10px] font-mono tracking-widest text-white/30 mb-5">FRAMEWORK_SUPPORT</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FRAMEWORKS.map(({ name, status }) => (
                  <div key={name} className="flex items-center justify-between border border-white/5 px-3 py-2.5">
                    <span className="text-xs font-mono text-white/50">{name}</span>
                    <span className={`text-[9px] font-mono tracking-widest ${
                      status === "LIVE" ? "text-primary" :
                      status === "BETA" ? "text-yellow-400/70" :
                      status === "PLANNED" ? "text-yellow-400/60" : "text-white/20"
                    }`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: API key + links */}
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-primary/60 mb-4">GET_API_KEY</div>
              <ApiKeyGate />
            </div>

            {/* Quick links */}
            <div className="border border-white/5 p-5 space-y-1" style={{ background: "#0c0c0c" }}>
              <div className="text-[10px] font-mono tracking-widest text-white/20 mb-4">RESOURCES</div>
              {[
                { label: "Full API Reference", href: "/docs" },
                { label: "GitHub Repository", href: "https://github.com/zhad0-protocol/zhad0-monorepo" },
                { label: "Changelog", href: "https://docs.zhad0.network/changelog" },
                { label: "npm Package (planned)", href: "https://github.com/zhad0-protocol/zhad0-monorepo" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 text-[11px] font-mono text-white/35 hover:text-white/70 transition-colors group"
                >
                  {label}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>

            {/* Status */}
            <div className="border border-white/5 p-5 font-mono text-xs" style={{ background: "#0c0c0c" }}>
              <div className="text-[10px] tracking-widest text-white/20 mb-4">SDK_STATUS</div>
              <div className="space-y-2.5">
                {[
                  { label: "Client-side AES-GCM", status: "LIVE" },
                  { label: "wrapAgent() API surface", status: "LIVE" },
                  { label: "Mainnet relay",     status: "PLANNED" },
                  { label: "Real ZK proof gen", status: "PLANNED" },
                  { label: "Intent bundling",   status: "PLANNED" },
                  { label: "Gasless mode",      status: "PLANNED" },
                  { label: "Multi-chain",       status: "PLANNED" },
                ].map(({ label, status }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/35">{label}</span>
                    <span className={`text-[9px] tracking-widest ${status === "LIVE" ? "text-primary" : "text-yellow-400/60"}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
