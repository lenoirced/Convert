// 1 KRW en EUR — à mettre à jour avant le départ si besoin
export const FALLBACK_RATE = 0.00066

const STORAGE_KEY = "krw_eur_rate"

interface CachedRate {
  rate: number
  ts: number
}

function readCache(): CachedRate | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CachedRate) : null
  } catch {
    return null
  }
}

function writeCache(rate: number) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ rate, ts: Date.now() }))
}

export type RateSource =
  | { kind: "live" }
  | { kind: "cached"; ts: number }
  | { kind: "fallback" }

export async function resolveExchangeRate(): Promise<{
  rate: number
  source: RateSource
}> {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=KRW&to=EUR",
    )
    if (!res.ok) throw new Error("bad response")
    const data = await res.json()
    const rate = data.rates.EUR as number
    writeCache(rate)
    return { rate, source: { kind: "live" } }
  } catch {
    const cached = readCache()
    if (cached) {
      return { rate: cached.rate, source: { kind: "cached", ts: cached.ts } }
    }
    return { rate: FALLBACK_RATE, source: { kind: "fallback" } }
  }
}
