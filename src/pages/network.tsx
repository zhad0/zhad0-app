import { Layout } from "@/components/layout";
import { WalletGate, WalletGateInline } from "@/components/wallet-gate";
import { useListRelayers, useGetIntentFeed, useGetProtocolStats, useGetIntentStats } from "@/lib/api-client";
import { formatDistanceToNow } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Shield, Activity, Network, Box } from "lucide-react";

const PINK = "hsl(328 90% 60%)";
const COLORS = [PINK, "#a855f7", "#6366f1", "#475569"];

const STATUS_STYLES: Record<string, string> = {
  active: "text-primary border-primary/30 bg-primary/10",
  inactive: "text-white/30 border-white/10 bg-white/5",
  slashed: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function NetworkPage() {
  const { data: relayers } = useListRelayers();
  const { data: intents } = useGetIntentFeed();
  const { data: stats } = useGetProtocolStats();
  const { data: intentStats } = useGetIntentStats();

  return (
    <Layout>
      <div className="relative" style={{ backgroundColor: "#080808" }}>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-14 border-b border-white/5 pb-10">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">LIVE_TELEMETRY</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">Network_Observatory</h1>
          <p className="text-white/35 font-mono text-sm">
            Real-time observation of the ZHAD0 Ghost Relayer network.
          </p>
        </header>

        {/* Stats bar — public */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mb-14">
          {[
            { icon: Network, label: "ACTIVE_NODES", value: stats?.activeRelayers, accent: true },
            { icon: Shield, label: "TOTAL_PROCESSED", value: stats?.totalIntentsProcessed?.toLocaleString() },
            { icon: Activity, label: "AVG_UPTIME", value: stats?.uptimePct ? `${stats.uptimePct}%` : undefined },
            { icon: Box, label: "STAKED_$ZHAD0", value: stats?.totalStakedZhad0 ? parseInt(stats.totalStakedZhad0).toLocaleString() : undefined },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className="bg-[#080808] p-6 font-mono" data-testid={`stat-${label.toLowerCase()}`}>
              <div className="text-[10px] text-white/25 tracking-widest flex items-center gap-2 mb-2">
                <Icon className="w-3 h-3" /> {label}
              </div>
              <div className={`text-2xl font-bold ${accent ? "text-primary" : "text-white"}`}>
                {value ?? "—"}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          {/* Charts — public */}
          <div className="space-y-6">
            <div className="border border-white/5 p-6" style={{ background: "#0c0c0c" }}>
              <div className="text-[10px] font-mono tracking-widest text-white/30 mb-6">INTENTS_BY_FRAMEWORK</div>
              <div className="h-[220px]">
                {intentStats?.byFramework ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={intentStats.byFramework}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={78}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="framework"
                      >
                        {intentStats.byFramework.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(232,60,135,0.2)", fontFamily: "monospace", fontSize: 11 }}
                        itemStyle={{ color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/20 font-mono text-xs">LOADING...</div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {intentStats?.byFramework.map((f, i) => (
                  <div key={f.framework} className="flex justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-white/50">{f.framework}</span>
                    </div>
                    <span className="text-white/30">{f.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/5 p-6" style={{ background: "#0c0c0c" }}>
              <div className="text-[10px] font-mono tracking-widest text-white/30 mb-6">VOLUME_24H</div>
              <div className="space-y-3 font-mono">
                <div className="flex justify-between py-2.5 border-b border-white/5 text-sm">
                  <span className="text-white/35 text-xs tracking-widest">INTENTS</span>
                  <span className="text-white">{intentStats?.last24hIntents?.toLocaleString() ?? "—"}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-white/5 text-sm">
                  <span className="text-white/35 text-xs tracking-widest">FEES_ETH</span>
                  <span className="text-primary">{intentStats?.last24hFeesEth ?? "—"} ETH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Relayer table — wallet-gated */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div className="text-[10px] font-mono tracking-widest text-primary/70">GHOST_RELAYER_NODES</div>
              <div className="text-[10px] font-mono tracking-widest border border-primary/20 text-primary/60 px-3 py-1">
                {stats?.activeRelayers ?? 0} ONLINE
              </div>
            </div>

            <WalletGate
              label="CONNECT WALLET TO VIEW NODES"
              description="Operator details, stake amounts, and earnings are visible to connected wallets only."
            >
              <div className="border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono whitespace-nowrap">
                    <thead className="border-b border-white/5" style={{ background: "#0d0d0d" }}>
                      <tr className="text-[10px] text-white/20 tracking-widest">
                        <th className="text-left px-4 py-3 font-normal">OPERATOR</th>
                        <th className="text-left px-4 py-3 font-normal">STATUS</th>
                        <th className="text-right px-4 py-3 font-normal">STAKED</th>
                        <th className="text-right px-4 py-3 font-normal">INTENTS</th>
                        <th className="text-right px-4 py-3 font-normal">EARNINGS</th>
                        <th className="text-right px-4 py-3 font-normal">UPTIME</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/3">
                      {relayers?.map((r) => (
                        <tr key={r.id} className="hover:bg-white/2 transition-colors" data-testid={`relayer-row-${r.id.slice(0, 8)}`}>
                          <td className="px-4 py-3 text-white/60">{r.operatorAddress.slice(0, 6)}...{r.operatorAddress.slice(-4)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] tracking-widest border ${STATUS_STYLES[r.status] ?? ""}`}>
                              <span className="w-1 h-1 rounded-full bg-current" />
                              {r.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-white/40">{parseInt(r.stakedZhad0).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-white/60">{r.intentsRelayed.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-primary">{r.earningsEth} ETH</td>
                          <td className="px-4 py-3 text-right text-white/60">{r.uptimePct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </WalletGate>
          </div>
        </div>

        {/* Intent feed — wallet-gated */}
        <section>
          <div className="text-[10px] font-mono tracking-widest text-primary/70 mb-4">GLOBAL_INTENT_STREAM</div>
          <WalletGate
            label="CONNECT WALLET TO VIEW INTENT STREAM"
            description="Live proof hashes and relay data are restricted to connected wallets."
          >
            <div className="border border-white/5" style={{ background: "#0c0c0c" }}>
              <div className="grid grid-cols-6 gap-4 px-5 py-3 border-b border-white/5 text-[10px] font-mono tracking-widest text-white/20">
                <div className="col-span-2">PROOF_HASH</div>
                <div>FRAMEWORK</div>
                <div>REGION</div>
                <div className="text-right">FEE</div>
                <div className="text-right">TIME</div>
              </div>
              <div className="divide-y divide-white/3 max-h-[420px] overflow-y-auto">
                {intents?.map((intent) => (
                  <div
                    key={intent.id}
                    className="grid grid-cols-6 gap-4 px-5 py-3 text-xs font-mono items-center hover:bg-white/2 transition-colors"
                    data-testid={`intent-${intent.id.slice(0, 8)}`}
                  >
                    <div className="col-span-2 flex items-center gap-2 overflow-hidden">
                      <span className={`w-0.5 h-4 flex-shrink-0 ${intent.status === "confirmed" ? "bg-primary" : intent.status === "pending" ? "bg-yellow-500" : "bg-red-500"}`} />
                      <span className="text-white/30 truncate">{intent.proofHash.slice(0, 20)}...</span>
                    </div>
                    <div className="text-white/50">{intent.agentFramework}</div>
                    <div className="text-white/30">{intent.relayerRegion}</div>
                    <div className="text-right text-primary">{intent.feeEth} ETH</div>
                    <div className="text-right text-white/25">
                      {formatDistanceToNow(new Date(intent.relayedAt), { addSuffix: true })}
                    </div>
                  </div>
                ))}
                {!intents && (
                  <div className="px-5 py-10 text-center text-white/20 text-xs font-mono">AWAITING_STREAM...</div>
                )}
              </div>
            </div>
          </WalletGate>
        </section>
      </div>
      </div>
    </Layout>
  );
}
