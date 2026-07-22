import { ArrowUpDown, Delete } from "lucide-react"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useExchangeRate } from "@/hooks/use-exchange-rate"
import { formatDisplay, formatEUR, formatKRW } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useRef, useState } from "react"

type Direction = "KRW" | "EUR"

const QUICK_AMOUNTS = [10_000, 100_000, 500_000]

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"]

const LONG_PRESS_MS = 500

export function Converter() {
  const [direction, setDirection] = useState<Direction>("KRW")
  const [rawInput, setRawInput] = useState("0")

  const isOnline = useOnlineStatus()
  const { rate, sourceLabel } = useExchangeRate(isOnline)

  const longPressTimer = useRef<number | null>(null)
  const longPressTriggered = useRef(false)

  const value = parseFloat(rawInput) || 0
  const resultValue = direction === "KRW" ? value * rate : value / rate
  const resultCurrency: Direction = direction === "KRW" ? "EUR" : "KRW"

  function pressKey(k: string) {
    if (k === "back") {
      // A long press already cleared the field via handleBackspaceDown.
      if (longPressTriggered.current) {
        longPressTriggered.current = false
        return
      }
      setRawInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
      return
    }
    setRawInput((prev) => {
      if (k === ".") return prev.includes(".") ? prev : prev + "."
      return prev === "0" ? k : prev + k
    })
  }

  function handleBackspacePressStart() {
    longPressTriggered.current = false
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true
      setRawInput("0")
    }, LONG_PRESS_MS)
  }

  function handleBackspacePressEnd() {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  function swap() {
    setDirection((d) => (d === "KRW" ? "EUR" : "KRW"))
    setRawInput("0")
  }

  function quickAmount(amount: number) {
    setDirection("KRW")
    setRawInput(String(amount))
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-6 pt-[calc(env(safe-area-inset-top)+20px)]">
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-[17px] font-semibold">Convertisseur</h1>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isOnline ? "bg-emerald-400" : "bg-amber-500",
            )}
          />
          {isOnline ? "En ligne" : "Hors ligne"}
        </div>
      </header>

      <div className="px-2 pb-6 pt-5 text-center">
        <div className="break-all text-[44px] leading-[1.1] font-semibold">
          {rawInput === "0" ? "0" : formatDisplay(rawInput)}
          <span className="ml-1 text-xl font-medium text-muted-foreground">
            {direction}
          </span>
        </div>

        <div className="my-3.5 flex items-center justify-center">
          <button
            type="button"
            onClick={swap}
            aria-label="Inverser le sens de conversion"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card active:bg-card-2"
          >
            <ArrowUpDown className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="break-all text-[44px] leading-[1.1] font-semibold text-primary">
          {direction === "KRW"
            ? formatEUR(resultValue)
            : formatKRW(resultValue)}
          <span className="ml-1 text-xl font-medium text-muted-foreground">
            {resultCurrency}
          </span>
        </div>

        <div className="mt-3.5 text-center text-xs text-muted-foreground">
          1 EUR = <b className="font-semibold text-foreground">{formatKRW(1 / rate)}</b> KRW
          &middot; {sourceLabel}
        </div>
      </div>

      <div className="flex gap-2 px-1 pb-5">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => quickAmount(amount)}
            className="flex-1 rounded-xl border border-border bg-card py-2.5 text-[13px] font-medium active:bg-card-2"
          >
            {formatKRW(amount)}
          </button>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-3 gap-0.5">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => pressKey(k)}
            onPointerDown={k === "back" ? handleBackspacePressStart : undefined}
            onPointerUp={k === "back" ? handleBackspacePressEnd : undefined}
            onPointerLeave={k === "back" ? handleBackspacePressEnd : undefined}
            onContextMenu={
              k === "back" ? (e) => e.preventDefault() : undefined
            }
            aria-label={k === "back" ? "Effacer (appui long : tout effacer)" : undefined}
            className="flex items-center justify-center rounded-2xl py-[18px] text-[26px] font-medium active:bg-card"
          >
            {k === "back" ? <Delete className="h-[22px] w-[22px]" /> : k}
          </button>
        ))}
      </div>
    </div>
  )
}
