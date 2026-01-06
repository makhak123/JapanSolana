import type { Block } from "./block"
import type { ValidatorNetwork } from "./validator-network"

export class ConsensusEngine {
  constructor(private validatorNetwork: ValidatorNetwork) {}

  // Simplified Tower BFT (inspired by Solana)
  async validateBlock(block: Block): Promise<{
    valid: boolean
    votes: number
    required: number
  }> {
    const activeValidators = this.validatorNetwork.getActiveValidators()
    const requiredVotes = Math.floor((activeValidators.length * 2) / 3) + 1 // 66% consensus

    // Simulate validator voting
    let votes = 0
    for (const validator of activeValidators) {
      // Higher reputation = more likely to vote correctly
      const voteChance = validator.reputation / 100
      if (Math.random() < voteChance) {
        votes++
      }
    }

    const valid = votes >= requiredVotes

    return {
      valid,
      votes,
      required: requiredVotes,
    }
  }

  async reachConsensus(block: Block): Promise<boolean> {
    const result = await this.validateBlock(block)

    if (result.valid) {
      // Record successful validation for leader
      const leader = this.validatorNetwork.getCurrentLeader()
      if (leader) {
        this.validatorNetwork.recordBlockValidation(leader.id)
      }
    }

    return result.valid
  }

  getConsensusInfo() {
    const stats = this.validatorNetwork.getNetworkStats()
    const requiredVotes = Math.floor((stats.activeValidators * 2) / 3) + 1

    return {
      algorithm: "Tower BFT (簡易版)",
      requiredConsensus: "66%",
      requiredVotes,
      ...stats,
    }
  }
}
