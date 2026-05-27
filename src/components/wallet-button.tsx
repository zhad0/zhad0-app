import { useAccount, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useState } from "react";
import { Wallet, ChevronDown, LogOut, Copy, Check } from "lucide-react";
import { ScrambleText } from "./scramble-text";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  function copyAddress() {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 border border-primary/40 text-primary text-[10px] font-mono tracking-widest px-3 py-2 hover:bg-primary/10 transition-all"
          data-testid="btn-wallet-connected"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {shortAddr}
          <ChevronDown className="w-3 h-3" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div
              className="absolute right-0 top-full mt-1 w-52 border border-white/10 z-50 font-mono text-xs"
              style={{ background: "#0c0c0c" }}
            >
              <div className="px-4 py-3 border-b border-white/5 text-white/30 text-[10px] tracking-widest">
                BASE MAINNET
              </div>
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-2 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                data-testid="btn-copy-address"
              >
                {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy address"}
              </button>
              <button
                onClick={() => { open({ view: "Account" }); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                data-testid="btn-wallet-details"
              >
                <Wallet className="w-3 h-3 text-primary" />
                Wallet details
              </button>
              <button
                onClick={() => { disconnect(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-400/70 hover:text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
                data-testid="btn-disconnect"
              >
                <LogOut className="w-3 h-3" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="flex items-center gap-2 border border-primary/40 text-primary text-[10px] font-mono tracking-widest px-3 py-2 hover:bg-primary hover:text-black transition-all"
      data-testid="btn-connect-wallet"
    >
      <Wallet className="w-3 h-3" />
      <ScrambleText>CONNECT_WALLET</ScrambleText>
    </button>
  );
}
