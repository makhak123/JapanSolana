import type { Transaction } from "./block"

export class TransactionPool {
  private transactions: Transaction[] = []
  private readonly MAX_POOL_SIZE = 1000

  addTransaction(transaction: Transaction): void {
    // Check if transaction already exists
    const exists = this.transactions.some((tx) => tx.id === transaction.id)
    if (exists) {
      throw new Error("取引はすでにプールに存在します")
    }

    // Check pool size limit
    if (this.transactions.length >= this.MAX_POOL_SIZE) {
      throw new Error("取引プールが満杯です")
    }

    this.transactions.push(transaction)
  }

  getTransactions(limit?: number): Transaction[] {
    if (limit) {
      return this.transactions.slice(0, limit)
    }
    return [...this.transactions]
  }

  removeTransactions(transactionIds: string[]): void {
    this.transactions = this.transactions.filter((tx) => !transactionIds.includes(tx.id))
  }

  clear(): void {
    this.transactions = []
  }

  getSize(): number {
    return this.transactions.length
  }

  getTransaction(id: string): Transaction | undefined {
    return this.transactions.find((tx) => tx.id === id)
  }
}
