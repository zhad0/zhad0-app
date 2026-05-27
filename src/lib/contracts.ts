/// Central config for all ZHAD0 on-chain contracts.
/// After deploying to Base, replace the placeholder addresses here.
/// The UI will automatically pick up the real addresses.

export const CONTRACT_ADDRESSES = {
  /// ERC-20 + ERC20Votes token — 1B supply
  ZHAD0Token:    "0x0000000000000000000000000000000000000001" as `0x${string}`,
  /// Ghost Relay staking + registration registry
  RelayRegistry: "0x0000000000000000000000000000000000000002" as `0x${string}`,
  /// DAO Governor (OpenZeppelin Governor + Timelock)
  ZHADGovernor:  "0x0000000000000000000000000000000000000003" as `0x${string}`,
  /// 48-hour timelock for executed proposals
  Timelock:      "0x0000000000000000000000000000000000000004" as `0x${string}`,
} as const;

/// Set to false once real contracts are deployed.
/// The UI uses this to show "testnet / mock" banners.
export const CONTRACTS_DEPLOYED = false;

// ── ABIs (minimal — only functions used by the UI) ────────────────────────────

export const ZHAD0TOKEN_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getVotes",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "delegate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "delegatee", type: "address" }],
    outputs: [],
  },
] as const;

export const RELAY_REGISTRY_ABI = [
  {
    name: "register",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "name", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "addStake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "requestUnstake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "unstake",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "operators",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "staked", type: "uint256" },
      { name: "unstakeRequestAt", type: "uint256" },
      { name: "active", type: "bool" },
      { name: "name", type: "string" },
    ],
  },
  {
    name: "getStake",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "op", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "isActive",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "op", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "minStake",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getOperatorCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const GOVERNOR_ABI = [
  {
    name: "castVote",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "support", type: "uint8" },  // 0=against, 1=for, 2=abstain
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "propose",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "targets", type: "address[]" },
      { name: "values", type: "uint256[]" },
      { name: "calldatas", type: "bytes[]" },
      { name: "description", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getVotes",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
      { name: "timepoint", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "hasVoted",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;
