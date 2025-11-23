// Gestionnaire de panier synchronisé entre toutes les pages
class CartManager {
    constructor() {
        this.cartKey = 'greencart_cart';
        this.init();
    }
    
    init() {
        // Initialiser le panier s'il n'existe pas
        if (!this.getCart()) {
            this.saveCart([]);
        }
        this.updateCartIcon();
    }
    
    // Récupérer le panier depuis localStorage
    getCart() {
        try {
            const cart = localStorage.getItem(this.cartKey);
            return cart ? JSON.parse(cart) : [];
        } catch (e) {
            console.error('Erreur lors de la lecture du panier:', e);
            return [];
        }
    }
    
    // Sauvegarder le panier dans localStorage
    saveCart(cart) {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(cart));
            this.updateCartIcon();
            // Déclencher un événement personnalisé pour notifier les autres composants
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
        } catch (e) {
            console.error('Erreur lors de la sauvegarde du panier:', e);
        }
    }
    
    // Ajouter un produit au panier
    addToCart(productId, productName, price, quantity = 1, image = '', producer = '') {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(price),
                quantity: quantity,
                image: image,
                producer: producer
            });
        }
        
        this.saveCart(cart);
        return cart;
    }
    
    // Retirer un produit du panier
    removeFromCart(productId) {
        const cart = this.getCart().filter(item => item.id !== productId);
        this.saveCart(cart);
        return cart;
    }
    
    // Mettre à jour la quantité d'un produit
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            }
            item.quantity = quantity;
            this.saveCart(cart);
        }
        
        return cart;
    }
    
    // Vider le panier
    clearCart() {
        this.saveCart([]);
    }
    
    // Obtenir le nombre total d'articles
    getTotalItems() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Obtenir le total du panier
    getTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Mettre à jour l'icône du panier dans le header
    updateCartIcon() {
        const totalItems = this.getTotalItems();
        
        // Mettre à jour tous les badges .cart-count
        const cartCounts = document.querySelectorAll('.cart-count');
        cartCounts.forEach(badge => {
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'flex';
                badge.removeAttribute('data-count');
            } else {
                badge.textContent = '';
                badge.style.display = 'none';
                badge.setAttribute('data-count', '0');
            }
        });
        
        // Mettre à jour les aria-label des liens panier
        const cartLinks = document.querySelectorAll('a[href="/panier"], a[href*="panier"]');
        cartLinks.forEach(link => {
            link.setAttribute('aria-label', `Panier, ${totalItems} article${totalItems > 1 ? 's' : ''}`);
        });
    }
}

// Créer une instance globale
const cartManager = new CartManager();

// Écouter les mises à jour du panier pour synchroniser l'affichage
window.addEventListener('cartUpdated', () => {
    cartManager.updateCartIcon();
});

// Exporter pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}

