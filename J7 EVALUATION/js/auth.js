const DRAuth = {
  SESSION_KEY: 'drs-session',

  getUser() {
    const raw = sessionStorage.getItem(this.SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  },

  setUser(user) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user))
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY)
  },

  requireLogin(redirectTo = './login.html') {
    if (!this.getUser()) {
      window.location.href = redirectTo
      return null
    }
    return this.getUser()
  },
}
