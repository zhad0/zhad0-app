import { Layout } from "@/components/layout";
import { WalletGateInline } from "@/components/wallet-gate";
import { useAccount } from "wagmi";
import { useGetTokenInfo } from "@/lib/api-client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Users, Lock, TrendingUp } from "lucide-react";
import { Link } from "wouter";

const PHASE_COLORS: Record<string, string> = {
  completed: "text-primary border-primary/40 bg-primary/10",
  active: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  upcoming: "text-white/20 border-white/10 bg-white/5",
};

const PHASE_DOT: Record<string, string> = {
  completed: "bg-primary",
  active: "bg-yellow-400 animate-pulse",
  upcoming: "bg-white/20",
};

function StakeCTA() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <WalletGateInline label="CONNECT_WALLET_TO_STAKE — run a Ghost Node and earn 60% of relay fees in ETH" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start">
      <Link
        href="/relayer"
        className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 text-xs font-mono font-bold tracking-widest hover:bg-primary/90 transition-all"
        data-testid="btn-token-stake"
      >
        STAKE & RUN NODE <ArrowRight className="w-3 h-3" />
      </Link>
      <div className="flex items-center gap-2 border border-primary/10 px-4 py-3" style={{ background: "#0a040a" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-mono text-white/40 tracking-widest">
          {address?.slice(0, 6)}...{address?.slice(-4)} on Base
        </span>
      </div>
    </div>
  );
}

