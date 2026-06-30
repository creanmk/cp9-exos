document.addEventListener('DOMContentLoaded', () => {
  const user = DRAuth.requireLogin()
  if (!user) return

  if (user.role !== 'organisateur') {
    window.location.href = './index.html'
    return
  }

  DRCommon.mountHeader()
  DRCommon.mountFooter()

  const form = document.getElementById('create-form')
  const errorEl = document.getElementById('create-error')
  const successEl = document.getElementById('create-success')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorEl.classList.add('hidden')
    successEl.classList.add('hidden')

    const result = await DRApi.createOuting({
      title: form.title.value,
      maxPlaces: form.maxPlaces.value,
      totalPrice: form.totalPrice.value,
      organizerId: user.id,
    })

    if (!result.ok) {
      errorEl.textContent = result.error
      errorEl.classList.remove('hidden')
      return
    }

    successEl.textContent = `Sortie créée (statut Planifié). Retour à l'accueil…`
    successEl.classList.remove('hidden')
    setTimeout(() => {
      window.location.href = './index.html'
    }, 900)
  })
})
