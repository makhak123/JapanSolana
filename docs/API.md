# API Documentation

Complete API reference for ソラナ blockchain.

## BlockchainAPI

Main interface for all blockchain operations.

### Initialization

```typescript
import { getBlockchainAPI } from '@/lib/api/blockchain-api'

const api = getBlockchainAPI() // Singleton instance
```

### Wallet Operations

#### createWallet(name?: string)

Creates a new wallet with RSA key pair.

**Parameters:**
- `name` (optional): Human-readable name for the wallet

**Returns:**
```typescript
{
  address: string,      // Unique wallet address
  publicKey: string     // PEM-formatted public key
}
```

**Example:**
```typescript
const wallet = api.createWallet('太郎')
console.log(wallet.address) // "太郎_a1b2c3d4e5f6g7h8"
```

#### getBalance(address: string)

Get current balance for an address.

**Parameters:**
- `address`: Wallet address to check

**Returns:** `number` - Current balance

**Example:**
```typescript
const balance = api.getBalance('太郎_a1b2c3d4e5f6g7h8')
console.log(balance) // 1000
```

### Transaction Operations

#### createTransaction(from: string, to: string, amount: number)

Create a new transaction.

**Parameters:**
- `from`: Sender's wallet address
- `to`: Recipient's wallet address
- `amount`: Amount to transfer (must be positive)

**Returns:**
```typescript
{
  success: boolean,
  transaction?: {
    id: string,
    from: string,
    to: string,
    amount: number,
    timestamp: number
  },
  error?: string
}
```

**Example:**
```typescript
const result = api.createTransaction(
  'wallet_sender',
  'wallet_receiver',
  500
)

if (result.success) {
  console.log('Transaction ID:', result.transaction.id)
} else {
  console.error('Error:', result.error)
}
```

**Validation Rules:**
- Sender must have sufficient balance
- Amount must be positive
- Sender and receiver must be different
- Both addresses must be valid

#### processBlock()

Process pending transactions into a new block.

**Returns:**
```typescript
{
  success: boolean,
  block?: {
    index: number,
    timestamp: number,
    transactions: number,
    hash: string,
    validator: string,
    leader: string,
    consensusReached: boolean
  },
  error?: string
}
```

**Example:**
```typescript
const result = await api.processBlock()

if (result.success) {
  console.log('Block created:', result.block.index)
  console.log('Validator:', result.block.leader)
  console.log('Consensus:', result.block.consensusReached)
}
```

### Chain Operations

#### getChainInfo()

Get current blockchain statistics.

**Returns:**
```typescript
{
  length: number,                    // Total blocks
  validators: number,                // Number of validators
  pendingTransactions: number,       // Transactions awaiting processing
  isValid: boolean,                  // Chain integrity status
  latestBlock: Block                 // Most recent block
}
```

**Example:**
```typescript
const info = api.getChainInfo()
console.log('Chain length:', info.length)
console.log('Valid:', info.isValid)
```

#### getChain()

Get the entire blockchain.

**Returns:** `Block[]` - Array of all blocks

**Example:**
```typescript
const chain = api.getChain()
chain.forEach(block => {
  console.log(`Block ${block.index}:`, block.transactions.length, 'transactions')
})
```

### Validator Operations

#### addValidator(name: string, stake: number)

Add a new validator to the network.

**Parameters:**
- `name`: Validator name
- `stake`: Stake amount (minimum: 1000)

**Returns:**
```typescript
{
  success: boolean,
  validator?: {
    id: string,
    name: string,
    stake: number,
    blocksValidated: number,
    reputation: number,
    isActive: boolean,
    joinedAt: number
  },
  error?: string
}
```

**Example:**
```typescript
const result = api.addValidator('検証者イプシロン', 5000)

if (result.success) {
  console.log('Validator ID:', result.validator.id)
  console.log('Initial reputation:', result.validator.reputation)
}
```

#### getValidatorStats()

Get validator network statistics.

**Returns:**
```typescript
{
  network: {
    totalValidators: number,
    activeValidators: number,
    totalStake: number,
    totalBlocksValidated: number,
    currentLeader: ValidatorNode | null,
    averageReputation: number
  },
  consensus: {
    algorithm: string,
    requiredConsensus: string,
    requiredVotes: number,
    totalValidators: number,
    activeValidators: number
  }
}
```

**Example:**
```typescript
const stats = api.getValidatorStats()
console.log('Active validators:', stats.network.activeValidators)
console.log('Total stake:', stats.network.totalStake)
console.log('Current leader:', stats.network.currentLeader?.name)
```

## Error Handling

All methods return structured error information:

```typescript
// Transaction errors
"残高不足: 100 < 500"                    // Insufficient balance
"取引金額は正の数である必要があります"      // Amount must be positive
"自分自身に送金することはできません"        // Cannot send to self
"送信者または受信者のアドレスが無効です"    // Invalid addresses

// Validator errors
"最低ステーク額は 1000 です"             // Minimum stake requirement
"取引プールが満杯です"                   // Transaction pool full
"処理する取引がありません"                // No pending transactions
```

## Type Definitions

### Transaction

```typescript
interface Transaction {
  id: string           // Unique transaction ID
  from: string         // Sender address
  to: string           // Recipient address
  amount: number       // Transfer amount
  timestamp: number    // Creation timestamp
  signature?: string   // Optional cryptographic signature
}
```

### Block

```typescript
interface Block {
  index: number              // Block number
  timestamp: number          // Creation time
  transactions: Transaction[] // Included transactions
  previousHash: string       // Previous block hash
  hash: string              // This block's hash
  validator?: string        // Validator that created block
  nonce: number             // Mining nonce
}
```

### ValidatorNode

```typescript
interface ValidatorNode {
  id: string              // Unique validator ID
  name: string            // Display name
  stake: number           // Staked amount
  blocksValidated: number // Total blocks validated
  reputation: number      // Reputation score (0-100)
  isActive: boolean       // Active status
  joinedAt: number        // Join timestamp
}
