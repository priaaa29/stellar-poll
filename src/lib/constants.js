// ═══════════════════════════════════════════════════════════════
// Network Configuration
// ═══════════════════════════════════════════════════════════════
export const TESTNET_RPC_URL = "https://soroban-testnet.stellar.org";
export const TESTNET_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const HORIZON_TESTNET_URL = "https://horizon-testnet.stellar.org";
export const FRIENDBOT_URL = "https://friendbot.stellar.org";

// ⚠️ Replace this after deploying your contract (Step 8)
export const CONTRACT_ID = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

// ═══════════════════════════════════════════════════════════════
// Poll Configuration
// ═══════════════════════════════════════════════════════════════
export const POLL_QUESTION = "Which blockchain has the best developer experience?";
export const POLL_OPTIONS = ["Stellar", "Ethereum", "Solana", "Polkadot"];

// ═══════════════════════════════════════════════════════════════
// Transaction Status
// ═══════════════════════════════════════════════════════════════
export const TX_STATUS = {
  IDLE: "idle",
  PREPARING: "preparing",
  SIGNING: "signing",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  FAILED: "failed",
};

// ═══════════════════════════════════════════════════════════════
// Supported Wallets (StellarWalletsKit compatible)
// ═══════════════════════════════════════════════════════════════
export const SUPPORTED_WALLETS = [
  {
    id: "freighter",
    name: "Freighter",
    icon: "🦊",
    color: "#7B61FF",
    description: "Browser extension wallet",
  },
  {
    id: "xbull",
    name: "xBull",
    icon: "🐂",
    color: "#00B4D8",
    description: "Web & mobile wallet",
  },
  {
    id: "albedo",
    name: "Albedo",
    icon: "🌟",
    color: "#F4A261",
    description: "Web-based signer",
  },
  {
    id: "rabet",
    name: "Rabet",
    icon: "🐰",
    color: "#E76F51",
    description: "Browser extension",
  },
];