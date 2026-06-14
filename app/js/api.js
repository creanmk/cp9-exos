/** Couche API v0 — localStorage. Même signatures que le futur Express v1. */
const DRApi = {
  async init() {
    await DRStore.init()
  },

  async login(email, password) {
    await this.init()
    const user = DRStore.findUserByEmail(email.trim())
    if (!user || user.password !== password) {
      return { ok: false, error: 'Email ou mot de passe incorrect' }
    }
    const { password: _, ...safeUser } = user
    return { ok: true, user: safeUser }
  },

  async getOutings() {
    await this.init()
    return DRStore.getOutings()
  },

  async getOuting(id) {
    await this.init()
    return DRStore.getOuting(id)
  },

  async reserve(outingId, user) {
    await this.init()
    return DRStore.reserve(outingId, user)
  },
}
