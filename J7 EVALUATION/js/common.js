const DRCommon = {
  outingIconCode(title) {
    const t = (title || '').toLowerCase()
    if (t.includes('laser')) return 'LG'
    if (t.includes('bowling')) return 'BW'
    if (t.includes('escape')) return 'EG'
    return 'DR'
  },

  // Alias legacy (cache navigateur après renommage)
  outingEmoji(title) {
    return this.outingIconCode(title)
  },

  statusLabel(status) {
    const map = {
      SCHEDULED: 'Planifié',
      DROP_OPEN: 'Drop live',
      FULL: 'Complet',
      DROP_CLOSED: 'Terminé',
    }
    return map[status] || status
  },

  statusClass(status) {
    const map = {
      SCHEDULED: 'badge-scheduled',
      DROP_OPEN: 'badge-open',
      FULL: 'badge-full',
      DROP_CLOSED: 'badge-closed',
    }
    return map[status] || 'badge-scheduled'
  },

  renderHeader() {
    const user = DRAuth.getUser()
    let userHtml = `<a class="btn-ghost" href="./login.html">Connexion</a>`

    if (user) {
      const initial = (user.pseudo || user.email || '?').charAt(0).toUpperCase()
      const orgaLink =
        user.role === 'organisateur'
          ? '<a class="btn-ghost" href="./create-drop.html">Créer une sortie</a>'
          : ''
      userHtml = `
        ${orgaLink}
        <span class="user-chip">
          <span class="avatar">${initial}</span>
          <span>${user.pseudo}</span>
        </span>
        <a href="#" class="btn-ghost" id="btn-logout">Déconnexion</a>
      `
    }

    return `
      <header class="site-header">
        <a class="brand" href="./index.html">
          <img class="brand-logo" src="./assets/drs-logo.png" alt="DropRushSplit — DR$" width="88" height="40" />
          <span class="brand-text">
            <strong>DropRushSplit</strong>
            <span>Rush la place · Split la note</span>
          </span>
        </a>
        <nav class="user-nav">${userHtml}</nav>
      </header>
    `
  },

  renderFooter() {
    return `
      <footer class="site-footer">
        DropRushSplit J7 · recette CP9 · Données locales (localStorage)
      </footer>
    `
  },

  mountHeader(containerId = 'header') {
    const el = document.getElementById(containerId)
    if (el) el.innerHTML = this.renderHeader()
    document.getElementById('btn-logout')?.addEventListener('click', (e) => {
      e.preventDefault()
      DRAuth.logout()
      window.location.href = './index.html'
    })
  },

  mountFooter(containerId = 'footer') {
    const el = document.getElementById(containerId)
    if (el) el.innerHTML = this.renderFooter()
  },

  queryId() {
    return new URLSearchParams(window.location.search).get('id')
  },

  progressPct(booked, max) {
    if (!max) return 0
    return Math.min(100, Math.round((booked / max) * 100))
  },
}
