let countdownSeconds = 300

function formatTime(total) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function startTimer() {
  const el = document.getElementById('timer')
  if (!el) return

  el.textContent = formatTime(countdownSeconds)
  setInterval(() => {
    if (countdownSeconds > 0) countdownSeconds -= 1
    el.textContent = formatTime(countdownSeconds)
  }, 1000)
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = DRAuth.requireLogin()
  if (!user) return

  DRCommon.mountHeader()
  DRCommon.mountFooter()

  const id = DRCommon.queryId()
  const outing = await DRApi.getOuting(id)
  const container = document.getElementById('drop-content')

  if (!outing) {
    container.innerHTML = '<div class="alert alert-error">Sortie introuvable.</div>'
    return
  }

  if (user.role === 'observateur') {
    container.innerHTML = '<div class="alert alert-warn">Les observateurs ne peuvent pas réserver.</div>'
    return
  }

  if (outing.status !== 'DROP_OPEN') {
    container.innerHTML = `
      <div class="alert alert-warn">Ce drop n'est pas ouvert (statut : ${DRCommon.statusLabel(outing.status)}).</div>
      <a class="btn btn-secondary" href="./index.html">Retour</a>
    `
    return
  }

  const booked = outing.placesLeft

  container.innerHTML = `
    <section class="page-hero">
      <span class="tag tag-live">Drop live · US-02</span>
      <h1>${outing.title}</h1>
      <p class="intro">${outing.totalPrice} € au total · partagés entre les inscrits après fermeture.</p>
    </section>

    <article class="card drop-live">
      <div class="drop-live-header">
        <span class="live-pill">En direct</span>
      </div>
      <div class="timer-ring">
        <div>
          <p class="timer-label">Temps restant</p>
          <p class="timer" id="timer">--:--</p>
        </div>
      </div>
      <div class="places-block">
        <p class="places-left">Places restantes</p>
        <p class="places-left"><strong id="places-left">${outing.placesLeft}</strong> / ${outing.maxPlaces}</p>
        <p class="card-meta" style="margin:0.35rem 0 0">${booked} inscrit(s) · ${outing.totalPrice} € à split</p>
      </div>

      <form id="reserve-form" action="">
        <button class="btn btn-drop" id="btn-reserve">Réserver ma place</button>
      </form>
    </article>

    <div id="reserve-msg"></div>
    <a class="btn btn-link" href="./index.html">← Retour aux sorties</a>
  `
})
