# ソラナ (Solana Japanese Fork)

高速分散型ブロックチェーン - Demo Implementation

A mini working Japanese fork of Solana blockchain built with TypeScript and Next.js.

## 🌸 特徴 (Features)

- **高速ブロック生成**: Inspired by Solana's Proof of History (PoH)
- **Proof of Stake**: Stake-weighted validator selection
- **Tower BFT Consensus**: Simplified Byzantine Fault Tolerance with 66% consensus requirement
- **検証者ネットワーク**: Distributed validator network with reputation tracking
- **日本語インターフェース**: Fully Japanese UI and documentation

## 🏗️ アーキテクチャ (Architecture)

### Core Components

1. **Blockchain Engine** (`lib/blockchain/`)
   - `block.ts` - Block and transaction structures
   - `solana-chain.ts` - Main blockchain implementation with PoH
   - `wallet.ts` - Wallet creation and cryptographic signing

2. **Transaction System** (`lib/blockchain/`)
   - `transaction-pool.ts` - Pending transaction management
   - `transaction-validator.ts` - Transaction validation logic

3. **Validator Network** (`lib/blockchain/`)
   - `validator-network.ts` - Proof of Stake validator management
   - `consensus.ts` - Tower BFT consensus mechanism

4. **API Layer** (`lib/api/`)
   - `blockchain-api.ts` - Unified API for blockchain operations

## 🚀 使い方 (Getting Started)

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/solana-japanese-fork.git
cd solana-japanese-fork

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

## 📖 使用例 (Usage Examples)

### Creating a Wallet

```typescript
import { Wallet } from './lib/blockchain/wallet'

const wallet = new Wallet('太郎')
console.log('Address:', wallet.address)
console.log('Public Key:', wallet.publicKey)
```

### Creating a Transaction

```typescript
import { getBlockchainAPI } from './lib/api/blockchain-api'

const api = getBlockchainAPI()

// Create wallets
const wallet1 = api.createWallet('送信者')
const wallet2 = api.createWallet('受信者')

// Create transaction
const result = api.createTransaction(
  wallet1.address,
  wallet2.address,
  100
)

if (result.success) {
  console.log('Transaction created:', result.transaction)
}

// Process block
await api.processBlock()
```

### Adding a Validator

```typescript
const result = api.addValidator('新しい検証者', 5000)

if (result.success) {
  console.log('Validator added:', result.validator)
}
```

### Checking Balance

```typescript
const balance = api.getBalance(walletAddress)
console.log('Balance:', balance)
```

## 🔧 技術スタック (Tech Stack)

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Blockchain**: Custom implementation inspired by Solana
- **Consensus**: Tower BFT (simplified)
- **Cryptography**: Node.js crypto module

## 📊 コンセンサスアルゴリズム (Consensus Algorithm)

This implementation uses a simplified version of Solana's Tower BFT:

1. **Validator Selection**: Stake-weighted random selection (Proof of Stake)
2. **Block Production**: Selected leader creates new block
3. **Consensus**: Requires 66% validator agreement
4. **Reputation System**: Validators earn reputation for successful validations

## 🔐 セキュリティ (Security)

⚠️ **Warning**: This is a demonstration project. Do NOT use in production:

- Simplified cryptography (educational purposes)
- No network security layer
- Mock consensus implementation
- No replay attack protection
- Centralized architecture

## 🎯 主な違い (Key Differences from Solana)

1. **Simplified PoH**: Basic hash chaining instead of full Proof of History
2. **Reduced Complexity**: Educational implementation vs. production-grade
3. **Single Node**: No network layer or distributed nodes
4. **Japanese UI**: Complete Japanese language interface
5. **Browser-Based**: Runs entirely in Next.js application

## 🧪 テスト (Testing)

```bash
# Run tests (if implemented)
npm test
```

## 📝 ライセンス (License)

MIT License - Free to use and modify

## 🤝 貢献 (Contributing)

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 リンク (Links)

- [Original Solana](https://solana.com)
- [Solana Documentation](https://docs.solana.com)
- [Tower BFT Paper](https://solana.com/solana-whitepaper.pdf)

## 👨‍💻 開発者 (Developer)

Created as an educational demonstration of blockchain technology with Japanese localization.

---

**注意**: このプロジェクトは教育目的のデモンストレーションです。本番環境での使用は推奨されません。

**Note**: This project is a demonstration for educational purposes. Not recommended for production use.
