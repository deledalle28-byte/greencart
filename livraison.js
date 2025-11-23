// Validation du formulaire de livraison
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('delivery-form');
    const errorSummary = document.getElementById('error-summary');
    const errorSummaryList = document.getElementById('error-summary-list');
    
    // Champs du formulaire
    const fields = {
        firstname: document.getElementById('firstname'),
        lastname: document.getElementById('lastname'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        address: document.getElementById('address'),
        'postal-code': document.getElementById('postal-code'),
        city: document.getElementById('city'),
        country: document.getElementById('country'),
        'delivery-mode': document.querySelectorAll('input[name="delivery-mode"]'),
        'delivery-date': document.getElementById('delivery-date'),
        'delivery-time': document.getElementById('delivery-time')
    };
    
    // Messages d'erreur
    const errorMessages = {
        firstname: 'Merci d\'indiquer votre prénom.',
        lastname: 'Merci d\'indiquer votre nom.',
        email: {
            empty: 'Merci d\'indiquer votre adresse e-mail.',
            invalid: 'L\'adresse e-mail semble invalide. Merci de vérifier.'
        },
        phone: 'Merci d\'indiquer un numéro de téléphone valide (ex. : 06 12 34 56 78).',
        address: 'Merci d\'indiquer une adresse de livraison.',
        'postal-code': {
            empty: 'Merci d\'indiquer un code postal.',
            invalid: 'Nous ne livrons pas encore à cette adresse. Essayez un autre code postal ou vérifiez vos informations.'
        },
        city: 'Merci d\'indiquer une ville.',
        'delivery-mode': 'Merci de sélectionner un mode de livraison.',
        'delivery-date': 'Merci de choisir une date de livraison.',
        'delivery-time': 'Merci de sélectionner un créneau horaire.'
    };
    
    // Validation d'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validation de téléphone (format français)
    function isValidPhone(phone) {
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    // Validation de code postal (5 chiffres)
    function isValidPostalCode(postalCode) {
        const postalRegex = /^\d{5}$/;
        return postalRegex.test(postalCode.replace(/\s/g, ''));
    }
    
    // Afficher une erreur pour un champ
    function showFieldError(fieldId, message) {
        const field = fields[fieldId];
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (field) {
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Effacer une erreur pour un champ
    function clearFieldError(fieldId) {
        const field = fields[fieldId];
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (field) {
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    // Valider un champ individuel
    function validateField(fieldId, value) {
        clearFieldError(fieldId);
        
        if (!value || value.trim() === '') {
            if (fieldId === 'email') {
                showFieldError(fieldId, errorMessages.email.empty);
            } else if (fieldId === 'postal-code') {
                showFieldError(fieldId, errorMessages['postal-code'].empty);
            } else {
                showFieldError(fieldId, errorMessages[fieldId]);
            }
            return false;
        }
        
        // Validations spécifiques
        if (fieldId === 'email' && !isValidEmail(value)) {
            showFieldError(fieldId, errorMessages.email.invalid);
            return false;
        }
        
        if (fieldId === 'phone' && !isValidPhone(value)) {
            showFieldError(fieldId, errorMessages.phone);
            return false;
        }
        
        if (fieldId === 'postal-code' && !isValidPostalCode(value)) {
            showFieldError(fieldId, errorMessages['postal-code'].invalid);
            return false;
        }
        
        return true;
    }
    
    // Valider le mode de livraison
    function validateDeliveryMode() {
        const selected = Array.from(fields['delivery-mode']).find(radio => radio.checked);
        if (!selected) {
            const errorElement = document.getElementById('delivery-mode-error');
            if (errorElement) {
                errorElement.textContent = errorMessages['delivery-mode'];
                errorElement.style.display = 'block';
            }
            return false;
        } else {
            const errorElement = document.getElementById('delivery-mode-error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            return true;
        }
    }
    
    // Valider la date de livraison
    function validateDeliveryDate() {
        const dateValue = fields['delivery-date'].value;
        if (!dateValue) {
            showFieldError('delivery-date', errorMessages['delivery-date']);
            return false;
        }
        return true;
    }
    
    // Valider le créneau horaire
    function validateDeliveryTime() {
        const timeValue = fields['delivery-time'].value;
        if (!timeValue) {
            showFieldError('delivery-time', errorMessages['delivery-time']);
            return false;
        }
        return true;
    }
    
    // Valider tout le formulaire
    function validateForm() {
        let isValid = true;
        const errors = [];
        
        // Valider les champs texte
        const textFields = ['firstname', 'lastname', 'email', 'phone', 'address', 'postal-code', 'city'];
        textFields.forEach(fieldId => {
            const field = fields[fieldId];
            if (field && !validateField(fieldId, field.value)) {
                isValid = false;
                errors.push({
                    field: fieldId,
                    message: errorMessages[fieldId] || `Le champ ${fieldId} est requis.`
                });
            }
        });
        
        // Valider le mode de livraison
        if (!validateDeliveryMode()) {
            isValid = false;
            errors.push({
                field: 'delivery-mode',
                message: errorMessages['delivery-mode']
            });
        }
        
        // Valider la date de livraison
        if (!validateDeliveryDate()) {
            isValid = false;
            errors.push({
                field: 'delivery-date',
                message: errorMessages['delivery-date']
            });
        }
        
        // Valider le créneau horaire
        if (!validateDeliveryTime()) {
            isValid = false;
            errors.push({
                field: 'delivery-time',
                message: errorMessages['delivery-time']
            });
        }
        
        // Afficher le résumé d'erreur
        if (!isValid && errors.length > 0) {
            errorSummary.style.display = 'block';
            errorSummaryList.innerHTML = '';
            errors.forEach(error => {
                const li = document.createElement('li');
                const fieldLabel = document.querySelector(`label[for="${error.field}"]`)?.textContent || error.field;
                li.textContent = `${fieldLabel} : ${error.message}`;
                errorSummaryList.appendChild(li);
            });
            
            // Faire défiler vers le résumé d'erreur
            errorSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            errorSummary.focus();
        } else {
            errorSummary.style.display = 'none';
        }
        
        return isValid;
    }
    
    // Gestion des sélecteurs de date
    const dateOptions = document.querySelectorAll('.date-option');
    dateOptions.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const date = button.getAttribute('data-date');
            
            // Désélectionner les autres
            dateOptions.forEach(opt => {
                opt.classList.remove('selected');
                opt.setAttribute('aria-pressed', 'false');
            });
            
            // Sélectionner celui-ci
            button.classList.add('selected');
            button.setAttribute('aria-pressed', 'true');
            fields['delivery-date'].value = date;
            clearFieldError('delivery-date');
        });
    });
    
    // Gestion des sélecteurs de créneau horaire
    const timeOptions = document.querySelectorAll('.time-option');
    timeOptions.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const time = button.getAttribute('data-time');
            
            // Désélectionner les autres
            timeOptions.forEach(opt => {
                opt.classList.remove('selected');
                opt.setAttribute('aria-pressed', 'false');
            });
            
            // Sélectionner celui-ci
            button.classList.add('selected');
            button.setAttribute('aria-pressed', 'true');
            fields['delivery-time'].value = time;
            clearFieldError('delivery-time');
        });
    });
    
    // Validation en temps réel pour les champs texte
    const textFields = ['firstname', 'lastname', 'email', 'phone', 'address', 'postal-code', 'city'];
    textFields.forEach(fieldId => {
        const field = fields[fieldId];
        if (field) {
            field.addEventListener('blur', () => {
                validateField(fieldId, field.value);
            });
            
            field.addEventListener('input', () => {
                if (field.value.trim() !== '') {
                    clearFieldError(fieldId);
                }
            });
        }
    });
    
    // Validation en temps réel pour le mode de livraison
    fields['delivery-mode'].forEach(radio => {
        radio.addEventListener('change', () => {
            validateDeliveryMode();
        });
    });
    
    // Soumission du formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Si le formulaire est valide, rediriger vers la page de paiement
            window.location.href = '/commande/paiement';
        }
    });
});

