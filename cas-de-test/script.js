const STORAGE_KEY = 'cp9-cas-de-test-j1-v1'

const CASES = [
  { num: 1, label: 'Nominal', badge: 'nominal', type: 'Fonctionnel', id: 'TC-DRS-001' },
  { num: 2, label: 'Nominal', badge: 'nominal', type: 'Fonctionnel', id: 'TC-DRS-002' },
  { num: 3, label: 'Erreur', badge: 'erreur', type: 'Erreur', id: 'TC-DRS-003' },
  { num: 4, label: 'Erreur', badge: 'erreur', type: 'Erreur', id: 'TC-DRS-004' },
  { num: 5, label: 'Limite', badge: 'limite', type: 'Limite', id: 'TC-DRS-005' },
]

const form = document.getElementById('cas-form')
const template = document.getElementById('case-template')
const auteurGlobal = document.getElementById('auteur-global')
const dateGlobal = document.getElementById('date-global')
const preview = document.getElementById('preview')
const previewFrame = document.getElementById('preview-frame')
const previewTitle = document.getElementById('preview-title')
const previewMeta = document.getElementById('preview-meta')
const previewBody = document.getElementById('preview-body')
const saveHint = document.getElementById('save-hint')

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function buildCases() {
  CASES.forEach((spec) => {
    const node = template.content.cloneNode(true)
    const article = node.querySelector('.case-panel')
    article.dataset.case = String(spec.num)

    article.querySelector('h2').textContent = `Cas ${spec.num}`
    const badge = article.querySelector('.type-badge')
    badge.textContent = spec.label
    badge.classList.add(spec.badge)

    article.querySelector('[data-field="id"]').placeholder = spec.id
    article.querySelector('[data-field="id"]').value = spec.id
    article.querySelector('[data-field="type"]').value = spec.type

    form.appendChild(node)
  })
}

function getCasePanels() {
  return [...form.querySelectorAll('.case-panel')]
}

function collectData() {
  const cases = getCasePanels().map((panel) => {
    const get = (field) => panel.querySelector(`[data-field="${field}"]`)?.value.trim() ?? ''
    const donnees = []
    for (let i = 0; i < 3; i++) {
      const d = panel.querySelector(`[data-donnee="${i}"]`)?.value.trim() ?? ''
      const v = panel.querySelector(`[data-valeur="${i}"]`)?.value.trim() ?? ''
      if (d || v) donnees.push({ d, v })
    }
    const etapes = []
    for (let i = 0; i < 4; i++) {
      const action = panel.querySelector(`[data-step-action="${i}"]`)?.value.trim() ?? ''
      const result = panel.querySelector(`[data-step-result="${i}"]`)?.value.trim() ?? ''
      if (action || result) etapes.push({ n: i + 1, action, result })
    }
    return {
      id: get('id'),
      us: get('us'),
      priorite: get('priorite'),
      type: get('type'),
      intitule: get('intitule'),
      preconditions: get('preconditions'),
      donnees,
      etapes,
      resultat: get('resultat'),
      postconditions: get('postconditions'),
    }
  })

  return {
    auteur: auteurGlobal.value.trim(),
    date: dateGlobal.value,
    cases,
  }
}

function applyData(data) {
  if (!data) return
  if (data.auteur) auteurGlobal.value = data.auteur
  if (data.date) dateGlobal.value = data.date

  data.cases?.forEach((c, idx) => {
    const panel = getCasePanels()[idx]
    if (!panel) return
    const set = (field, val) => {
      const el = panel.querySelector(`[data-field="${field}"]`)
      if (el && val != null) el.value = val
    }
    set('id', c.id)
    set('us', c.us)
    set('priorite', c.priorite)
    set('type', c.type)
    set('intitule', c.intitule)
    set('preconditions', c.preconditions)
    set('resultat', c.resultat)
    set('postconditions', c.postconditions)
    c.donnees?.forEach((row, i) => {
      panel.querySelector(`[data-donnee="${i}"]`).value = row.d ?? ''
      panel.querySelector(`[data-valeur="${i}"]`).value = row.v ?? ''
    })
    c.etapes?.forEach((row, i) => {
      panel.querySelector(`[data-step-action="${i}"]`).value = row.action ?? ''
      panel.querySelector(`[data-step-result="${i}"]`).value = row.result ?? ''
    })
  })
}

