// Gestion du formulaire d'avis sur la page de confirmation
document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedback-form');
    
    if (!feedbackForm) return;
    
    const experienceRadios = document.querySelectorAll('input[name="feedback-experience"]');
    const commentField = document.getElementById('feedback-comment');
    const submitButton = feedbackForm.querySelector('button[type="submit"]');
    
    // Soumission du formulaire
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Vérifier qu'une option est sélectionnée
        const selectedExperience = Array.from(experienceRadios).find(radio => radio.checked);
        
        if (!selectedExperience) {
            // Afficher un message d'erreur discret
            const firstRadio = experienceRadios[0];
            const fieldset = firstRadio.closest('fieldset');
            if (fieldset) {
                fieldset.setAttribute('aria-invalid', 'true');
                fieldset.style.border = '2px solid var(--color-error)';
                fieldset.style.borderRadius = 'var(--radius-md)';
                fieldset.style.padding = 'var(--spacing-16)';
            }
            return;
        }
        
        // Désactiver le bouton pendant l'envoi
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        
        // Simuler l'envoi (dans un vrai cas, ce serait une requête AJAX)
        setTimeout(() => {
            // Afficher un message de succès
            const successMessage = document.createElement('div');
            successMessage.className = 'feedback-success';
            successMessage.setAttribute('role', 'status');
            successMessage.setAttribute('aria-live', 'polite');
            successMessage.innerHTML = '<p>Merci pour votre avis ! Votre retour nous aide à améliorer GreenCart.</p>';
            
            feedbackForm.parentNode.insertBefore(successMessage, feedbackForm);
            feedbackForm.style.display = 'none';
            
            // Faire défiler vers le message de succès
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1000);
    });
    
    // Effacer l'erreur quand une option est sélectionnée
    experienceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const fieldset = radio.closest('fieldset');
            if (fieldset) {
                fieldset.setAttribute('aria-invalid', 'false');
                fieldset.style.border = '';
                fieldset.style.borderRadius = '';
                fieldset.style.padding = '';
            }
        });
    });
});

