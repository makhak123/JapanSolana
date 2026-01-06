# Architecture Documentation

## System Overview

ソラナ (Solana Japanese Fork) is a simplified blockchain implementation that demonstrates core concepts from Solana while providing a Japanese-language interface.

## Component Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Web Interface                      │
│  (Next.js + React Components in Japanese)          │
└───────────────────┬─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│                  API Layer                           │
│            (blockchain-api.ts)                      │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ Transaction      │    │ Validator        │
│ System           │    │ Network          │
│                  │    │                  │
│ • Pool           │    │ • PoS Selection  │
│ • Validator      │    │ • Consensus      │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
         ┌─────────────────────┐
         │  Blockchain Core    │
         │                     │
         │  • Blocks           │
         │  • Chain            │
         │  • Wallets          │
         └─────────────────────┘
```

## Core Components

### 1. Blockchain Core (`lib/blockchain/`)

#### Block (`block.ts`)
- Represents individual blocks in the chain
- Contains transactions, timestamp, hash, and validator info
- Implements basic Proof of History via hash chaining

```typescript
class Block {
  index: number
  timestamp: number
  transactions: Transaction[]
  previousHash: string
  hash: string
  validator: string
}
```

#### SolanaChain (`solana-chain.ts`)
- Main blockchain implementation
- Manages chain state and block creation
- Implements validator selection (round-robin + stake-weighted)
- Provides balance tracking across all transactions

**Key Methods:**
- `createTransaction()` - Add transaction to pending pool
- `mineBlock()` - Create new block with pending transactions
- `getBalance()` - Calculate address balance
- `isChainValid()` - Verify blockchain integrity

#### Wallet (`wallet.ts`)
- RSA key pair generation
- Address derivation from public key
- Transaction signing capabilities

### 2. Transaction System

#### TransactionPool (`transaction-pool.ts`)
- Manages pending transactions before block creation
- Enforces pool size limits (max 1000)
- Prevents duplicate transactions

#### TransactionValidator (`transaction-validator.ts`)
- Validates transaction structure
- Checks sender balance sufficiency
- Prevents invalid operations (self-transfer, negative amounts)

### 3. Validator Network

#### ValidatorNetwork (`validator-network.ts`)
- Manages validator registration and staking
- Implements stake-weighted leader selection
- Tracks validator reputation and performance

**Validator Requirements:**
- Minimum stake: 1000 units
- Active status based on reputation
- Reputation threshold: >50 to remain active

#### ConsensusEngine (`consensus.ts`)
- Simplified Tower BFT implementation
- Requires 66% validator agreement
- Records successful validations

### 4. API Layer (`blockchain-api.ts`)

Unified interface for all blockchain operations:

```typescript
class BlockchainAPI {
  createWallet(name?: string)
  createTransaction(from, to, amount)
  processBlock()
  getBalance(address)
  getChainInfo()
  addValidator(name, stake)
  getValidatorStats()
}
```

## Data Flow

### Transaction Creation Flow

```
User Input (UI)
    ↓
TransactionForm
    ↓
BlockchainAPI.createTransaction()
    ↓
TransactionValidator.validateTransaction()
    ↓ (if valid)
SolanaChain.createTransaction()
    ↓
Added to pendingTransactions[]
```

### Block Processing Flow

```
User clicks "Process Block"
    ↓
BlockchainAPI.processBlock()
    ↓
ValidatorNetwork.selectLeader() (stake-weighted)
    ↓
SolanaChain.mineBlock()
    ↓
Block created with pending transactions
    ↓
ConsensusEngine.reachConsensus()
    ↓ (if consensus reached)
Block added to chain
    ↓
Pending transactions cleared
```

## Consensus Mechanism

### Simplified Tower BFT

1. **Leader Selection**: 
   - Stake-weighted probability
   - Higher stake = higher chance of selection
   
2. **Block Proposal**: 
   - Selected leader creates block
   - Includes all pending valid transactions
   
3. **Validation**: 
   - Validators vote based on reputation
   - Requires 66% agreement
   
4. **Finality**: 
   - Block added to chain
   - Leader receives reputation boost

## Security Considerations

### Implemented
- Transaction signature support
- Balance validation before transactions
- Chain integrity verification
- Reputation-based validator management

### Not Implemented (Educational Limitations)
- Network layer security
- Advanced cryptographic signatures
- Replay attack protection
- Sybil attack prevention
- Double-spend protection across concurrent blocks
- Full Byzantine fault tolerance

## Performance Characteristics

- **Block Time**: ~400ms (configurable)
- **Transaction Pool**: Max 1000 pending transactions
- **Consensus**: Simulated voting (instant)
- **Storage**: In-memory (resets on restart)

## Future Enhancements

Potential improvements for a production-ready system:

1. **Persistence**: Database storage for blocks and state
2. **Networking**: P2P node communication
3. **Smart Contracts**: VM for executing contract code
4. **Advanced PoH**: Full timestamp-based ordering
5. **Sharding**: Parallel transaction processing
6. **Token Economics**: Native token with inflation/deflation

## Comparison to Real Solana

| Feature | This Implementation | Real Solana |
|---------|-------------------|-------------|
| Consensus | Simplified Tower BFT | Full Tower BFT |
| PoH | Hash chaining | Verifiable delay function |
| TPS | N/A (single node) | 65,000+ |
| Block Time | 400ms | 400ms |
| Network | None | Global P2P |
| Smart Contracts | None | Rust/C programs |
| Finality | Immediate | ~13 seconds |
