// ═══════════════════════════════════════════════════════════════
// StellarWalletsKit Integration
// This connects to whichever wallet the user picks
// ═══════════════════════════════════════════════════════════════

import { SUPPORTED_WALLETS, TESTNET_NETWORK_PASSPHRASE } from "./constants";
import { WalletNotFoundError, TransactionRejectedError, classifyError } from "./errors";
import { fetchBalance } from "./stellar";

/**
 * Initialize the wallet kit
 *
 * In production with the real StellarWalletsKit:
 *   import { StellarWalletsKit, WalletNetwork, allowAllModules } from "@creit.tech/stellar-wallets-kit";
 *   const kit = new StellarWalletsKit({
 *     network: WalletNetwork.TESTNET,
 *     selectedWalletId: "freighter",
 *     modules: allowAllModules(),
 *   });
 */
export function createWalletKit() {
  console.log("[wallet] Initializing StellarWalletsKit for TESTNET");
  return { initialized: true, network: "TESTNET", selectedWallet: null };
}

/**
 * Connect to a specific wallet and get the user's public key
 */
export async function connectWallet(walletId) {
  const wallet = SUPPORTED_WALLETS.find((w) => w.id === walletId);
  if (!wallet) throw new WalletNotFoundError(walletId);

  console.log(`[wallet] Connecting to ${wallet.name}...`);

  // Simulate connection delay (real wallets take ~1-2 seconds)
  await new Promise((r) => setTimeout(r, 800));

  // Simulate "Rabet not installed" — demonstrates the WalletNotFoundError
  if (walletId === "rabet") {
    throw new WalletNotFoundError(wallet.name);
  }

  // Generate a testnet-style address (starts with G, 56 chars total)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let addr = "G";
  for (let i = 0; i < 55; i++) addr += chars[Math.floor(Math.random() * chars.length)];

  const balance = (Math.random() * 9000 + 1000).toFixed(2);

  return { publicKey: addr, wallet, balance };
}

/**
 * Ask the connected wallet to sign a transaction
 */
export async function signTransaction(xdr, walletId) {
  console.log(`[wallet] Requesting signature from ${walletId}...`);

  // Simulate the wallet popup delay
  await new Promise((r) => setTimeout(r, 1500));

  // 10% chance of rejection (demonstrates TransactionRejectedError)
  if (Math.random() < 0.1) {
    throw new TransactionRejectedError();
  }

  return "signed_" + xdr;
}