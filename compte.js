// Gestion des onglets
document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginPanel = document.getElementById('login-panel');
    const signupPanel = document.getElementById('signup-panel');

    function switchTab(tab, panel) {
        // Désactiver tous les onglets
        [loginTab, signupTab].forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
        });
        [loginPanel, signupPanel].forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-hidden', 'true');
        });

        // Activer l'onglet sélectionné
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
    }

    loginTab.addEventListener('click', () => switchTab(loginTab, loginPanel));
    signupTab.addEventListener('click', () => switchTab(signupTab, signupPanel));

    // Navigation clavier pour les onglets
    [loginTab, signupTab].forEach(tab => {
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (tab === loginTab) {
                    switchTab(loginTab, loginPanel);
                } else {
                    switchTab(signupTab, signupPanel);
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                if (e.key === 'ArrowLeft' && tab === signupTab) {
                    switchTab(loginTab, loginPanel);
                    loginTab.focus();
                } else if (e.key === 'ArrowRight' && tab === loginTab) {
                    switchTab(signupTab, signupPanel);
                    signupTab.focus();
                }
            }
        });
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const isPassword = input.type === 'password';
            
            input.type = isPassword ? 'text' : 'password';
            this.textContent = isPassword ? 'Masquer' : 'Afficher';
            this.setAttribute('aria-label', isPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
        });
    });

    // Détection Caps Lock
    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            const capsLockWarning = document.getElementById('caps-lock-warning');
            if (capsLockWarning) {
                const isCapsLock = e.getModifierState && e.getModifierState('CapsLock');
                capsLockWarning.style.display = isCapsLock ? 'block' : 'none';
            }
        });
    });

    // Validation formulaire de connexion
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors('login');

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        let hasErrors = false;

        // Validation email
        if (!email) {
            showFieldError('login-email-error', 'Merci d\'indiquer votre adresse e-mail.');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showFieldError('login-email-error', 'Cette adresse e-mail ne semble pas valide.');
            hasErrors = true;
        }

        // Validation mot de passe
        if (!password) {
            showFieldError('login-password-error', 'Merci d\'indiquer votre mot de passe.');
            hasErrors = true;
        }

        if (hasErrors) {
            showFormErrors('login-errors', 'Certains champs sont incorrects. Merci de vérifier les informations ci-dessous.');
            return;
        }

        // Simulation de connexion (à remplacer par un vrai appel API)
        console.log('Tentative de connexion:', { email, password });
        alert('Connexion simulée. Dans une vraie application, cela appellerait l\'API d\'authentification.');
    });

    // Validation formulaire de création de compte
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors('signup');

        const firstname = document.getElementById('signup-firstname').value.trim();
        const lastname = document.getElementById('signup-lastname').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const acceptCgv = document.getElementById('accept-cgv').checked;

        let hasErrors = false;

        // Validation prénom
        if (!firstname) {
            showFieldError('signup-firstname-error', 'Merci d\'indiquer votre prénom.');
            hasErrors = true;
        }

        // Validation nom
        if (!lastname) {
            showFieldError('signup-lastname-error', 'Merci d\'indiquer votre nom.');
            hasErrors = true;
        }

        // Validation email
        if (!email) {
            showFieldError('signup-email-error', 'Merci d\'indiquer votre adresse e-mail.');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showFieldError('signup-email-error', 'Cette adresse e-mail ne semble pas valide.');
            hasErrors = true;
        }

        // Validation mot de passe
        if (!password) {
            showFieldError('signup-password-error', 'Merci d\'indiquer un mot de passe.');
            hasErrors = true;
        } else if (!isValidPassword(password)) {
            showFieldError('signup-password-error', 'Le mot de passe doit contenir au minimum 8 caractères, 1 lettre et 1 chiffre.');
            hasErrors = true;
        }

        // Validation CGV
        if (!acceptCgv) {
            showFieldError('accept-cgv-error', 'Vous devez accepter les Conditions générales de vente et la Politique de confidentialité pour créer un compte.');
            hasErrors = true;
        }

        if (hasErrors) {
            showFormErrors('signup-errors', 'Certains champs sont incorrects. Merci de vérifier les informations ci-dessous.');
            return;
        }

        // Simulation de création de compte (à remplacer par un vrai appel API)
        console.log('Création de compte:', { firstname, lastname, email, password, acceptCgv });
        alert('Création de compte simulée. Dans une vraie application, cela appellerait l\'API d\'inscription.');
    });

    // Boutons Google (simulation)
    document.getElementById('google-login-btn').addEventListener('click', function() {
        console.log('Connexion avec Google');
        alert('Dans une vraie application, cela déclencherait le flux OAuth Google Sign-In.');
    });

    document.getElementById('google-signup-btn').addEventListener('click', function() {
        console.log('Création de compte avec Google');
        alert('Dans une vraie application, cela déclencherait le flux OAuth Google Sign-In pour créer un compte.');
    });
});

// Fonctions utilitaires
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // Minimum 8 caractères, 1 lettre, 1 chiffre
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        const input = errorElement.closest('.form-group').querySelector('input');
        if (input) {
            input.setAttribute('aria-invalid', 'true');
            input.classList.add('error');
        }
    }
}

function clearErrors(formPrefix) {
    // Effacer les erreurs de formulaire
    const formErrors = document.getElementById(formPrefix + '-errors');
    if (formErrors) {
        formErrors.textContent = '';
        formErrors.style.display = 'none';
    }

    // Effacer les erreurs de champs
    document.querySelectorAll(`#${formPrefix}-panel .field-error`).forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });

    // Réinitialiser les états des champs
    document.querySelectorAll(`#${formPrefix}-panel input`).forEach(input => {
        input.removeAttribute('aria-invalid');
        input.classList.remove('error');
    });
}

function showFormErrors(errorContainerId, message) {
    const errorContainer = document.getElementById(errorContainerId);
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