function saveDraft(showMsg = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collectData()))
  if (showMsg) {
    saveHint.textContent = 'Brouillon sauvegardé localement dans ce navigateur.'
    saveHint.classList.remove('error')
  }
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) applyData(JSON.parse(raw))
  } catch {
    /* ignore */
  }
}

function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function display(val) {
  const s = (val ?? '').trim()
  return s ? escapeHtml(s) : '<em class="preview-empty">—</em>'
}

function incompleteWarnings(data) {
  const warnings = []
  if (!data.auteur) warnings.push('Nom / binôme non renseigné.')
  data.cases.forEach((c, i) => {
    const n = i + 1
    if (!c.us || !c.intitule || !c.preconditions || !c.resultat || c.etapes.length === 0) {
      warnings.push(`Cas ${n} : incomplet (vous pouvez quand même capturer).`)
    }
  })
  return warnings
}

function renderPreview(data) {
  previewTitle.textContent = data.auteur || 'Nom non renseigné'
  previewMeta.textContent = `Date : ${data.date || '—'} · 5 cas de test DropRushSplit (DR$)`

  previewBody.innerHTML = data.cases
    .map((c) => {
      const donneesRows = c.donnees.length
        ? c.donnees
            .map((r) => `<tr><td>${display(r.d)}</td><td>${display(r.v)}</td></tr>`)
            .join('')
        : '<tr><td colspan="2"><em class="preview-empty">Aucune donnée renseignée</em></td></tr>'
      const stepsRows = c.etapes.length
        ? c.etapes
            .map((r) => `<tr><td>${r.n}</td><td>${display(r.action)}</td><td>${display(r.result)}</td></tr>`)
            .join('')
        : '<tr><td colspan="3"><em class="preview-empty">Aucune étape renseignée</em></td></tr>'

      return `
        <article class="preview-case">
          <h3>${display(c.id || 'TC-DRS-???')} — ${display(c.intitule)}</h3>
          <p class="preview-kv"><strong>User Story</strong> ${display(c.us)} · <strong>Type</strong> ${display(c.type)} · <strong>Priorité</strong> ${display(c.priorite)}</p>
          <p class="preview-kv"><strong>Préconditions</strong></p>
          <p class="preview-block">${display(c.preconditions)}</p>
          <p class="preview-kv"><strong>Données</strong></p>
          <table class="preview-steps"><thead><tr><th>Donnée</th><th>Valeur</th></tr></thead><tbody>${donneesRows}</tbody></table>
          <p class="preview-kv"><strong>Étapes</strong></p>
          <table class="preview-steps"><thead><tr><th>#</th><th>Action</th><th>Résultat attendu</th></tr></thead><tbody>${stepsRows}</tbody></table>
          <p class="preview-kv"><strong>Résultat global</strong></p>
          <p class="preview-block">${display(c.resultat)}</p>
          <p class="preview-kv"><strong>Post-conditions</strong></p>
          <p class="preview-block">${display(c.postconditions)}</p>
        </article>
      `
    })
    .join('')
}

document.getElementById('btn-save').addEventListener('click', () => saveDraft(true))

document.getElementById('btn-preview').addEventListener('click', () => {
  const data = collectData()
  saveDraft(false)

  getCasePanels().forEach((panel) => panel.classList.remove('invalid'))

  renderPreview(data)
  preview.classList.remove('hidden')

  const warnings = incompleteWarnings(data)
  if (warnings.length) {
    saveHint.textContent = `Aperçu généré — ${warnings.length} point(s) à compléter si besoin (capture autorisée).`
    saveHint.classList.remove('error')
  } else {
    saveHint.textContent = 'Aperçu complet — prêt pour la capture.'
    saveHint.classList.remove('error')
  }

  preview.scrollIntoView({ behavior: 'smooth', block: 'start' })
  previewFrame.focus({ preventScroll: true })
})

form.addEventListener('input', () => {
  saveDraft(false)
  saveHint.textContent = ''
})

buildCases()
dateGlobal.value = todayISO()
loadDraft()
