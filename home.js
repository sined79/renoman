// RENOMAN SRL Website JavaScript

// Variables globales pour stocker les données
let contentData = {};
let projectsData = null; // Nouveau : stockera le manifest des projets
let currentLang = 'en';

// Load content and initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // On charge les deux fichiers JSON en parallèle
    Promise.all([
        loadContent(),          // Charge content.json (votre fonction d'origine)
        loadProjectsManifest()  // Charge projects-manifest.json (nouveau)
    ]).then(() => {
        const savedLang = localStorage.getItem('preferred-language') || 'EN';
        currentLang = savedLang.toLowerCase();

        // Update language buttons state
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === savedLang);
        });

        // Apply content from JSON IMMEDIATELY
        updatePageContent();

        // Initialize all functionality after content is loaded
        initNavigation();
        initLanguagePicker();
        initThemeToggle();
        initContactForm();
        initSmoothScrolling();
        initScrollEffects();
        initProjectSlideshow();
        initPolicyOffcanvas();
        updatePageContent();
        
        console.log("Site initialisé avec succès");
    });
});

// Load content from content.json file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        contentData = await response.json();
        console.log('Content loaded successfully');
    } catch (error) {
        console.error('Could not load content.json:', error);
        contentData = {};
    }
}

// Load content from projects-manifest.json file
async function loadProjectsManifest() {
    try {
        const response = await fetch('projects-manifest.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        projectsData = await response.json();
        console.log('Projects manifest loaded successfully');
    } catch (error) {
        console.error('Could not load projects-manifest.json:', error);
        projectsData = null;
    }
}

// --- FONCTIONS UTILITAIRES DE CONTENU (INCHANGÉES) ---

function updatePageContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getText(key);
        if (translation) {
            element.textContent = translation;
        } else if (element.textContent.trim() === '') {
            console.warn(`No translation found for: ${key}`);
        }
    });

    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getText(key);
        if (translation) {
            element.placeholder = translation;
        }
    });

    updateSEOMetaTags();
    updateSelectOptions();
    updateCookieBanner();
}

function getNestedProperty(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

function getText(path, lang = currentLang) {
    const parts = path.split('.');
    const lastPart = parts[parts.length - 1];
    const isArrayIndex = !isNaN(parseInt(lastPart));
    let value;

    if (isArrayIndex) {
        const arrayPath = parts.slice(0, -1).join('.');
        const index = parseInt(lastPart);
        value = getNestedProperty(contentData, arrayPath);
        if (!value) return '';

        if (typeof value === 'object' && value[lang]) {
            const langArray = value[lang];
            return Array.isArray(langArray) ? (langArray[index] || '') : '';
        }
        if (Array.isArray(value)) {
            return value[index] || '';
        }
        return '';
    } else {
        value = getNestedProperty(contentData, path);
        if (!value) return '';
        if (Array.isArray(value)) return value;
        if (typeof value === 'object' && value !== null) {
            return value[lang] || value['en'] || '';
        }
        return value;
    }
}

function updateSEOMetaTags() {
    // ... (Votre code SEO original, inchangé) ...
    const lang = currentLang;
    const localeMap = { 'en': 'en_US', 'fr': 'fr_FR', 'nl': 'nl_NL' };
    
    // Update title and other meta tags logic here (same as original)
    const title = getText('seo.titre_page', lang);
    if (title) document.title = title;
}

function updateSelectOptions() {
    const projectTypeSelect = document.getElementById('projectType');
    if (projectTypeSelect) {
        const options = projectTypeSelect.querySelectorAll('option[data-i18n]');
        options.forEach(option => {
            const key = option.getAttribute('data-i18n');
            const translation = getText(key);
            if (translation) option.textContent = translation;
        });
    }
}

function updateCookieBanner() {
    if (window.silktideCookieBannerManager) {
        const cookieConfig = {
            cookieTypes: [
                {
                    id: "necessary",
                    name: getText('cookies.cookies_necessaires'),
                    description: getText('cookies.description_cookies_necessaires'),
                    required: true,
                    onAccept: function() { console.log('Necessary cookies accepted'); }
                }
            ]
        };
        try {
            window.silktideCookieBannerManager.updateCookieBannerConfig(cookieConfig);
        } catch (e) { console.log('Cookie banner update not available'); }
    }
}

// --- FONCTIONS D'INITIALISATION STANDARD (INCHANGÉES) ---

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    if (navToggle) {
        navToggle.addEventListener('click', function() { nav.classList.toggle('nav--mobile-open'); });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', function() { nav.classList.remove('nav--mobile-open'); });
    });
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && nav.classList.contains('nav--mobile-open')) {
            nav.classList.remove('nav--mobile-open');
        }
    });
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });
}

