import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";
import { base } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string;

export const wagmiAdapter = new WagmiAdapter({
  networks: [base],
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  projectId,
  metadata: {
    name: "ZHAD0 Protocol",
    description: "ZK-powered privacy layer for AI agents on Base",
    url: "https://zhad0.io",
    icons: ["/logo.png"],
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "hsl(328, 90%, 60%)",
    "--w3m-border-radius-master": "0px",
  },
  features: {
    analytics: false,
    email: false,
    socials: [],
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
export { base };
