// Scripts pour la page produit

document.addEventListener('DOMContentLoaded', function() {
    
    // Gestion de la galerie d'images (miniatures)
    const thumbnailButtons = document.querySelectorAll('.thumbnail-btn');
    const mainImage = document.getElementById('main-product-image');
    
    // Réinitialiser l'état actif des miniatures et activer la première
    if (thumbnailButtons.length > 0) {
        thumbnailButtons.forEach(btn => btn.classList.remove('active'));
        // Activer la première miniature par défaut
        thumbnailButtons[0].classList.add('active');
        
        // Ajouter les événements de clic
        thumbnailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const imageSrc = this.getAttribute('data-image');
                if (imageSrc && mainImage) {
                    mainImage.src = imageSrc;
                    // Mettre à jour l'état actif
                    thumbnailButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    // Gestion du sélecteur de quantité
    const quantityInput = document.getElementById('quantity-selector');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    if (decreaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (increaseBtn && quantityInput) {
        increaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentValue = parseInt(quantityInput.value) || 1;
            const maxValue = parseInt(quantityInput.getAttribute('max')) || 10;
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    // Gestion du bouton "Ajouter au panier"
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    // Réinitialiser l'état du bouton au chargement de la page
    if (addToCartBtn) {
        addToCartBtn.textContent = 'Ajouter au panier';
        addToCartBtn.classList.remove('added');
        
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const quantity = parseInt(quantityInput ? quantityInput.value : 1) || 1;
            
            // Récupérer les informations du produit depuis la page
            const productTitle = document.querySelector('.product-title')?.textContent || 'Produit';
            const productPrice = document.querySelector('.product-price')?.textContent?.replace(/[^\d,]/g, '').replace(',', '.') || '0';
            const productImage = document.querySelector('#main-product-image')?.src || '';
            const productProducer = document.querySelector('.product-producer')?.textContent || '';
            const productId = window.location.pathname.split('/').pop() || 'product-' + Date.now();
            
            // Utiliser le gestionnaire de panier
            if (typeof cartManager !== 'undefined') {
                cartManager.addToCart(productId, productTitle, productPrice, quantity, productImage, productProducer);
            }
            
            // Feedback visuel
            this.textContent = 'Ajouté au panier ✓';
            this.classList.add('added');
            
            // Réinitialiser après 2 secondes
            setTimeout(() => {
                this.textContent = 'Ajouter au panier';
                this.classList.remove('added');
            }, 2000);
        });
    }
    
    // Validation de la quantité
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = parseInt(this.getAttribute('max')) || 10;
            
            if (value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    }
});

