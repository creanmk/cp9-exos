const ANSWERS = { q1: 'a', q2: 'a', q3: 'a', q4: 'a' }

const form = document.getElementById('quiz')
const resultEl = document.getElementById('result')

function fireConfetti() {
  if (typeof confetti !== 'function') return
  const duration = 2500
  const end = Date.now() + duration
  const tick = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } })
    if (Date.now() < end) requestAnimationFrame(tick)
  }
  tick()
  setTimeout(() => confetti({ particleCount: 150, spread: 100, origin: { y: 0.55 } }), 200)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  let score = 0
  const total = Object.keys(ANSWERS).length

  document.querySelectorAll('.q').forEach((el) => el.classList.remove('ok', 'ko'))

  Object.entries(ANSWERS).forEach(([name, correct], i) => {
    const selected = form.querySelector(`input[name="${name}"]:checked`)
    const block = document.querySelectorAll('.q')[i]
    if (selected?.value === correct) {
      score++
      block?.classList.add('ok')
    } else {
      block?.classList.add('ko')
    }
  })

  resultEl.classList.remove('hidden')

  if (score === total) {
    resultEl.innerHTML = `
      <p class="bingo">Bingo !</p>
      <h2>Bravo — fil rouge débloqué !</h2>
      <img src="drs-logo.png" alt="DR$" class="logo" />
      <p class="name">DR$</p>
      <p class="tagline">Drop Zone &amp; Rush Split</p>
      <p class="desc">Places limitées · course pour réserver · note partagée entre inscrits.</p>
    `
    fireConfetti()
  } else {
    resultEl.innerHTML = `
      <p class="score-fail">${score} / ${total}</p>
      <p class="retry">Relisez les questions en rouge et réessayez — il faut <strong>4/4</strong> pour débloquer le concept.</p>
    `
  }

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})
