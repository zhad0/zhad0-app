import { Layout } from "@/components/layout";
import { useGetChainInfo } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ExternalLink } from "lucide-react";

const SECTIONS = [
  {
    id: "abstract",
    label: "01 // ABSTRACT",
    content: `As AI agents increasingly execute autonomous financial transactions on public blockchains, they face systemic privacy failures: front-running via MEV extraction, strategy leakage through wallet transparency, and balance surveillance. Zhad0 is a ZK-powered privacy middleware layer for AI agents operating on Base L2. Zhad0 encrypts agent intents off-chain, generates zero-knowledge proofs of intent validity via RISC Zero, and executes them through a decentralized threshold-relayed Ghost Relay network. The architecture preserves agent operational privacy while maintaining composability with Base's existing DeFi ecosystem.`,
  },
  {
    id: "problem",
    label: "02 // PROBLEM_STATEMENT",
    content: `Public blockchains are transparent by design. Every transaction, wallet balance, and on-chain interaction is visible to anyone who inspects the mempool or chain state. For human users, this is a known trade-off. For autonomous AI agents executing high-frequency financial strategies, this transparency is catastrophic.\n\nThree specific failure modes emerge at scale:\n\n• MEV Extraction — sophisticated searchers monitor the mempool for predictable agent transactions and front-run them within the same block, extracting value before execution.\n\n• Strategy Leakage — wallet-linked activity over time reveals agent trading patterns, portfolio allocation, and behavioral signatures to competitors and adversaries.\n\n• Balance Surveillance — real-time capital visibility enables targeted attacks, forced liquidations, and manipulation of agent behavior.`,
  },
  {
    id: "architecture",
    label: "03 // ARCHITECTURE",
    content: `Zhad0 operates as a middleware layer between agent frameworks and Base L2. The protocol consists of three primary components:\n\n1. INTENT_ENCRYPTION_LAYER — Agent payloads are serialized and encrypted using threshold public-key cryptography. No single party holds the decryption key; a 2-of-3 threshold among Ghost Relayer cohorts is required to reconstruct intent. The encrypted blob is committed to an off-chain queue.\n\n2. ZK_PROOF_GENERATION — A RISC Zero zkVM circuit verifies that the encrypted intent is structurally valid — correct nonce, valid signature, within gas bounds — and produces a validity proof without revealing the intent contents. This proof is attached to the encrypted blob.\n\n3. GHOST_RELAY_NETWORK — A permissioned-but-open network of staked relayers receives blobs, validates proofs on-chain, and submits execution transactions to Base. The executing relayer never learns the intent content. Threshold decryption only occurs at the moment of Base submission.`,
  },
  {
    id: "cryptography",
    label: "04 // CRYPTOGRAPHIC_CONSTRUCTIONS",
    content: `The ZHAD0 cryptographic stack is built on three primitives:\n\n• THRESHOLD_ENCRYPTION — We use Distributed Key Generation (DKG) over BLS12-381 to establish a threshold key shared across Ghost Relayers. A 2-of-3 quorum must cooperate to decrypt, preventing any single relayer from reading intent contents.\n\n• ZK_PROOF_SYSTEM — Intent validity proofs use RISC Zero's STARK-based zkVM. The circuit enforces: (a) signature validity against agent public key, (b) nonce monotonicity, (c) gas ceiling compliance, and (d) schema correctness. Proof generation is performed off-chain by the agent; verification is performed on-chain by Base contract.\n\n• COMMITMENT_SCHEME — Intent blobs are committed using Pedersen commitments before relay submission, ensuring blob integrity across the relay lifecycle without revealing contents.`,
  },
  {
    id: "security",
    label: "05 // SECURITY_MODEL",
    content: `ZHAD0's threat model assumes an adversarial network in which up to t-1 of t Ghost Relayers may collude or be compromised, where t is the threshold parameter (default: 2-of-3). Under this model:\n\n• PRIVACY — An adversary controlling fewer than t relayers learns nothing about intent contents. Privacy holds even if the adversary observes all network traffic.\n\n• LIVENESS — Execution proceeds as long as at least t honest relayers are online. The system is resilient to up to f = n-t relay failures per round.\n\n• INTEGRITY — ZK proofs are verified on-chain before execution. An invalid or forged proof causes the Base contract to revert. Relayer stake is slashed 10% per attempted invalid submission.\n\n• CENSORSHIP_RESISTANCE — No single relayer can censor a specific agent. Intent blobs are broadcast to the full relayer set; any t-quorum can execute.`,
  },
  {
    id: "economics",
    label: "06 // ECONOMIC_MECHANISM",
    content: `The ZHAD0 economic model aligns relayer incentives with protocol liveness and honest behavior:\n\n• FEE_DISTRIBUTION — Each relayed intent pays a fee in ETH, set by the agent. Of this fee: 60% goes to the executing relayer, 20% to the staking pool (distributed pro-rata to all staked ZHAD0), and 20% to the protocol treasury.\n\n• SLASHING_CONDITIONS — Relayers lose 10% of their staked ZHAD0 per verified protocol violation: submitting invalid proofs, selectively censoring intents, or coordinating to deanonymize agents.\n\n• EXPECTED_YIELD — Based on projected network volume and a 10,000 ZHAD0 minimum stake, relayer operators can expect 15-25% APR denominated in ETH, with upside correlated to network adoption.\n\n• TREASURY_GOVERNANCE — The 20% treasury allocation is controlled by $ZHAD0 token holders via on-chain governance, enabling protocol parameter updates and ecosystem grants.`,
  },
  {
    id: "base",
    label: "07 // BASE_L2_INTEGRATION",
    content: `ZHAD0 is deployed exclusively on Base L2 (Chain ID: 8453). Base provides the ideal execution environment for the protocol:\n\n• LOW_LATENCY — Base's 2-second block time enables near-real-time intent execution without sacrificing Ethereum's security guarantees.\n\n• EVM_COMPATIBILITY — Full EVM compatibility means ZHAD0's on-chain verifier contracts are standard Solidity, auditable by the existing ecosystem tooling.\n\n• ETHEREUM_SECURITY — As a Coinbase-developed L2 secured by Ethereum, Base inherits the full economic security of Ethereum mainnet. ZK proof verification anchors to Ethereum consensus.\n\n• COINBASE_AGENTKIT — Base's close relationship with Coinbase's developer ecosystem makes it the natural home for AI agent infrastructure. ZHAD0 is built to be the privacy primitive for the AgentKit ecosystem.`,
  },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="border border-white/5 mt-4" style={{ background: "#0a0a0a" }}>
      <div className="px-4 py-2 border-b border-white/5 text-[10px] font-mono text-white/20 tracking-widest">REFERENCE</div>
      <pre className="p-4 text-[11px] font-mono text-white/40 whitespace-pre-wrap leading-relaxed overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function Whitepaper() {
  const { data: chain } = useGetChainInfo();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16" style={{ backgroundColor: "#080808" }}>
        {/* Header */}
        <header className="mb-14 border-b border-white/5 pb-10">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">PROTOCOL_DOCUMENTATION</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            ZHAD0: A ZK-Powered Privacy Layer<br className="hidden md:block" /> for AI Agents on Base
          </h1>
          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-white/25 tracking-widest">
            <span>VERSION: 1.0</span>
            <span>CHAIN: {chain?.name ?? "Base"} (ID: {chain?.chainId ?? 8453})</span>
            <span>PROOF_SYSTEM: RISC ZERO</span>
            <span>STATUS: MAINNET_ACTIVE</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <div className="text-[10px] font-mono tracking-widest text-white/20 mb-4">TABLE_OF_CONTENTS</div>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-[10px] font-mono text-white/25 hover:text-primary transition-colors py-1.5 border-l border-white/5 pl-3 hover:border-primary/50"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>

              {/* Chain info card */}
              {chain && (
                <div className="mt-8 border border-white/5 p-4" style={{ background: "#0c0c0c" }}>
                  <div className="text-[10px] font-mono tracking-widest text-white/20 mb-3">DEPLOYMENT</div>
                  <div className="space-y-2 text-[10px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-white/25">CHAIN</span>
                      <span className="text-primary">{chain.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/25">CHAIN_ID</span>
                      <span className="text-white/50">{chain.chainId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/25">BLOCK_TIME</span>
                      <span className="text-white/50">{chain.blockTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/25">SETTLED_ON</span>
                      <span className="text-white/50">ETH</span>
                    </div>
                    <a
                      href={chain.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-primary/60 hover:text-primary transition-colors mt-2"
                      data-testid="link-explorer"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      Basescan
                    </a>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-12">
            {SECTIONS.map((section, i) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="scroll-mt-20"
              >
                <div className="text-[10px] font-mono tracking-widest text-primary mb-5">{section.label}</div>
                <div className="space-y-4">
                  {section.content.split("\n\n").map((para, j) => (
                    <p
                      key={j}
                      className="text-sm font-mono text-white/50 leading-relaxed"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {section.id === "architecture" && (
                  <CodeBlock>{`// ZHAD0 Agent Integration (pseudocode)
const intent = await agent.buildIntent({ action: "SWAP", amount: "1 ETH" });
const encrypted = await zhad0.encrypt(intent, thresholdPublicKey);
const proof = await riscZeroVM.prove(encrypted, intentCircuit);
await ghostRelay.submit({ blob: encrypted, proof });`}</CodeBlock>
                )}

                {section.id === "cryptography" && (
                  <CodeBlock>{`// On-chain verifier (Base Solidity)
function verifyIntent(
  bytes calldata encryptedBlob,
  bytes32 proofHash,
  uint256[2] calldata blsSignature
) external returns (bool) {
  require(riscZeroVerifier.verify(proofHash, intentCircuitId), "Invalid ZK proof");
  require(blsVerify(blsSignature, encryptedBlob), "Invalid threshold signature");
  emit IntentVerified(proofHash, block.number);
  return true;
}`}</CodeBlock>
                )}
              </motion.section>
            ))}

            {/* Footer CTAs */}
            <div className="border-t border-white/5 pt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/relayer"
                className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3.5 text-xs font-mono font-bold tracking-widest hover:bg-primary/90 transition-all"
                data-testid="btn-whitepaper-relayer"
              >
                RUN A GHOST NODE <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/network"
                className="inline-flex items-center gap-2 border border-white/10 text-white/50 px-6 py-3.5 text-xs font-mono font-bold tracking-widest hover:border-primary/30 hover:text-white/80 transition-all"
                data-testid="btn-whitepaper-network"
              >
                VIEW NETWORK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