function initLanguagePicker() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) {
        langButtons.forEach(btn => { btn.classList.toggle('active', btn.dataset.lang === savedLang); });
        currentLang = savedLang.toLowerCase();
    }
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const selectedLang = this.dataset.lang;
            currentLang = selectedLang.toLowerCase();
            localStorage.setItem('preferred-language', selectedLang);
            updatePageContent();
            document.documentElement.lang = currentLang;
        });
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(themeIcon, currentTheme);
    themeToggle.addEventListener('click', function() {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeIcon, newTheme);
    });
}
function updateThemeIcon(icon, theme) { icon.textContent = theme === 'light' ? '🌙' : '☀️'; }

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 1. Récupération des données
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // 2. Validation (avec sécurité si la fonction n'existe pas)
        if (typeof validateForm === 'function' && !validateForm(data)) return;

        // 3. Gestion de l'état "Chargement"
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        // Fallback sécurisé si getText n'est pas défini
        const loadingText = (typeof getText === 'function' ? getText('messages.envoi_en_cours') : null) || 'Envoi en cours...';
        
        submitBtn.textContent = loadingText;
        submitBtn.disabled = true;

        try {
            // 4. Envoi avec les URLs AJAX spécifiques
            let successCount = 0;

            // Premier envoi
            try {
                const response1 = await fetch('https://formsubmit.co/ajax/info@renomansprl.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result1 = await response1.json();
                console.log('Response 1:', result1);
                if (result1.success) successCount++;
            } catch (error1) {
                console.error('Erreur envoi 1:', error1);
            }

            // Deuxième envoi
            try {
                const response2 = await fetch('https://formsubmit.co/ajax/1e112aa92c469079719850b22a32b628', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result2 = await response2.json();
                console.log('Response 2:', result2);
                if (result2.success) successCount++;
            } catch (error2) {
                console.error('Erreur envoi 2:', error2);
            }

            if (successCount > 0) {
                // Succès si au moins un envoi a réussi
                const successMsg = (typeof getText === 'function' ? getText('messages.succes_envoi') : null) || 'Message envoyé avec succès !';
                if (typeof showMessage === 'function') {
                    showMessage(successMsg, 'success');
                } else {
                    alert(successMsg); // Fallback simple
                }
                form.reset();
            } else {
                throw new Error('Échec de l\'envoi du message');
            }
        } catch (error) {
            // Erreur
            console.error('Erreur FormSubmit:', error);
            const errorMsg = (typeof getText === 'function' ? getText('messages.erreur_envoi') : null) || 'Une erreur est survenue.';
            
            if (typeof showMessage === 'function') {
                showMessage(errorMsg, 'error');
            } else {
                alert(errorMsg);
            }
        } finally {
            // 5. Rétablissement du bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        showMessage(getText('messages.erreur_nom') || 'Invalid name', 'error');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showMessage(getText('messages.erreur_email') || 'Invalid email', 'error');
        return false;
    }
    return true;
}
function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `padding: 1rem; margin: 1rem 0; border-radius: 4px; background: ${type === 'success' ? '#d4edda' : '#f8d7da'}; color: ${type === 'success' ? '#155724' : '#721c24'}; border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};`;
    const form = document.getElementById('contactForm');
    form.insertBefore(messageEl, form.firstChild);
    setTimeout(() => { messageEl.remove(); }, 5000);
}

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

function initScrollEffects() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.service-card, .project-card, .stat-card').forEach(card => observer.observe(card));
}

function initPolicyOffcanvas() {
    const offcanvas = document.getElementById('policyOffcanvas');
    if (!offcanvas) return;
    const links = document.querySelectorAll('a[data-policy]');
    const closeBtn = offcanvas.querySelector('.offcanvas__close');
    const overlay = offcanvas.querySelector('.offcanvas__overlay');
    const title = offcanvas.querySelector('.offcanvas__title');
    const content = offcanvas.querySelector('.offcanvas__body');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const type = this.dataset.policy;
            let titleText = '', contentText = '';
            
            if (type === 'privacy') {
                titleText = getText('politique_confidentialite.titre');
                contentText = getText('politique_confidentialite.texte');
            } else if (type === 'terms') {
                titleText = getText('conditions_generales.titre');
                contentText = getText('conditions_generales.texte');
            }
            
            title.textContent = titleText || 'Policy';
            content.innerHTML = contentText || 'Content not found';
            offcanvas.classList.add('offcanvas--open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closePolicy() {
        offcanvas.classList.remove('offcanvas--open');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closePolicy);
    if (overlay) overlay.addEventListener('click', closePolicy);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePolicy();
    });
}

// --- NOUVELLE LOGIQUE DE GALERIE (PROJECTS SLIDESHOW) ---

function initProjectSlideshow() {
    const projectPhotos = document.querySelectorAll('.project-photo');
    projectPhotos.forEach(photo => {
        photo.addEventListener('click', function() {
            const projectName = this.dataset.project;
            if (projectName) {
                openSlideshow(projectName);
            }
        });
        photo.style.cursor = 'pointer';
    });
}

