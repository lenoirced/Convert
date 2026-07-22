export function formatKRW(n: number) {
  return Math.round(n).toLocaleString("fr-FR")
}

export function formatEUR(n: number) {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDisplay(raw: string) {
  if (raw.includes(".")) {
    const [i, d] = raw.split(".")
    return Number(i).toLocaleString("fr-FR") + "," + d
  }
  return Number(raw).toLocaleString("fr-FR")
}
