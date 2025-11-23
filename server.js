const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Décoder l'URL pour gérer les espaces et caractères spéciaux
  let decodedUrl = decodeURIComponent(req.url);
  
  // Extraire l'extension du fichier demandé (avant transformation)
  const originalExtname = String(path.extname(decodedUrl)).toLowerCase();
  
  // Routes spéciales - à traiter AVANT la logique générale
  if (decodedUrl === '/panier' || decodedUrl.startsWith('/panier/')) {
    decodedUrl = '/panier.html';
    console.log(`[ROUTING] /panier -> /panier.html`);
  }
  else if (decodedUrl === '/commande/livraison' || decodedUrl === '/commande/livraison/' || decodedUrl.startsWith('/commande/livraison/')) {
    decodedUrl = '/livraison.html';
    console.log(`[ROUTING] /commande/livraison -> /livraison.html`);
  }
  else if (decodedUrl === '/checkout/livraison' || decodedUrl === '/checkout/livraison/' || decodedUrl.startsWith('/checkout/livraison/')) {
    decodedUrl = '/livraison.html';
    console.log(`[ROUTING] /checkout/livraison -> /livraison.html`);
  }
  else if (decodedUrl === '/commande/paiement' || decodedUrl === '/commande/paiement/' || decodedUrl.startsWith('/commande/paiement/')) {
    decodedUrl = '/paiement.html';
    console.log(`[ROUTING] /commande/paiement -> /paiement.html`);
  }
  else if (decodedUrl === '/commande/confirmation' || decodedUrl === '/commande/confirmation/' || decodedUrl.startsWith('/commande/confirmation/')) {
    decodedUrl = '/confirmation.html';
    console.log(`[ROUTING] /commande/confirmation -> /confirmation.html`);
  }
  else if (decodedUrl === '/engagements' || decodedUrl === '/engagements/' || decodedUrl.startsWith('/engagements/')) {
    decodedUrl = '/engagements.html';
    console.log(`[ROUTING] /engagements -> /engagements.html`);
  }
  else if (decodedUrl === '/nos-engagements' || decodedUrl === '/nos-engagements/' || decodedUrl.startsWith('/nos-engagements/')) {
    decodedUrl = '/engagements.html';
    console.log(`[ROUTING] /nos-engagements -> /engagements.html`);
  }
  else if (decodedUrl === '/producteurs' || decodedUrl === '/producteurs/' || decodedUrl.startsWith('/producteurs/')) {
    // Si c'est une route spécifique de producteur
    if (decodedUrl === '/producteurs/ferme-des-tilleuls' || decodedUrl === '/producteurs/ferme-des-tilleuls/') {
      decodedUrl = '/producteur-ferme-tilleuls.html';
      console.log(`[ROUTING] /producteurs/ferme-des-tilleuls -> /producteur-ferme-tilleuls.html`);
    } else {
      // Sinon, servir la page liste des producteurs
      decodedUrl = '/producteurs.html';
      console.log(`[ROUTING] /producteurs -> /producteurs.html`);
    }
  }
  else if (decodedUrl === '/aide' || decodedUrl === '/aide/' || decodedUrl.startsWith('/aide/')) {
    decodedUrl = '/aide.html';
    console.log(`[ROUTING] /aide -> /aide.html`);
  }
  else if (decodedUrl === '/faq' || decodedUrl === '/faq/' || decodedUrl.startsWith('/faq/')) {
    decodedUrl = '/aide.html';
    console.log(`[ROUTING] /faq -> /aide.html`);
  }
  else if (decodedUrl === '/a-propos' || decodedUrl === '/a-propos/' || decodedUrl.startsWith('/a-propos/')) {
    decodedUrl = '/a-propos.html';
    console.log(`[ROUTING] /a-propos -> /a-propos.html`);
  }
  else if (decodedUrl === '/rejoindre-nos-producteurs' || decodedUrl === '/rejoindre-nos-producteurs/' || decodedUrl.startsWith('/rejoindre-nos-producteurs/')) {
    decodedUrl = '/rejoindre.html';
    console.log(`[ROUTING] /rejoindre-nos-producteurs -> /rejoindre.html`);
  }
  else if (decodedUrl === '/rejoindre' || decodedUrl === '/rejoindre/' || decodedUrl.startsWith('/rejoindre/')) {
    decodedUrl = '/rejoindre.html';
    console.log(`[ROUTING] /rejoindre -> /rejoindre.html`);
  }
  else if (decodedUrl === '/contact' || decodedUrl === '/contact/' || decodedUrl.startsWith('/contact/')) {
    decodedUrl = '/contact.html';
    console.log(`[ROUTING] /contact -> /contact.html`);
  }
  else if (decodedUrl === '/suivi-de-commande' || decodedUrl === '/suivi-de-commande/' || decodedUrl.startsWith('/suivi-de-commande/')) {
    decodedUrl = '/suivi.html';
    console.log(`[ROUTING] /suivi-de-commande -> /suivi.html`);
  }
  else if (decodedUrl === '/suivi' || decodedUrl === '/suivi/' || decodedUrl.startsWith('/suivi/')) {
    decodedUrl = '/suivi.html';
    console.log(`[ROUTING] /suivi -> /suivi.html`);
  }
  else if (decodedUrl === '/mentions-legales' || decodedUrl === '/mentions-legales/' || decodedUrl.startsWith('/mentions-legales/')) {
    decodedUrl = '/mentions-legales.html';
    console.log(`[ROUTING] /mentions-legales -> /mentions-legales.html`);
  }
  else if (decodedUrl === '/conditions-generales-de-vente' || decodedUrl === '/conditions-generales-de-vente/' || decodedUrl.startsWith('/conditions-generales-de-vente/')) {
    decodedUrl = '/cgv.html';
    console.log(`[ROUTING] /conditions-generales-de-vente -> /cgv.html`);
  }
  else if (decodedUrl === '/cgv' || decodedUrl === '/cgv/' || decodedUrl.startsWith('/cgv/')) {
    decodedUrl = '/cgv.html';
    console.log(`[ROUTING] /cgv -> /cgv.html`);
  }
  else if (decodedUrl === '/politique-de-confidentialite' || decodedUrl === '/politique-de-confidentialite/' || decodedUrl.startsWith('/politique-de-confidentialite/')) {
    decodedUrl = '/confidentialite.html';
    console.log(`[ROUTING] /politique-de-confidentialite -> /confidentialite.html`);
  }
  else if (decodedUrl === '/confidentialite' || decodedUrl === '/confidentialite/' || decodedUrl.startsWith('/confidentialite/')) {
    decodedUrl = '/confidentialite.html';
    console.log(`[ROUTING] /confidentialite -> /confidentialite.html`);
  }
  else if (decodedUrl === '/accessibilite' || decodedUrl === '/accessibilite/' || decodedUrl.startsWith('/accessibilite/')) {
    decodedUrl = '/accessibilite.html';
    console.log(`[ROUTING] /accessibilite -> /accessibilite.html`);
  }
  else if (decodedUrl === '/recherche' || decodedUrl === '/recherche/' || decodedUrl.startsWith('/recherche/')) {
    decodedUrl = '/recherche.html';
    console.log(`[ROUTING] /recherche -> /recherche.html`);
  }
  else if (decodedUrl === '/mon-compte' || decodedUrl === '/mon-compte/' || decodedUrl.startsWith('/mon-compte/')) {
    decodedUrl = '/mon-compte.html';
    console.log(`[ROUTING] /mon-compte -> /mon-compte.html`);
  }
  else if (decodedUrl === '/compte/tableau-de-bord' || decodedUrl === '/compte/tableau-de-bord/' || decodedUrl.startsWith('/compte/tableau-de-bord/')) {
    decodedUrl = '/mon-compte.html';
    console.log(`[ROUTING] /compte/tableau-de-bord -> /mon-compte.html`);
  }
  else if (decodedUrl === '/compte' || decodedUrl === '/compte/' || decodedUrl.startsWith('/compte/')) {
    decodedUrl = '/compte.html';
    console.log(`[ROUTING] /compte -> /compte.html`);
  }
  // Si pas d'extension, c'est probablement une route
  else if (!originalExtname || originalExtname === '') {
    // Si c'est la racine, servir index.html
    if (decodedUrl === '/' || decodedUrl === '') {
      decodedUrl = '/index.html';
    }
    // Si c'est /produit ou commence par /produit/, déterminer quel fichier servir
    else if (decodedUrl.startsWith('/produit')) {
      // Mapping des routes produits vers les fichiers
      const productRoutes = {
        '/produit/fromages': '/produit-fromages.html',
        '/produit/confitures': '/produit-confitures.html',
        '/produit/jus-pomme': '/produit-jus-pomme.html',
        '/produit/panier-famille': '/produit-panier-famille.html',
        '/produit/herbes-aromatiques': '/produit-herbes-aromatiques.html',
        '/produit/soupe-legumes': '/produit-soupe-legumes.html',
        '/produit/oignons-echalotes': '/produit-oignons-echalotes.html',
        '/produit/panier-legumes': '/produit.html'
      };
      
      // Vérifier si on a une route spécifique
      if (productRoutes[decodedUrl]) {
        decodedUrl = productRoutes[decodedUrl];
      } else {
        // Par défaut, servir produit.html
        decodedUrl = '/produit.html';
      }
    }
    // Sinon, servir index.html pour le routing côté client
    else {
      decodedUrl = '/index.html';
    }
  }
  
  // Gérer la racine et les routes
  let filePath = '.' + decodedUrl;
  
  // Si le chemin commence par /images/, chercher dans public/images
  if (decodedUrl.startsWith('/images/')) {
    filePath = './public' + decodedUrl;
  }
  // Si le chemin commence par /public/, servir depuis le dossier public
  else if (decodedUrl.startsWith('/public/')) {
    filePath = '.' + decodedUrl;
  }
  // Pour tous les autres fichiers, chercher à la racine
  // filePath est déjà défini comme '.' + decodedUrl

  // Sécurité : empêcher l'accès aux fichiers en dehors du dossier
  const resolvedPath = path.resolve(filePath);
  const basePath = path.resolve('.');
  if (!resolvedPath.startsWith(basePath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Accès interdit');
    return;
  }

  // Recalculer l'extension après avoir déterminé le fichier
  const finalExtname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[finalExtname] || 'application/octet-stream';
  
  // Debug pour panier
  if (req.url === '/panier' || decodedUrl === '/panier.html') {
    console.log(`[DEBUG PANIER] req.url: ${req.url}, decodedUrl: ${decodedUrl}, filePath: ${filePath}`);
  }
  
  // Vérifier si le fichier existe avant de le lire
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Fichier non trouvé
      console.log(`[ERREUR] Fichier non trouvé: ${filePath} (URL: ${req.url}, decodedUrl: ${decodedUrl})`);
      
      // Si c'est panier.html, livraison.html, paiement.html, engagements.html, producteurs, producteur, produits, aide ou fichiers HTML spécifiques, ne PAS servir index.html
      const isSpecificRoute = decodedUrl === '/panier.html' || 
                              decodedUrl === '/livraison.html' ||
                              decodedUrl === '/paiement.html' ||
                              decodedUrl === '/confirmation.html' ||
                              decodedUrl === '/engagements.html' ||
                              decodedUrl === '/producteurs.html' ||
                              decodedUrl === '/producteur-ferme-tilleuls.html' ||
                              decodedUrl === '/aide.html' ||
                              decodedUrl === '/a-propos.html' ||
                              decodedUrl === '/rejoindre.html' ||
                              decodedUrl === '/contact.html' ||
                              decodedUrl === '/suivi.html' ||
                              decodedUrl === '/mentions-legales.html' ||
                              decodedUrl === '/cgv.html' ||
                              decodedUrl === '/confidentialite.html' ||
                              decodedUrl === '/accessibilite.html' ||
                              decodedUrl === '/compte.html' ||
                              decodedUrl === '/mon-compte.html' ||
                              decodedUrl === '/recherche.html' ||
                              decodedUrl.startsWith('/produit') || 
                              decodedUrl.includes('produit-') ||
                              decodedUrl === '/produits.html';
      
      if (isSpecificRoute) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Fichier non trouvé: ' + filePath + ' (URL demandée: ' + req.url + ', decodedUrl: ' + decodedUrl + ')');
        return;
      }
      
      // Pour les autres routes HTML, servir index.html pour le routing côté client
      if (finalExtname === '.html') {
        console.log(`[FALLBACK] Servir index.html pour: ${req.url}`);
        fs.readFile('./index.html', (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end(`Erreur serveur: ${error.code}`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Pour les autres fichiers, retourner 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Fichier non trouvé: ' + filePath);
      }
      return;
    }
    
    // Fichier trouvé, le lire
    console.log(`[SUCCÈS] Servir fichier: ${filePath} (URL: ${req.url})`);
    fs.readFile(filePath, (error, content) => {
      if (error) {
        console.log(`[ERREUR LECTURE] Erreur lors de la lecture: ${error.message}`);
        res.writeHead(500);
        res.end(`Erreur serveur: ${error.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Serveur GreenCart démarré !`);
  console.log(`\n📍 Ouvrez votre navigateur à l'adresse :`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log(`💡 Appuyez sur Ctrl+C pour arrêter le serveur\n`);
});

