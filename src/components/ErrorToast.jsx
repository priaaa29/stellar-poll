import React, { useEffect } from "react";
import "./ErrorToast.css";

export default function ErrorToast({ error, onDismiss }) {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(onDismiss, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  if (!error) return null;

  const iconMap = {
    WALLET_NOT_FOUND: "🔍",
    TX_REJECTED: "✋",
    INSUFFICIENT_BALANCE: "💸",
  };

  return (
    <div className="error-toast" onClick={onDismiss} role="alert">
      <span className="error-icon">{iconMap[error.code] || "⚠️"}</span>
      <div className="error-content">
        <span className="error-title">{error.name || "Error"}</span>
        <span className="error-message">{error.message}</span>
      </div>
      <span className="error-dismiss">×</span>
    </div>
  );
}