const TYPES = [
  { id: 'nominal', label: 'Nominal', hint: 'Cas qui doit réussir' },
  { id: 'erreur', label: 'Erreur', hint: 'Données ou action invalides' },
  { id: 'limite', label: 'Limite', hint: 'Frontière du métier' },
  { id: 'hors', label: 'Hors scope', hint: 'Autre acteur ou autre US' },
]

const USER_STORIES = {
  a: {
    group: 'A',
    text: "En tant qu'<strong>organisateur</strong>, je veux <strong>créer une sortie</strong> avec un drop et des places limitées afin de gérer les inscriptions automatiquement.",
    thinList: "Une équipe n'a listé que : « Création OK avec tous les champs » et « Sortie visible en liste ».",
    qcm: {
      question: 'Quels scénarios manquent encore pour une couverture minimale (2 err. + 1 lim.) ?',
      options: [
        { id: 'a1', text: 'Création sans prix → message de validation', correct: true },
        { id: 'a2', text: 'Places max = 0 → refusé', correct: true },
        { id: 'a3', text: 'Création avec 1 seule place (minimum valide)', correct: true },
        { id: 'a4', text: 'Participant réserve sa place sur le drop', correct: false },
        { id: 'a5', text: 'Login organisateur réussi', correct: false },
        { id: 'a6', text: 'Export PDF du split', correct: false },
      ],
    },
    scenarios: [
      { id: 'a-s1', text: 'Organisateur remplit titre, prix, places max et date de drop valides → sortie créée et visible en liste.', correct: 'nominal' },
      { id: 'a-s2', text: 'Organisateur crée une deuxième sortie le même jour → les deux sorties apparaissent distinctement.', correct: 'nominal' },
      { id: 'a-s3', text: 'Organisateur laisse le champ prix vide → message d\'erreur, aucune sortie créée.', correct: 'erreur' },
      { id: 'a-s4', text: 'Organisateur saisit 0 ou −1 places maximum → création refusée.', correct: 'erreur' },
      { id: 'a-s5', text: 'Organisateur crée une sortie avec exactement 1 place (minimum métier valide).', correct: 'limite' },
      { id: 'a-s6', text: 'Organisateur saisit une date de drop dans le passé → erreur affichée.', correct: 'limite' },
      { id: 'a-s7', text: 'Participant clique « Réserver » pendant le drop ouvert.', correct: 'hors' },
      { id: 'a-s8', text: 'Inscrit consulte son montant dû sur la page Split.', correct: 'hors' },
    ],
  },
  b: {
    group: 'B',
    text: "En tant qu'<strong>utilisateur</strong>, je veux <strong>me connecter</strong> à mon compte afin d'accéder aux drops disponibles.",
    thinList: "Une équipe n'a listé que : « Login email/mdp corrects » et « Liste des drops affichée ».",
    qcm: {
      question: 'Quels scénarios manquent encore pour une couverture minimale (2 err. + 1 lim.) ?',
      options: [
        { id: 'b1', text: 'Mot de passe incorrect → accès refusé', correct: true },
        { id: 'b2', text: 'Champs email et mot de passe vides → message d\'erreur', correct: true },
        { id: 'b3', text: 'Email sans arobase (format invalide)', correct: true },
        { id: 'b4', text: 'Organisateur crée une sortie avec 8 places', correct: false },
        { id: 'b5', text: 'Split affiché après fermeture du drop', correct: false },
        { id: 'b6', text: 'Timer du drop décompte correctement', correct: false },
      ],
    },
    scenarios: [
      { id: 'b-s1', text: 'Utilisateur saisit email et mot de passe valides → redirection vers la liste des drops.', correct: 'nominal' },
      { id: 'b-s2', text: 'Utilisateur déjà inscrit se reconnecte le lendemain → accès immédiat aux drops.', correct: 'nominal' },
      { id: 'b-s3', text: 'Mot de passe incorrect → message d\'erreur, pas de connexion.', correct: 'erreur' },
      { id: 'b-s4', text: 'Email inconnu dans la base → accès refusé.', correct: 'erreur' },
      { id: 'b-s5', text: 'Email saisi sans arobase (ex. testdrs.fr) → validation échoue.', correct: 'limite' },
      { id: 'b-s6', text: '10 tentatives de connexion échouées d\'affilée → compte temporairement bloqué.', correct: 'limite' },
      { id: 'b-s7', text: 'Organisateur définit le prix total d\'une sortie à 120 €.', correct: 'hors' },
      { id: 'b-s8', text: 'Observateur consulte les sorties sans se connecter.', correct: 'hors' },
    ],
  },
  c: {
    group: 'C',
    text: "En tant qu'<strong>inscrit</strong>, je veux <strong>consulter mon montant dû</strong> après fermeture du drop afin de savoir ce que je dois payer.",
    thinList: "Une équipe n'a listé que : « Montant = total ÷ inscrits » et « Page split accessible après DROP_CLOSED ».",
    qcm: {
      question: 'Quels scénarios manquent encore pour une couverture minimale (2 err. + 1 lim.) ?',
      options: [
        { id: 'c1', text: 'Consultation du split avant fermeture du drop → refus', correct: true },
        { id: 'c2', text: 'Utilisateur non inscrit accède à l\'URL split → accès refusé', correct: true },
        { id: 'c3', text: 'Un seul inscrit : montant = 100 % du total', correct: true },
        { id: 'c4', text: 'Création de sortie par l\'organisateur', correct: false },
        { id: 'c5', text: 'Double réservation même utilisateur', correct: false },
        { id: 'c6', text: 'Bouton Réserver grisé quand complet', correct: false },
      ],
    },
    scenarios: [
      { id: 'c-s1', text: 'Inscrit ouvre la page Split après DROP_CLOSED → montant = prix total ÷ nombre d\'inscrits.', correct: 'nominal' },
      { id: 'c-s2', text: 'Deux inscrits différents voient le même montant par personne sur la page Split.', correct: 'nominal' },
      { id: 'c-s3', text: 'Inscrit tente d\'accéder au Split alors que le drop est encore OPEN → message ou redirection.', correct: 'erreur' },
      { id: 'c-s4', text: 'Utilisateur connecté mais non inscrit à la sortie accède au Split → accès refusé.', correct: 'erreur' },
      { id: 'c-s5', text: 'Un seul inscrit sur la sortie → montant dû = 100 % du prix total.', correct: 'limite' },
      { id: 'c-s6', text: 'Aucun inscrit après fermeture → page Split gère le cas sans crash (0 inscrit).', correct: 'limite' },
      { id: 'c-s7', text: 'Utilisateur se connecte avec email et mot de passe.', correct: 'hors' },
      { id: 'c-s8', text: 'Organisateur lance manuellement l\'ouverture du drop.', correct: 'hors' },
    ],
  },
}

