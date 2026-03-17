# 🗳️ StellarPoll — Live Voting DApp on Stellar

A real-time polling application built on the Stellar blockchain with
multi-wallet integration, Soroban smart contract, and live event streaming.

## ✅ Level 2 Requirements

| Requirement | Status |
|---|---|
| 3 error types handled | ✅ WalletNotFoundError, TransactionRejectedError, InsufficientBalanceError |
| Contract deployed on testnet | ✅ `CCZF67EHLKRBNV26OKTAB6RMFR44YCT6VLRV3JCJSZFIQVH4LE3SOH7T` |
| Contract called from frontend | ✅ vote(), get_votes() |
| Transaction status visible | ✅ 4-stage tracker |
| 2+ meaningful commits | ✅ 30 commits |

## 🖼️ Screenshots

### Wallet Options
![Wallet Modal](./docs/screenshot-wallet.png)

## 📋 Deployed Contract

- **Contract Address**: `CCZF67EHLKRBNV26OKTAB6RMFR44YCT6VLRV3JCJSZFIQVH4LE3SOH7T`
- **Deploy TX Hash**: `4042b6f9daa38608abbd3f8d01f402884987868d20d38b223b2daa07359cc55b`
- **Network**: Stellar Testnet

## 🚀 Setup

git clone https://github.com/YOUR_USERNAME/stellar-poll.git
cd stellar-poll
npm install
npm run dev

## 📁 Project Structure

src/
├── components/    # 8 UI components
├── hooks/         # useWallet, useEvents
├── lib/           # Stellar SDK, errors, events, wallet service
├── App.jsx        # Main app
└── main.jsx       # Entry point
contracts/
└── poll/          # Soroban smart contract (Rust)