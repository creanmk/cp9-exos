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

  displayOutingTitle(title) {
    const value = title != null ? String(title).trim() : ''
    if (!value) return '<span class="title-unset">(Sans titre)</span>'
    return String(title)
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
        <p class="site-footer-meta">DropRushSplit · version recette J7 · CP9 · données locales (localStorage)</p>
        <p class="site-footer-actions">
          <button type="button" class="btn-reset-data" id="btn-reset-data">Réinitialiser les données</button>
        </p>
      </footer>
    `
  },

  resetAppData() {
    const ok = window.confirm(
      'Réinitialiser toutes les données locales de DR$ ?\n\nLes sorties, réservations et session seront effacées. Cette action est irréversible.'
    )
    if (!ok) return
    if (typeof DRStore !== 'undefined' && DRStore.reset) DRStore.reset()
    sessionStorage.clear()
    window.location.href = './index.html'
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
    document.getElementById('btn-reset-data')?.addEventListener('click', () => {
      this.resetAppData()
    })
  },

  queryId() {
    return new URLSearchParams(window.location.search).get('id')
  },

  progressPct(booked, max) {
    if (!max) return 0
    return Math.min(100, Math.round((booked / max) * 100))
  },

  renderStatsSkeleton() {
    return `
      <div class="stat skeleton-stat" aria-hidden="true"><span class="skeleton skeleton-stat-value"></span><span class="skeleton skeleton-stat-label"></span></div>
      <div class="stat skeleton-stat" aria-hidden="true"><span class="skeleton skeleton-stat-value"></span><span class="skeleton skeleton-stat-label"></span></div>
      <div class="stat skeleton-stat" aria-hidden="true"><span class="skeleton skeleton-stat-value"></span><span class="skeleton skeleton-stat-label"></span></div>
    `
  },

  renderOutingsSkeleton(count = 3) {
    return Array.from({ length: count }, () => `
      <article class="outing-card skeleton-card" aria-hidden="true">
        <div class="skeleton-card-head">
          <span class="skeleton skeleton-icon"></span>
          <div class="skeleton-card-titles">
            <span class="skeleton skeleton-line skeleton-line-lg"></span>
            <span class="skeleton skeleton-line skeleton-line-sm"></span>
          </div>
        </div>
        <div class="skeleton-metrics">
          <span class="skeleton skeleton-pill"></span>
          <span class="skeleton skeleton-pill"></span>
          <span class="skeleton skeleton-pill"></span>
        </div>
        <span class="skeleton skeleton-progress"></span>
        <span class="skeleton skeleton-btn"></span>
      </article>
    `).join('')
  },

  renderDetailSkeleton(variant = 'drop') {
    const body =
      variant === 'split'
        ? `
          <article class="card skeleton-card-block">
            <span class="skeleton skeleton-line skeleton-line-sm"></span>
            <span class="skeleton skeleton-amount"></span>
            <span class="skeleton skeleton-line"></span>
          </article>
          <article class="card skeleton-card-block">
            <span class="skeleton skeleton-line skeleton-line-lg"></span>
            <span class="skeleton skeleton-table"></span>
          </article>
        `
        : `
          <article class="card drop-live skeleton-card-block">
            <span class="skeleton skeleton-pill skeleton-pill-wide"></span>
            <span class="skeleton skeleton-timer"></span>
            <span class="skeleton skeleton-line"></span>
            <span class="skeleton skeleton-btn"></span>
          </article>
        `

    return `
      <div class="page-skeleton" aria-busy="true" aria-label="Chargement">
        <section class="page-hero skeleton-hero">
          <span class="skeleton skeleton-pill skeleton-pill-wide"></span>
          <span class="skeleton skeleton-line skeleton-line-xl"></span>
          <span class="skeleton skeleton-line skeleton-line-md"></span>
        </section>
        ${body}
      </div>
    `
  },
}
