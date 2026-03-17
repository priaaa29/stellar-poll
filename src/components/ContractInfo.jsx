import React from "react";
import "./ContractInfo.css";

export default function ContractInfo({ contractId, deployTxHash }) {
  return (
    <div className="contract-info">
      <div className="contract-info-row">
        <span className="contract-label">Contract</span>
        <span className="contract-value" title={contractId}>
          {contractId.slice(0, 8)}...{contractId.slice(-8)}
        </span>
        <a href={`https://stellar.expert/explorer/testnet/contract/${contractId}`}
          target="_blank" rel="noopener noreferrer" className="contract-link">↗</a>
      </div>
      {deployTxHash && (
        <div className="contract-info-row">
          <span className="contract-label">Deploy TX</span>
          <span className="contract-value" title={deployTxHash}>
            {deployTxHash.slice(0, 8)}...{deployTxHash.slice(-8)}
          </span>
          <a href={`https://stellar.expert/explorer/testnet/tx/${deployTxHash}`}
            target="_blank" rel="noopener noreferrer" className="contract-link">↗</a>
        </div>
      )}
      <div className="contract-info-row">
        <span className="contract-label">Network</span>
        <span className="contract-value network-badge">Testnet</span>
      </div>
    </div>
  );
}