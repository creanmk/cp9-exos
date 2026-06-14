const DRCommon = {
  statusLabel(status) {
    const map = {
      SCHEDULED: 'Planifié',
      DROP_OPEN: 'Drop ouvert',
      FULL: 'Complet',
      DROP_CLOSED: 'Drop fermé',
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

  renderHeader(active = '') {
    const user = DRAuth.getUser()
    const userHtml = user
      ? `${user.pseudo} · <a href="#" id="btn-logout">Déco</a>`
      : `<a href="./login.html">Connexion</a>`

    return `
      <header class="site-header">
        <a class="brand" href="./index.html">
          <span class="brand-mark">DR$</span>
          <span class="brand-text">
            <strong>DropRushSplit</strong>
            <span>Rush la place · Split la note</span>
          </span>
        </a>
        <div class="user-nav">${userHtml}</div>
      </header>
    `
  },

  mountHeader(containerId = 'header') {
    const el = document.getElementById(containerId)
    if (el) el.innerHTML = this.renderHeader()
    const logout = document.getElementById('btn-logout')
    logout?.addEventListener('click', (e) => {
      e.preventDefault()
      DRAuth.logout()
      window.location.href = './index.html'
    })
  },

  queryId() {
    return new URLSearchParams(window.location.search).get('id')
  },
}
