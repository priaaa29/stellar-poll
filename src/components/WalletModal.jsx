import React from "react";
import { SUPPORTED_WALLETS } from "../lib/constants";
import "./WalletModal.css";

export default function WalletModal({ isOpen, onClose, onSelect, connecting }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Connect Wallet</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <p className="modal-subtitle">
          Select a wallet to interact with the Stellar testnet
        </p>
        <div className="wallet-list">
          {SUPPORTED_WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              className={`wallet-option ${connecting === wallet.id ? "connecting" : ""}`}
              onClick={() => onSelect(wallet)}
              disabled={!!connecting}
              style={{ "--wallet-color": wallet.color }}
            >
              <span className="wallet-icon">{wallet.icon}</span>
              <div className="wallet-info">
                <span className="wallet-name">{wallet.name}</span>
                <span className="wallet-desc">{wallet.description}</span>
              </div>
              {connecting === wallet.id && <span className="wallet-spinner" />}
            </button>
          ))}
        </div>
        <div className="modal-footer">
          <span className="modal-note">⚡ Powered by StellarWalletsKit</span>
        </div>
      </div>
    </div>
  );
}