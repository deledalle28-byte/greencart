// Scripts pour la page produits (filtres, tri, pagination)

// Carte des producteurs
let map = null;
let userMarker = null;
let producersMarkers = [];

// Données des producteurs (coordonnées fictives pour la démo)
const producers = [
    {
        id: 'ferme-tilleuls',
        name: 'Ferme des Tilleuls',
        lat: 48.8566,
        lng: 2.3522,
        type: 'Fruits & légumes',
        distance: null
    },
    {
        id: 'gaec-pre-vert',
        name: 'GAEC du Pré Vert',
        lat: 48.8606,
        lng: 2.3376,
        type: 'Produits laitiers',
        distance: null
    },
    {
        id: 'atelier-vergers',
        name: 'Atelier des Vergers',
        lat: 48.8526,
        lng: 2.3682,
        type: 'Épicerie artisanale',
        distance: null
    },
    {
        id: 'cueillette-vallee',
        name: 'Cueillette de la Vallée',
        lat: 48.8486,
        lng: 2.3322,
        type: 'Boissons locales',
        distance: null
    },
    {
        id: 'rucher-bois-vert',
        name: 'Rucher du Bois Vert',
        lat: 48.8646,
        lng: 2.3422,
        type: 'Épicerie artisanale',
        distance: null
    }
];

