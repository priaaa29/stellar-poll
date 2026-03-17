// ═══════════════════════════════════════════════════════════════
// Custom Error Types for Stellar DApp
// Requirement: 3 error types handled
// ═══════════════════════════════════════════════════════════════

/**
 * Error 1: Wallet not installed or unavailable
 * Triggers when: user tries to connect a wallet that isn't installed
 */
export class WalletNotFoundError extends Error {
    constructor(walletName) {
      super(`Wallet "${walletName}" is not installed or not available. Please install it and try again.`);
      this.name = "WalletNotFoundError";
      this.code = "WALLET_NOT_FOUND";
      this.walletName = walletName;
    }
  }
  
  /**
   * Error 2: User rejected the transaction signing
   * Triggers when: user clicks "Reject" in the wallet popup
   */
  export class TransactionRejectedError extends Error {
    constructor(details = "") {
      super(`Transaction was rejected by the user.${details ? " " + details : ""}`);
      this.name = "TransactionRejectedError";
      this.code = "TX_REJECTED";
    }
  }
  
  /**
   * Error 3: Insufficient XLM balance for transaction fees
   * Triggers when: user doesn't have enough XLM to pay gas
   */
  export class InsufficientBalanceError extends Error {
    constructor(required, available) {
      super(
        `Insufficient balance. Required: ${required} XLM, Available: ${available} XLM. ` +
        `Fund your testnet account at friendbot.stellar.org`
      );
      this.name = "InsufficientBalanceError";
      this.code = "INSUFFICIENT_BALANCE";
      this.required = required;
      this.available = available;
    }
  }
  
  /**
   * Takes any raw error and converts it to one of our typed errors
   * This way we always show the user a helpful, specific message
   */
  export function classifyError(err) {
    const msg = err?.message?.toLowerCase() || "";
  
    if (msg.includes("not found") || msg.includes("not installed") || msg.includes("no provider")) {
      return new WalletNotFoundError("Unknown");
    }
    if (msg.includes("rejected") || msg.includes("denied") || msg.includes("cancelled") || msg.includes("user refused")) {
      return new TransactionRejectedError();
    }
    if (msg.includes("insufficient") || msg.includes("underfunded") || msg.includes("balance")) {
      return new InsufficientBalanceError("unknown", "unknown");
    }
  
    return err; // return as-is if we can't classify it
  }