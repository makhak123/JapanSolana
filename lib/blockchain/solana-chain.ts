import { Block, type Transaction } from "./block"
import crypto from "crypto"

export class SolanaChain {
  public chain: Block[] = []
  public pendingTransactions: Transaction[] = []
  public validators: string[] = []
  public difficulty = 2
  private readonly BLOCK_TIME = 400 // milliseconds (similar to Solana's fast block time)

  constructor() {
    // ジェネシスブロック (Genesis Block)
    this.chain.push(this.createGenesisBlock())
  }

  private createGenesisBlock(): Block {
    return new Block(0, Date.now(), [], "0", "ソラナ創設者")
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  addValidator(validator: string): void {
    if (!this.validators.includes(validator)) {
      this.validators.push(validator)
    }
  }

  selectValidator(): string {
    // Simple round-robin validator selection (simplified PoS)
    if (this.validators.length === 0) {
      return "デフォルト検証者"
    }
    const index = this.chain.length % this.validators.length
    return this.validators[index]
  }

  createTransaction(transaction: Transaction): void {
    // Validate transaction
    if (!transaction.from || !transaction.to) {
      throw new Error("取引には送信者と受信者のアドレスが必要です")
    }

    if (transaction.amount <= 0) {
      throw new Error("取引金額は正の数である必要があります")
    }

    transaction.id = crypto.randomBytes(32).toString("hex")
    transaction.timestamp = Date.now()

    this.pendingTransactions.push(transaction)
  }

  async mineBlock(): Promise<Block> {
    const validator = this.selectValidator()
    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash,
      validator,
    )

    // Simulate Proof of History
    block.generateProofOfHistory()

    this.chain.push(block)
    this.pendingTransactions = []

    return block
  }

  getBalance(address: string): number {
    let balance = 0

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.from === address) {
          balance -= trans.amount
        }

        if (trans.to === address) {
          balance += trans.amount
        }
      }
    }

    return balance
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }

    return true
  }

  getChainInfo() {
    return {
      length: this.chain.length,
      validators: this.validators.length,
      pendingTransactions: this.pendingTransactions.length,
      isValid: this.isChainValid(),
      latestBlock: this.getLatestBlock(),
    }
  }
}
