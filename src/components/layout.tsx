import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, ExternalLink, ChevronDown } from "lucide-react";
import { WalletButton } from "./wallet-button";
import { SiEthereum, SiX, SiGithub, SiFarcaster, SiNpm } from "react-icons/si";
import { ScrambleText } from "./scramble-text";
import { LogoZ } from "./logo-z";
import logoUrl from "/logo.png";

const NAV_LINKS = [
  { href: "/sdk",        label: "SDK" },
  { href: "/network",    label: "NETWORK" },
  { href: "/relayer",    label: "RUN_NODE" },
  { href: "/governance", label: "GOVERNANCE" },
  { href: "/docs",       label: "DOCS" },
  { href: "/about",      label: "ABOUT" },
];

const FOOTER_COLS = [
  {
    heading: "PROTOCOL",
    links: [
      { label: "Whitepaper",  href: "/whitepaper",  internal: true  },
      { label: "Network",     href: "/network",     internal: true  },
      { label: "Token",       href: "/token",       internal: true  },
      { label: "Governance",  href: "/governance",  internal: true  },
      { label: "About",       href: "/about",       internal: true  },
    ],
  },
  {
    heading: "DEVELOPERS",
    links: [
      { label: "SDK Reference",  href: "/sdk",              internal: true  },
      { label: "API Reference",  href: "/docs#relay-api",   internal: true  },
      { label: "CLI Access",     href: "/docs#cli",         internal: true  },
      { label: "Page Guide",     href: "/docs#overview",    internal: true  },
      { label: "npm Package",    href: "https://npmjs.com/package/@zhad0/sdk", internal: false },
    ],
  },
  {
    heading: "OPERATORS",
    links: [
      { label: "Run a Node",    href: "/relayer",         internal: true  },
      { label: "Telemetry",     href: "/network",         internal: true  },
      { label: "Full Docs",     href: "/docs",            internal: true  },
      { label: "ZK Circuit",    href: "/docs#zk-circuit", internal: true  },
      { label: "Architecture",  href: "/docs#architecture", internal: true },
    ],
  },
  {
    heading: "COMMUNITY",
    links: [
      { label: "Blog",       href: "https://mirror.xyz/zhad0protocol.eth", internal: false },
      { label: "FAQ",        href: "/faq",                               internal: true  },
      { label: "Changelog",  href: "https://docs.zhad0.network/changelog", internal: false },
      { label: "GitHub",     href: "https://github.com/zhad0-protocol",  internal: false },
      { label: "Farcaster",  href: "https://warpcast.com/zhad0",         internal: false },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "Privacy Policy",    href: "/privacy",    internal: true },
      { label: "Terms of Service",  href: "/terms",      internal: true },
      { label: "Cookie Policy",     href: "/cookies",    internal: true },
      { label: "Disclaimer",        href: "/disclaimer", internal: true },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: SiX, href: "https://x.com/zhad0protocol", label: "X / Twitter" },
  { icon: SiGithub, href: "https://github.com/zhad0-protocol", label: "GitHub" },
  { icon: SiFarcaster, href: "https://warpcast.com/zhad0", label: "Farcaster" },
  { icon: SiNpm, href: "https://npmjs.com/package/@zhad0/sdk", label: "npm" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground dark"
      style={{ backgroundColor: "#080808" }}
    >
      {/* ── TOP NAV ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
        style={{ background: "rgba(8,8,8,0.90)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center gap-4">
          {/* Logo — fixed left */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 mr-4 group"
            data-testid="link-home"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src={logoUrl}
              alt="ZHAD0"
              className="w-9 h-9 object-contain logo-animate-nav"
            />
            <span className="font-mono font-bold text-sm tracking-[0.3em] text-white group-hover:text-primary transition-colors">ZHAD0</span>
          </Link>

          {/* Desktop nav — centered absolutely */}
          <nav
            className="hidden lg:flex items-center gap-5 absolute left-1/2 -translate-x-1/2"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-[10px] font-mono tracking-widest whitespace-nowrap transition-colors ${
                  location === href
                    ? "text-primary"
                    : "text-white/30 hover:text-white/70"
                }`}
                data-testid={`nav-${label.toLowerCase().replace("_", "-")}`}
              >
                <ScrambleText>{label}</ScrambleText>
              </Link>
            ))}
          </nav>

          {/* Right: Base badge + wallet — pushed to far right */}
          <div className="hidden lg:flex items-center gap-3 ml-auto flex-shrink-0">
            <div className="flex items-center gap-1.5 border border-white/8 px-2.5 py-1.5 text-[10px] font-mono text-white/30 tracking-widest">
              <SiEthereum className="w-2.5 h-2.5" />
              BASE
            </div>
            <WalletButton />
          </div>

          {/* Mobile: wallet + hamburger */}
          <div className="lg:hidden ml-auto flex items-center gap-2">
            <WalletButton />
            <button
              className="text-white/50 hover:text-white transition-colors p-1"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              data-testid="btn-mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/5" style={{ background: "#080808" }}>
            <nav className="flex flex-col px-5 py-2">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-xs font-mono tracking-widest border-b border-white/5 transition-colors ${
                    location === href ? "text-primary" : "text-white/40 hover:text-white/70"
                  }`}
                  data-testid={`mobile-nav-${label.toLowerCase().replace("_", "-")}`}
                >
                  <ScrambleText>{label}</ScrambleText>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 pt-14">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 pt-14 pb-8" style={{ background: "#060606" }}>
        <div className="max-w-7xl mx-auto px-5">
          {/* Top: brand + columns */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-8 mb-12">
            {/* Brand col */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src={logoUrl} alt="ZHAD0" className="w-9 h-9 object-contain opacity-80" />
                <span className="font-mono font-bold text-sm tracking-[0.3em] text-white">ZHAD0</span>
              </div>
              <p className="text-[11px] font-mono text-white/25 max-w-[220px] leading-relaxed mb-6">
                ZK-powered privacy middleware for AI agents on Base L2. Agent transactions — invisible.
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-8 h-8 border border-white/8 flex items-center justify-center text-white/25 hover:text-primary hover:border-primary/40 transition-all"
                    data-testid={`footer-social-${label.toLowerCase().split(" ")[0]}`}
                  >
                    <Icon className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>

            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <div className="text-[10px] font-mono tracking-widest text-white/20 mb-4">{col.heading}</div>
                <ul className="space-y-2.5">
                  {col.links.map(({ label, href, internal }) => (
                    <li key={label}>
                      {internal ? (
                        <Link
                          href={href}
                          className="text-[11px] font-mono text-white/35 hover:text-white/70 transition-colors"
                        >
                          {label}
                        </Link>
                      ) : (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-white/35 hover:text-white/70 transition-colors inline-flex items-center gap-1"
                        >
                          {label}
                          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-[10px] font-mono text-white/15 tracking-widest">
              © {new Date().getFullYear()} ZHAD0 Protocol. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-white/15 tracking-widest">
              <span className="flex items-center gap-1.5">
                <SiEthereum className="w-2.5 h-2.5" />
                BASE L2
              </span>
              <span>CHAIN ID: 8453</span>
              <span>RISC ZERO</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
