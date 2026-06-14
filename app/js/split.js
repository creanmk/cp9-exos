document.addEventListener('DOMContentLoaded', async () => {
  const user = DRAuth.requireLogin()
  if (!user) return

  DRCommon.mountHeader()

  const id = DRCommon.queryId()
  const outing = await DRApi.getOuting(id)
  const container = document.getElementById('split-content')

  if (!outing) {
    container.innerHTML = '<div class="alert alert-error">Sortie introuvable.</div>'
    return
  }

  if (outing.status !== 'DROP_CLOSED' && outing.status !== 'FULL') {
    container.innerHTML = `
      <div class="alert alert-warn">Le split n'est disponible qu'après fermeture du drop.</div>
      <a class="btn btn-secondary" href="./index.html">Retour</a>
    `
    return
  }

  const inscrits = outing.reservations.length
  // BUG-04 : multiplication au lieu de division (voir devinette Q4)
  const montantParPersonne = inscrits > 0 ? outing.totalPrice * inscrits : 0

  const rows = outing.reservations
    .map(
      (r) => `
      <tr>
        <td>${r.pseudo}</td>
        <td>${montantParPersonne.toFixed(2)} €</td>
        <td>En attente</td>
      </tr>
    `
    )
    .join('')

  container.innerHTML = `
    <p class="tag">Split · US-04</p>
    <h1>${outing.title}</h1>
    <p class="intro">Drop fermé · ${inscrits} inscrit(s) · total ${outing.totalPrice} €</p>

    <article class="card split-hero">
      <p class="card-meta">Montant par personne</p>
      <p class="split-amount">${montantParPersonne.toFixed(2)} €</p>
      <p class="split-detail">${outing.totalPrice} € ÷ ${inscrits} inscrits</p>
    </article>

    <article class="card">
      <h2>Détail par inscrit</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Participant</th>
            <th>À payer</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="3">Aucun inscrit</td></tr>'}</tbody>
      </table>
    </article>

    <a class="btn btn-link" href="./index.html">← Retour aux sorties</a>
  `
})
