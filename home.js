// RENOMAN SRL Website JavaScript

// Variables globales pour stocker les données
let contentData = {};
let projectsData = null; // Nouveau : stockera le manifest des projets
let currentLang = 'en';
let careersData = null;   // ← ajouter cette ligne


// Load content and initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // On charge les deux fichiers JSON en parallèle
    Promise.all([
        loadContent(),          // Charge content.json (votre fonction d'origine)
        loadProjectsManifest(),  // Charge projects-manifest.json (nouveau)
        loadCareersManifest()    // Charge careers-manifest.json (nouveau)
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
        initCareers();
        initServiceFlipCards();
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

    // Bullets multilingues
    document.querySelectorAll('[data-i18n-bullets]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-bullets');
        var parts = key.split('.');
        var val = contentData;  // ✅ contentData, pas content
        parts.forEach(function(p) { val = val && val[p]; });
        if (val && typeof val === 'object' && !Array.isArray(val)) {
            val = val[currentLang] || val['en'];  // ✅ currentLang, pas lang
        }
        if (Array.isArray(val)) {
            el.innerHTML = val.map(function(b) {
                return '<li>' + b + '</li>';
            }).join('');
        }
    });

    // Zones HTML multilingues (innerHTML)
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-html');
        var parts = key.split('.');
        var val = contentData;
        parts.forEach(function(p) { val = val && val[p]; });
        if (val && typeof val === 'object') {
            val = val[currentLang] || val['en'];
        }
        if (val) el.innerHTML = val;
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
            if (window.lucide) lucide.createIcons();
            renderProjectCards();
            renderCareerCards();
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
    // Sélectionne uniquement les liens avec une ancre valide (#section)
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Ignore les href vides, "#" seul, ou les liens data-policy
            if (!targetId || targetId === '#' || this.hasAttribute('data-policy')) return;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
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

    const links = document.querySelectorAll('[data-policy]');
    const closeBtn = offcanvas.querySelector('.offcanvas__close, #offcanvasClose, .offcanvasclose');
    const overlay = offcanvas.querySelector('.offcanvas__overlay, .offcanvasoverlay');
    const titleEl = document.getElementById('policyTitle');       // ← getElementById, plus robuste
    const contentEl = document.getElementById('policyContent');   // ← idem

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const type = this.dataset.policy;
            let titleText = '', contentText = '';

            if (type === 'privacy') {
                titleText = getText('politiqueconfidentialite.titre');
                contentText = getText('politiqueconfidentialite.texte');
            } else if (type === 'terms') {
                titleText = getText('conditionsgenerales.titre');
                contentText = getText('conditionsgenerales.texte');
            }

            if (titleEl) titleEl.textContent = titleText;
            if (contentEl) contentEl.innerHTML = contentText || 'Content not found';

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
function initProjectSlideshow() {
  renderProjectCards();
}

function renderProjectCards() {
  var grid = document.getElementById('projectsGrid');
  if (!grid || !projectsData) return;

  grid.innerHTML = '';

  var sorted = Object.keys(projectsData).sort(function(a, b) {
    return (projectsData[a].order || 999) - (projectsData[b].order || 999);
  });

  sorted.forEach(function(projectName) {
    var p = projectsData[projectName];
    if (!p) return;

    var title   = getLocalizedValue(p.titre);
    var teaser  = getLocalizedValue(p.teaser);
    var coverSrc = p.folder + '/' + p.cover;

    var card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = [
      '<div class="project-card__photo" data-project="' + projectName + '">',
        '<img src="' + coverSrc + '" alt="' + title + '" class="project-photo" loading="lazy">',
        '<div class="project-card__overlay">',
          '<span class="project-card__view-btn">' + (getText('ui.viewGallery') || 'View gallery') + '</span>',
        '</div>',
      '</div>',
      '<div class="project-card__info">',
        '<h3 class="project-card__title">' + title + '</h3>',
        '<p class="project-card__teaser">' + teaser + '</p>',
        '<button class="btn btn--outline btn--sm project-card__details-btn">',
          getText('ui.learnMore') || 'Learn more →',
        '</button>',
      '</div>'
    ].join('');

    ['project-card__photo', 'project-card__title', 'project-card__details-btn'].forEach(function(cls) {
      var el = card.querySelector('.' + cls);
      if (el) el.addEventListener('click', function() { openSlideshow(projectName); });
    });

    grid.appendChild(card);
  });

  document.querySelectorAll('.project-card').forEach(function(c) { c.classList.add('fade-in'); });
}

