import { Layout } from "@/components/layout";

const SECTIONS = [
  {
    title: "1. Introduction",
    content: `ZHAD0 Protocol ("ZHAD0", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our protocol interface at zhad0.network and associated smart contracts deployed on Base L2 (Chain ID: 8453).\n\nBy connecting your wallet or interacting with ZHAD0, you agree to the practices described in this policy. If you disagree, please discontinue use of the interface.`,
  },
  {
    title: "2. Information We Collect",
    content: `On-chain data: Blockchain transactions are public by nature. Any transaction you submit to Base — including staking, governance votes, and relay registrations — is permanently recorded on the blockchain and visible to all.\n\nWallet addresses: When you connect a wallet, we temporarily process your public wallet address to display your balances, voting power, and node status. We do not store wallet addresses server-side beyond the session.\n\nUsage data: We collect anonymized analytics including page views, feature interactions, and error reports. No personally identifiable information is associated with this data.\n\nNo private keys: We never request, collect, or have access to your private keys or seed phrases.`,
  },
  {
    title: "3. How We Use Information",
    content: `We use the information we process to:\n\n• Display protocol statistics, relayer data, and governance proposals\n• Process wallet-connected features (staking, voting, node registration)\n• Improve the interface and detect bugs\n• Comply with legal obligations\n\nWe do not sell, rent, or share your information with third parties for marketing purposes.`,
  },
  {
    title: "4. ZK Privacy Guarantees",
    content: `A core feature of ZHAD0 is that agent intent contents are never revealed to the protocol, its operators, or any third party. Zero-knowledge proofs validate intent integrity without disclosing transaction details. This privacy guarantee is enforced at the cryptographic layer, not by policy.\n\nNote: The ZHAD0 privacy layer applies to agent intents processed through the Ghost Relay network. It does not apply to governance votes or staking transactions, which are recorded on-chain as standard Base transactions.`,
  },
  {
    title: "5. Cookies and Local Storage",
    content: `We use browser localStorage to store your wallet connection preference across sessions. No third-party tracking cookies are used. Our analytics provider uses privacy-first, cookieless tracking that does not create user profiles or cross-site tracking identifiers.`,
  },
  {
    title: "6. Third-Party Services",
    content: `The ZHAD0 interface integrates with:\n\n• Base L2 RPC (Coinbase) — for blockchain data\n• RISC Zero — for ZK proof verification\n• Basescan — linked for transaction exploration\n\nThese services have their own privacy policies. We are not responsible for their data practices.`,
  },
  {
    title: "7. Data Retention",
    content: `Session data (wallet connection state) is cleared when you disconnect or close the browser. Anonymized analytics data is retained for 90 days. On-chain data is permanently recorded by the Base blockchain and is outside our control.`,
  },
  {
    title: "8. Your Rights",
    content: `Depending on your jurisdiction, you may have rights to access, correct, or delete personal data we hold. Since we collect minimal identifiable data, most requests can be fulfilled by disconnecting your wallet and clearing browser storage. For specific requests, contact us at privacy@zhad0.network.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy as the protocol evolves. Material changes will be announced via the ZHAD0 governance forum and our X/Farcaster accounts. Continued use of the interface after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "10. Contact",
    content: `For privacy-related inquiries: privacy@zhad0.network\nProtocol issues: GitHub Issues (github.com/zhad0-protocol)\nGeneral: hello@zhad0.network`,
  },
];

export default function Privacy() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-16" style={{ backgroundColor: "#080808" }}>
        <header className="mb-14 border-b border-white/5 pb-10">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">LEGAL</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">Privacy Policy</h1>
          <div className="flex gap-6 text-[10px] font-mono text-white/25 tracking-widest">
            <span>LAST UPDATED: MAY 2026</span>
            <span>ZHAD0 PROTOCOL</span>
          </div>
        </header>

        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <div className="text-[10px] font-mono tracking-widest text-primary mb-4">{s.title.toUpperCase().replace(/\./g, "").replace(/\s/g, "_")}</div>
              <h2 className="text-base font-mono font-bold text-white/80 mb-4">{s.title}</h2>
              <div className="space-y-3">
                {s.content.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm font-mono text-white/40 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
