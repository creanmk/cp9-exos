const DRStore = {
  STORAGE_KEY: 'drs-v1',

  async init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const res = await fetch('./data/seed.json')
      if (!res.ok) throw new Error('Impossible de charger seed.json')
      const seed = await res.json()
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seed))
    }
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY)
  },

  _read() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}')
  },

  _write(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
  },

  getUsers() {
    return this._read().users || []
  },

  getOutings() {
    return this._read().outings || []
  },

  getOuting(id) {
    return this.getOutings().find((o) => o.id === Number(id)) || null
  },

  findUserByEmail(email) {
    return this.getUsers().find((u) => u.email === email) || null
  },

  reserve(outingId, user) {
    const data = this._read()
    const outing = data.outings.find((o) => o.id === Number(outingId))
    if (!outing) return { ok: false, error: 'Sortie introuvable' }
    if (outing.status !== 'DROP_OPEN') return { ok: false, error: 'Drop non ouvert' }
    if (outing.placesLeft <= 0) return { ok: false, error: 'Complet' }
    if (outing.reservations.some((r) => r.userId === user.id)) {
      return { ok: false, error: 'Déjà inscrit' }
    }

    outing.reservations.push({ userId: user.id, pseudo: user.pseudo })
    outing.placesLeft -= 1
    if (outing.placesLeft === 0) outing.status = 'FULL'

    this._write(data)
    return { ok: true }
  },
}
