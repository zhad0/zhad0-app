import { Layout } from "@/components/layout";
import { WalletGateInline } from "@/components/wallet-gate";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { Vote, Clock, AlertTriangle, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Governance() {
  const { isConnected } = useAccount();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16" style={{ backgroundColor: "#080808" }}>

        {/* Header */}
        <header className="mb-14 border-b border-white/5 pb-10">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">ON_CHAIN_GOVERNANCE</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">ZHAD0_DAO</h1>
              <p className="text-white/35 font-mono text-sm max-w-xl leading-relaxed">
                $ZHAD0 token holders will govern protocol parameters, treasury allocation, and upgrades through binding on-chain votes.
              </p>
            </div>
            {isConnected ? (
              <button
                disabled
                className="flex-shrink-0 inline-flex items-center gap-2 border border-white/10 text-white/20 px-6 py-3 text-xs font-mono tracking-widest cursor-not-allowed"
                data-testid="btn-create-proposal"
                title="Governance launches after token deployment"
              >
                NEW PROPOSAL <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <WalletGateInline label="CONNECT_WALLET_TO_CREATE_PROPOSAL" />
            )}
          </div>
        </header>

        {/* Stats — all empty until live */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mb-10">
          {[
            { icon: Vote,          label: "ACTIVE_PROPOSALS",  value: "—" },
            { icon: Users,         label: "TOTAL_VOTERS",       value: "—" },
            { icon: TrendingUp,    label: "YOUR_VOTING_POWER",  value: "—" },
            { icon: AlertTriangle, label: "QUORUM_THRESHOLD",   value: "25M ZHAD0" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#080808] p-6 font-mono" data-testid={`gov-stat-${label.toLowerCase()}`}>
              <div className="text-[10px] text-white/25 tracking-widest flex items-center gap-2 mb-2">
                <Icon className="w-3 h-3" /> {label}
              </div>
              <div className="text-2xl font-bold text-white/25">{value}</div>
            </div>
          ))}
        </div>

        {/* SOON banner */}
        <div className="border border-yellow-400/20 px-6 py-5 flex items-start gap-4 mb-14" style={{ background: "#0f0b00" }}>
          <Clock className="w-4 h-4 text-yellow-400/70 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] font-mono tracking-widest text-yellow-400/80 mb-1">GOVERNANCE_NOT_YET_ACTIVE — COMING_SOON</div>
            <p className="text-xs font-mono text-white/30 leading-relaxed max-w-2xl">
              On-chain governance launches after $ZHAD0 token deployment to Base mainnet and a 30-day distribution period.
              The <code className="text-primary/60">ZHADGovernor</code> and <code className="text-primary/60">TimelockController</code> contracts
              are written and audited — awaiting deployment.
              Once live, any wallet holding ≥100,000 $ZHAD0 can submit proposals and vote here directly.
            </p>
            <Link href="/token" className="inline-flex items-center gap-1.5 text-[10px] font-mono text-yellow-400/60 hover:text-yellow-400 mt-3 transition-colors">
              VIEW TOKEN LAUNCH TIMELINE <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Proposals — empty state */}
        <section className="mb-14">
          <div className="text-[10px] font-mono tracking-widest text-primary/60 mb-6">PROPOSALS</div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-white/5 p-16 flex flex-col items-center gap-5 text-center"
            style={{ background: "#0c0c0c" }}
          >
            <Vote className="w-8 h-8 text-white/10" />
            <div>
              <div className="text-[10px] font-mono tracking-widest text-white/20 mb-2">NO_PROPOSALS_YET</div>
              <p className="text-xs font-mono text-white/20 max-w-xs leading-relaxed">
                Proposals will appear here once governance is live on Base mainnet.
              </p>
            </div>
            <span className="text-[9px] font-mono tracking-widest border border-yellow-400/20 text-yellow-400/50 px-3 py-1.5" style={{ background: "#0f0b00" }}>
              COMING SOON
            </span>
          </motion.div>
        </section>

        {/* Governance model — documentation, always shown */}
        <section className="border border-white/5 p-8" style={{ background: "#0c0c0c" }}>
          <div className="text-[10px] font-mono tracking-widest text-white/30 mb-8">GOVERNANCE_MODEL</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                label: "PROPOSE",
                desc: "Any wallet holding ≥100,000 ZHAD0 can submit a proposal. A 48-hour discussion window precedes the vote.",
              },
              {
                step: "02",
                label: "VOTE",
                desc: "1 ZHAD0 = 1 vote. Voting is open for 7 days. Quorum is 25M ZHAD0 (2.5% of supply). Simple majority passes.",
              },
              {
                step: "03",
                label: "EXECUTE",
                desc: "Passed proposals enter a 48-hour TimelockController delay. After expiry, execution is open to anyone.",
              },
            ].map(({ step, label, desc }) => (
              <div key={step} className="border border-white/5 p-5 hover:border-primary/20 transition-colors">
                <div className="text-3xl font-black text-white/5 font-mono mb-4">{step}</div>
                <div className="text-[10px] font-mono tracking-widest text-primary mb-2">{label}</div>
                <p className="text-xs font-mono text-white/35 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Technical parameters */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="text-[10px] font-mono tracking-widest text-white/20 mb-5">TECHNICAL_PARAMETERS</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              {[
                { label: "PROPOSAL_THRESHOLD", value: "100,000 ZHAD0" },
                { label: "VOTING_PERIOD",      value: "7 days" },
                { label: "QUORUM",             value: "2.5% of supply" },
                { label: "TIMELOCK_DELAY",     value: "48 hours" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#0c0c0c] p-4 font-mono">
                  <div className="text-[9px] tracking-widest text-white/20 mb-1">{label}</div>
                  <div className="text-sm text-white/60">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
