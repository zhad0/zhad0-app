import { Layout } from "@/components/layout";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { ScrambleText } from "@/components/scramble-text";
import { useState } from "react";
import { parseUnits, formatUnits } from "viem";
import {
  Terminal, ShieldAlert, Cpu, HardDrive, ArrowRight, Wifi, TrendingUp,
  Wallet, CheckCircle, Clock, AlertTriangle, Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  CONTRACT_ADDRESSES,
  CONTRACTS_DEPLOYED,
  ZHAD0TOKEN_ABI,
  RELAY_REGISTRY_ABI,
} from "@/lib/contracts";

// ── Constants ──────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "CLONE_AND_INSTALL",
    desc: "Pull the relayer repository and install dependencies.",
    code: `git clone https://github.com/zhad0-protocol/zhad0-monorepo
cd zhad0-monorepo/apps/relayer
pnpm install`,
  },
  {
    num: "02",
    title: "CONFIGURE",
    desc: "Copy the example environment file and fill in your RPC URL and private key.",
    code: `cp .env.example .env
# Edit .env:
# RPC_URL=https://mainnet.base.org
# PRIVATE_KEY=0x...
# RELAYER_NAME=your-node-name`,
  },
  {
    num: "03",
    title: "RUN_LOCALLY",
    desc: "Verify the node is operating correctly before staking.",
    code: `pnpm dev
# Test: curl http://localhost:8080/health
# Expected: {"status":"ok"}`,
  },
  {
    num: "04",
    title: "DEPLOY_TO_RAILWAY",
    desc: "Push to Railway for a persistent, production-grade deployment.",
    code: `npm i -g @railway/cli
railway login
railway init
railway up`,
  },
  {
    num: "05",
    title: "REGISTER_ON_CHAIN",
    desc: "Stake $ZHAD0 and register your node using the STAKE tab, or via CLI.",
    code: `zhad0-relayer register \\
  --stake 10000 \\
  --payout-address 0xYourPayoutAddress`,
  },
];

const FEE_SPLITS = [
  { label: "RELAYER_SHARE", pct: 60, color: "bg-primary" },
  { label: "STAKERS_POOL", pct: 20, color: "bg-fuchsia-700" },
  { label: "TREASURY", pct: 20, color: "bg-white/20" },
];

