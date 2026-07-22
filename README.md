# KRW/EUR — Convertisseur

PWA React (Vite + TypeScript + Tailwind + shadcn/ui) : convertisseur KRW ↔ EUR
style calculette, offline-first, installable sur écran d'accueil mobile.

## Développement

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```

## Taux de change

- `FALLBACK_RATE` dans [src/lib/exchange-rate.ts](src/lib/exchange-rate.ts) est le taux de secours codé en dur (1 KRW en EUR).
- Au chargement, l'app tente un fetch vers `api.frankfurter.app`. En cas de succès, le taux est mis en cache dans `localStorage` avec un horodatage. En cas d'échec (hors ligne), le dernier taux en cache est utilisé, sinon le fallback.

## Icône

Le SVG source de l'icône (₩ barré) est dans [src/pwa-assets/icon.svg](src/pwa-assets/icon.svg).
Pour la remplacer par votre propre logo : éditez ce fichier puis relancez

```bash
node scripts/generate-icons.mjs
```

pour régénérer `public/icons/icon-192.png`, `public/icons/icon-512.png` et `public/favicon.png`.