// Nouvelle fonction qui utilise projectsData
function getProjectImages(projectName) {
    // Si le manifest n'est pas chargé ou projet inconnu, fallback
    if (!projectsData || !projectsData[projectName]) {
        console.warn(`Projet "${projectName}" introuvable dans le manifest.`);
        return ['assets/photo-placeholder.svg'];
    }

    const project = projectsData[projectName];
    // Reconstruit le chemin complet: dossier + nom de fichier
    return project.images.map(img => `${project.folder}/${img}`);
}

// Nouvelle fonction qui utilise getText pour le titre
function getProjectTitle(projectName) {
    // Essaie de trouver le titre dans content.json via la clé de traduction habituelle
    // Exemple de clé attendue dans votre JSON content: section_projets.projet_1_vilvoorde.titre
    // Vous devrez peut-être adapter ces clés selon votre structure content.json exacte
    const keyMap = {
        'sungrow': 'section_projets.projet_1_vilvoorde.titre',
        'go4zero': 'section_projets.projet_2_go4zero.titre',
        'climatesolutions': 'section_projets.projet_3_climate.titre'
    };
    
    const translationKey = keyMap[projectName];
    if (translationKey) {
        const title = getText(translationKey);
        if (title) return title;
    }
    
    return projectName.charAt(0).toUpperCase() + projectName.slice(1);
}

function openSlideshow(projectName) {
    const projectImages = getProjectImages(projectName);
    let currentImageIndex = 0;

    const modal = document.createElement('div');
    modal.className = 'slideshow-modal';
    
    // Structure avec le loader et styles inline pour le centrage
    modal.innerHTML = `
        <div class="slideshow-overlay" id="slideshowOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div class="slideshow-container" style="position: relative; width: 90%; max-width: 800px;">
                <button class="slideshow-close" id="slideshowClose" style="position: absolute; top: -40px; right: 0; color: white; background: none; border: none; font-size: 40px; cursor: pointer;">&times;</button>
                
                <div class="slideshow-content" style="position: relative; min-height: 200px; display: flex; flex-direction: column; align-items: center;">
                    <div class="slideshow-loader" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none;"></div>
                    
                    <img src="" alt="${projectName}" class="slideshow-image" id="slideshowImage" style="max-width: 550px; max-height: 550px; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; transition: opacity 0.3s ease;">
                    
                    
                </div>

                ${projectImages.length > 1 ? `
                    <button class="slideshow-nav" id="slideshowPrev" style="position: absolute; top: 50%; left: -50px; transform: translateY(-50%); background: none; border: none; color: white; font-size: 30px; cursor: pointer; padding: 10px;">&#10094;</button>
                    <button class="slideshow-nav" id="slideshowNext" style="position: absolute; top: 50%; right: -50px; transform: translateY(-50%); background: none; border: none; color: white; font-size: 30px; cursor: pointer; padding: 10px;">&#10095;</button>
                ` : ''}
            </div>
            <style>@keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }</style>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Elements
    const overlay = modal.querySelector('#slideshowOverlay');
    const closeBtn = modal.querySelector('#slideshowClose');
    const prevBtn = modal.querySelector('#slideshowPrev');
    const nextBtn = modal.querySelector('#slideshowNext');
    const imageElement = modal.querySelector('#slideshowImage');
    const counter = modal.querySelector('.slideshow-counter');
    const loader = modal.querySelector('.slideshow-loader');

    // Close logic
    function closeSlideshow() {
        modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
    }

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSlideshow(); });
    closeBtn.addEventListener('click', closeSlideshow);

    // Image loading logic
    function loadImage(index) {
        loader.style.display = 'block';
        imageElement.style.opacity = '0.3';
        
        const tempImg = new Image();
        const url = projectImages[index];
        
        tempImg.onload = function() {
            imageElement.src = url;
            if (counter) counter.textContent = `${index + 1} / ${projectImages.length}`;
            loader.style.display = 'none';
            imageElement.style.opacity = '1';
            preloadNextImage(index);
        };
        
        tempImg.onerror = function() {
            loader.style.display = 'none';
            imageElement.alt = "Image not found";
        };
        
        tempImg.src = url;
    }

    function preloadNextImage(idx) {
        if (projectImages.length > 1) {
            const nextIdx = (idx + 1) % projectImages.length;
            const img = new Image();
            img.src = projectImages[nextIdx];
        }
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
        loadImage(currentImageIndex);
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % projectImages.length;
        loadImage(currentImageIndex);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Keyboard navigation
    function handleKeydown(e) {
        if (e.key === 'Escape') closeSlideshow();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    }
    document.addEventListener('keydown', handleKeydown);

    // Initial load
    loadImage(0);
}
