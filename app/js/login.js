document.addEventListener('DOMContentLoaded', () => {
  DRCommon.mountHeader()
  DRCommon.mountFooter()

  const form = document.getElementById('login-form')
  const errorEl = document.getElementById('login-error')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorEl.classList.add('hidden')

    const email = form.email.value
    const password = form.password.value
    const result = await DRApi.login(email, password)

    if (!result.ok) {
      errorEl.textContent = result.error
      errorEl.classList.remove('hidden')
      return
    }

    DRAuth.setUser(result.user)
    window.location.href = './index.html'
  })
})
