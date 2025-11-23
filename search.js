// Script global pour gérer la recherche sur toutes les pages
document.addEventListener('DOMContentLoaded', function() {
    // Intercepter tous les formulaires de recherche
    const searchForms = document.querySelectorAll('.search-form');
    
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = form.querySelector('input[type="search"]');
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            
            if (searchTerm) {
                // Rediriger vers la page produits avec le paramètre de recherche
                window.location.href = `/produits?q=${encodeURIComponent(searchTerm)}`;
            } else {
                // Si vide, rediriger vers la page produits sans filtre
                window.location.href = '/produits';
            }
        });
    });
});