let pickedUs = null
const answers = {}
const qcmAnswers = new Set()

const stepPick = document.getElementById('step-pick')
const stepClassify = document.getElementById('step-classify')
const stepQcm = document.getElementById('step-qcm')
const stepResult = document.getElementById('step-result')

function show(el) {
  el.classList.remove('hidden')
}
function hide(el) {
  el.classList.add('hidden')
}

function renderUsGrid() {
  const grid = document.getElementById('us-grid')
  grid.innerHTML = Object.entries(USER_STORIES)
    .map(
      ([key, us]) => `
    <button type="button" class="us-card" data-us="${key}">
      <span class="us-badge">US ${us.group}</span>
      <p>${us.text}</p>
    </button>
  `
    )
    .join('')

  grid.querySelectorAll('.us-card').forEach((btn) => {
    btn.addEventListener('click', () => startClassify(btn.dataset.us))
  })
}

function startClassify(usKey) {
  pickedUs = usKey
  const us = USER_STORIES[usKey]
  Object.keys(answers).forEach((k) => delete answers[k])
  qcmAnswers.clear()

  document.getElementById('us-banner').innerHTML = `
    <div class="us-banner">
      <span class="us-badge">US ${us.group}</span>
      <p>${us.text}</p>
    </div>
  `

  const list = document.getElementById('scenario-list')
  list.innerHTML = us.scenarios
    .map(
      (s, i) => `
    <article class="scenario" data-id="${s.id}">
      <p class="scenario-num">${i + 1}</p>
      <p class="scenario-text">${s.text}</p>
      <div class="type-row" role="group" aria-label="Type de scénario ${i + 1}">
        ${TYPES.map(
          (t) => `
          <label class="type-opt">
            <input type="radio" name="${s.id}" value="${t.id}" />
            <span>${t.label}</span>
          </label>
        `
        ).join('')}
      </div>
    </article>
  `
    )
    .join('')

  hide(stepPick)
  hide(stepResult)
  hide(stepQcm)
  show(stepClassify)
  stepClassify.scrollIntoView({ behavior: 'smooth' })
}

function startQcm() {
  const us = USER_STORIES[pickedUs]
  document.getElementById('qcm-intro').innerHTML = `
    <strong>Liste incomplète d'une équipe :</strong> ${us.thinList}
  `

  const block = document.getElementById('qcm-block')
  block.innerHTML = `
    <p class="qcm-q">${us.qcm.question}</p>
    <p class="hint">Cochez <strong>tous</strong> les scénarios manquants pertinents.</p>
    <div class="qcm-opts">
      ${us.qcm.options
        .map(
          (o) => `
        <label class="qcm-opt">
          <input type="checkbox" name="qcm" value="${o.id}" data-correct="${o.correct}" />
          <span>${o.text}</span>
        </label>
      `
        )
        .join('')}
    </div>
  `

  hide(stepClassify)
  show(stepQcm)
}

