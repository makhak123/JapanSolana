import type { Transaction } from "./block"
import type { SolanaChain } from "./solana-chain"

export class TransactionValidator {
  constructor(private blockchain: SolanaChain) {}

  validateTransaction(transaction: Transaction): {
    valid: boolean
    error?: string
  } {
    // Check if addresses are valid
    if (!transaction.from || !transaction.to) {
      return {
        valid: false,
        error: "送信者または受信者のアドレスが無効です",
      }
    }

    // Check if amount is positive
    if (transaction.amount <= 0) {
      return {
        valid: false,
        error: "取引金額は正の数である必要があります",
      }
    }

    // Check if sender has sufficient balance
    const balance = this.blockchain.getBalance(transaction.from)
    if (balance < transaction.amount) {
      return {
        valid: false,
        error: `残高不足: ${balance} < ${transaction.amount}`,
      }
    }

    // Check if sender and receiver are different
    if (transaction.from === transaction.to) {
      return {
        valid: false,
        error: "自分自身に送金することはできません",
      }
    }

    return { valid: true }
  }

  validateBlock(transactions: Transaction[]): {
    valid: boolean
    invalidTransactions: string[]
    errors: string[]
  } {
    const invalidTransactions: string[] = []
    const errors: string[] = []

    for (const transaction of transactions) {
      const result = this.validateTransaction(transaction)
      if (!result.valid) {
        invalidTransactions.push(transaction.id)
        errors.push(result.error || "不明なエラー")
      }
    }

    return {
      valid: invalidTransactions.length === 0,
      invalidTransactions,
      errors,
    }
  }
}
