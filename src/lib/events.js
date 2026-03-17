// ═══════════════════════════════════════════════════════════════
// Real-Time Event System
// In production, this subscribes to Soroban contract events
// Here we simulate them to show the UI working
// ═══════════════════════════════════════════════════════════════

import { POLL_OPTIONS } from "./constants";

/**
 * Simple event emitter (like a mini pub/sub system)
 * Components can "listen" for events and react when they fire
 */
export function createEventEmitter() {
  const listeners = new Map();

  return {
    on(event, callback) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(callback);
      return () => listeners.get(event)?.delete(callback); // returns unsubscribe fn
    },
    emit(event, data) {
      listeners.get(event)?.forEach((cb) => {
        try { cb(data); } catch (err) { console.error(`[events] Error:`, err); }
      });
    },
  };
}

/**
 * Subscribe to contract events from the blockchain
 *
 * In production with Soroban RPC:
 *   server.getEvents({
 *     startLedger: latestLedger,
 *     filters: [{ type: "contract", contractIds: [CONTRACT_ID], topics: [...] }],
 *   })
 */
export function subscribeToContractEvents(contractId, emitter) {
  console.log("[events] Subscribing to contract events:", contractId);

  // Simulate other users voting every few seconds
  const interval = setInterval(() => {
    if (Math.random() > 0.55) {
      const option = POLL_OPTIONS[Math.floor(Math.random() * POLL_OPTIONS.length)];
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let addr = "G";
      for (let i = 0; i < 55; i++) addr += chars[Math.floor(Math.random() * chars.length)];

      emitter.emit("vote", { voter: addr, option, timestamp: new Date().toISOString() });
    }
  }, 4000);

  return () => clearInterval(interval); // cleanup function
}

/**
 * Format raw events into display-friendly feed items
 */
export function formatEventForFeed(type, data) {
  const icons = {
    vote: "🗳️", connect: "🔗", disconnect: "🔌",
    deploy: "🚀", tx_success: "✅", tx_fail: "❌", init: "📊",
  };

  const texts = {
    vote: () => `${data.voter?.slice(0, 4)}...${data.voter?.slice(-4)} voted for ${data.option}`,
    connect: () => `${data.walletName} connected: ${data.address?.slice(0, 4)}...${data.address?.slice(-4)}`,
    disconnect: () => "Wallet disconnected",
    deploy: () => "Contract deployed to testnet",
    tx_success: () => `Vote confirmed for ${data.option} — TX: ${data.hash?.slice(0, 8)}...`,
    tx_fail: () => `Vote failed: ${data.reason}`,
    init: () => `Poll initialized with ${data.optionCount} options`,
  };

  return { icon: icons[type] || "📋", text: texts[type]?.() || `Event: ${type}`, time: "just now", type };
}