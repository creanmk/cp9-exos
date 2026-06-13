const ANSWERS = {
  q1: 'a',
  q2: 'a',
  q3: 'a',
  q4: 'a',
  q5: 'a',
  q6: 'a',
  q7: 'a',
  q8: 'a',
  q9: 'a',
  q10: 'a',
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

form.addEventListener('submit', (e) => {
  e.preventDefault()

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
  let message = ''

  if (score === total) {
    message = 'Parfait — vous repérez bien les bugs classiques front et API.'
  } else if (score >= 7) {
    message = 'Bon niveau. Relisez les questions en rouge.'
  } else {
    message = 'Revoir HTML/CSS de base, puis fetch + getElementById.'
  }

  resultEl.classList.remove('hidden')
  resultEl.innerHTML = `
    <h2>Résultat</h2>
    <p class="score">${score} / ${total} (${pct}&nbsp;%)</p>
    <p>${message}</p>
    ${
      missed.length
        ? `<p class="hint"><strong>À revoir :</strong> ${missed.join(' · ')}</p>`
        : ''
    }
  `

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})

resetBtn.addEventListener('click', () => {
  form.reset()
  resultEl.classList.add('hidden')
  resultEl.innerHTML = ''
  document.querySelectorAll('.q').forEach((el) => {
    el.classList.remove('correct', 'incorrect')
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
