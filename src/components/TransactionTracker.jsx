import React from "react";
import { TX_STATUS } from "../lib/constants";
import "./TransactionTracker.css";

const STAGES = [
  { key: TX_STATUS.PREPARING, label: "Preparing", icon: "⚙️" },
  { key: TX_STATUS.SIGNING, label: "Signing", icon: "✍️" },
  { key: TX_STATUS.SUBMITTING, label: "Submitting", icon: "📡" },
  { key: TX_STATUS.SUCCESS, label: "Confirmed", icon: "✅" },
];

export default function TransactionTracker({ status, txHash }) {
  if (status === TX_STATUS.IDLE) return null;

  const isFailed = status === TX_STATUS.FAILED;
  const currentIdx = STAGES.findIndex((s) => s.key === status);

  return (
    <div className={`tx-tracker ${isFailed ? "tx-failed" : ""}`}>
      <div className="tx-tracker-header">
        <span className="tx-tracker-title">
          {isFailed ? "❌ Transaction Failed" : "Transaction Status"}
        </span>
        {txHash && (
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-explorer-link"
          >
            View on Explorer ↗
          </a>
        )}
      </div>

      {!isFailed && (
        <div className="tx-stages">
          {STAGES.map((stage, idx) => {
            const isActive = idx === currentIdx;
            const isComplete = idx < currentIdx;
            return (
              <div
                key={stage.key}
                className={`tx-stage ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
              >
                <div className="tx-stage-dot">
                  {isComplete ? "✓" : isActive ? stage.icon : "○"}
                </div>
                <span className="tx-stage-label">{stage.label}</span>
                {idx < STAGES.length - 1 && (
                  <div className={`tx-stage-line ${isComplete ? "complete" : ""}`} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}