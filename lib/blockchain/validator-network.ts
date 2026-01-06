interface ValidatorNode {
  id: string
  name: string
  stake: number
  blocksValidated: number
  reputation: number
  isActive: boolean
  joinedAt: number
}

export class ValidatorNetwork {
  private validators: Map<string, ValidatorNode> = new Map()
  private readonly MIN_STAKE = 1000 // Minimum stake to become validator
  private currentLeader: string | null = null

  addValidator(
    name: string,
    stake: number,
  ): {
    success: boolean
    validator?: ValidatorNode
    error?: string
  } {
    if (stake < this.MIN_STAKE) {
      return {
        success: false,
        error: `最低ステーク額は ${this.MIN_STAKE} です`,
      }
    }

    const id = `検証者_${name}_${Date.now().toString(36)}`

    const validator: ValidatorNode = {
      id,
      name,
      stake,
      blocksValidated: 0,
      reputation: 100,
      isActive: true,
      joinedAt: Date.now(),
    }

    this.validators.set(id, validator)

    return {
      success: true,
      validator,
    }
  }

  removeValidator(id: string): boolean {
    return this.validators.delete(id)
  }

  getValidator(id: string): ValidatorNode | undefined {
    return this.validators.get(id)
  }

  getAllValidators(): ValidatorNode[] {
    return Array.from(this.validators.values())
  }

  getActiveValidators(): ValidatorNode[] {
    return Array.from(this.validators.values()).filter((v) => v.isActive)
  }

  // Simplified Proof of Stake leader selection
  selectLeader(): ValidatorNode | null {
    const activeValidators = this.getActiveValidators()

    if (activeValidators.length === 0) {
      return null
    }

    // Weight by stake amount
    const totalStake = activeValidators.reduce((sum, v) => sum + v.stake, 0)
    let random = Math.random() * totalStake

    for (const validator of activeValidators) {
      random -= validator.stake
      if (random <= 0) {
        this.currentLeader = validator.id
        return validator
      }
    }

    // Fallback to first validator
    const leader = activeValidators[0]
    this.currentLeader = leader.id
    return leader
  }

  getCurrentLeader(): ValidatorNode | null {
    if (!this.currentLeader) {
      return null
    }
    return this.validators.get(this.currentLeader) || null
  }

  recordBlockValidation(validatorId: string): void {
    const validator = this.validators.get(validatorId)
    if (validator) {
      validator.blocksValidated++
      validator.reputation = Math.min(100, validator.reputation + 1)
    }
  }

  penalizeValidator(validatorId: string, amount: number): void {
    const validator = this.validators.get(validatorId)
    if (validator) {
      validator.reputation = Math.max(0, validator.reputation - amount)
      if (validator.reputation < 50) {
        validator.isActive = false
      }
    }
  }

  getNetworkStats() {
    const validators = this.getAllValidators()
    const activeCount = this.getActiveValidators().length
    const totalStake = validators.reduce((sum, v) => sum + v.stake, 0)
    const totalBlocks = validators.reduce((sum, v) => sum + v.blocksValidated, 0)

    return {
      totalValidators: validators.length,
      activeValidators: activeCount,
      totalStake,
      totalBlocksValidated: totalBlocks,
      currentLeader: this.getCurrentLeader(),
      averageReputation:
        validators.length > 0 ? validators.reduce((sum, v) => sum + v.reputation, 0) / validators.length : 0,
    }
  }
}
