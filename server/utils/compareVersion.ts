export default function (a: string, b: string) {
  const aParts = a.split('.').map(p => parseInt(p, 10) || 0)
  const bParts = b.split('.').map(p => parseInt(p, 10) || 0)

  const maxLen = Math.max(aParts.length, bParts.length)
  for (let i = 0; i < maxLen; i++) {
    const av = aParts[i] ?? 0
    const bv = bParts[i] ?? 0
    if (av !== bv) {
      return bv - av
    }
  }
  return 0
}
