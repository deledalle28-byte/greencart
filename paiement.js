// Validation du formulaire de paiement
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('payment-form');
    const errorSummary = document.getElementById('error-summary');
    const errorSummaryList = document.getElementById('error-summary-list');
    const paymentProcessing = document.getElementById('payment-processing');
    const paymentErrorBank = document.getElementById('payment-error-bank');
    
    // Sections conditionnelles
    const cardDetailsSection = document.getElementById('card-details-section');
    const walletSection = document.getElementById('wallet-section');
    const billingAddressFields = document.getElementById('billing-address-fields');
    const billingSameCheckbox = document.getElementById('billing-same');
    
    // Champs du formulaire
    const fields = {
        'payment-method': document.querySelectorAll('input[name="payment-method"]'),
        'card-number': document.getElementById('card-number'),
        'card-expiry': document.getElementById('card-expiry'),
        'card-cvc': document.getElementById('card-cvc'),
        'card-name': document.getElementById('card-name'),
        'billing-address': document.getElementById('billing-address'),
        'billing-postal-code': document.getElementById('billing-postal-code'),
        'billing-city': document.getElementById('billing-city'),
        'billing-country': document.getElementById('billing-country')
    };
    
    // Messages d'erreur
    const errorMessages = {
        'payment-method': 'Merci de sélectionner un moyen de paiement.',
        'card-number': 'Le numéro de carte semble invalide. Merci de vérifier.',
        'card-expiry': 'Merci d\'indiquer une date valide.',
        'card-cvc': 'Merci d\'indiquer un cryptogramme à 3 chiffres.',
        'card-name': 'Merci d\'indiquer le nom figurant sur la carte.',
        'billing-address': 'Merci d\'indiquer une adresse de facturation.',
        'billing-postal-code': 'Merci d\'indiquer un code postal.',
        'billing-city': 'Merci d\'indiquer une ville.'
    };
    
    // Formatage du numéro de carte (ajout d'espaces)
    if (fields['card-number']) {
        fields['card-number'].addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            if (value.length > 0) {
                value = value.match(/.{1,4}/g).join(' ');
                if (value.length > 19) value = value.substring(0, 19);
            }
            e.target.value = value;
        });
    }
    
    // Formatage de la date d'expiration (MM / AA)
    if (fields['card-expiry']) {
        fields['card-expiry'].addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
            }
            if (value.length > 7) value = value.substring(0, 7);
            e.target.value = value;
        });
    }
    
    // Formatage du CVC (3-4 chiffres)
    if (fields['card-cvc']) {
        fields['card-cvc'].addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
    
    // Validation du numéro de carte (algorithme de Luhn)
    function isValidCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        if (cleaned.length < 13 || cleaned.length > 19) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    // Validation de la date d'expiration
    function isValidExpiryDate(expiry) {
        const parts = expiry.split(' / ');
        if (parts.length !== 2) return false;
        
        const month = parseInt(parts[0]);
        const year = parseInt(parts[1]);
        
        if (month < 1 || month > 12) return false;
        if (year < 0 || year > 99) return false;
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        
        return true;
    }
    
    // Validation du CVC
    function isValidCVC(cvc) {
        const cleaned = cvc.replace(/\D/g, '');
        return cleaned.length === 3 || cleaned.length === 4;
    }
    
    // Afficher une erreur pour un champ
    function showFieldError(fieldId, message) {
        const field = fields[fieldId];
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (field) {
            if (field.nodeName === 'INPUT' || field.nodeName === 'SELECT') {
                field.setAttribute('aria-invalid', 'true');
                field.classList.add('error');
            }
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
            if (field.nodeName === 'INPUT' || field.nodeName === 'SELECT') {
                field.setAttribute('aria-invalid', 'false');
                field.classList.remove('error');
            }
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
            showFieldError(fieldId, errorMessages[fieldId]);
            return false;
        }
        
        // Validations spécifiques
        if (fieldId === 'card-number' && !isValidCardNumber(value)) {
            showFieldError(fieldId, errorMessages[fieldId]);
            return false;
        }
        
        if (fieldId === 'card-expiry' && !isValidExpiryDate(value)) {
            showFieldError(fieldId, errorMessages[fieldId]);
            return false;
        }
        
        if (fieldId === 'card-cvc' && !isValidCVC(value)) {
            showFieldError(fieldId, errorMessages[fieldId]);
            return false;
        }
        
        return true;
    }
    
    // Valider le moyen de paiement
    function validatePaymentMethod() {
        const selected = Array.from(fields['payment-method']).find(radio => radio.checked);
        if (!selected) {
            const errorElement = document.getElementById('payment-method-error');
            if (errorElement) {
                errorElement.textContent = errorMessages['payment-method'];
                errorElement.style.display = 'block';
            }
            return false;
        } else {
            const errorElement = document.getElementById('payment-method-error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            return true;
        }
    }
    
    // Valider l'adresse de facturation
    function validateBillingAddress() {
        if (billingSameCheckbox.checked) {
            return true;
        }
        
        let isValid = true;
        const billingFields = ['billing-address', 'billing-postal-code', 'billing-city'];
        
        billingFields.forEach(fieldId => {
            const field = fields[fieldId];
            if (field && !validateField(fieldId, field.value)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Valider tout le formulaire
    function validateForm() {
        let isValid = true;
        const errors = [];
        
        // Valider le moyen de paiement
        if (!validatePaymentMethod()) {
            isValid = false;
            errors.push({
                field: 'payment-method',
                message: errorMessages['payment-method']
            });
        }
        
        // Valider les champs carte si carte bancaire sélectionnée
        const selectedMethod = Array.from(fields['payment-method']).find(radio => radio.checked);
        if (selectedMethod && selectedMethod.value === 'card') {
            const cardFields = ['card-number', 'card-expiry', 'card-cvc', 'card-name'];
            cardFields.forEach(fieldId => {
                const field = fields[fieldId];
                if (field && !validateField(fieldId, field.value)) {
                    isValid = false;
                    errors.push({
                        field: fieldId,
                        message: errorMessages[fieldId]
                    });
                }
            });
        }
        
        // Valider l'adresse de facturation si nécessaire
        if (!validateBillingAddress()) {
            isValid = false;
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
    
    // Gestion du changement de moyen de paiement
    fields['payment-method'].forEach(radio => {
        radio.addEventListener('change', () => {
            const method = radio.value;
            
            if (method === 'card') {
                cardDetailsSection.style.display = 'block';
                walletSection.style.display = 'none';
            } else {
                cardDetailsSection.style.display = 'none';
                walletSection.style.display = 'block';
                
                const walletName = method === 'wallet' ? 'Apple Pay / Google Pay' : 'PayPal';
                document.getElementById('wallet-name').textContent = walletName;
            }
            
            validatePaymentMethod();
        });
    });
    
    // Gestion de la checkbox adresse de facturation
    billingSameCheckbox.addEventListener('change', () => {
        if (billingSameCheckbox.checked) {
            billingAddressFields.style.display = 'none';
            // Effacer les erreurs des champs de facturation
            ['billing-address', 'billing-postal-code', 'billing-city'].forEach(fieldId => {
                clearFieldError(fieldId);
            });
        } else {
            billingAddressFields.style.display = 'block';
        }
    });
    
    // Validation en temps réel pour les champs carte
    const cardFields = ['card-number', 'card-expiry', 'card-cvc', 'card-name'];
    cardFields.forEach(fieldId => {
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
    
    // Soumission du formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Cacher les messages d'erreur précédents
        paymentErrorBank.style.display = 'none';
        
        if (validateForm()) {
            // Afficher le message de traitement
            paymentProcessing.style.display = 'block';
            paymentProcessing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Désactiver le bouton de soumission
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Traitement en cours...';
            
            // Simuler le traitement du paiement (dans un vrai cas, ce serait une requête vers le PSP)
            setTimeout(() => {
                // Simuler un succès (dans un vrai cas, on vérifierait la réponse du PSP)
                const success = Math.random() > 0.2; // 80% de chance de succès pour la démo
                
                if (success) {
                    // Rediriger vers la page de confirmation
                    window.location.href = '/commande/confirmation';
                } else {
                    // Afficher l'erreur banque / SCA
                    paymentProcessing.style.display = 'none';
                    paymentErrorBank.style.display = 'block';
                    paymentErrorBank.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Réactiver le bouton
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Payer maintenant</span><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
                }
            }, 2000);
        }
    });
});