export default function Token() {
  const { data: token } = useGetTokenInfo();

  const circulatingPct = token
    ? Math.round((parseInt(token.circulatingSupply) / parseInt(token.totalSupply)) * 100)
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16" style={{ backgroundColor: "#080808" }}>
        {/* Header */}
        <header className="mb-14 border-b border-white/5 pb-10">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">
            BASE MAINNET // CHAIN ID 8453
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">$ZHAD0 Token</h1>
              <p className="text-white/35 font-mono text-sm max-w-xl leading-relaxed">
                The protocol token powering Ghost Relayer staking, governance, and fee distribution on Base.
              </p>
            </div>
            <div className="font-mono text-[10px] text-white/25 border border-white/5 px-4 py-3 flex-shrink-0" style={{ background: "#0c0c0c" }}>
              <div className="tracking-widest mb-1">CONTRACT ADDRESS</div>
              <div className="text-white/50 break-all">{token?.contractAddress ?? "0xZHAD0...0001"}</div>
            </div>
          </div>
        </header>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mb-14">
          {[
            { icon: Coins, label: "TOTAL_SUPPLY", value: token ? `${(parseInt(token.totalSupply) / 1_000_000).toFixed(0)}M` : "—", sub: "$ZHAD0" },
            { icon: TrendingUp, label: "CIRCULATING", value: token ? `${(parseInt(token.circulatingSupply) / 1_000_000).toFixed(1)}M` : "—", sub: `${circulatingPct}% unlocked` },
            { icon: Users, label: "HOLDERS", value: token?.holders?.toLocaleString() ?? "—", sub: "on Base" },
            { icon: Lock, label: "MIN_STAKE", value: "10,000", sub: "to run a node" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-[#080808] p-6 font-mono group hover:bg-[#0f0a0d] transition-colors" data-testid={`token-stat-${label.toLowerCase()}`}>
              <Icon className="w-3.5 h-3.5 text-white/20 mb-4 group-hover:text-primary transition-colors" />
              <div className="text-[10px] text-white/25 tracking-widest mb-1">{label}</div>
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-[10px] text-white/30">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          {/* Distribution chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-white/5 p-8"
            style={{ background: "#0c0c0c" }}
          >
            <div className="text-[10px] font-mono tracking-widest text-white/30 mb-6">TOKEN_DISTRIBUTION</div>
            <div className="h-[220px] mb-6">
              {token?.distribution ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={token.distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="pct"
                      nameKey="label"
                    >
                      {token.distribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number, name: string) => [`${val}%`, name]}
                      contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(232,60,135,0.2)", fontFamily: "monospace", fontSize: 11 }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-white/20 font-mono text-xs">LOADING...</div>
              )}
            </div>
            <div className="space-y-2.5">
              {token?.distribution.map((d) => (
                <div key={d.label} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-white/50">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/25">{(parseInt(d.amount) / 1_000_000).toFixed(0)}M</span>
                    <span className="text-white/50 w-8 text-right">{d.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vesting schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-white/5 p-8"
            style={{ background: "#0c0c0c" }}
          >
            <div className="text-[10px] font-mono tracking-widest text-white/30 mb-6">VESTING_SCHEDULE</div>
            <div className="space-y-1">
              <div className="grid grid-cols-4 text-[10px] font-mono tracking-widest text-white/20 pb-3 border-b border-white/5">
                <span>GROUP</span>
                <span>CLIFF</span>
                <span>VEST</span>
                <span className="text-right">TGE</span>
              </div>
              {token?.vestingSchedule.map((v) => (
                <div key={v.group} className="grid grid-cols-4 text-xs font-mono py-3 border-b border-white/3 hover:bg-white/2 transition-colors">
                  <span className="text-white/60 truncate pr-2">{v.group}</span>
                  <span className="text-white/30">{v.cliff}</span>
                  <span className="text-white/30">{v.vesting}</span>
                  <span className="text-right text-primary">{v.tge}</span>
                </div>
              ))}
            </div>

            {/* Supply bar */}
            <div className="mt-8">
              <div className="text-[10px] font-mono tracking-widest text-white/25 mb-3">SUPPLY_UNLOCK_PROGRESS</div>
              <div className="flex h-1.5 bg-white/5 overflow-hidden">
                <div className="bg-primary transition-all duration-700" style={{ width: `${circulatingPct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/25 mt-2">
                <span>CIRCULATING: {circulatingPct}%</span>
                <span>LOCKED: {100 - circulatingPct}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Roadmap / Phase status */}
        <section className="mb-14">
          <div className="text-[10px] font-mono tracking-widest text-primary/60 mb-6">PROTOCOL_ROADMAP</div>
          <div className="space-y-1">
            {token?.phaseStatus.map((p, i) => (
              <motion.div
                key={p.phase}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="flex items-start gap-5 p-5 border border-white/5 hover:border-white/10 transition-colors"
                style={{ background: "#0c0c0c" }}
                data-testid={`phase-${p.phase}`}
              >
                <div className="flex-shrink-0 w-8 h-8 border border-white/10 flex items-center justify-center font-mono text-[10px] text-white/25">
                  {String(p.phase).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-sm font-mono font-bold text-white/80">{p.label}</span>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest border px-2 py-0.5 ${PHASE_COLORS[p.status]}`}>
                      <span className={`w-1 h-1 rounded-full ${PHASE_DOT[p.status]}`} />
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-white/30 leading-relaxed">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Utility & CTAs */}
        <section className="border border-white/5 p-8" style={{ background: "#0c0c0c" }}>
          <div className="text-[10px] font-mono tracking-widest text-white/30 mb-6">TOKEN_UTILITY</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "RELAYER_STAKING", desc: "Stake ZHAD0 to qualify as a Ghost Relayer and earn 60% of relay fees in ETH." },
              { label: "GOVERNANCE", desc: "Vote on protocol upgrades, fee parameters, and treasury allocation via on-chain DAO." },
              { label: "SLASHING_BOND", desc: "Staked ZHAD0 is slashed 10% per protocol violation, securing honest relayer behavior." },
            ].map(({ label, desc }) => (
              <div key={label} className="border border-white/5 p-5 hover:border-primary/20 transition-colors">
                <div className="text-[10px] font-mono tracking-widest text-primary mb-3">{label}</div>
                <p className="text-xs font-mono text-white/35 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Wallet-gated staking CTA */}
          <StakeCTA />
        </section>
      </div>
    </Layout>
  );
}
