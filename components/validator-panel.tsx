"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BlockchainAPI } from "@/lib/api/blockchain-api"

interface ValidatorPanelProps {
  api: BlockchainAPI
  stats: any
  onUpdate: () => void
}

export function ValidatorPanel({ api, stats, onUpdate }: ValidatorPanelProps) {
  const [validatorName, setValidatorName] = useState("")
  const [stake, setStake] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  const handleAddValidator = () => {
    if (!validatorName || !stake) {
      setMessage("名前とステーク額を入力してください")
      return
    }

    const result = api.addValidator(validatorName, Number.parseFloat(stake))

    if (result.success) {
      setMessage(`検証者「${validatorName}」が追加されました`)
      setValidatorName("")
      setStake("")
      onUpdate()
    } else {
      setMessage(result.error || "検証者の追加に失敗しました")
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>検証者ネットワーク</CardTitle>
          <CardDescription>ブロックチェーンを保護する検証者の統計情報</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">総検証者数</div>
                  <div className="font-bold text-2xl">{stats.network.totalValidators}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">アクティブ</div>
                  <div className="font-bold text-2xl text-green-600">{stats.network.activeValidators}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">総ステーク</div>
                  <div className="font-bold text-2xl">{stats.network.totalStake.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs">検証済みブロック</div>
                  <div className="font-bold text-2xl">{stats.network.totalBlocksValidated}</div>
                </div>
              </div>

              {stats.network.currentLeader && (
                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="text-sm font-semibold mb-1">現在のリーダー</div>
                  <div className="text-xs">{stats.network.currentLeader.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ステーク: {stats.network.currentLeader.stake} | 評価: {stats.network.currentLeader.reputation}
                  </div>
                </div>
              )}

              <div className="rounded-lg border p-3">
                <div className="text-sm font-semibold mb-1">コンセンサス情報</div>
                <div className="text-xs text-muted-foreground">アルゴリズム: {stats.consensus.algorithm}</div>
                <div className="text-xs text-muted-foreground">
                  必要なコンセンサス: {stats.consensus.requiredConsensus}
                </div>
                <div className="text-xs text-muted-foreground">必要な票数: {stats.consensus.requiredVotes}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>検証者を追加</CardTitle>
          <CardDescription>新しい検証者をネットワークに追加します (最低ステーク: 1000)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="validatorName">検証者名</Label>
            <Input
              id="validatorName"
              placeholder="例: イプシロン"
              value={validatorName}
              onChange={(e) => setValidatorName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stake">ステーク額</Label>
            <Input
              id="stake"
              type="number"
              placeholder="1000"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
            />
          </div>

          <Button onClick={handleAddValidator} className="w-full">
            検証者を追加
          </Button>

          {message && <div className="rounded-lg border p-3 text-sm text-center bg-muted/50">{message}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
