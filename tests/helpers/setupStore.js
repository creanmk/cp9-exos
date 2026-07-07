/**
 * setupStore.js — Helper Jest pour DR$
 *
 * Rôle :
 *  1. Charge les variables d'environnement depuis .env.test (via dotenv)
 *  2. Simule un localStorage en mémoire (Node n'a pas de localStorage)
 *  3. Injecte le jeu de données de test (seed-test.json)
 *  4. Charge store.js dans un contexte isolé
 *  5. Remet tout à zéro AVANT CHAQUE TEST (beforeEach → reproductibilité)
 *
 * Les élèves n'ont pas besoin de modifier ce fichier.
 * Ils doivent être capables d'expliquer son rôle.
 */

const fs   = require('fs')
const path = require('path')
const vm   = require('vm')

// 1. Charger .env.test — Node ne le fait JAMAIS automatiquement
require('dotenv').config({
  path: path.join(__dirname, '../../.env.test'),
})

const seedPath  = path.join(__dirname, '../..', process.env.DRS_SEED_FILE)
const storePath = path.join(__dirname, '../../app/js/store.js')
// store.js utilise 'drs-v1' en dur — le mock doit employer la même clé
const STORE_KEY = 'drs-v1'

// 2. Faux localStorage en mémoire
function createMockStorage(initial = {}) {
  const data = { ...initial }
  return {
    getItem(key)        { return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null },
    setItem(key, value) { data[key] = String(value) },
    removeItem(key)     { delete data[key] },
  }
}

// 3. Charger store.js dans un contexte vm isolé
function loadStore(localStorage) {
  const context = { localStorage, module: { exports: {} } }
  vm.createContext(context)
  const code = fs.readFileSync(storePath, 'utf8')
  vm.runInContext(`${code}\nmodule.exports = DRStore;`, context)
  return context.module.exports
}

// 4. Reset complet du store
function resetTestStore() {
  const seed = fs.readFileSync(seedPath, 'utf8')
  // Seed chargé sous la clé que store.js utilise réellement (STORE_KEY = 'drs-v1')
  global.localStorage = createMockStorage({ [STORE_KEY]: seed })
  global.DRStore = loadStore(global.localStorage)
}

// beforeEach : CHAQUE test démarre dans le même état (reproductibilité REAC)
beforeEach(() => {
  resetTestStore()
})

afterEach(() => {
  delete global.localStorage
  delete global.DRStore
})