// Fonction pour calculer la distance entre deux points (formule de Haversine)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Fonction pour initialiser la carte
function initMap(userLat, userLng) {
    if (map) {
        map.remove();
    }
    
    // Créer la carte centrée sur la position de l'utilisateur
    map = L.map('map').setView([userLat, userLng], 12);
    
    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Ajouter le marqueur de l'utilisateur
    const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div style="background-color: #2563EB; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    
    userMarker = L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong>Votre position</strong>');
    
    // Ajouter les marqueurs des producteurs
    producers.forEach(producer => {
        const distance = calculateDistance(userLat, userLng, producer.lat, producer.lng);
        producer.distance = distance;
        
        const producerIcon = L.divIcon({
            className: 'producer-marker',
            html: '<div style="background-color: #2E7D32; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        const marker = L.marker([producer.lat, producer.lng], { icon: producerIcon })
            .addTo(map)
            .bindPopup(`
                <strong>${producer.name}</strong><br>
                ${producer.type}<br>
                <small>À ${distance.toFixed(1)} km</small>
            `);
        
        producersMarkers.push(marker);
    });
    
    // Trier les producteurs par distance
    producers.sort((a, b) => a.distance - b.distance);
}

// Fonction pour obtenir la géolocalisation de l'utilisateur
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                // En cas d'erreur, utiliser une position par défaut (Paris)
                console.warn('Géolocalisation non disponible, utilisation d\'une position par défaut');
                resolve({
                    lat: 48.8566,
                    lng: 2.3522
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Fonction pour obtenir le terme de recherche depuis l'URL
    function getSearchTermFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('q') || '';
    }
    
    // Fonction pour afficher le terme de recherche
    function displaySearchTerm() {
        const searchTerm = getSearchTermFromURL();
        if (searchTerm) {
            // Créer ou mettre à jour l'affichage du terme de recherche
            let searchDisplay = document.getElementById('search-term-display');
            if (!searchDisplay) {
                searchDisplay = document.createElement('div');
                searchDisplay.id = 'search-term-display';
                searchDisplay.className = 'search-term-display';
                const productsTitle = document.querySelector('.products-section h2');
                if (productsTitle) {
                    productsTitle.insertAdjacentElement('afterend', searchDisplay);
                } else {
                    // Si pas de titre, l'ajouter avant la grille
                    const productsGrid = document.getElementById('products-grid');
                    if (productsGrid) {
                        productsGrid.parentNode.insertBefore(searchDisplay, productsGrid);
                    }
                }
            }
            searchDisplay.innerHTML = `
                <p>Résultats de recherche pour : <strong>"${searchTerm}"</strong></p>
                <button type="button" class="btn-clear-search" onclick="window.location.href='/produits'">Effacer la recherche</button>
            `;
        } else {
            // Supprimer l'affichage si pas de recherche
            const searchDisplay = document.getElementById('search-term-display');
            if (searchDisplay) {
                searchDisplay.remove();
            }
        }
    }
    
    // Éléments DOM
    const filtersForm = document.getElementById('filters-form');
    const sortSelect = document.getElementById('sort-select');
    const activeFiltersContainer = document.getElementById('active-filters');
    const clearAllBtn = document.getElementById('clear-all-filters');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const resetFiltersNoProducts = document.getElementById('reset-filters-no-products');
    const productsGrid = document.getElementById('products-grid');
    const noProductsMessage = document.getElementById('no-products');
    const productsCount = document.getElementById('products-count');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // Éléments de la carte
    const toggleMapBtn = document.getElementById('toggle-map-btn');
    const mapContainer = document.getElementById('producers-map');
    
    // État des filtres actifs
    let activeFilters = [];
    
    // Fonction pour mettre à jour les filtres actifs
    function updateActiveFilters() {
        activeFilters = [];
        activeFiltersContainer.innerHTML = '';
        
        // Récupérer les filtres actifs depuis le formulaire
        const formData = new FormData(filtersForm);
        
        // Type de produit
        const type = formData.get('type');
        if (type) {
            const option = filtersForm.querySelector(`#filter-type option[value="${type}"]`);
            if (option) {
                activeFilters.push({
                    key: 'type',
                    label: 'Type',
                    value: option.textContent,
                    filterValue: type
                });
            }
        }
        
        // Producteur
        const producer = formData.get('producer');
        if (producer) {
            const option = filtersForm.querySelector(`#filter-producer option[value="${producer}"]`);
            if (option) {
                activeFilters.push({
                    key: 'producer',
                    label: 'Producteur',
                    value: option.textContent,
                    filterValue: producer
                });
            }
        }
        
        // Labels (checkboxes)
        const labels = formData.getAll('labels');
        labels.forEach(label => {
            const checkbox = filtersForm.querySelector(`input[type="checkbox"][value="${label}"]`);
            if (checkbox && checkbox.checked) {
                let labelText = '';
                switch(label) {
                    case 'bio': labelText = 'Agriculture biologique'; break;
                    case 'sans-pesticides': labelText = 'Sans pesticides de synthèse'; break;
                    case 'circuit-court': labelText = 'Circuit court'; break;
                    case 'sans-plastique': labelText = 'Sans emballage plastique'; break;
                }
                activeFilters.push({
                    key: 'labels',
                    label: 'Label',
                    value: labelText,
                    filterValue: label
                });
            }
        });
        
        // Prix
        const price = formData.get('price');
        if (price) {
            let priceText = '';
            switch(price) {
                case '0-10': priceText = 'Moins de 10 €'; break;
                case '10-20': priceText = '10–20 €'; break;
                case '20+': priceText = 'Plus de 20 €'; break;
            }
            activeFilters.push({
                key: 'price',
                label: 'Prix',
                value: priceText,
                filterValue: price
            });
        }
        
        // Afficher les filtres actifs
        if (activeFilters.length > 0) {
            activeFilters.forEach(filter => {
                const chip = document.createElement('span');
                chip.className = 'filter-chip';
                chip.innerHTML = `
                    <span class="chip-label">${filter.label} :</span>
                    <span class="chip-value">${filter.value}</span>
                    <button type="button" class="chip-remove" aria-label="Retirer le filtre ${filter.label} : ${filter.value}" data-filter-key="${filter.key}" data-filter-value="${filter.filterValue}">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                `;
                activeFiltersContainer.appendChild(chip);
            });
            clearAllBtn.style.display = 'inline-block';
        } else {
            clearAllBtn.style.display = 'none';
        }
        
        // Filtrer les produits
        filterProducts();
    }
    
    // Fonction pour obtenir le terme de recherche depuis l'URL
    function getSearchTermFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('q') || '';
    }
    
    // Fonction pour afficher le terme de recherche
    function displaySearchTerm() {
        const searchTerm = getSearchTermFromURL();
        if (searchTerm) {
            // Créer ou mettre à jour l'affichage du terme de recherche
            let searchDisplay = document.getElementById('search-term-display');
            if (!searchDisplay) {
                searchDisplay = document.createElement('div');
                searchDisplay.id = 'search-term-display';
                searchDisplay.className = 'search-term-display';
                const productsTitle = document.querySelector('.products-section h2');
                if (productsTitle) {
                    productsTitle.insertAdjacentElement('afterend', searchDisplay);
                }
            }
            searchDisplay.innerHTML = `
                <p>Résultats de recherche pour : <strong>"${searchTerm}"</strong></p>
                <button type="button" class="btn-clear-search" onclick="window.location.href='/produits'">Effacer la recherche</button>
            `;
        } else {
            // Supprimer l'affichage si pas de recherche
            const searchDisplay = document.getElementById('search-term-display');
            if (searchDisplay) {
                searchDisplay.remove();
            }
        }
    }
    
    // Fonction pour filtrer les produits
    function filterProducts() {
        const formData = new FormData(filtersForm);
        const type = formData.get('type');
        const producer = formData.get('producer');
        const price = formData.get('price');
        const labels = formData.getAll('labels');
        const searchTerm = getSearchTermFromURL().toLowerCase();
        
        const productCards = productsGrid.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            let shouldShow = true;
            
            // Recherche textuelle (prioritaire)
            if (searchTerm && shouldShow) {
                const productTitle = card.querySelector('h3 a')?.textContent.toLowerCase() || '';
                const producerName = card.querySelector('.product-producer-name')?.textContent.toLowerCase() || '';
                const productText = productTitle + ' ' + producerName;
                
                // Vérifier si le terme de recherche est présent
                if (!productText.includes(searchTerm)) {
                    shouldShow = false;
                }
            }
            
            // Filtrer par type (simplifié - basé sur le contenu)
            if (type && shouldShow) {
                const productTitle = card.querySelector('h3 a').textContent.toLowerCase();
                // Logique de filtrage simplifiée
                if (type === 'paniers-legumes' && !productTitle.includes('panier') && !productTitle.includes('légume')) {
                    shouldShow = false;
                }
            }
            
            // Filtrer par producteur (simplifié)
            if (producer && shouldShow) {
                const producerName = card.querySelector('.product-producer-name').textContent;
                // Logique de filtrage simplifiée
            }
            
            // Filtrer par prix (simplifié)
            if (price && shouldShow) {
                const priceText = card.querySelector('.product-price').textContent;
                const priceValue = parseFloat(priceText.replace('€', '').replace(',', '.').trim());
                if (price === '0-10' && priceValue >= 10) shouldShow = false;
                if (price === '10-20' && (priceValue < 10 || priceValue > 20)) shouldShow = false;
                if (price === '20+' && priceValue <= 20) shouldShow = false;
            }
            
            if (shouldShow) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mettre à jour le compteur
        productsCount.textContent = visibleCount;
        
        // Afficher/masquer le message "aucun produit"
        if (visibleCount === 0) {
            productsGrid.style.display = 'none';
            noProductsMessage.style.display = 'block';
        } else {
            productsGrid.style.display = 'grid';
            noProductsMessage.style.display = 'none';
        }
    }
    
    // Fonction pour réinitialiser tous les filtres
    function resetAllFilters() {
        filtersForm.reset();
        activeFilters = [];
        updateActiveFilters();
        filterProducts();
    }
    
    // Afficher le terme de recherche et filtrer au chargement
    displaySearchTerm();
    filterProducts();
    
    // Écouter les changements de filtres
    if (filtersForm) {
        filtersForm.addEventListener('change', function() {
            updateActiveFilters();
        });
        
        // Écouter les clics sur les boutons de suppression de filtre
        activeFiltersContainer.addEventListener('click', function(e) {
            if (e.target.closest('.chip-remove')) {
                const button = e.target.closest('.chip-remove');
                const filterKey = button.getAttribute('data-filter-key');
                const filterValue = button.getAttribute('data-filter-value');
                
                // Retirer le filtre
                if (filterKey === 'type') {
                    document.getElementById('filter-type').value = '';
                } else if (filterKey === 'producer') {
                    document.getElementById('filter-producer').value = '';
                } else if (filterKey === 'price') {
                    document.getElementById('filter-price').value = '';
                } else if (filterKey === 'labels') {
                    const checkbox = filtersForm.querySelector(`input[type="checkbox"][value="${filterValue}"]`);
                    if (checkbox) checkbox.checked = false;
                }
                
                updateActiveFilters();
            }
        });
    }
    
    // Bouton réinitialiser tous les filtres
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', resetAllFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    
    if (resetFiltersNoProducts) {
        resetFiltersNoProducts.addEventListener('click', resetAllFilters);
    }
    
    // Gestion du tri
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
            
            // Trier les produits
            productCards.sort((a, b) => {
                if (sortValue === 'price-asc') {
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('€', '').replace(',', '.').trim());
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('€', '').replace(',', '.').trim());
                    return priceA - priceB;
                } else if (sortValue === 'price-desc') {
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('€', '').replace(',', '.').trim());
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('€', '').replace(',', '.').trim());
                    return priceB - priceA;
                } else if (sortValue === 'popularity') {
                    const ratingA = parseFloat(a.querySelector('.rating-text').textContent);
                    const ratingB = parseFloat(b.querySelector('.rating-text').textContent);
                    return ratingB - ratingA;
                }
                return 0;
            });
            
            // Réorganiser dans le DOM
            productCards.forEach(card => productsGrid.appendChild(card));
        });
    }
    
    // Bouton "Charger plus"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Ici, vous pouvez ajouter la logique pour charger plus de produits
            // Pour l'instant, on simule juste
            this.textContent = 'Chargement...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Charger plus de produits';
                this.disabled = false;
                // Dans une vraie application, vous chargeriez plus de produits ici
            }, 1000);
        });
    }
    
    // Initialiser les filtres actifs au chargement
    updateActiveFilters();
    
    // Afficher le terme de recherche et filtrer au chargement
    displaySearchTerm();
    filterProducts();
    
    // Gestion de la carte des producteurs
    if (toggleMapBtn && mapContainer) {
        let mapInitialized = false;
        
        toggleMapBtn.addEventListener('click', async function() {
            const isVisible = mapContainer.style.display !== 'none';
            
            if (!isVisible) {
                // Afficher la carte
                mapContainer.style.display = 'block';
                toggleMapBtn.innerHTML = `
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Masquer la carte
                `;
                
                // Initialiser la carte si ce n'est pas déjà fait
                if (!mapInitialized) {
                    try {
                        toggleMapBtn.textContent = 'Chargement...';
                        toggleMapBtn.disabled = true;
                        
                        const userLocation = await getUserLocation();
                        initMap(userLocation.lat, userLocation.lng);
                        
                        mapInitialized = true;
                        toggleMapBtn.innerHTML = `
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            Masquer la carte
                        `;
                        toggleMapBtn.disabled = false;
                    } catch (error) {
                        console.error('Erreur lors de l\'initialisation de la carte:', error);
                        alert('Impossible de charger la carte. Veuillez réessayer.');
                        mapContainer.style.display = 'none';
                        toggleMapBtn.innerHTML = `
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            Afficher la carte
                        `;
                        toggleMapBtn.disabled = false;
                    }
                } else {
                    // Réinitialiser la carte avec la position actuelle
                    try {
                        const userLocation = await getUserLocation();
                        initMap(userLocation.lat, userLocation.lng);
                    } catch (error) {
                        console.error('Erreur lors de la mise à jour de la carte:', error);
                    }
                }
            } else {
                // Masquer la carte
                mapContainer.style.display = 'none';
                toggleMapBtn.innerHTML = `
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Afficher la carte
                `;
            }
        });
        
        // Gérer le changement de sélection dans le dropdown de livraison
        const deliverySelect = document.getElementById('filter-delivery');
        if (deliverySelect) {
            deliverySelect.addEventListener('change', function() {
                if (this.value === 'local' && !mapInitialized) {
                    // Si l'utilisateur sélectionne "Voir les producteurs près de moi", afficher la carte
                    toggleMapBtn.click();
                }
            });
        }
    }
});

