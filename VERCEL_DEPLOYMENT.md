# 🚀 Guide de Déploiement Vercel - Maths Plus

Ce guide vous accompagne dans le déploiement de Planète Mathématique sur Vercel.

## 📋 Prérequis

- Un compte [Vercel](https://vercel.com) (gratuit)
- Le repository Git configuré (GitHub, GitLab ou Bitbucket)
- Une clé API Gemini (pour les fonctionnalités IA)

## 🔧 Configuration Initiale

### 1. Préparation des Variables d'Environnement

Avant de déployer, assurez-vous d'avoir votre clé API Gemini :

1. Visitez [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez une nouvelle clé API
3. Copiez la clé pour la configuration Vercel

### 2. Connexion à Vercel

#### Option A : Déploiement via Dashboard Vercel

1. Connectez-vous à [Vercel](https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Sélectionnez votre repository Git
4. Vercel détectera automatiquement la configuration Vite

#### Option B : Déploiement via CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer le projet
vercel
```

## ⚙️ Configuration du Projet sur Vercel

### Variables d'Environnement

Dans le dashboard Vercel, allez dans **Settings > Environment Variables** et ajoutez :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `GEMINI_API_KEY` | `votre_clé_api_gemini` | Production, Preview, Development |

### Configuration Build (Automatique)

Vercel utilisera automatiquement les paramètres de `vercel.json` :

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🎯 Optimisations Incluses

### Performance

✅ **Caching Optimisé**
- Assets statiques : Cache immutable (1 an)
- JSON/Manifeste : Cache de 24h/1h
- HTML : Revalidation systématique

✅ **Code Splitting**
- Séparation des vendors React, TanStack Query, et KaTeX
- Chunks organisés par type (JS, Images, Fonts)

✅ **Compression**
- Minification avec esbuild
- Target ES2020 pour navigateurs modernes
- CSS Code Splitting activé

### Sécurité

✅ **Headers de Sécurité**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

✅ **Service Worker**
- Configuration correcte avec `Service-Worker-Allowed: /`
- Cache strategy optimisée

### SEO & PWA

✅ **Configuration PWA**
- Manifest.json avec cache approprié
- Service Worker enregistré
- Support offline (via SW)

✅ **Routing SPA**
- Rewrites configurés pour HashRouter
- URLs propres sans trailing slash

## 🧪 Test Local avant Déploiement

```bash
# 1. Installer les dépendances
npm install

# 2. Tester le build de production
npm run build:production

# 3. Prévisualiser en local
npm run preview

# 4. Vérifier les types TypeScript
npm run type-check
```

Ouvrez `http://localhost:4173` pour tester la version de production localement.

## 📦 Structure de Build

Après le build, la structure dans `dist/` sera :

```
dist/
├── index.html
├── manifest.json
├── service-worker.js
├── assets/
│   ├── js/
│   │   ├── index-[hash].js
│   │   ├── react-vendor-[hash].js
│   │   ├── query-vendor-[hash].js
│   │   └── math-vendor-[hash].js
│   ├── images/
│   │   └── [nom]-[hash].{png,jpg,svg}
│   └── fonts/
│       └── [nom]-[hash].{woff,woff2}
├── content/
│   └── [fichiers JSON de contenu]
└── concours/
    └── [fichiers JSON des concours]
```

## 🔄 Déploiement Continu

Une fois configuré, Vercel déploiera automatiquement :

- **Production** : À chaque push sur la branche `main`
- **Preview** : À chaque push sur d'autres branches
- **Pull Requests** : Un preview pour chaque PR

## 🐛 Résolution de Problèmes

### Erreur : Module not found

```bash
# Nettoyer et réinstaller
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Build échoue sur Vercel

1. Vérifiez les logs de build dans Vercel Dashboard
2. Assurez-vous que `GEMINI_API_KEY` est configurée
3. Vérifiez que Node.js version >= 18

### Service Worker ne fonctionne pas

Le Service Worker nécessite HTTPS. Il fonctionnera automatiquement sur Vercel mais pas en local HTTP.

## 📊 Métriques de Performance

Après déploiement, vérifiez :

- **Lighthouse Score** : Devrait être > 90 pour Performance
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Bundle Size** : Vérifié avec chunk size limits

## 🔗 Liens Utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## 🎉 Déploiement Réussi !

Votre application sera accessible sur :
- **Production** : `https://votre-projet.vercel.app`
- **Custom Domain** : Configurable dans Vercel Settings

---

**Note** : Ce guide est spécifique au projet Planète Mathématique et prend en compte toutes les optimisations déjà configurées dans les fichiers `vercel.json` et `vite.config.ts`.
