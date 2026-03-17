import React from "react";
import "./Header.css";

export default function Header({ connectedWallet, publicKey, balance, onConnect, onDisconnect }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">StellarPoll</span>
        </div>
        <span className="header-tag">Live on Testnet</span>
      </div>
      <div className="header-right">
        {connectedWallet ? (
          <div className="wallet-connected">
            <div className="wallet-badge">
              <span className="wallet-badge-icon">{connectedWallet.icon}</span>
              <div className="wallet-badge-info">
                <span className="wallet-badge-addr">
                  {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
                </span>
                <span className="wallet-badge-balance">{balance} XLM</span>
              </div>
            </div>
            <button className="btn-disconnect" onClick={onDisconnect}>Disconnect</button>
          </div>
        ) : (
          <button className="btn-connect" onClick={onConnect}>Connect Wallet</button>
        )}
      </div>
    </header>
  );
}