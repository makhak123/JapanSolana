"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BlockchainAPI } from "@/lib/api/blockchain-api"

interface WalletManagerProps {
  api: BlockchainAPI
  onUpdate: () => void
}

export function WalletManager({ api, onUpdate }: WalletManagerProps) {
  const [wallets, setWallets] = useState<Array<{ address: string; balance: number }>>([])
  const [walletName, setWalletName] = useState("")
  const [checkAddress, setCheckAddress] = useState("")
  const [balance, setBalance] = useState<number | null>(null)

  const handleCreateWallet = () => {
    const wallet = api.createWallet(walletName || undefined)
    const balance = api.getBalance(wallet.address)

    setWallets([...wallets, { address: wallet.address, balance }])
    setWalletName("")
    onUpdate()
  }

  const handleCheckBalance = () => {
    if (checkAddress) {
      const bal = api.getBalance(checkAddress)
      setBalance(bal)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>新しいウォレットを作成</CardTitle>
          <CardDescription>ブロックチェーン上で取引を行うための新しいウォレットを作成します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletName">ウォレット名 (オプション)</Label>
            <Input
              id="walletName"
              placeholder="例: 太郎のウォレット"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
          </div>

          <Button onClick={handleCreateWallet} className="w-full">
            ウォレットを作成
          </Button>

          {wallets.length > 0 && (
            <div className="space-y-2 mt-4">
              <Label>作成されたウォレット</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {wallets.map((wallet, index) => (
                  <div key={index} className="rounded-lg border p-3 text-sm">
                    <div className="font-mono break-all text-xs">{wallet.address}</div>
                    <div className="text-muted-foreground text-xs mt-1">残高: {wallet.balance}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>残高を確認</CardTitle>
          <CardDescription>ウォレットアドレスの残高を確認します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkAddress">ウォレットアドレス</Label>
            <Input
              id="checkAddress"
              placeholder="アドレスを入力"
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
            />
          </div>

          <Button onClick={handleCheckBalance} className="w-full" variant="secondary">
            残高を確認
          </Button>

          {balance !== null && (
            <div className="rounded-lg border p-4 text-center">
              <div className="text-muted-foreground text-sm">残高</div>
              <div className="font-bold text-3xl mt-1">{balance}</div>
              <div className="text-muted-foreground text-xs mt-1">SOL</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
