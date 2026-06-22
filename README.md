# CP9 — Exercices (GitHub Pages)

**Accès élèves :** https://creanmk.github.io/cp9-exos/

| Activité | Lien |
|----------|------|
| Devinette fil rouge (J1) | [/devinette/](devinette/) |
| Exo 1 QCM débogage | [/exo1/](exo1/) |
| **App DR$ v0.1** | [/app/](app/) |
| Atelier ordre des tests | [/atelier-ordre/](atelier-ordre/) |
| Atelier US → scénarios | [/atelier-scenarios/](atelier-scenarios/) |
| **Livrable J1 — cas de test** | [/cas-de-test/](cas-de-test/) |

## Publier une mise à jour

```bash
cd ~/Desktop/cp9-exos
git add .
git commit -m "Mise à jour"
git push origin main
```

Pages se met à jour en ~1 min.

## Corrigés formateur

Les corrigés (QCM, bugs DR$, cas de test J1, ateliers) sont fournis **hors dépôt public** (document local ou LMS). Ne pas committer de dossier `solution-formateur/` dans ce repo.

## Structure

```
cp9-exos/
├── index.html          ← sommaire
├── devinette/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── drs-logo.png
├── exo1/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── app/                ← fil rouge DR$ v0.1
│   ├── index.html
│   └── …
├── atelier-ordre/
│   └── …
├── atelier-scenarios/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── cas-de-test/
    ├── index.html
    ├── style.css
    └── script.js
```
