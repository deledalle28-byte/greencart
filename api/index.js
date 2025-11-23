const fs = require('fs');
const path = require('path');

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

// Fonction pour gérer le routing
function handleRequest(req, res) {
  // Décoder l'URL pour gérer les espaces et caractères spéciaux
  let decodedUrl = decodeURIComponent(req.url);
  
  // Extraire l'extension du fichier demandé (avant transformation)
  const originalExtname = String(path.extname(decodedUrl)).toLowerCase();
  
  // Routes spéciales - à traiter AVANT la logique générale
  if (decodedUrl === '/panier' || decodedUrl.startsWith('/panier/')) {
    decodedUrl = '/panier.html';
  }
  else if (decodedUrl === '/commande/livraison' || decodedUrl === '/commande/livraison/' || decodedUrl.startsWith('/commande/livraison/')) {
    decodedUrl = '/livraison.html';
  }
  else if (decodedUrl === '/checkout/livraison' || decodedUrl === '/checkout/livraison/' || decodedUrl.startsWith('/checkout/livraison/')) {
    decodedUrl = '/livraison.html';
  }
  else if (decodedUrl === '/commande/paiement' || decodedUrl === '/commande/paiement/' || decodedUrl.startsWith('/commande/paiement/')) {
    decodedUrl = '/paiement.html';
  }
  else if (decodedUrl === '/commande/confirmation' || decodedUrl === '/commande/confirmation/' || decodedUrl.startsWith('/commande/confirmation/')) {
    decodedUrl = '/confirmation.html';
  }
  else if (decodedUrl === '/engagements' || decodedUrl === '/engagements/' || decodedUrl.startsWith('/engagements/')) {
    decodedUrl = '/engagements.html';
  }
  else if (decodedUrl === '/nos-engagements' || decodedUrl === '/nos-engagements/' || decodedUrl.startsWith('/nos-engagements/')) {
    decodedUrl = '/engagements.html';
  }
  else if (decodedUrl === '/producteurs' || decodedUrl === '/producteurs/' || decodedUrl.startsWith('/producteurs/')) {
    if (decodedUrl === '/producteurs/ferme-des-tilleuls' || decodedUrl === '/producteurs/ferme-des-tilleuls/') {
      decodedUrl = '/producteur-ferme-tilleuls.html';
    } else {
      decodedUrl = '/producteurs.html';
    }
  }
  else if (decodedUrl === '/aide' || decodedUrl === '/aide/' || decodedUrl.startsWith('/aide/')) {
    decodedUrl = '/aide.html';
  }
  else if (decodedUrl === '/faq' || decodedUrl === '/faq/' || decodedUrl.startsWith('/faq/')) {
    decodedUrl = '/aide.html';
  }
  else if (decodedUrl === '/a-propos' || decodedUrl === '/a-propos/' || decodedUrl.startsWith('/a-propos/')) {
    decodedUrl = '/a-propos.html';
  }
  else if (decodedUrl === '/rejoindre-nos-producteurs' || decodedUrl === '/rejoindre-nos-producteurs/' || decodedUrl.startsWith('/rejoindre-nos-producteurs/')) {
    decodedUrl = '/rejoindre.html';
  }
  else if (decodedUrl === '/rejoindre' || decodedUrl === '/rejoindre/' || decodedUrl.startsWith('/rejoindre/')) {
    decodedUrl = '/rejoindre.html';
  }
  else if (decodedUrl === '/contact' || decodedUrl === '/contact/' || decodedUrl.startsWith('/contact/')) {
    decodedUrl = '/contact.html';
  }
  else if (decodedUrl === '/suivi-de-commande' || decodedUrl === '/suivi-de-commande/' || decodedUrl.startsWith('/suivi-de-commande/')) {
    decodedUrl = '/suivi.html';
  }
  else if (decodedUrl === '/suivi' || decodedUrl === '/suivi/' || decodedUrl.startsWith('/suivi/')) {
    decodedUrl = '/suivi.html';
  }
  else if (decodedUrl === '/mentions-legales' || decodedUrl === '/mentions-legales/' || decodedUrl.startsWith('/mentions-legales/')) {
    decodedUrl = '/mentions-legales.html';
  }
  else if (decodedUrl === '/conditions-generales-de-vente' || decodedUrl === '/conditions-generales-de-vente/' || decodedUrl.startsWith('/conditions-generales-de-vente/')) {
    decodedUrl = '/cgv.html';
  }
  else if (decodedUrl === '/cgv' || decodedUrl === '/cgv/' || decodedUrl.startsWith('/cgv/')) {
    decodedUrl = '/cgv.html';
  }
  else if (decodedUrl === '/politique-de-confidentialite' || decodedUrl === '/politique-de-confidentialite/' || decodedUrl.startsWith('/politique-de-confidentialite/')) {
    decodedUrl = '/confidentialite.html';
  }
  else if (decodedUrl === '/confidentialite' || decodedUrl === '/confidentialite/' || decodedUrl.startsWith('/confidentialite/')) {
    decodedUrl = '/confidentialite.html';
  }
  else if (decodedUrl === '/accessibilite' || decodedUrl === '/accessibilite/' || decodedUrl.startsWith('/accessibilite/')) {
    decodedUrl = '/accessibilite.html';
  }
  else if (decodedUrl === '/recherche' || decodedUrl === '/recherche/' || decodedUrl.startsWith('/recherche/')) {
    decodedUrl = '/recherche.html';
  }
  else if (decodedUrl === '/mon-compte' || decodedUrl === '/mon-compte/' || decodedUrl.startsWith('/mon-compte/')) {
    decodedUrl = '/mon-compte.html';
  }
  else if (decodedUrl === '/compte/tableau-de-bord' || decodedUrl === '/compte/tableau-de-bord/' || decodedUrl.startsWith('/compte/tableau-de-bord/')) {
    decodedUrl = '/mon-compte.html';
  }
  else if (decodedUrl === '/compte' || decodedUrl === '/compte/' || decodedUrl.startsWith('/compte/')) {
    decodedUrl = '/compte.html';
  }
  else if (decodedUrl === '/produits' || decodedUrl === '/produits/' || decodedUrl.startsWith('/produits')) {
    decodedUrl = '/produits.html';
  }
  // Si pas d'extension, c'est probablement une route
  else if (!originalExtname || originalExtname === '') {
    // Si c'est la racine, servir index.html
    if (decodedUrl === '/' || decodedUrl === '') {
      decodedUrl = '/index.html';
    }
    // Si c'est /produit ou commence par /produit/, déterminer quel fichier servir
    else if (decodedUrl.startsWith('/produit')) {
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
      
      if (productRoutes[decodedUrl]) {
        decodedUrl = productRoutes[decodedUrl];
      } else {
        decodedUrl = '/produit.html';
      }
    }
    // Sinon, servir index.html pour le routing côté client
    else {
      decodedUrl = '/index.html';
    }
  }
  
  // Gérer la racine et les routes
  let filePath = path.join(__dirname, '..', decodedUrl);
  
  // Si le chemin commence par /images/, chercher dans public/images
  if (decodedUrl.startsWith('/images/')) {
    filePath = path.join(__dirname, '..', 'public', decodedUrl);
  }
  // Si le chemin commence par /public/, servir depuis le dossier public
  else if (decodedUrl.startsWith('/public/')) {
    filePath = path.join(__dirname, '..', decodedUrl);
  }
  
  // Sécurité : empêcher l'accès aux fichiers en dehors du dossier
  const resolvedPath = path.resolve(filePath);
  const basePath = path.resolve(path.join(__dirname, '..'));
  if (!resolvedPath.startsWith(basePath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Accès interdit');
    return;
  }

  // Recalculer l'extension après avoir déterminé le fichier
  const finalExtname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[finalExtname] || 'application/octet-stream';
  
  // Vérifier si le fichier existe avant de le lire
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Fichier non trouvé
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
        res.end('Fichier non trouvé: ' + filePath);
        return;
      }
      
      // Pour les autres routes HTML, servir index.html pour le routing côté client
      if (finalExtname === '.html') {
        const indexPath = path.join(__dirname, '..', 'index.html');
        fs.readFile(indexPath, (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end(`Erreur serveur: ${error.code}`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Fichier non trouvé: ' + filePath);
      }
      return;
    }
    
    // Fichier trouvé, le lire
    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end(`Erreur serveur: ${error.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
}

// Export pour Vercel
module.exports = (req, res) => {
  handleRequest(req, res);
};

