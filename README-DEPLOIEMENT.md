# 🚀 Déploiement GreenCart sur Vercel

## Prérequis
- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit)

## Étapes de déploiement

### 1. Créer un dépôt GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur "New repository"
3. Nommez-le `greencart` (ou autre nom)
4. Ne cochez PAS "Initialize with README"
5. Cliquez sur "Create repository"

### 2. Pousser votre code sur GitHub

Ouvrez un terminal dans le dossier `Greencart` et exécutez :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Faire un commit
git commit -m "Initial commit - GreenCart"

# Ajouter le dépôt distant (remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE-USERNAME/greencart.git

# Pousser le code
git branch -M main
git push -u origin main
```

### 3. Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" et connectez-vous avec GitHub
3. Cliquez sur "Add New Project"
4. Sélectionnez votre dépôt `greencart`
5. Vercel détectera automatiquement les paramètres :
   - Framework Preset: Other
   - Build Command: (laisser vide)
   - Output Directory: (laisser vide)
   - Install Command: `npm install` (si nécessaire)
6. Cliquez sur "Deploy"

### 4. Votre site est en ligne !

Après quelques secondes, Vercel vous donnera une URL comme :
- `https://greencart-xxxxx.vercel.app`

Vous pouvez aussi configurer un nom de domaine personnalisé gratuit dans les paramètres du projet.

## Mises à jour

Pour mettre à jour votre site :
1. Modifiez vos fichiers localement
2. Faites un commit et poussez sur GitHub :
   ```bash
   git add .
   git commit -m "Description de vos modifications"
   git push
   ```
3. Vercel redéploiera automatiquement votre site !

## Support

- Documentation Vercel : https://vercel.com/docs
- Support Vercel : support@vercel.com

