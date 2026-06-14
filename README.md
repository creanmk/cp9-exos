# CP9 — Exercices (GitHub Pages)

**Accès élèves :** https://creanmk.github.io/cp9-exos/

| Activité | Lien |
|----------|------|
| Devinette fil rouge (J1) | [/devinette/](devinette/) |
| Exo 1 QCM débogage | [/exo1/](exo1/) |
| **App DR$ v0.1** | [/app/](app/) |

## Publier une mise à jour

```bash
cd ~/Desktop/cp9-exos
git add .
git commit -m "Mise à jour"
git push origin main
```

Pages se met à jour en ~1 min.

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
└── app/                ← fil rouge DR$ v0.1
    ├── index.html      ← accueil
    ├── login.html
    ├── drop.html
    ├── split.html
    ├── css/drs.css
    ├── js/
    └── data/seed.json
```
