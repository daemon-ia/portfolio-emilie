# Portfolio — Emilie Roupsard

Portfolio créatif : design graphique, sites web et applications.

## Structure

```
PORTFOLIO emilie/
├── index.html          → Page principale (toutes les sections)
├── contact.php         → Traitement du formulaire de contact
├── css/
│   └── style.css       → Styles + animations
├── js/
│   └── script.js       → Interactions, scroll reveal, filtres
└── assets/             → Tes images de projets (à créer)
```

## Personnaliser

### 1. Remplacer les projets

Dans `index.html`, repère les `<article class="card">`. Pour chaque projet :
- Remplace `<div class="card-img" style="background: ...">` par une image :
  ```html
  <div class="card-img" style="background: url('assets/mon-projet.jpg') center/cover;"></div>
  ```
- Modifie le `<h3>` et la description
- Vérifie la catégorie `data-category="design|web|app"` (pour les filtres)

### 2. Mettre ta photo

Dans la section "À propos", remplace le bloc `.photo-placeholder` :
```html
<div class="photo-frame">
    <img src="assets/photo-emilie.jpg" alt="Emilie Roupsard">
</div>
```
(Pense à supprimer le `<div class="photo-placeholder">ER</div>`.)

### 3. Réseaux sociaux

En bas du `<footer>`, remplace les `#` par les vraies URLs Instagram, LinkedIn, Behance.

### 4. Texte "À propos"

Modifie directement les `<p>` dans la section `id="about"`.

## Déploiement sur OVH

1. Connecte-toi à ton **espace client OVH** → Hébergements → ton hébergement
2. Récupère tes infos FTP (host, login, mot de passe) dans **FTP-SSH**
3. Avec **FileZilla** (gratuit) :
   - Hôte : `ftp.cluster0XX.hosting.ovh.net` (selon ton hébergement)
   - Utilisateur / Mot de passe : ceux d'OVH
   - Port : 21
4. Connecte-toi, puis envoie **tout le contenu** du dossier dans `www/` (ou directement à la racine selon ta config)
5. Visite ton nom de domaine → ton site est en ligne.

## Test en local

Pour tester `contact.php`, il te faut un serveur PHP local. Le plus simple :

- **WampServer** ou **XAMPP** (Windows) → place le dossier dans `c:\wamp64\www\` puis va sur `http://localhost/PORTFOLIO%20emilie/`
- Ou pour juste tester le HTML/CSS/JS sans le formulaire : ouvre `index.html` dans ton navigateur (le formulaire ne fonctionnera pas).

## Notes techniques

- **Curseur personnalisé** : désactivé automatiquement sur mobile / tactile.
- **Animations au scroll** : utilisent `IntersectionObserver` (compatible tous navigateurs modernes).
- **Formulaire** : envoie via `fetch` en AJAX, le `contact.php` répond en JSON.
- **Anti-spam** : protection contre l'injection d'en-têtes dans `contact.php`. Pour aller plus loin, tu peux ajouter un reCAPTCHA.

## Prochaines améliorations possibles

- Ajouter de vraies images de projets dans `assets/`
- Créer des pages détail par projet (`projet-1.html`, etc.)
- Ajouter un blog/actualités
- Optimiser le SEO (balises Open Graph, sitemap)
