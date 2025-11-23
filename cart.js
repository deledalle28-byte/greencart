// Scripts pour la page Panier

document.addEventListener('DOMContentLoaded', function() {
    
    // Charger le panier depuis localStorage si cartManager est disponible
    if (typeof cartManager !== 'undefined') {
        const cart = cartManager.getCart();
        // Le panier sera synchronisé automatiquement via cartManager
    }
    
    // Éléments DOM
    const quantityInputs = document.querySelectorAll('.cart-quantity-input');
    const decreaseBtns = document.querySelectorAll('.quantity-btn-decrease');
    const increaseBtns = document.querySelectorAll('.quantity-btn-increase');
    const removeBtns = document.querySelectorAll('.cart-action-link[aria-label*="Supprimer"]');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoInput = document.getElementById('promo-code-input');
    const promoMessage = document.getElementById('promo-message');
    
    // Fonction pour calculer le sous-total d'un produit
    function calculateItemSubtotal(productId) {
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const unitPrice = parseFloat(quantityInput.getAttribute('data-unit-price'));
        const quantity = parseInt(quantityInput.value) || 1;
        return unitPrice * quantity;
    }
    
    // Fonction pour mettre à jour l'affichage du sous-total d'un produit
    function updateItemSubtotal(productId) {
        const subtotal = calculateItemSubtotal(productId);
        const subtotalElement = document.querySelector(`.cart-item-subtotal[data-product-id="${productId}"]`);
        if (subtotalElement) {
            subtotalElement.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
        }
    }
    
    // Fonction pour calculer le total du panier
    function calculateCartTotal() {
        let subtotal = 0;
        quantityInputs.forEach(input => {
            const productId = input.getAttribute('data-product-id');
            subtotal += calculateItemSubtotal(productId);
        });
        
        const shipping = 4.90;
        const packaging = 1.00;
        const total = subtotal + shipping + packaging;
        
        // Mettre à jour les affichages
        const subtotalElement = document.getElementById('cart-subtotal');
        const totalElement = document.getElementById('cart-total');
        
        if (subtotalElement) {
            subtotalElement.textContent = subtotal.toFixed(2).replace('.', ',') + ' €';
        }
        if (totalElement) {
            totalElement.textContent = total.toFixed(2).replace('.', ',') + ' € TTC';
        }
        
        // Annoncer le changement pour l'accessibilité
        if (totalElement) {
            totalElement.setAttribute('aria-live', 'polite');
        }
    }
    
    // Fonction pour afficher un message de feedback
    function showMessage(productId, message, type = 'success') {
        const messageElement = document.getElementById(`message-${productId}`);
        if (!messageElement) return;
        
        messageElement.textContent = message;
        messageElement.className = `cart-message cart-message-${type}`;
        messageElement.setAttribute('role', 'status');
        messageElement.setAttribute('aria-live', 'polite');
        
        // Masquer le message après 5 secondes
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'cart-message';
        }, 5000);
    }
    
    // Fonction pour valider la quantité
    function validateQuantity(value, min, max) {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < min) {
            return { valid: false, message: `❌ Quantité invalide. Merci de saisir un nombre entre ${min} et ${max}.` };
        }
        if (numValue > max) {
            return { valid: false, message: `❌ Quantité invalide. Merci de saisir un nombre entre ${min} et ${max}.` };
        }
        return { valid: true };
    }
    
    // Gestion des changements de quantité via input
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const value = this.value;
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = parseInt(this.getAttribute('max')) || 10;
            
            const validation = validateQuantity(value, min, max);
            
            if (!validation.valid) {
                showMessage(productId, validation.message, 'error');
                this.value = min;
                updateItemSubtotal(productId);
                calculateCartTotal();
                return;
            }
            
            // Vérifier si le produit est en rupture (simulation)
            if (parseInt(value) > 8) {
                showMessage(productId, '⚠️ Ce produit n\'est plus disponible dans la quantité souhaitée. Quantité ajustée à 1.', 'warning');
                this.value = 1;
                updateItemSubtotal(productId);
                calculateCartTotal();
                return;
            }
            
            // Synchroniser avec cartManager
            if (typeof cartManager !== 'undefined') {
                cartManager.updateQuantity(productId, parseInt(value));
            }
            
            updateItemSubtotal(productId);
            calculateCartTotal();
            showMessage(productId, '✅ Quantité mise à jour. Le total a été recalculé.', 'success');
        });
        
        input.addEventListener('blur', function() {
            const value = this.value;
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = parseInt(this.getAttribute('max')) || 10;
            
            if (value === '' || parseInt(value) < min) {
                this.value = min;
                const productId = this.getAttribute('data-product-id');
                updateItemSubtotal(productId);
                calculateCartTotal();
            }
        });
    });
    
    // Gestion des boutons diminuer
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const input = document.getElementById(`quantity-${productId}`);
            const currentValue = parseInt(input.value) || 1;
            const min = parseInt(input.getAttribute('min')) || 1;
            
            if (currentValue > min) {
                const newValue = currentValue - 1;
                input.value = newValue;
                
                // Synchroniser avec cartManager
                if (typeof cartManager !== 'undefined') {
                    cartManager.updateQuantity(productId, newValue);
                }
                
                updateItemSubtotal(productId);
                calculateCartTotal();
                showMessage(productId, '✅ Quantité mise à jour. Le total a été recalculé.', 'success');
            }
        });
    });
    
    // Gestion des boutons augmenter
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const input = document.getElementById(`quantity-${productId}`);
            const currentValue = parseInt(input.value) || 1;
            const max = parseInt(input.getAttribute('max')) || 10;
            
            if (currentValue < max) {
                const newValue = currentValue + 1;
                input.value = newValue;
                
                // Synchroniser avec cartManager
                if (typeof cartManager !== 'undefined') {
                    cartManager.updateQuantity(productId, newValue);
                }
                
                updateItemSubtotal(productId);
                calculateCartTotal();
                showMessage(productId, '✅ Quantité mise à jour. Le total a été recalculé.', 'success');
            } else {
                showMessage(productId, `❌ Quantité invalide. Merci de saisir un nombre entre 1 et ${max}.`, 'error');
            }
        });
    });
    
    // Gestion des boutons supprimer
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const row = document.querySelector(`.cart-item-row[data-product-id="${productId}"]`);
            
            if (row && confirm('Êtes-vous sûr de vouloir supprimer ce produit de votre panier ?')) {
                // Synchroniser avec cartManager
                if (typeof cartManager !== 'undefined') {
                    cartManager.removeFromCart(productId);
                }
                
                row.remove();
                calculateCartTotal();
                
                // Vérifier si le panier est vide
                const remainingItems = document.querySelectorAll('.cart-item-row');
                if (remainingItems.length === 0) {
                    document.getElementById('cart-with-items').style.display = 'none';
                    document.getElementById('cart-empty').style.display = 'block';
                }
            }
        });
    });
    
    // Gestion du code promo
    if (applyPromoBtn && promoInput) {
        applyPromoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const code = promoInput.value.trim().toUpperCase();
            
            if (!code) {
                promoMessage.textContent = '❌ Veuillez saisir un code promo.';
                promoMessage.className = 'promo-message promo-message-error';
                return;
            }
            
            // Simulation de validation du code
            if (code === 'PROMO10') {
                promoMessage.textContent = '✅ Le code PROMO10 a été appliqué. Réduction : −10 % sur les produits concernés.';
                promoMessage.className = 'promo-message promo-message-success';
                // Ici, vous pourriez appliquer la réduction au total
            } else {
                promoMessage.textContent = '❌ Ce code n\'est pas valide ou a déjà été utilisé.';
                promoMessage.className = 'promo-message promo-message-error';
            }
            
            promoMessage.setAttribute('role', 'status');
            promoMessage.setAttribute('aria-live', 'polite');
        });
        
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoBtn.click();
            }
        });
    }
    
    // Calcul initial du total
    calculateCartTotal();
});