function buildProjectInfoPanel(projectName) {
  var p = projectsData && projectsData[projectName];
  if (!p) return '<p>No data</p>';

  var lv = getLocalizedValue; // alias court

  var badgesHTML = (lv(p.highlights) || []).map(function(h) {
    return '<span class="highlight-badge">' + h + '</span>';
  }).join('');

  var stakeholdersHTML = (lv(p.stakeholders) || []).map(function(s) {
    return '<li><strong>' + s.role + '</strong>' + s.name + '</li>';
  }).join('');

  var contribsHTML = (lv(p.contributions) || []).map(function(c) {
    return '<li><strong>' + c.title + '</strong> — ' + c.text + '</li>';
  }).join('');

  return [
    '<h2>' + lv(p.titre) + '</h2>',
    '<div class="project-highlights">' + badgesHTML + '</div>',
    '<h3>' + (getText('ui.projectOverview') || 'Overview') + '</h3>',
    '<p>' + lv(p.overview) + '</p>',
    '<h3>' + (getText('ui.stakeholders') || 'Stakeholders') + '</h3>',
    '<ul class="stakeholder-list">' + stakeholdersHTML + '</ul>',
    '<h3>' + (getText('ui.ourContributions') || 'Our Contributions') + '</h3>',
    '<ul>' + contribsHTML + '</ul>'
  ].join('');
}

function getLocalizedValue(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[currentLang] || obj['en'] || '';
}

function getProjectImages(projectName) {
  var p = projectsData && projectsData[projectName];
  if (!p || !p.images) return [];
  return p.images.map(function(img) {
    return p.folder + '/' + img;
  });
}

function openSlideshow(projectName) {
  var projectImages = getProjectImages(projectName);
  var currentImageIndex = 0;

  var modal = document.createElement('div');
  modal.className = 'slideshow-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;display:flex;align-items:center;justify-content:center;';

  modal.innerHTML = [
    '<div id="slideshowOverlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.92);"></div>',
    '<div class="slideshow-with-info" style="position:relative;z-index:1;">',

      // Galerie côté gauche
      '<div class="slideshow-gallery-side">',
        '<button id="slideshowClose" style="align-self:flex-end;background:rgba(255,255,255,0.15);border:none;color:white;font-size:28px;width:40px;height:40px;border-radius:50%;cursor:pointer;line-height:1;">&times;</button>',
        '<div style="position:relative;display:flex;align-items:center;">',
          projectImages.length > 1 ? '<button id="slideshowPrev" style="position:absolute;left:-48px;background:rgba(255,255,255,0.15);border:none;color:white;font-size:24px;width:40px;height:40px;border-radius:50%;cursor:pointer;">&#8249;</button>' : '',
          '<img id="slideshowImage" src="" alt="" style="max-width:100%;max-height:65vh;object-fit:contain;border-radius:8px;display:block;transition:opacity 0.3s ease;">',
          projectImages.length > 1 ? '<button id="slideshowNext" style="position:absolute;right:-48px;background:rgba(255,255,255,0.15);border:none;color:white;font-size:24px;width:40px;height:40px;border-radius:50%;cursor:pointer;">&#8250;</button>' : '',
        '</div>',
        projectImages.length > 1 ? '<p id="slideshowCounter" style="color:rgba(255,255,255,0.6);font-size:12px;margin:0;"></p>' : '',
      '</div>',

      // Panneau info côté droit
      '<div class="slideshow-info-panel" id="slideshowInfoPanel">',
        buildProjectInfoPanel(projectName),
      '</div>',

    '</div>'
  ].join('');

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  var overlay = document.getElementById('slideshowOverlay');
  var closeBtn = document.getElementById('slideshowClose');
  var prevBtn = document.getElementById('slideshowPrev');
  var nextBtn = document.getElementById('slideshowNext');
  var imageEl = document.getElementById('slideshowImage');
  var counter = document.getElementById('slideshowCounter');

  function closeSlideshow() {
    modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
  }

  function loadImage(index) {
    imageEl.style.opacity = '0.3';
    var tmp = new Image();
    tmp.onload = function() {
      imageEl.src = tmp.src;
      imageEl.style.opacity = '1';
      if (counter) counter.textContent = (index + 1) + ' / ' + projectImages.length;
    };
    tmp.onerror = function() { imageEl.style.opacity = '1'; };
    tmp.src = projectImages[index];
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
    loadImage(currentImageIndex);
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % projectImages.length;
    loadImage(currentImageIndex);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') closeSlideshow();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }

  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeSlideshow(); });
  closeBtn.addEventListener('click', closeSlideshow);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  document.addEventListener('keydown', handleKeydown);

  loadImage(0);
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



