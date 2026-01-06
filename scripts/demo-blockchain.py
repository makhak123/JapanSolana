"""
ソラナ Demo Script

This script demonstrates the basic functionality of the blockchain:
1. Create wallets
2. Create transactions
3. Process blocks
4. Validate chain
"""

import requests
import json
import time

class SolanaDemo:
    def __init__(self):
        self.wallets = []
        
    def demo(self):
        print("=" * 60)
        print("ソラナ (Solana Japanese Fork) - Demo")
        print("=" * 60)
        print()
        
        print("📝 This is a simplified blockchain demonstration")
        print("   inspired by Solana's architecture")
        print()
        
        print("🔑 Key Features:")
        print("   ✓ Proof of History (PoH) inspired block creation")
        print("   ✓ Proof of Stake (PoS) validator selection")
        print("   ✓ Tower BFT consensus mechanism")
        print("   ✓ Fast block times (~400ms)")
        print()
        
        print("🏗️  Architecture:")
        print("   • Blockchain Core (blocks, transactions, wallets)")
        print("   • Transaction System (pool, validation)")
        print("   • Validator Network (PoS, consensus)")
        print("   • Japanese Web Interface")
        print()
        
        print("⚠️  Educational Demo - Not for Production:")
        print("   • Simplified cryptography")
        print("   • In-memory storage (no persistence)")
        print("   • Single node (no network layer)")
        print("   • Mock consensus implementation")
        print()
        
        print("🚀 To use the blockchain:")
        print("   1. Run: npm run dev")
        print("   2. Open: http://localhost:3000")
        print("   3. Create wallets in the ウォレット (Wallet) tab")
        print("   4. Send transactions in the 取引 (Transaction) tab")
        print("   5. View blocks in the ブロック (Block) explorer")
        print("   6. Monitor validators in the 検証者 (Validator) tab")
        print()
        
        print("📖 Example Usage:")
        print()
        print("// Create a wallet")
        print("const wallet = api.createWallet('太郎')")
        print("console.log(wallet.address)")
        print()
        
        print("// Send a transaction")
        print("const result = api.createTransaction(")
        print("  'sender_address',")
        print("  'receiver_address',")
        print("  100")
        print(")")
        print()
        
        print("// Process pending transactions")
        print("await api.processBlock()")
        print()
        
        print("// Check balance")
        print("const balance = api.getBalance(wallet.address)")
        print()
        
        print("=" * 60)
        print("Ready to explore! Visit http://localhost:3000")
        print("=" * 60)

if __name__ == "__main__":
    demo = SolanaDemo()
    demo.demo()
