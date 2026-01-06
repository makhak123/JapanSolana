"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BlockchainAPI } from "@/lib/api/blockchain-api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TransactionFormProps {
  api: BlockchainAPI
  onUpdate: () => void
}

export function TransactionForm({ api, onUpdate }: TransactionFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleCreateTransaction = () => {
    if (!from || !to || !amount) {
      setMessage({ type: "error", text: "すべてのフィールドを入力してください" })
      return
    }

    const result = api.createTransaction(from, to, Number.parseFloat(amount))

    if (result.success) {
      setMessage({ type: "success", text: `取引が作成されました: ${result.transaction?.id.substring(0, 16)}...` })
      setAmount("")
      onUpdate()
    } else {
      setMessage({ type: "error", text: result.error || "取引の作成に失敗しました" })
    }
  }

  const handleProcessBlock = async () => {
    setProcessing(true)
    const result = await api.processBlock()
    setProcessing(false)

    if (result.success) {
      setMessage({
        type: "success",
        text: `ブロック #${result.block?.index} が処理されました (検証者: ${result.block?.leader})`,
      })
      onUpdate()
    } else {
      setMessage({ type: "error", text: result.error || "ブロックの処理に失敗しました" })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>新しい取引を作成</CardTitle>
          <CardDescription>送信者と受信者のアドレスを入力して取引を作成します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from">送信者アドレス</Label>
            <Input
              id="from"
              placeholder="送信者のウォレットアドレス"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">受信者アドレス</Label>
            <Input
              id="to"
              placeholder="受信者のウォレットアドレス"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">金額</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCreateTransaction} className="flex-1">
              取引を作成
            </Button>
            <Button onClick={handleProcessBlock} disabled={processing} variant="secondary">
              {processing ? "処理中..." : "ブロックを処理"}
            </Button>
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