const REQS = [
  { icon: Cpu,        label: "COMPUTE",   value: "2 vCPU / 4GB RAM" },
  { icon: HardDrive,  label: "STORAGE",   value: "40GB SSD" },
  { icon: Wifi,       label: "LATENCY",   value: "<100ms global" },
  { icon: ShieldAlert,label: "MIN_STAKE", value: "10,000 $ZHAD0" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function StepCode({ code }: { code: string }) {
  return (
    <div className="border border-white/5 relative" style={{ background: "#0c0c0c" }}>
      <div className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-mono text-white/20 border-b border-l border-white/5">
        BASH
      </div>
      <pre className="text-xs font-mono p-5 pt-8 overflow-x-auto text-primary/70 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Stake Tab — on-chain staking UI ───────────────────────────────────────────
function StakeTab() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const [stakeInput, setStakeInput] = useState("10000");
  const [nodeName, setNodeName]     = useState("");
  const [step, setStep]             = useState<"idle" | "approve" | "register" | "done">("idle");

  const stakeWei = (() => {
    try { return parseUnits(stakeInput || "0", 18); } catch { return 0n; }
  })();

  // ── Contract reads ──────────────────────────────────────────────────────────
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESSES.ZHAD0Token,
    abi: ZHAD0TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });

  const { data: allowance } = useReadContract({
    address: CONTRACT_ADDRESSES.ZHAD0Token,
    abi: ZHAD0TOKEN_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESSES.RelayRegistry] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });

  const { data: operatorData } = useReadContract({
    address: CONTRACT_ADDRESSES.RelayRegistry,
    abi: RELAY_REGISTRY_ABI,
    functionName: "operators",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });

  const { data: minStake } = useReadContract({
    address: CONTRACT_ADDRESSES.RelayRegistry,
    abi: RELAY_REGISTRY_ABI,
    functionName: "minStake",
    query: { enabled: CONTRACTS_DEPLOYED },
  });

  // ── Contract writes ─────────────────────────────────────────────────────────
  const { writeContract: approve, data: approveTxHash } = useWriteContract();
  const { writeContract: register, data: registerTxHash } = useWriteContract();
  const { writeContract: requestUnstake } = useWriteContract();

  const { isLoading: approveLoading, isSuccess: approveSuccess } =
    useWaitForTransactionReceipt({ hash: approveTxHash });
  const { isLoading: registerLoading, isSuccess: registerSuccess } =
    useWaitForTransactionReceipt({ hash: registerTxHash });

  // Derive state
  const operatorActive   = operatorData ? operatorData[2] : false;
  const currentStake     = operatorData ? operatorData[0] : 0n;
  const unstakeRequestAt = operatorData ? operatorData[1] : 0n;
  const hasAllowance     = (allowance ?? 0n) >= stakeWei;
  const balanceFormatted = balance ? Number(formatUnits(balance, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—";
  const stakeFormatted   = Number(formatUnits(currentStake, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 });
  const minStakeFormatted = minStake ? Number(formatUnits(minStake, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "10,000";

  function handleApprove() {
    if (!CONTRACTS_DEPLOYED) return;
    setStep("approve");
    approve({
      address: CONTRACT_ADDRESSES.ZHAD0Token,
      abi: ZHAD0TOKEN_ABI,
      functionName: "approve",
      args: [CONTRACT_ADDRESSES.RelayRegistry, stakeWei],
    });
  }

  function handleRegister() {
    if (!CONTRACTS_DEPLOYED) return;
    setStep("register");
    register({
      address: CONTRACT_ADDRESSES.RelayRegistry,
      abi: RELAY_REGISTRY_ABI,
      functionName: "register",
      args: [stakeWei, nodeName || "unnamed-relay"],
    });
  }

  function handleRequestUnstake() {
    if (!CONTRACTS_DEPLOYED) return;
    requestUnstake({
      address: CONTRACT_ADDRESSES.RelayRegistry,
      abi: RELAY_REGISTRY_ABI,
      functionName: "requestUnstake",
      args: [],
    });
  }

  // ── Not connected ───────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div
        className="border border-primary/20 p-10 flex flex-col items-center gap-6 text-center"
        style={{ background: "#0a040a" }}
      >
        <Wallet className="w-8 h-8 text-primary/40" />
        <div>
          <div className="text-[10px] font-mono tracking-[0.3em] text-primary mb-1">CONNECT WALLET TO STAKE</div>
          <p className="text-xs font-mono text-white/25 max-w-xs leading-relaxed mt-2">
            Connect your Base wallet to stake $ZHAD0 and register as a Ghost Relay operator.
          </p>
        </div>
        <button
          onClick={() => open()}
          className="flex items-center gap-2 bg-primary text-black px-6 py-3 text-[10px] font-mono font-bold tracking-widest hover:bg-primary/90 transition-all"
        >
          <ScrambleText>CONNECT_WALLET</ScrambleText>
        </button>
      </div>
    );
  }

  // ── Contract not yet deployed ───────────────────────────────────────────────
  if (!CONTRACTS_DEPLOYED) {
    return (
      <div className="space-y-4">
        {/* Pre-deploy banner */}
        <div className="border border-yellow-400/20 px-5 py-4 flex items-start gap-3" style={{ background: "#0f0b00" }}>
          <AlertTriangle className="w-4 h-4 text-yellow-400/70 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] font-mono tracking-widest text-yellow-400/80 mb-1">CONTRACT_NOT_YET_DEPLOYED</div>
            <p className="text-xs font-mono text-white/30 leading-relaxed">
              Contracts are being audited and will be deployed to Base mainnet at launch.
              This interface is ready — no changes needed after deployment.
            </p>
          </div>
        </div>

        {/* Wallet connected display */}
        <div className="border border-primary/10 px-4 py-3 flex items-center gap-3" style={{ background: "#0a040a" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
          <span className="text-[10px] font-mono text-white/40 tracking-widest">CONNECTED:</span>
          <span className="text-[10px] font-mono text-primary ml-auto">{address?.slice(0,6)}...{address?.slice(-4)}</span>
        </div>

        {/* Form preview (disabled) */}
        <div className="border border-white/5 p-6 space-y-5 opacity-50 pointer-events-none" style={{ background: "#0c0c0c" }}>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/30 mb-2">NODE_NAME</label>
            <input
              disabled
              placeholder="my-ghost-relay"
              className="w-full bg-black border border-white/10 p-3 text-white/30 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-white/30 mb-2">
              STAKE_AMOUNT (MIN: {minStakeFormatted} $ZHAD0)
            </label>
            <input
              disabled
              defaultValue="10000"
              className="w-full bg-black border border-white/10 p-3 text-white/30 text-sm font-mono"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/5 py-4 text-center text-[10px] font-mono text-white/20 tracking-widest">
              1. APPROVE $ZHAD0
            </div>
            <div className="flex-1 bg-white/5 py-4 text-center text-[10px] font-mono text-white/20 tracking-widest">
              2. REGISTER NODE
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Already a registered operator ──────────────────────────────────────────
  if (operatorActive || registerSuccess) {
    return (
      <div className="space-y-4">
        <div className="border border-primary/20 px-5 py-4 flex items-center gap-3" style={{ background: "#0a040a" }}>
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <div>
            <div className="text-[10px] font-mono tracking-widest text-primary mb-1">NODE_REGISTERED</div>
            <p className="text-xs font-mono text-white/30">Your node is active on Base mainnet.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/5">
          <div className="bg-[#080808] p-5 font-mono">
            <div className="text-[10px] tracking-widest text-white/25 mb-2">YOUR_STAKE</div>
            <div className="text-xl font-bold text-primary">{stakeFormatted} ZHAD0</div>
          </div>
          <div className="bg-[#080808] p-5 font-mono">
            <div className="text-[10px] tracking-widest text-white/25 mb-2">STATUS</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">ACTIVE</span>
            </div>
          </div>
        </div>
        {unstakeRequestAt === 0n && (
          <button
            onClick={handleRequestUnstake}
            className="w-full border border-white/10 text-white/30 text-[10px] font-mono tracking-widest py-3 hover:border-red-400/30 hover:text-red-400/60 transition-all"
          >
            REQUEST UNSTAKE (7-DAY LOCK)
          </button>
        )}
        {unstakeRequestAt > 0n && (
          <div className="border border-yellow-400/20 px-4 py-3 flex items-center gap-3" style={{ background: "#0f0b00" }}>
            <Clock className="w-3.5 h-3.5 text-yellow-400/70" />
            <span className="text-[10px] font-mono text-yellow-400/70 tracking-widest">UNSTAKE_PENDING — 7-day lock active</span>
          </div>
        )}
      </div>
    );
  }

  // ── Registration flow ───────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="border border-primary/10 px-4 py-3 flex items-center justify-between" style={{ background: "#0a040a" }}>
        <span className="text-[10px] font-mono text-white/30 tracking-widest">BALANCE</span>
        <span className="text-[10px] font-mono text-primary">{balanceFormatted} ZHAD0</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-white/30 mb-2">NODE_NAME</label>
          <input
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="my-ghost-relay"
            className="w-full bg-black border border-white/10 p-3 text-white text-sm font-mono focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono tracking-widest text-white/30 mb-2">
            STAKE_AMOUNT (MIN: {minStakeFormatted})
          </label>
          <input
            type="number"
            value={stakeInput}
            onChange={(e) => setStakeInput(e.target.value)}
            min="10000"
            step="1000"
            className="w-full bg-black border border-white/10 p-3 text-white text-sm font-mono focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
      </div>

      {/* Two-step: Approve then Register */}
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={hasAllowance || approveLoading}
          className={`flex-1 py-4 text-[10px] font-mono tracking-widest transition-all flex items-center justify-center gap-2 ${
            hasAllowance || approveSuccess
              ? "border border-primary/20 text-primary/40 cursor-default"
              : "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20"
          }`}
          data-testid="btn-approve-zhad0"
        >
          {approveLoading ? (
            <><Clock className="w-3 h-3 animate-spin" /> APPROVING...</>
          ) : hasAllowance || approveSuccess ? (
            <><CheckCircle className="w-3 h-3" /> APPROVED</>
          ) : (
            "1. APPROVE $ZHAD0"
          )}
        </button>
        <button
          onClick={handleRegister}
          disabled={!hasAllowance || registerLoading || !nodeName.trim()}
          className={`flex-1 py-4 text-[10px] font-mono tracking-widest transition-all flex items-center justify-center gap-2 ${
            !hasAllowance
              ? "border border-white/5 text-white/15 cursor-not-allowed"
              : "bg-primary text-black font-bold hover:bg-primary/90"
          }`}
          data-testid="btn-register-node"
        >
          {registerLoading ? (
            <><Clock className="w-3 h-3 animate-spin" /> REGISTERING...</>
          ) : (
            <>2. REGISTER NODE <ArrowRight className="w-3 h-3" /></>
          )}
        </button>
      </div>
      <p className="text-[10px] font-mono text-white/20 leading-relaxed">
        Step 1 approves $ZHAD0 spend. Step 2 stakes and registers on Base (chain ID 8453).
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Relayer() {
  const [stakeAmount, setStakeAmount] = useState<number>(10000);
  const [tab, setTab]                 = useState<"setup" | "stake">("setup");
  const yearlyZhad0  = stakeAmount * 0.20;
  const monthlyZhad0 = yearlyZhad0 / 12;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16" style={{ backgroundColor: "#080808" }}>

        {/* Header */}
        <header className="mb-14 border-b border-white/5 pb-10">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">BECOME_INFRASTRUCTURE</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Run_a_Ghost_Node</h1>
          <p className="text-white/35 font-mono text-sm max-w-xl leading-relaxed">
            Ghost Relayers are the backbone of ZHAD0. Stake $ZHAD0, process encrypted intents, submit proofs to Base — you never see what's inside. You just earn.
          </p>
        </header>

        {/* System requirements */}
        <section className="mb-14">
          <div className="text-[10px] font-mono tracking-widest text-primary/60 mb-6">SYSTEM_REQUIREMENTS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {REQS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#080808] p-6 font-mono group hover:bg-[#0f0a0d] transition-colors">
                <Icon className="w-4 h-4 text-white/20 mb-4 group-hover:text-primary transition-colors" />
                <div className="text-[10px] tracking-widest text-white/25 mb-2">{label}</div>
                <div className="text-sm text-white/70">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left — tabbed content */}
          <div className="lg:col-span-2">

            {/* Tabs */}
            <div className="flex border-b border-white/5 mb-8">
              {([
                { id: "setup", label: "SETUP_GUIDE", icon: Terminal },
                { id: "stake", label: "STAKE_&_REGISTER", icon: Layers },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-5 py-3 text-[10px] font-mono tracking-widest border-b-2 -mb-px transition-colors ${
                    tab === id
                      ? "text-primary border-primary"
                      : "text-white/25 border-transparent hover:text-white/50"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* Setup tab */}
            {tab === "setup" && (
              <div className="space-y-8">
                {STEPS.map((s) => (
                  <motion.div
                    key={s.num}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-10 h-10 border border-primary/20 flex items-center justify-center group-hover:border-primary/60 transition-colors">
                        <span className="text-[10px] font-mono text-primary/60">{s.num}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono tracking-widest text-primary mb-2">{s.title}</div>
                        <p className="text-white/40 font-mono text-xs mb-4 leading-relaxed">{s.desc}</p>
                        <StepCode code={s.code} />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Monitoring */}
                <div className="border border-white/5 p-6" style={{ background: "#0c0c0c" }}>
                  <div className="text-[10px] font-mono tracking-widest text-white/30 mb-5">MONITORING_ENDPOINTS</div>
                  <div className="space-y-2 font-mono text-xs">
                    {[
                      { endpoint: "/health",  desc: "Server status" },
                      { endpoint: "/info",    desc: "Operator address, stake, uptime" },
                      { endpoint: "/metrics", desc: "Prometheus-compatible metrics" },
                    ].map(({ endpoint, desc }) => (
                      <div key={endpoint} className="flex items-center gap-4 py-2.5 border-b border-white/5">
                        <span className="text-primary w-24 flex-shrink-0">{endpoint}</span>
                        <span className="text-white/30">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stake tab */}
            {tab === "stake" && (
              <motion.div
                key="stake"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StakeTab />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Yield calculator */}
            <div className="border border-primary/20 p-6 sticky top-20" style={{ background: "#0a040a" }}>
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary/10">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-mono tracking-widest text-primary">YIELD_CALCULATOR</span>
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-mono tracking-widest text-white/30 mb-2">STAKE_AMOUNT ($ZHAD0)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(10000, Number(e.target.value)))}
                  className="w-full bg-black border border-white/10 p-3 text-white text-sm font-mono focus:outline-none focus:border-primary transition-colors"
                  min="10000"
                  step="1000"
                  data-testid="input-stake"
                />
                <div className="text-[10px] font-mono text-white/20 mt-1.5 text-right">MIN: 10,000</div>
              </div>

              <div className="space-y-3 mb-6 font-mono">
                {[
                  { label: "EST_APR", value: "15–25%" },
                  { label: "MONTHLY", value: `${monthlyZhad0.toLocaleString(undefined, { maximumFractionDigits: 0 })} ZHAD0`, accent: true },
                  { label: "YEARLY",  value: `${yearlyZhad0.toLocaleString(undefined, { maximumFractionDigits: 0 })} ZHAD0`, accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} className="flex justify-between text-xs py-2.5 border-b border-white/5">
                    <span className="text-white/30 tracking-widest">{label}</span>
                    <span className={accent ? "text-primary font-bold" : "text-white"}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono tracking-widest text-white/25 mb-3">FEE_DISTRIBUTION</div>
              <div className="flex h-1.5 rounded-full overflow-hidden mb-3">
                {FEE_SPLITS.map((s) => (
                  <div key={s.label} className={s.color} style={{ width: `${s.pct}%` }} />
                ))}
              </div>
              <div className="space-y-1.5">
                {FEE_SPLITS.map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                      <span className="text-white/30">{s.label}</span>
                    </div>
                    <span className="text-white/50">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk factors */}
            <div className="border border-white/5 p-6 font-mono text-xs" style={{ background: "#0c0c0c" }}>
              <div className="text-[10px] tracking-widest text-white/20 mb-4">RISK_FACTORS</div>
              <div className="space-y-2.5 text-white/30">
                {[
                  "Stake slashing: 10% per violation",
                  "Downtime = lost relay revenue",
                  "Private key compromise = stake theft",
                  "Network attacks mitigated by threshold relay",
                ].map((r) => (
                  <div key={r} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-white/15 mt-1.5 flex-shrink-0" />
                    {r}
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
