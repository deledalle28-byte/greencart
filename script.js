// ============================================
// Scripts d'accessibilité et fonctionnalités
// ============================================

// Gestion de la navigation clavier
document.addEventListener('DOMContentLoaded', function() {
    
    // Réinitialiser TOUS les boutons et éléments interactifs au chargement
    function resetAllButtons() {
        // Réinitialiser tous les boutons
        document.querySelectorAll('button, .btn, a.btn').forEach(btn => {
            btn.blur();
            btn.classList.remove('active', 'added', 'clicked', 'disabled');
            if (btn.hasAttribute('disabled')) {
                btn.removeAttribute('disabled');
            }
        });
        
        // Réinitialiser toutes les cartes
        document.querySelectorAll('.category-card, .product-card, .article-card').forEach(card => {
            card.blur();
            card.classList.remove('active', 'clicked');
        });
        
        // Réinitialiser tous les liens de navigation
        document.querySelectorAll('.main-nav a, a').forEach(link => {
            link.blur();
            link.classList.remove('active', 'clicked');
        });
    }
    
    // Appeler la réinitialisation au chargement
    resetAllButtons();
    
    // Réinitialiser aussi après un court délai pour s'assurer que tout est bien réinitialisé
    setTimeout(resetAllButtons, 100);
    
    // Amélioration de l'accessibilité du formulaire de recherche
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput ? searchInput.value.trim() : '';
            if (query) {
                // Redirection vers la page de recherche avec le paramètre
                window.location.href = `/recherche?q=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Gestion du formulaire de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const emailInput = document.getElementById('newsletter-email');
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        
        // Réinitialiser le formulaire au chargement
        if (emailInput) {
            emailInput.value = '';
        }
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'S\'inscrire à la newsletter GreenCart';
            submitButton.classList.remove('disabled', 'added', 'active');
        }
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput ? emailInput.value.trim() : '';
            
            if (email && isValidEmail(email)) {
                // Désactiver temporairement le bouton
                if (submitButton) {
                    const originalText = submitButton.textContent;
                    submitButton.disabled = true;
                    submitButton.textContent = 'Inscription en cours...';
                    
                    // Simuler l'envoi
                    setTimeout(() => {
                        alert('Merci pour votre inscription ! Vous recevrez bientôt nos offres locales.');
                        if (emailInput) {
                            emailInput.value = '';
                        }
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.textContent = originalText;
                            submitButton.blur();
                        }
                    }, 500);
                }
            } else {
                alert('Veuillez entrer une adresse e-mail valide.');
                if (emailInput) {
                    emailInput.focus();
                }
            }
        });
    }
    
    // Fonction de validation d'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Amélioration de l'accessibilité : gestion du focus pour les cartes
    const interactiveCards = document.querySelectorAll('.category-card, .product-card, .article-card');
    interactiveCards.forEach(card => {
        // Rendre les cartes focusables au clavier
        card.setAttribute('tabindex', '0');
        
        // Gestion de l'activation au clavier (Entrée ou Espace)
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
        
        // Réinitialiser après le clic
        card.addEventListener('click', function() {
            setTimeout(() => {
                this.blur();
                this.classList.remove('active', 'clicked');
            }, 150);
        });
    });
    
    // Réinitialiser tous les boutons après un clic
    document.querySelectorAll('button, .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ne pas réinitialiser si c'est un lien qui va naviguer
            if (this.tagName === 'A' && this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                // Laisser le navigateur gérer la navigation
                return;
            }
            
            // Pour les autres boutons, réinitialiser après un court délai
            setTimeout(() => {
                this.blur();
                this.classList.remove('active', 'clicked', 'added');
            }, 200);
        });
    });
    
    // Amélioration de l'annonce du nombre d'articles dans le panier
    const cartLink = document.querySelector('a[href="/panier"]');
    if (cartLink) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const count = parseInt(cartCount.textContent) || 0;
            cartLink.setAttribute('aria-label', `Panier, ${count} article${count > 1 ? 's' : ''}`);
        }
    }
    
    // Gestion de l'état actif dans la navigation
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        // Marquer le lien actif seulement si c'est la page courante
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '/' && link.getAttribute('href') === '/')) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
        
        // Réinitialiser après le clic
        link.addEventListener('click', function() {
            setTimeout(() => {
                this.blur();
            }, 100);
        });
    });
});

// Gestion du scroll pour le header sticky
let lastScroll = 0;
const header = document.querySelector('.main-header');

if (header) {
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Ajout d'une ombre plus prononcée lors du scroll
        if (currentScroll > 10) {
            header.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
}

// Amélioration de l'accessibilité : annonce des changements pour les lecteurs d'écran
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}
