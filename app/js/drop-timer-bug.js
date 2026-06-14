// BUG-03 — accès au timer avant rendu DOM (voir devinette Q3)
try {
  document.getElementById('timer').textContent = '05:00'
} catch (_) {
  /* timer pas encore monté */
}
