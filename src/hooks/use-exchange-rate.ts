import { useEffect, useState } from "react"
import { FALLBACK_RATE, resolveExchangeRate } from "@/lib/exchange-rate"

function labelForSource(
  source: Awaited<ReturnType<typeof resolveExchangeRate>>["source"],
) {
  switch (source.kind) {
    case "live":
      return "taux en direct"
    case "cached":
      return `taux du ${new Date(source.ts).toLocaleDateString("fr-FR")}`
    case "fallback":
      return "taux hors ligne (secours)"
  }
}

export function useExchangeRate(isOnline: boolean) {
  const [rate, setRate] = useState(FALLBACK_RATE)
  const [sourceLabel, setSourceLabel] = useState(
    "taux hors ligne (secours)",
  )
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    resolveExchangeRate().then(({ rate, source }) => {
      if (cancelled) return
      setRate(rate)
      setSourceLabel(labelForSource(source))
      setIsLive(source.kind === "live")
    })
    return () => {
      cancelled = true
    }
    // Re-attempt whenever connectivity is restored, to refresh a stale/cached rate.
  }, [isOnline])

  return { rate, sourceLabel, isLive }
}
