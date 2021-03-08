export default function randInt (min: number, max: number): number {
  const r = Math.random()
  const sub = max - min
  return Math.floor(r * sub + min)
}
