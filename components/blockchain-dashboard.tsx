"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBlockchainAPI } from "@/lib/api/blockchain-api"
import { BlockExplorer } from "./block-explorer"
import { ValidatorPanel } from "./validator-panel"
import { TransactionForm } from "./transaction-form"
import { WalletManager } from "./wallet-manager"

export function BlockchainDashboard() {
  const [api] = useState(() => getBlockchainAPI())
  const [chainInfo, setChainInfo] = useState<any>(null)
  const [validatorStats, setValidatorStats] = useState<any>(null)

  const updateStats = () => {
    setChainInfo(api.getChainInfo())
    setValidatorStats(api.getValidatorStats())
  }

  useEffect(() => {
    updateStats()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="font-bold text-6xl mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          ソラナ
        </h1>
        <p className="text-muted-foreground text-lg">高速分散型ブロックチェーン</p>
        <p className="text-muted-foreground text-sm mt-2">Solana Japanese Fork - Demo Implementation</p>
      </header>

      {chainInfo && (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">ブロック数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{chainInfo.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">検証者</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{chainInfo.validators}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">保留中の取引</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{chainInfo.pendingTransactions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">チェーン状態</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{chainInfo.isValid ? "✓" : "✗"}</div>
              <p className="text-muted-foreground text-xs">{chainInfo.isValid ? "有効" : "無効"}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">取引</TabsTrigger>
          <TabsTrigger value="wallets">ウォレット</TabsTrigger>
          <TabsTrigger value="blocks">ブロック</TabsTrigger>
          <TabsTrigger value="validators">検証者</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionForm api={api} onUpdate={updateStats} />
        </TabsContent>

        <TabsContent value="wallets" className="space-y-4">
          <WalletManager api={api} onUpdate={updateStats} />
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <BlockExplorer api={api} />
        </TabsContent>

        <TabsContent value="validators" className="space-y-4">
          <ValidatorPanel api={api} stats={validatorStats} onUpdate={updateStats} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
