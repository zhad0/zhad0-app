import { useState } from "react";
import { motion } from "framer-motion";
import { Zhad0Client, type SubmitReceipt } from "@zhad0/sdk";
import { ScrambleText } from "@/components/scramble-text";

const DEFAULT_INTENT = `{
  "action": "SWAP",
  "tokenIn": "0xUSDC",
  "tokenOut": "0xWETH",
  "amountIn": "1000000",
  "nonce": 42
}`;

function shorten(hex: string, head = 10, tail = 6): string {
  if (hex.length <= head + tail + 3) return hex;
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`;
}

export function SdkDemo() {
  const [input, setInput] = useState(DEFAULT_INTENT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<SubmitReceipt | null>(null);
  const [ciphertext, setCiphertext] = useState<string | null>(null);
  const [iv, setIv] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const parsed = JSON.parse(input);
      const client = new Zhad0Client({ relayerMode: "simulated" });
      const encrypted = await client.encryptIntent(parsed);
      setCiphertext(encrypted.ciphertext);
      setIv(encrypted.iv);
      setFingerprint(encrypted.keyFingerprint);
      const r = await client.submitIntent(parsed);
      setReceipt(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setReceipt(null);
      setCiphertext(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="border border-white/8 relative overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-mono tracking-widest text-white/30">
            SDK_PLAYGROUND
          </div>
          <span className="text-[9px] font-mono tracking-widest text-yellow-400/80 border border-yellow-400/30 px-1.5 py-0.5 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
            DESIGN_PREVIEW
          </span>
        </div>
        <div className="text-[9px] font-mono tracking-widest text-white/25">
          @zhad0/sdk
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <div className="text-[9px] font-mono tracking-widest text-white/30 mb-2">
            INTENT_PAYLOAD (JSON)
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="w-full h-32 bg-black/60 border border-white/10 text-xs font-mono text-white/80 p-3 outline-none focus:border-primary/40 resize-none"
            data-testid="input-sdk-demo-intent"
          />
        </div>

        <button
          onClick={run}
          disabled={busy}
          className="w-full border border-primary/40 text-primary text-[10px] font-mono tracking-widest px-5 py-3 hover:bg-primary hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="button-sdk-demo-run"
        >
          <ScrambleText>
            {busy ? "ENCRYPTING…" : "ENCRYPT_INTENT + SIMULATE_PROOF"}
          </ScrambleText>
        </button>

        {error && (
          <div className="border border-red-500/30 bg-red-500/5 text-red-300/80 text-xs font-mono p-3">
            ERROR: {error}
          </div>
        )}

        {(ciphertext || receipt) && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            {ciphertext && (
              <div>
                <div className="text-[9px] font-mono tracking-widest text-primary/70 mb-1">
                  AES-256-GCM CIPHERTEXT
                </div>
                <div
                  className="text-[10px] font-mono text-white/60 bg-black/60 border border-white/5 p-2 break-all"
                  data-testid="text-sdk-demo-ciphertext"
                >
                  {ciphertext}
                </div>
                <div className="flex gap-4 mt-1 text-[9px] font-mono text-white/30">
                  <span>IV: {iv && shorten(iv, 6, 4)}</span>
                  <span>KEY_FP: {fingerprint}</span>
                </div>
              </div>
            )}

            {receipt && (
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                <div className="border border-white/5 p-2">
                  <div className="text-white/30 mb-0.5">INTENT_HASH</div>
                  <div className="text-primary/80">
                    {shorten(receipt.intentHash)}
                  </div>
                </div>
                <div className="border border-white/5 p-2">
                  <div className="text-white/30 mb-0.5">PROOF_HASH (SIM)</div>
                  <div className="text-yellow-400/70">
                    {shorten(receipt.proof.proofHash)}
                  </div>
                </div>
                <div className="border border-white/5 p-2">
                  <div className="text-white/30 mb-0.5">RELAY_LATENCY</div>
                  <div className="text-white/70">{receipt.relayMs}ms</div>
                </div>
                <div className="border border-white/5 p-2">
                  <div className="text-white/30 mb-0.5">TX_HASH</div>
                  <div className="text-white/30">null · no relay yet</div>
                </div>
              </div>
            )}

            <div className="text-[9px] font-mono text-yellow-400/60 leading-relaxed border-l-2 border-yellow-400/30 pl-3">
              Encryption is real (Web Crypto AES-256-GCM, key generated in your
              browser). The ZK proof is a SHA-256 stand-in until the on-chain
              verifier and Ghost Relay are deployed. No network call is made.
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/5 text-[9px] font-mono tracking-widest text-white/25">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
          CLIENT_SIDE_ONLY
        </div>
        <div>MAINNET_NOT_YET_LIVE</div>
      </div>
    </motion.div>
  );
}
