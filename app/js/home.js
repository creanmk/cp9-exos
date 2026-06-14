document.addEventListener('DOMContentLoaded', async () => {
  DRCommon.mountHeader()

  const list = document.getElementById('outings-list')
  const outings = await DRApi.getOutings()

  if (!outings.length) {
    list.innerHTML = '<p class="intro">Aucune sortie pour le moment.</p>'
    return
  }

  list.innerHTML = outings
    .map((o) => {
      const booked = o.maxPlaces - o.placesLeft
      let action = ''

      if (o.status === 'DROP_OPEN' || o.status === 'FULL') {
        action = `<a class="btn btn-primary" href="./drop.html?id=${o.id}">Rejoindre le drop</a>`
      } else if (o.status === 'DROP_CLOSED') {
        action = `<a class="btn btn-secondary" href="./split.html?id=${o.id}">Voir le split</a>`
      } else {
        action = `<span class="card-meta">Drop pas encore ouvert</span>`
      }

      return `
        <article class="card">
          <span class="badge ${DRCommon.statusClass(o.status)}">${DRCommon.statusLabel(o.status)}</span>
          <h2>${o.title}</h2>
          <p class="card-meta">${o.totalPrice} € · ${booked}/${o.maxPlaces} inscrits</p>
          ${action}
        </article>
      `
    })
    .join('')
})
