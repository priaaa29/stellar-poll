#!/bin/bash
set -e

echo "🔨 Building contract..."
cd contracts/poll
stellar contract build

echo ""
echo "🚀 Deploying to testnet..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_poll_contract.wasm \
  --source deployer \
  --network testnet)

echo "✅ Contract deployed!"
echo "   Contract ID: $CONTRACT_ID"

echo ""
echo "📋 Initializing poll..."
stellar contract invoke \
  --id $CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  initialize \
  --admin deployer \
  --options '["stellar", "ethereum", "solana", "polkadot"]'

echo ""
echo "✅ Poll initialized!"
echo "   Update src/lib/constants.js with: $CONTRACT_ID"
