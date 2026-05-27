# ZHAD0 Protocol — Web App

[![Status](https://img.shields.io/badge/status-live-00d26a.svg)](https://zhad0.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built on Base](https://img.shields.io/badge/chain-Base%20L2-0052ff.svg)](https://base.org)

> Zero-knowledge privacy middleware for autonomous AI agents on Base L2.
> Encrypt agent intents off-chain, prove validity with RISC Zero, relay through
> the decentralised Ghost network. Nobody on Base can trace your agent.

**Live site:** [zhad0.io](https://zhad0.io)

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing — protocol overview, live stats, intent feed |
| `/network` | Network monitor — active relayers, ZK proof throughput |
| `/relayer` | Relayer operator guide — stake, register, earn fees |
| `/token` | ZHAD0 token economics |
| `/sdk` | SDK documentation and interactive demo |
| `/docs` | Developer integration guide |
| `/whitepaper` | Technical whitepaper |
| `/governance` | DAO governance |
| `/faq` | Frequently asked questions |

---

## Stack

- **React 18** + **Vite 6** + **TypeScript** strict
- **Tailwind CSS v4** + **shadcn/ui** component library
- **Framer Motion** for animations
- **Wagmi v3** + **Reown AppKit** for wallet connections
- **TanStack Query v5** for API data fetching
- **Wouter** for client-side routing
- **`@zhad0/sdk`** for client-side intent encryption

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/zhad0/zhad0-app.git
cd zhad0-app

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
# Add your Reown project ID (https://cloud.reown.com)

# 4. Run dev server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_REOWN_PROJECT_ID` | Yes | WalletConnect/Reown project ID for wallet modal |
| `PORT` | No | Dev server port (default: 3000) |

---

## API Integration

The app fetches live protocol data from the ZHAD0 API server.
API hooks live in `src/lib/api-client/` and are generated from the
[OpenAPI spec](https://github.com/zhad0/zhad0-api) (separate repo).

---

## SDK Integration

Client-side intent encryption uses `@zhad0/sdk`:

```ts
import { Zhad0Client } from "@zhad0/sdk";

const client = new Zhad0Client();
const receipt = await client.submitIntent({
  action: "SWAP",
  tokenIn: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  tokenOut: "0x4200000000000000000000000000000000000006",
  amountIn: "1000000000",
});
```

> **Design Preview:** ZK proofs and Ghost Relay submission are simulated
> until the mainnet Ghost Relay network is live. Client-side AES-256-GCM
> encryption is real. See [`@zhad0/sdk`](https://github.com/zhad0/zhad0-sdk)
> for full capability details.

---

## Project Structure

```
src/
  components/       Shared UI components (layout, wallet, SDK demo)
    ui/             shadcn/ui primitives
  hooks/            Custom React hooks
  lib/
    api-client/     Generated API hooks (TanStack Query)
    wagmi.ts        Wallet/Web3 configuration
  pages/            One file per route
  index.css         Global styles + Tailwind
  App.tsx           Router + providers
  main.tsx          Entry point
```

---

## Related Repos

| Repo | Description |
|---|---|
| [`zhad0/zhad0-sdk`](https://github.com/zhad0/zhad0-sdk) | TypeScript SDK + CLI |

---

## License

MIT — see [LICENSE](LICENSE)

Website: [zhad0.io](https://zhad0.io)
