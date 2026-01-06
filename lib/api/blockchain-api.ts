import { SolanaChain } from "../blockchain/solana-chain"
import { TransactionPool } from "../blockchain/transaction-pool"
import { TransactionValidator } from "../blockchain/transaction-validator"
import { Wallet } from "../blockchain/wallet"
import { ValidatorNetwork } from "../blockchain/validator-network"
import { ConsensusEngine } from "../blockchain/consensus"
import type { Transaction } from "../blockchain/block"

export class BlockchainAPI {
  private blockchain: SolanaChain
  private transactionPool: TransactionPool
  private validator: TransactionValidator
  private validatorNetwork: ValidatorNetwork
  private consensus: ConsensusEngine
  private wallets: Map<string, Wallet> = new Map()

  constructor() {
    this.blockchain = new SolanaChain()
    this.transactionPool = new TransactionPool()
    this.validator = new TransactionValidator(this.blockchain)
    this.validatorNetwork = new ValidatorNetwork()
    this.consensus = new ConsensusEngine(this.validatorNetwork)

    this.validatorNetwork.addValidator("アルファ", 5000)
    this.validatorNetwork.addValidator("ベータ", 3000)
    this.validatorNetwork.addValidator("ガンマ", 4000)
    this.validatorNetwork.addValidator("デルタ", 2500)

    this.blockchain.addValidator("検証者_α")
    this.blockchain.addValidator("検証者_β")
    this.blockchain.addValidator("検証者_γ")
  }

  createWallet(name?: string): { address: string; publicKey: string } {
    const wallet = new Wallet(name)
    this.wallets.set(wallet.address, wallet)
    return {
      address: wallet.address,
      publicKey: wallet.publicKey,
    }
  }

  getWallet(address: string): Wallet | undefined {
    return this.wallets.get(address)
  }

  createTransaction(
    from: string,
    to: string,
    amount: number,
  ): {
    success: boolean
    transaction?: Transaction
    error?: string
  } {
    try {
      const transaction: Transaction = {
        id: "",
        from,
        to,
        amount,
        timestamp: Date.now(),
      }

      const validationResult = this.validator.validateTransaction(transaction)
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error,
        }
      }

      this.blockchain.createTransaction(transaction)
      return {
        success: true,
        transaction: this.blockchain.pendingTransactions[this.blockchain.pendingTransactions.length - 1],
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "不明なエラー",
      }
    }
  }

  async processBlock(): Promise<{
    success: boolean
    block?: any
    error?: string
  }> {
    try {
      if (this.blockchain.pendingTransactions.length === 0) {
        return {
          success: false,
          error: "処理する取引がありません",
        }
      }

      const leader = this.validatorNetwork.selectLeader()

      const block = await this.blockchain.mineBlock()

      const consensusReached = await this.consensus.reachConsensus(block)

      return {
        success: true,
        block: {
          index: block.index,
          timestamp: block.timestamp,
          transactions: block.transactions.length,
          hash: block.hash,
          validator: block.validator,
          leader: leader?.name,
          consensusReached,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "不明なエラー",
      }
    }
  }

  getBalance(address: string): number {
    return this.blockchain.getBalance(address)
  }

  getChainInfo() {
    return this.blockchain.getChainInfo()
  }

  getChain() {
    return this.blockchain.chain
  }

  getBlockchainInstance() {
    return this.blockchain
  }

  getValidatorStats() {
    return {
      network: this.validatorNetwork.getNetworkStats(),
      consensus: this.consensus.getConsensusInfo(),
    }
  }

  addValidator(name: string, stake: number) {
    return this.validatorNetwork.addValidator(name, stake)
  }
}

let apiInstance: BlockchainAPI | null = null

export function getBlockchainAPI(): BlockchainAPI {
  if (!apiInstance) {
    apiInstance = new BlockchainAPI()
  }
  return apiInstance
}