// Hero video crossfade loop
(function () {
  const vidA = document.getElementById('heroBgA');
  const vidB = document.getElementById('heroBgB');
  if (!vidA || !vidB) return;

  const FADE_BEFORE = 1.5; // secondes avant la fin pour déclencher le fondu

  function crossfade(fromVid, toVid) {
    toVid.currentTime = 0;
    toVid.play();
    toVid.classList.add('hero-video--active');
    fromVid.classList.remove('hero-video--active');

    // Nettoyage de l'écouteur sur fromVid pour éviter les doublons
    fromVid._crossfadeListener && fromVid.removeEventListener('timeupdate', fromVid._crossfadeListener);

    // Prépare le prochain crossfade sur toVid
    setupCrossfade(toVid, fromVid);
  }

  function setupCrossfade(activeVid, waitingVid) {
    const listener = function () {
      if (activeVid.duration && activeVid.currentTime >= activeVid.duration - FADE_BEFORE) {
        activeVid.removeEventListener('timeupdate', listener);
        crossfade(activeVid, waitingVid);
      }
    };
    activeVid._crossfadeListener = listener;
    activeVid.addEventListener('timeupdate', listener);
  }

  vidA.addEventListener('loadedmetadata', function () {
    setupCrossfade(vidA, vidB);
  });
})();


// =============================================
// FLIP CARDS — Services
// =============================================
function initServiceFlipCards() {
  // 1. Flip au clic sur la carte (sauf si clic sur le bouton "details")
  document.querySelectorAll('.flip-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      // Si le clic vient du bouton "Learn more", ne pas flipper
      if (e.target.closest('[data-service-detail]')) return;
      card.classList.toggle('is-flipped');
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  // 2. Bouton "Learn more" → ouvre l'offcanvas avec le contenu complet
  document.querySelectorAll('[data-service-detail]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // empêche le flip de se redéclencher
      var serviceKey = this.getAttribute('data-service-detail');
      openServiceOffcanvas(serviceKey);
    });
  });
}

function openServiceOffcanvas(serviceKey) {
  var offcanvas = document.getElementById('policyOffcanvas');
  if (!offcanvas) return;

  var titleEl = offcanvas.querySelector('#policyTitle');
  var contentEl = offcanvas.querySelector('#policyContent');

  // Récupère les données
  var title = getText('sectionservices.' + serviceKey + '.titre');
  var intro = getText('sectionservices.' + serviceKey + '.intro');

  // Bullets complets
  var bulletsPath = ('sectionservices.' + serviceKey + '.bullets').split('.');
  var bulletsVal = contentData;
  bulletsPath.forEach(function(p) { bulletsVal = bulletsVal && bulletsVal[p]; });
  if (bulletsVal && typeof bulletsVal === 'object' && !Array.isArray(bulletsVal)) {
    bulletsVal = bulletsVal[currentLang] || bulletsVal['en'];
  }

  var bulletsHTML = '';
  if (Array.isArray(bulletsVal)) {
    bulletsHTML = '<ul class="offcanvas-service-bullets">' +
      bulletsVal.map(function(b) { return '<li>' + b + '</li>'; }).join('') +
      '</ul>';
  }

  if (titleEl) titleEl.textContent = title || serviceKey;
  if (contentEl) {
    contentEl.innerHTML =
      '<p class="offcanvas-service-intro">' + (intro || '') + '</p>' +
      bulletsHTML;
  }

  offcanvas.classList.add('offcanvas--open');
  document.body.style.overflow = 'hidden';
}

// Appel à l'init (ajoute dans le bloc DOMContentLoaded existant)
// initServiceFlipCards();

// =============================================
// CAREERS — Chargement & Rendu
// =============================================

async function loadCareersManifest() {
  try {
    const response = await fetch('careers-manifest.json');
    if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
    careersData = await response.json();
    console.log('Careers manifest loaded successfully');
  } catch (error) {
    console.warn('Could not load careers-manifest.json — careers section hidden.');
    careersData = {};
  }
}

function initCareers() {
  renderCareerCards();
}

