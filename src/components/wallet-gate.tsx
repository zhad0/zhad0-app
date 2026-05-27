import { useAccount } from "wagmi";
import { Wallet, Lock } from "lucide-react";
import { WalletButton } from "./wallet-button";

interface WalletGateProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
}

export function WalletGate({ children, label = "CONNECT WALLET TO ACCESS", description }: WalletGateProps) {
  const { isConnected } = useAccount();

  if (isConnected) return <>{children}</>;

  return (
    <div className="relative" data-testid="wallet-gate">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-[3px] opacity-30 overflow-hidden max-h-[420px]">
        {children}
      </div>

      {/* Gate overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div
          className="border border-primary/30 px-8 py-8 flex flex-col items-center gap-5 text-center max-w-xs"
          style={{ background: "rgba(8,8,8,0.92)", backdropFilter: "blur(12px)" }}
        >
          <div className="w-12 h-12 border border-primary/30 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-primary mb-1">{label}</div>
            {description && (
              <p className="text-[11px] font-mono text-white/30 leading-relaxed mt-2">{description}</p>
            )}
          </div>
          <WalletButton />
        </div>
      </div>
    </div>
  );
}

export function WalletGateInline({ children, label = "Wallet required" }: { children?: React.ReactNode; label?: string }) {
  const { isConnected } = useAccount();
  if (isConnected) return children ? <>{children}</> : null;

  return (
    <div
      className="border border-white/5 p-6 flex flex-col sm:flex-row items-center gap-4"
      style={{ background: "#0c0c0c" }}
      data-testid="wallet-gate-inline"
    >
      <Wallet className="w-4 h-4 text-primary flex-shrink-0" />
      <span className="text-xs font-mono text-white/40 tracking-widest">{label}</span>
      <div className="sm:ml-auto">
        <WalletButton />
      </div>
    </div>
  );
}
