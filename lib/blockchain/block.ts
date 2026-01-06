import crypto from "crypto"

export interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  timestamp: number
  signature?: string
}

export class Block {
  public hash: string
  public nonce = 0

  constructor(
    public index: number,
    public timestamp: number,
    public transactions: Transaction[],
    public previousHash = "",
    public validator?: string,
  ) {
    this.hash = this.calculateHash()
  }

  calculateHash(): string {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.nonce +
          (this.validator || ""),
      )
      .digest("hex")
  }

  // Simplified Proof of History (PoH) inspired by Solana
  generateProofOfHistory(): void {
    this.hash = this.calculateHash()
  }
}
