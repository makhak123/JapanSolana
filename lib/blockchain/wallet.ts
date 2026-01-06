import crypto from "crypto"

export class Wallet {
  public address: string
  private privateKey: string
  public publicKey: string

  constructor(name?: string) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    })

    this.publicKey = publicKey.export({ type: "pkcs1", format: "pem" }).toString()
    this.privateKey = privateKey.export({ type: "pkcs1", format: "pem" }).toString()

    // Generate address from public key
    this.address = this.generateAddress(name)
  }

  private generateAddress(name?: string): string {
    const hash = crypto.createHash("sha256").update(this.publicKey).digest("hex")

    // Add Japanese prefix if name provided
    return name ? `${name}_${hash.substring(0, 16)}` : hash.substring(0, 32)
  }

  signTransaction(transactionData: string): string {
    const sign = crypto.createSign("SHA256")
    sign.update(transactionData)
    sign.end()
    return sign.sign(this.privateKey, "hex")
  }
}
