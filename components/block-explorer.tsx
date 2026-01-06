"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlockchainAPI } from "@/lib/api/blockchain-api"

interface BlockExplorerProps {
  api: BlockchainAPI
}

export function BlockExplorer({ api }: BlockExplorerProps) {
  const [blocks, setBlocks] = useState<any[]>([])

  useEffect(() => {
    setBlocks(api.getChain())
  }, [api])

  const refreshBlocks = () => {
    setBlocks(api.getChain())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ブロックエクスプローラー</CardTitle>
        <CardDescription>チェーン上のすべてのブロックを表示します</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {blocks
            .slice()
            .reverse()
            .map((block, index) => (
              <div key={block.index} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">ブロック #{block.index}</div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(block.timestamp).toLocaleString("ja-JP")}
                  </div>
                </div>

                <div className="font-mono text-xs break-all text-muted-foreground">
                  <span className="font-semibold">ハッシュ:</span> {block.hash}
                </div>

                {block.previousHash !== "0" && (
                  <div className="font-mono text-xs break-all text-muted-foreground">
                    <span className="font-semibold">前のハッシュ:</span> {block.previousHash}
                  </div>
                )}

                {block.validator && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold">検証者:</span> {block.validator}
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">取引数:</span> {block.transactions.length}
                </div>

                {block.transactions.length > 0 && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    {block.transactions.map((tx: any, txIndex: number) => (
                      <div key={txIndex} className="bg-muted/50 rounded p-2 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">取引 {txIndex + 1}</span>
                          <span className="font-bold text-green-600">{tx.amount} SOL</span>
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {tx.from.substring(0, 24)}... → {tx.to.substring(0, 24)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
