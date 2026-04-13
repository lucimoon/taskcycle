import confetti from 'canvas-confetti'

export function fireConfetti(): void {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#FF6B6B', '#FFD93D', '#52C99B', '#9B8FFF', '#74C0FC', '#FF9F3C'],
  })
}
