// Bug 5 : faute dans l'id recherché
const bouton = document.getElementById('btn-inscripton');
const message = document.getElementById('message-success');

bouton.addEventListener('click', function () {
  message.hidden = false;
  message.classList.add('visible');
});
