import { Layout } from "@/components/layout";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the ZHAD0 Protocol interface ("Interface") at zhad0.network, connecting a wallet, or interacting with ZHAD0 smart contracts deployed on Base L2 (Chain ID: 8453), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you must not use the Interface.\n\nZHAD0 Protocol is a decentralized protocol. The Interface is a non-custodial frontend for interacting with protocol smart contracts. ZHAD0 Labs does not custody your assets, control protocol execution, or act as a fiduciary.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years old and legally permitted to use blockchain-based financial applications in your jurisdiction. You represent that you are not located in, or a national or resident of, any jurisdiction subject to comprehensive US, EU, or UN sanctions.\n\nYou are solely responsible for determining whether your use of ZHAD0 complies with applicable laws in your jurisdiction.`,
  },
  {
    title: "3. Non-Custodial Nature",
    content: `ZHAD0 is a non-custodial protocol. We do not hold, control, or take custody of your digital assets at any time. All transactions are executed by smart contracts on Base L2. You are solely responsible for the security of your private keys and wallet.\n\nLoss of your private key means permanent loss of access to your staked assets. ZHAD0 Labs cannot recover lost keys or reverse transactions.`,
  },
  {
    title: "4. Protocol Risks",
    content: `Interacting with ZHAD0 involves significant risks including:\n\n• SMART CONTRACT RISK — Bugs or vulnerabilities in smart contracts may result in loss of funds, even after audit.\n• SLASHING RISK — Ghost Relayer operators may have staked ZHAD0 slashed for protocol violations.\n• MARKET RISK — The value of $ZHAD0 tokens may decline to zero.\n• REGULATORY RISK — Regulatory changes may restrict protocol use or token transferability.\n• ZK PROOF RISK — Bugs in the ZK circuit may affect intent validity guarantees.\n\nYou acknowledge these risks and use the protocol at your own risk.`,
  },
  {
    title: "5. Prohibited Activities",
    content: `You agree not to use ZHAD0 for:\n\n• Money laundering, terrorist financing, or sanctions evasion\n• Exploiting bugs or vulnerabilities (use our responsible disclosure program instead)\n• Manipulating governance outcomes through vote buying\n• Any activity that violates applicable law\n\nViolation of these prohibitions may result in on-chain enforcement (slashing) and may be reported to relevant authorities.`,
  },
  {
    title: "6. Intellectual Property",
    content: `ZHAD0 protocol contracts and core tooling are open-source under the MIT License. The ZHAD0 brand, logos, and Interface design are proprietary. You may not use ZHAD0 brand assets without written permission.\n\nContributions to the open-source repositories are governed by the contributor license agreement in the respective repositories.`,
  },
  {
    title: "7. Disclaimer of Warranties",
    content: `THE INTERFACE AND PROTOCOL ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. ZHAD0 LABS EXPRESSLY DISCLAIMS ALL WARRANTIES INCLUDING FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY OF INFORMATION.\n\nWE DO NOT WARRANT THAT THE INTERFACE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZHAD0 LABS AND ITS CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF FUNDS, DATA, OR PROFITS, ARISING FROM YOUR USE OF THE PROTOCOL.\n\nIN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED USD $100.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms are governed by the laws of the Cayman Islands, without regard to conflict-of-law principles. Any disputes shall be resolved by binding arbitration under JAMS rules, conducted in English.`,
  },
  {
    title: "10. Amendments",
    content: `We may amend these Terms at any time. Material changes will be announced via governance forum and our social channels. Continued use of the Interface after changes constitutes acceptance. For questions: legal@zhad0.network`,
  },
];

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-16" style={{ backgroundColor: "#080808" }}>
        <header className="mb-14 border-b border-white/5 pb-10">
          <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-4">LEGAL</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">Terms of Service</h1>
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