function renderCareerCards() {
  const section = document.getElementById('careers');
  const grid = document.getElementById('careersGrid');
  if (!section || !grid || !careersData) return;

  // Filtre les postes ouverts uniquement
  const openJobs = Object.keys(careersData).filter(function(key) {
    return careersData[key].open === true;
  });

  // Aucun poste → section et nav masquées
  if (openJobs.length === 0) {
    section.style.display = 'none';
    removeCareersNavLink();
    return;
  }

  // Affiche la section et le lien nav
  section.style.display = 'block';
  // Force un reflow avant que le scroll soit calculé
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      // Le double rAF garantit que le layout est stable
      section.style.scrollMarginTop = 'var(--header-height)';
    });
  });
  addCareersNavLink();

  // Trie par order
  openJobs.sort(function(a, b) {
    return (careersData[a].order || 999) - (careersData[b].order || 999);
  });

  grid.innerHTML = '';

  openJobs.forEach(function(jobKey) {
    var job = careersData[jobKey];
    var title    = getLocalizedValue(job.titre);
    var location = getLocalizedValue(job.location);
    var type     = getLocalizedValue(job.type);
    var teaser   = getLocalizedValue(job.teaser);

    var card = document.createElement('div');
    card.className = 'career-card';
    card.innerHTML = [
      '<div class="career-card__header">',
        '<h3 class="career-card__title">' + title + '</h3>',
        '<div class="career-card__meta">',
          '<span class="career-meta-badge">',
            '<i data-lucide="map-pin"></i>',
            location,
          '</span>',
          '<span class="career-meta-badge">',
            '<i data-lucide="briefcase"></i>',
            type,
          '</span>',
        '</div>',
      '</div>',
      '<p class="career-card__teaser">' + teaser + '</p>',
      '<div class="career-card__actions">',
        '<button class="btn btn--primary btn--sm career-details-btn" data-job-key="' + jobKey + '">',
          getText('ui.learnMore') || 'Learn more →',
        '</button>',
      '</div>'
    ].join('');

    card.querySelector('.career-details-btn').addEventListener('click', function() {
      openJobOffcanvas(jobKey);
    });

    grid.appendChild(card);
  });

  // Réinitialise les icônes Lucide sur les nouveaux éléments
  if (window.lucide) lucide.createIcons();
}

function openJobOffcanvas(jobKey) {
  var job = careersData && careersData[jobKey];
  if (!job) return;

  var offcanvas = document.getElementById('policyOffcanvas');
  if (!offcanvas) return;

  var titleEl   = document.getElementById('policyTitle');
  var contentEl = document.getElementById('policyContent');

  var title         = getLocalizedValue(job.titre);
  var location      = getLocalizedValue(job.location);
  var type          = getLocalizedValue(job.type);
  var overview      = getLocalizedValue(job.overview);
  var responsibilities = getLocalizedValue(job.responsibilities) || [];
  var profile          = getLocalizedValue(job.profile) || [];

  var respHTML = responsibilities.map(function(r) {
    return '<li>' + r + '</li>';
  }).join('');

  var profileHTML = profile.map(function(p) {
    return '<li>' + p + '</li>';
  }).join('');

  var applyEmail = 'jobs@renomansprl.com';

  var html = [
    '<div class="offcanvas-job-meta">',
      '<span class="career-meta-badge"><i data-lucide="map-pin"></i> ' + location + '</span>',
      '<span class="career-meta-badge"><i data-lucide="briefcase"></i> ' + type + '</span>',
    '</div>',
    '<h3>' + (getText('ui.jobOverview') || 'About the Role') + '</h3>',
    '<p class="offcanvas-job-overview">' + overview + '</p>',
    '<h3>' + (getText('ui.jobResponsibilities') || 'Responsibilities') + '</h3>',
    '<ul class="offcanvas-job-list">' + respHTML + '</ul>',
    '<h3>' + (getText('ui.jobProfile') || 'Your Profile') + '</h3>',
    '<ul class="offcanvas-job-list">' + profileHTML + '</ul>',
    '<div class="offcanvas-job-apply">',
      '<a href="mailto:' + applyEmail + '?subject=Application — ' + title + '" class="btn btn--primary">',
        getText('ui.applyNow') || 'Apply now →',
      '</a>',
    '</div>'
  ].join('');

  if (titleEl) titleEl.textContent = title;
  if (contentEl) contentEl.innerHTML = html;

  offcanvas.classList.add('offcanvas--open');
  document.body.style.overflow = 'hidden';

  if (window.lucide) lucide.createIcons();
}

// Gestion du lien nav Carrières
function addCareersNavLink() {
  if (document.getElementById('nav-link-careers')) return;
  var nav = document.querySelector('.nav__links, .navmenu, nav ul');
  if (!nav) return;

  var contactLink = nav.querySelector('a[href="#contact"]');
  var label = getText('sectioncarrieres.titre') || 'CAREERS';

  var li = document.createElement('li');
  li.id = 'nav-link-careers';
  li.innerHTML = '<a href="#careers" class="nav__link navlink">' + label + '</a>';

  // Scroll manuel avec offset header garanti
  li.querySelector('a').addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.getElementById('careers');
    if (!target) return;
    var headerHeight = document.querySelector('.header').offsetHeight;
    var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  if (contactLink && contactLink.closest('li')) {
    nav.insertBefore(li, contactLink.closest('li'));
  } else {
    nav.appendChild(li);
  }
}


function removeCareersNavLink() {
  var existing = document.getElementById('nav-link-careers');
  if (existing) existing.remove();
}
