document.addEventListener('DOMContentLoaded', async () => {
  DRCommon.mountHeader()
  DRCommon.mountFooter()

  const list = document.getElementById('outings-list')
  const outings = await DRApi.getOutings()

  if (!outings.length) {
    list.innerHTML = '<p class="intro">Aucune sortie pour le moment.</p>'
    return
  }

  const live = outings.filter((o) => o.status === 'DROP_OPEN').length
  const totalInscrits = outings.reduce((n, o) => n + o.reservations.length, 0)

  document.getElementById('stats-bar').innerHTML = `
    <div class="stat"><span class="stat-value">${outings.length}</span><span class="stat-label">Sorties</span></div>
    <div class="stat"><span class="stat-value">${live}</span><span class="stat-label">Drops live</span></div>
    <div class="stat"><span class="stat-value">${totalInscrits}</span><span class="stat-label">Inscrits</span></div>
  `

  list.innerHTML = outings
    .map((o) => {
      const booked = o.reservations.length
      const pct = DRCommon.progressPct(booked, o.maxPlaces)
      const isLive = o.status === 'DROP_OPEN'
      let action = ''

      if (isLive || o.status === 'FULL') {
        action = `<a class="btn btn-primary" href="./drop.html?id=${o.id}">Rejoindre le drop</a>`
      } else if (o.status === 'DROP_CLOSED') {
        action = `<a class="btn btn-secondary" href="./split.html?id=${o.id}">Voir le split →</a>`
      } else {
        action = `<span class="btn-muted">Ouverture du drop bientôt</span>`
      }

      return `
        <article class="outing-card ${isLive ? 'is-live' : ''}">
          <div class="card-head">
            <div class="card-icon-title">
              <span class="outing-icon" aria-hidden="true">${DRCommon.outingIconCode(o.title)}</span>
              <div>
                <h2>${o.title}</h2>
                <p class="card-sub">Promo CDA · Organisateur Orga</p>
              </div>
            </div>
            <span class="badge ${DRCommon.statusClass(o.status)}">${DRCommon.statusLabel(o.status)}</span>
          </div>
          <div class="card-metrics">
            <span class="metric"><span class="metric-label">Total</span> <strong>${o.totalPrice} €</strong></span>
            <span class="metric"><span class="metric-label">Inscrits</span> <strong>${booked}/${o.maxPlaces}</strong></span>
            <span class="metric"><span class="metric-label">Places rest.</span> <strong>${o.placesLeft}</strong></span>
          </div>
          <div class="progress-wrap">
            <div class="progress-label">
              <span>Remplissage</span>
              <span>${pct}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${pct >= 100 ? 'is-full' : ''}" style="width:${pct}%"></div>
            </div>
          </div>
          ${action}
        </article>
      `
    })
    .join('')
})
