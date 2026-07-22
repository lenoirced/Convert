// "." pour les milliers, "," pour les décimales (ex. 1.234,56).
const NUMBER_LOCALE = "de-DE"

export function formatKRW(n: number) {
  return Math.round(n).toLocaleString(NUMBER_LOCALE)
}

export function formatEUR(n: number) {
  return n.toLocaleString(NUMBER_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDisplay(raw: string) {
  if (raw.includes(".")) {
    const [i, d] = raw.split(".")
    return Number(i).toLocaleString(NUMBER_LOCALE) + "," + d
  }
  return Number(raw).toLocaleString(NUMBER_LOCALE)
}
