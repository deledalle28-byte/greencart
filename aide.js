// Gestion des accordéons FAQ
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser tous les accordéons
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        const answerId = question.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);
        
        if (answer) {
            // Initialiser l'état fermé
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');
            
            // Ajouter l'événement click
            question.addEventListener('click', function() {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Fermer tous les autres accordéons dans le même groupe (optionnel)
                // Pour garder un seul ouvert à la fois, décommentez les lignes suivantes :
                // const accordionList = question.closest('.faq-accordion-list');
                // if (accordionList) {
                //     const otherQuestions = accordionList.querySelectorAll('.faq-question');
                //     otherQuestions.forEach(q => {
                //         if (q !== question) {
                //             const otherAnswerId = q.getAttribute('aria-controls');
                //             const otherAnswer = document.getElementById(otherAnswerId);
                //             if (otherAnswer) {
                //                 q.setAttribute('aria-expanded', 'false');
                //                 otherAnswer.setAttribute('aria-hidden', 'true');
                //             }
                //         }
                //     });
                // }
                
                // Toggle l'accordéon actuel
                question.setAttribute('aria-expanded', !isExpanded);
                answer.setAttribute('aria-hidden', isExpanded);
                
                // Animation CSS gère le reste via les classes
            });
            
            // Gestion du clavier (Enter et Espace)
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
    
    // Recherche dans l'aide
    const helpSearchForm = document.querySelector('.help-search-form');
    const helpSearchInput = document.getElementById('help-search');
    
    if (helpSearchForm && helpSearchInput) {
        helpSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(helpSearchInput.value.trim());
        });
        
        // Recherche en temps réel (optionnel, décommentez si souhaité)
        // helpSearchInput.addEventListener('input', function() {
        //     if (this.value.length >= 3) {
        //         performSearch(this.value.trim());
        //     }
        // });
    }
    
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            
            if (!subject || !message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Simulation d'envoi (à remplacer par un vrai appel API)
            alert('Votre demande a été envoyée. Nous vous répondrons sous 24 heures ouvrées.');
            contactForm.reset();
        });
    }
});

// Fonction de recherche dans les FAQ
function performSearch(query) {
    if (!query) {
        // Réinitialiser l'affichage
        document.querySelectorAll('.faq-item').forEach(item => {
            item.style.display = '';
        });
        return;
    }
    
    const searchTerms = query.toLowerCase().split(' ');
    const faqItems = document.querySelectorAll('.faq-item');
    let foundCount = 0;
    
    faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question span')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer p')?.textContent.toLowerCase() || '';
        const fullText = questionText + ' ' + answerText;
        
        // Vérifier si tous les termes de recherche sont présents
        const matches = searchTerms.every(term => fullText.includes(term));
        
        if (matches) {
            item.style.display = '';
            foundCount++;
            
            // Ouvrir automatiquement l'accordéon si fermé
            const question = item.querySelector('.faq-question');
            const answerId = question.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);
            
            if (question && answer && question.getAttribute('aria-expanded') === 'false') {
                question.setAttribute('aria-expanded', 'true');
                answer.setAttribute('aria-hidden', 'false');
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    // Afficher un message si aucun résultat
    let messageElement = document.getElementById('search-results-message');
    if (foundCount === 0) {
        if (!messageElement) {
            messageElement = document.createElement('p');
            messageElement.id = 'search-results-message';
            messageElement.className = 'search-results-message';
            messageElement.style.marginTop = '16px';
            messageElement.style.color = 'var(--color-error)';
            const searchSection = document.querySelector('.help-search-section');
            if (searchSection) {
                searchSection.appendChild(messageElement);
            }
        }
        messageElement.textContent = 'Aucun résultat trouvé. Essayez d\'autres mots-clés ou parcourez les catégories ci-dessous.';
    } else {
        if (messageElement) {
            messageElement.remove();
        }
    }
}

