import confetti from 'canvas-confetti'

export function fireConfetti(): void {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#FF9EAA', '#FFF0A8', '#A8EEC8', '#CCBFFF', '#FF5757', '#FFE566'],
  })
}