function scoreClassify() {
  const us = USER_STORIES[pickedUs]
  let ok = 0
  const details = []

  us.scenarios.forEach((s) => {
    const chosen = document.querySelector(`input[name="${s.id}"]:checked`)?.value
    answers[s.id] = chosen
    const good = chosen === s.correct
    if (good) ok += 1
    details.push({ ...s, chosen, good })
  })

  return { ok, total: us.scenarios.length, details }
}

function scoreQcm() {
  const us = USER_STORIES[pickedUs]
  const boxes = document.querySelectorAll('#qcm-block input[type="checkbox"]')
  let ok = 0
  let required = 0

  boxes.forEach((box) => {
    const shouldCheck = box.dataset.correct === 'true'
    if (shouldCheck) required += 1
    const checked = box.checked
    if (shouldCheck && checked) ok += 1
    if (!shouldCheck && checked) ok -= 0.5
  })

  const allRequiredChecked = [...boxes]
    .filter((b) => b.dataset.correct === 'true')
    .every((b) => b.checked)
  const noFalsePositive = [...boxes]
    .filter((b) => b.dataset.correct === 'false')
    .every((b) => !b.checked)

  return {
    ok: Math.max(0, Math.round(ok)),
    required,
    perfect: allRequiredChecked && noFalsePositive,
  }
}

function countCoverage(details) {
  const counts = { nominal: 0, erreur: 0, limite: 0, hors: 0 }
  details.filter((d) => d.good).forEach((d) => {
    counts[d.correct] += 1
  })
  return counts
}

document.getElementById('btn-classify').addEventListener('click', () => {
  const incomplete = USER_STORIES[pickedUs].scenarios.some(
    (s) => !document.querySelector(`input[name="${s.id}"]:checked`)
  )
  if (incomplete) {
    alert('Classifiez les 8 scénarios avant de continuer.')
    return
  }

  const { details } = scoreClassify()
  document.querySelectorAll('.scenario').forEach((el) => {
    const id = el.dataset.id
    const d = details.find((x) => x.id === id)
    el.classList.remove('ok', 'ko')
    el.classList.add(d.good ? 'ok' : 'ko')
  })

  setTimeout(startQcm, 800)
})

document.getElementById('btn-finish').addEventListener('click', () => {
  const classScore = scoreClassify()
  const qcmScore = scoreQcm()
  const cov = countCoverage(classScore.details)
  const classPct = Math.round((classScore.ok / classScore.total) * 100)
  const totalPts = classScore.ok + (qcmScore.perfect ? 3 : qcmScore.ok)
  const maxPts = classScore.total + 3

  hide(stepQcm)

  const coverageOk =
    cov.nominal >= 2 && cov.erreur >= 2 && cov.limite >= 1 && classScore.ok >= 6

  stepResult.innerHTML = `
    <h2>Résultat — US ${USER_STORIES[pickedUs].group}</h2>
    <p class="score-main">${totalPts} / ${maxPts} points</p>
    <p>Classification : <strong>${classScore.ok}/${classScore.total}</strong> (${classPct} %)
    · Complétion : <strong>${qcmScore.perfect ? '3/3' : qcmScore.ok + '/3'}</strong></p>

    <div class="coverage">
      <p>Scénarios bien classés par type :</p>
      <ul>
        <li class="${cov.nominal >= 2 ? 'ok-line' : 'ko-line'}">Nominaux : ${cov.nominal}/2 min.</li>
        <li class="${cov.erreur >= 2 ? 'ok-line' : 'ko-line'}">Erreurs : ${cov.erreur}/2 min.</li>
        <li class="${cov.limite >= 1 ? 'ok-line' : 'ko-line'}">Limites : ${cov.limite}/1 min.</li>
      </ul>
    </div>

    ${
      coverageOk
        ? `<p class="score-ok">Bonne couverture — une US génère bien plus qu'un parcours nominal.</p>`
        : `<p class="score-partial">Piège fréquent : se limiter au nominal. Repérez erreurs et limites.</p>`
    }

    <div class="learn">
      <h3>À retenir</h3>
      <ul>
        <li>1 US → <strong>≥ 5 scénarios</strong> (2 nom. + 2 err. + 1 lim.)</li>
        <li>Prochaine étape : formaliser en <strong>cas de test</strong> (préconditions, étapes, attendu)</li>
      </ul>
    </div>

    <button type="button" class="btn-secondary" id="btn-retry">Recommencer avec une autre US</button>
  `

  show(stepResult)
  document.getElementById('btn-retry').addEventListener('click', () => {
    hide(stepResult)
    hide(stepQcm)
    hide(stepClassify)
    show(stepPick)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  stepResult.scrollIntoView({ behavior: 'smooth' })
})

document.getElementById('btn-back').addEventListener('click', () => {
  hide(stepClassify)
  show(stepPick)
})

renderUsGrid()
