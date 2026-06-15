const TESTS = [
  {
    id: 'a',
    label: 'A',
    text: "L'organisateur de la promo valide que le parcours « réserver une place » correspond à ce qu'il a demandé.",
    level: 'Acceptation',
  },
  {
    id: 'b',
    label: 'B',
    text: 'verifierPlacesDisponibles(drop) retourne false si 0 place restante.',
    level: 'Unitaire',
  },
  {
    id: 'c',
    label: 'C',
    text: 'Le clic sur « Réserver » déclenche bien l\'appel API qui décrémente le compteur en base.',
    level: 'Intégration',
  },
  {
    id: 'd',
    label: 'D',
    text: 'Le parcours complet (login → drop → réservation → split) fonctionne sur l\'environnement de recette.',
    level: 'Système',
  },
]

const CORRECT_ORDER = ['b', 'c', 'd', 'a']

const listEl = document.getElementById('sortable')
const resultEl = document.getElementById('result')
const btnCheck = document.getElementById('btn-check')
const btnReset = document.getElementById('btn-reset')

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function render(tests) {
  listEl.innerHTML = tests
    .map(
      (t, i) => `
    <li class="item" data-id="${t.id}">
      <div class="rank">${i + 1}</div>
      <div class="body">
        <span class="test-label">Test ${t.label}</span>
        <p class="test-text">${t.text}</p>
      </div>
      <div class="move">
        <button type="button" class="btn-icon" data-dir="up" aria-label="Monter">▲</button>
        <button type="button" class="btn-icon" data-dir="down" aria-label="Descendre">▼</button>
      </div>
    </li>
  `
    )
    .join('')

  updateRanks()
}

function updateRanks() {
  listEl.querySelectorAll('.item').forEach((el, i) => {
    el.querySelector('.rank').textContent = i + 1
  })
}

function getOrder() {
  return [...listEl.querySelectorAll('.item')].map((el) => el.dataset.id)
}

function init() {
  render(shuffle(TESTS))
  resultEl.classList.add('hidden')
  resultEl.innerHTML = ''
}

listEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-dir]')
  if (!btn) return

  const item = btn.closest('.item')
  const items = [...listEl.children]
  const idx = items.indexOf(item)

  if (btn.dataset.dir === 'up' && idx > 0) {
    listEl.insertBefore(item, items[idx - 1])
  }
  if (btn.dataset.dir === 'down' && idx < items.length - 1) {
    listEl.insertBefore(items[idx + 1], item)
  }

  updateRanks()
  listEl.querySelectorAll('.item').forEach((el) => el.classList.remove('ok', 'ko'))
  resultEl.classList.add('hidden')
})

btnCheck.addEventListener('click', () => {
  const order = getOrder()
  const perfect = order.every((id, i) => id === CORRECT_ORDER[i])

  listEl.querySelectorAll('.item').forEach((el, i) => {
    el.classList.remove('ok', 'ko')
    el.classList.add(order[i] === CORRECT_ORDER[i] ? 'ok' : 'ko')
  })

  resultEl.classList.remove('hidden')

  if (perfect) {
    resultEl.innerHTML = `
      <p class="score-ok">Parfait !</p>
      <h2>B → C → D → A</h2>
      <ol class="explain">
        <li><strong>B — Unitaire</strong> : tester la fonction isolée avant tout.</li>
        <li><strong>C — Intégration</strong> : front + API + base ensemble.</li>
        <li><strong>D — Système</strong> : parcours complet sur la recette.</li>
        <li><strong>A — Acceptation</strong> : validation métier par l'organisateur / PO.</li>
      </ol>
      <p class="tagline">On monte du code vers le client — pas l'inverse.</p>
    `
  } else {
    const okCount = order.filter((id, i) => id === CORRECT_ORDER[i]).length
    resultEl.innerHTML = `
      <p class="score-partial">${okCount} / 4 bon(s) emplacement(s)</p>
      <p>Ordre attendu : <strong>B → C → D → A</strong> (unitaire → intégration → système → acceptation).</p>
      <p class="retry">Les cartes vertes sont bien placées · corrigez les rouges et revalidez.</p>
    `
  }

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})

btnReset.addEventListener('click', init)

init()
