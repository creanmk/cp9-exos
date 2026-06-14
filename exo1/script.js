const ANSWERS = {
  q1: 'b',
  q2: 'c',
  q3: 'a',
  q4: 'c',
  q5: 'b',
  q6: 'a',
  q7: 'b',
  q8: 'c',
  q9: 'b',
  q10: 'c',
}

const LABELS = {
  q1: 'Balise <p> non fermée',
  q2: 'for / id incohérents',
  q3: 'Balise </script> incorrecte',
  q4: 'pointer-events: none',
  q5: 'Sélecteur class vs id',
  q6: 'box-sizing / débordement',
  q7: 'Faute de frappe dans id',
  q8: '= vs ===',
  q9: 'data hors du .then()',
  q10: 'getElementById incohérent avec le HTML',
}

const form = document.getElementById('quiz')
const resultEl = document.getElementById('result')
const resetBtn = document.getElementById('btn-reset')

let submitCount = 0
let trophyEarned = false

function fireConfetti() {
  if (typeof confetti !== 'function') return
  const duration = 2500
  const end = Date.now() + duration
  const tick = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#fbbf24', '#f59e0b', '#2563eb'] })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#fbbf24', '#f59e0b', '#2563eb'] })
    if (Date.now() < end) requestAnimationFrame(tick)
  }
  tick()
  setTimeout(() => confetti({ particleCount: 120, spread: 100, origin: { y: 0.55 }, colors: ['#fbbf24', '#fcd34d', '#2563eb'] }), 200)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  submitCount++

  let score = 0
  const total = Object.keys(ANSWERS).length
  const missed = []

  document.querySelectorAll('.q').forEach((el) => {
    el.classList.remove('correct', 'incorrect')
  })

  for (const [name, correct] of Object.entries(ANSWERS)) {
    const selected = form.querySelector(`input[name="${name}"]:checked`)
    const article = document.querySelector(`.q[data-q="${name.slice(1)}"]`)

    if (selected && selected.value === correct) {
      score++
      article?.classList.add('correct')
    } else {
      article?.classList.add('incorrect')
      missed.push(LABELS[name])
    }
  }

  const pct = Math.round((score / total) * 100)
  const firstTryPerfect = score === total && submitCount === 1
  if (firstTryPerfect) trophyEarned = true
  const showTrophy = trophyEarned && score === total
  let message = ''

  if (firstTryPerfect) {
    message = 'Vous repérez les bugs classiques front et API sans fausse route.'
  } else if (score === total) {
    message = 'Parfait — vous repérez bien les bugs classiques front et API.'
  } else if (score >= 7) {
    message = 'Bon niveau. Relisez les questions en rouge.'
  } else {
    message = 'Revoir HTML/CSS de base, puis fetch + getElementById.'
  }

  resultEl.classList.remove('hidden', 'winner')
  resultEl.innerHTML = `
    ${
      showTrophy
        ? `
      <div class="trophy-wrap">
        <p class="trophy-cup" aria-hidden="true">🏆</p>
        <p class="trophy-title">Coupe du débogueur !</p>
        <p class="trophy-sub">10/10 du premier coup — bravo !</p>
      </div>`
        : ''
    }
    <h2>Résultat</h2>
    <p class="score">${score} / ${total} (${pct}&nbsp;%)</p>
    <p>${message}</p>
    ${
      missed.length
        ? `<p class="hint"><strong>À revoir :</strong> ${missed.join(' · ')}</p>`
        : ''
    }
  `

  if (firstTryPerfect) {
    resultEl.classList.add('winner')
    fireConfetti()
  } else if (showTrophy) {
    resultEl.classList.add('winner')
  }

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})

resetBtn.addEventListener('click', () => {
  form.reset()
  resultEl.classList.add('hidden')
  resultEl.classList.remove('winner')
  resultEl.innerHTML = ''
  document.querySelectorAll('.q').forEach((el) => {
    el.classList.remove('correct', 'incorrect')
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
