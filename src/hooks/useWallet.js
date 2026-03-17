import { useState, useCallback } from "react";
import { connectWallet, signTransaction } from "../lib/walletService";

export function useWallet() {
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [connecting, setConnecting] = useState(null);

  const connect = useCallback(async (wallet) => {
    setConnecting(wallet.id);
    try {
      const result = await connectWallet(wallet.id);
      setConnectedWallet(result.wallet);
      setPublicKey(result.publicKey);
      setBalance(result.balance);
      return result;
    } finally {
      setConnecting(null);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnectedWallet(null);
    setPublicKey(null);
    setBalance(null);
  }, []);

  const sign = useCallback(
    async (xdr) => {
      if (!connectedWallet) throw new Error("No wallet connected");
      return signTransaction(xdr, connectedWallet.id);
    },
    [connectedWallet]
  );

  return {
    connectedWallet, publicKey, balance, connecting,
    connect, disconnect, sign,
    isConnected: !!connectedWallet,
  };
}