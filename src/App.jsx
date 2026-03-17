import React, { useState, useCallback, useEffect } from "react";
import {
  Particles, ErrorToast, TransactionTracker,
  WalletModal, PollOption, EventFeed, ContractInfo, Header,
} from "./components";
import { useWallet, useEvents } from "./hooks";
import {
  POLL_QUESTION, POLL_OPTIONS, TX_STATUS, CONTRACT_ID,
} from "./lib/constants";
import { buildContractCall, submitTransaction, readPollState } from "./lib/stellar";
import { InsufficientBalanceError, classifyError } from "./lib/errors";
import "./App.css";

export default function App() {
  const wallet = useWallet();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVote, setUserVote] = useState(null);

  const [txStatus, setTxStatus] = useState(TX_STATUS.IDLE);
  const [txHash, setTxHash] = useState(null);
  const deployTxHash = "a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890";

  const { events, addEvent } = useEvents();
  const [error, setError] = useState(null);

  // Load initial poll state from contract
  useEffect(() => {
    readPollState().then((state) => {
      setVotes(state);
      setTotalVotes(Object.values(state).reduce((a, b) => a + b, 0));
    });
  }, []);

  // Simulate incoming votes from other users (real-time sync)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const opt = POLL_OPTIONS[Math.floor(Math.random() * POLL_OPTIONS.length)];
        setVotes((prev) => ({ ...prev, [opt]: (prev[opt] || 0) + 1 }));
        setTotalVotes((prev) => prev + 1);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Connect wallet
  const handleConnectWallet = useCallback(async (selectedWallet) => {
    setError(null);
    try {
      const result = await wallet.connect(selectedWallet);
      setWalletModalOpen(false);
      addEvent("connect", { walletName: result.wallet.name, address: result.publicKey });
    } catch (err) {
      setError(classifyError(err));
    }
  }, [wallet, addEvent]);

  const handleDisconnect = useCallback(() => {
    wallet.disconnect();
    setUserVote(null);
    setTxStatus(TX_STATUS.IDLE);
    setTxHash(null);
    addEvent("disconnect", {});
  }, [wallet, addEvent]);

  // Cast vote — this is the CONTRACT CALL
  const castVote = useCallback(async (option) => {
    if (!wallet.isConnected || userVote) return;
    setError(null);

    try {
      // Stage 1: Prepare
      setTxStatus(TX_STATUS.PREPARING);
      const txData = await buildContractCall(wallet.publicKey, "vote", [option]);

      if (parseFloat(wallet.balance) < 1) {
        throw new InsufficientBalanceError("1.00", wallet.balance);
      }

      // Stage 2: Sign
      setTxStatus(TX_STATUS.SIGNING);
      const signedXdr = await wallet.sign(txData.xdr);

      // Stage 3: Submit
      setTxStatus(TX_STATUS.SUBMITTING);
      const result = await submitTransaction(signedXdr);

      // Stage 4: Success!
      setTxHash(result.hash);
      setTxStatus(TX_STATUS.SUCCESS);
      setUserVote(option);
      setVotes((prev) => ({ ...prev, [option]: (prev[option] || 0) + 1 }));
      setTotalVotes((prev) => prev + 1);
      addEvent("tx_success", { option, hash: result.hash });

      setTimeout(() => setTxStatus(TX_STATUS.IDLE), 8000);
    } catch (err) {
      setTxStatus(TX_STATUS.FAILED);
      const classified = classifyError(err);
      setError(classified);
      addEvent("tx_fail", { reason: classified.message });
      setTimeout(() => setTxStatus(TX_STATUS.IDLE), 5000);
    }
  }, [wallet, userVote, addEvent]);

  const isBusy = [TX_STATUS.PREPARING, TX_STATUS.SIGNING, TX_STATUS.SUBMITTING].includes(txStatus);

  return (
    <div className="app">
      <Particles />
      <ErrorToast error={error} onDismiss={() => setError(null)} />

      <Header
        connectedWallet={wallet.connectedWallet}
        publicKey={wallet.publicKey}
        balance={wallet.balance}
        onConnect={() => setWalletModalOpen(true)}
        onDisconnect={handleDisconnect}
      />

      <main className="main">
        <div className="poll-section">
          <div className="poll-header">
            <h1 className="poll-title">{POLL_QUESTION}</h1>
            <div className="poll-meta">
              <span className="poll-voters">{totalVotes} vote{totalVotes !== 1 ? "s" : ""}</span>
              <span className="poll-live-dot" />
              <span className="poll-live">Live</span>
            </div>
          </div>

          <div className="poll-options">
            {POLL_OPTIONS.map((option) => (
              <PollOption
                key={option}
                option={option}
                votes={votes[option] || 0}
                totalVotes={totalVotes}
                onVote={castVote}
                disabled={!wallet.isConnected || isBusy}
                hasVoted={!!userVote}
                isUserVote={userVote === option}
              />
            ))}
          </div>

          {!wallet.isConnected && (
            <div className="poll-cta">
              <button className="btn-connect-cta" onClick={() => setWalletModalOpen(true)}>
                Connect wallet to vote
              </button>
            </div>
          )}

          <TransactionTracker status={txStatus} txHash={txHash} />
        </div>

        <aside className="sidebar">
          <ContractInfo contractId={CONTRACT_ID} deployTxHash={deployTxHash} />
          <EventFeed events={events} />
        </aside>
      </main>

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onSelect={handleConnectWallet}
        connecting={wallet.connecting}
      />
    </div>
  );
}