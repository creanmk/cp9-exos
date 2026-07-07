/**
 * smoke.test.js — Test de smoke DR$
 *
 * Objectif : vérifier que l'environnement de test est entièrement opérationnel
 * AVANT de commencer la campagne de tests.
 *
 * Règle pro : tant que ce fichier ne passe pas à 100 %, la campagne ne démarre pas.
 */

const fs   = require('fs')
const path = require('path')

describe('Environnement de test DR$', () => {

  // ── 1. Variables d'environnement ────────────────────────────────────────────
  test("Les variables d'environnement de test sont chargées", () => {
    expect(process.env.NODE_ENV).toBe('test')
    expect(process.env.DRS_SEED_FILE).toBe('tests/fixtures/seed-test.json')
  })

  // ── 2. Jeu de données ────────────────────────────────────────────────────────
  test('La fixture seed-test.json est lisible et cohérente', () => {
    const seedPath = path.join(__dirname, '../..', process.env.DRS_SEED_FILE)
    const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'))

    expect(seed.users.length).toBeGreaterThanOrEqual(2)
    expect(seed.outings).toHaveLength(3)
    expect(seed.outings[0].status).toBe('DROP_OPEN')
  })

  // ── 3. Store opérationnel ────────────────────────────────────────────────────
  test('Le store expose les données du jeu de test', () => {
    const outings = DRStore.getOutings()

    expect(outings).toHaveLength(3)
    expect(outings[0].title).toBe('Laser game test')
    expect(outings[0].placesLeft).toBe(4)
  })

  // ── 4. Logique métier ────────────────────────────────────────────────────────
  test('Une réservation nominale fonctionne (logique métier DR$)', () => {
    const alex = { id: 2, pseudo: 'Alex' }
    const result = DRStore.reserve(1, alex)

    expect(result.ok).toBe(true)

    const outing = DRStore.getOuting(1)
    expect(outing.placesLeft).toBe(3)
    expect(outing.reservations).toHaveLength(1)
    expect(outing.reservations[0].pseudo).toBe('Alex')
  })

})
