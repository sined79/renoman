// RENOMAN SRL Website JavaScript

// Global variables
let contentData = {};
let currentLang = 'en';

// Load content and initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load JSON content first
    loadContent().then(() => {
        // Initialize all functionality after content is loaded
        initNavigation();
        initLanguagePicker();
        initThemeToggle();
        initContactForm();
        initSmoothScrolling();
        initScrollEffects();
        initProjectSlideshow();
        initPolicyOffcanvas();
        
        // Apply initial language
        const savedLang = localStorage.getItem('preferred-language') || 'en';
        currentLang = savedLang.toLowerCase();
        updatePageContent();
    });
});

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
        console.log('Content loaded successfully');
    } catch (error) {
        console.error('Could not load content.json:', error);
        // Fallback: use empty object or show error
        contentData = {};
    }
}

// Helper function to get nested property from object
function getNestedProperty(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

// Get translated text
function getText(path, lang = currentLang) {
    // Split path and check if last part is a number (array index)
    const parts = path.split('.');
    const lastPart = parts[parts.length - 1];
    const isArrayIndex = !isNaN(parseInt(lastPart));
    
    let value;
    
    if (isArrayIndex) {
        // Remove the index from path to get the array
        const arrayPath = parts.slice(0, -1).join('.');
        const index = parseInt(lastPart);
        value = getNestedProperty(contentData, arrayPath);
        
        if (!value) {
            console.warn(`Translation not found for: ${path}`);
            return '';
        }
        
        // Handle array with language keys
        if (typeof value === 'object' && value[lang]) {
            const langArray = value[lang];
            return Array.isArray(langArray) ? (langArray[index] || '') : '';
        }
        
        // Handle direct array
        if (Array.isArray(value)) {
            return value[index] || '';
        }
        
        console.warn(`Translation not found for: ${path}`);
        return '';
    } else {
        // Normal path without array index
        value = getNestedProperty(contentData, path);
        
        if (!value) {
            console.warn(`Translation not found for: ${path}`);
            return '';
        }
        
        // Handle arrays (for lists)
        if (Array.isArray(value)) {
            return value;
        }
        
        // Handle objects with language keys
        if (typeof value === 'object' && value !== null) {
            return value[lang] || value['en'] || '';
        }
        
        // Handle direct strings
        return value;
    }
}


// Update all page content with current language
function updatePageContent() {
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getText(key);
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getText(key);
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Update meta description
    const metaDesc = document.querySelector('meta[data-i18n-content]');
    if (metaDesc) {
        const key = metaDesc.getAttribute('data-i18n-content');
        const translation = getText(key);
        if (translation) {
            metaDesc.setAttribute('content', translation);
        }
    }
    
    // Update title
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        const key = titleElement.getAttribute('data-i18n');
        const translation = getText(key);
        if (translation) {
            document.title = translation;
        }
    }
    
    // Update SEO meta tags
    updateSEOMetaTags();
    
    // Update select options
    updateSelectOptions();
    
    // Update cookie banner
    updateCookieBanner();
}


// Update SEO meta tags
function updateSEOMetaTags() {
    const lang = currentLang;
    
    // Get locale code for Open Graph
    const localeMap = {
        'en': 'en_US',
        'fr': 'fr_FR',
        'nl': 'nl_NL'
    };
    
    // Update title
    const title = getText('seo.titre_page', lang);
    if (title) {
        document.title = title;
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.textContent = title;
    }
    
    // Update meta description
    const description = getText('seo.description', lang);
    const descMeta = document.getElementById('pageDescription');
    if (descMeta && description) {
        descMeta.setAttribute('content', description);
    }
    
    // Update keywords
    const keywords = getText('seo.keywords', lang);
    const keywordsMeta = document.getElementById('pageKeywords');
    if (keywordsMeta && keywords) {
        keywordsMeta.setAttribute('content', keywords);
    }
    
    // Update Open Graph tags
    const ogTitle = getText('seo.og_title', lang);
    const ogTitleMeta = document.getElementById('ogTitle');
    if (ogTitleMeta && ogTitle) {
        ogTitleMeta.setAttribute('content', ogTitle);
    }
    
    const ogDescription = getText('seo.og_description', lang);
    const ogDescMeta = document.getElementById('ogDescription');
    if (ogDescMeta && ogDescription) {
        ogDescMeta.setAttribute('content', ogDescription);
    }
    
    // Update OG image alt
    const ogImageAlt = getText('seo.og_image.alt', lang);
    const ogImageAltMeta = document.getElementById('ogImageAlt');
    if (ogImageAltMeta && ogImageAlt) {
        ogImageAltMeta.setAttribute('content', ogImageAlt);
    }
    
    // Update OG locale
    const ogLocaleMeta = document.getElementById('ogLocale');
    if (ogLocaleMeta) {
        ogLocaleMeta.setAttribute('content', localeMap[lang] || 'en_US');
    }
    
    // Update Twitter card tags
    const twitterTitle = document.getElementById('twitterTitle');
    if (twitterTitle && ogTitle) {
        twitterTitle.setAttribute('content', ogTitle);
    }
    
    const twitterDesc = document.getElementById('twitterDescription');
    if (twitterDesc && ogDescription) {
        twitterDesc.setAttribute('content', ogDescription);
    }
    
    // Update canonical and hreflang URLs based on current language
    const canonicalUrl = document.getElementById('canonicalUrl');
    const baseUrl = getText('seo.canonical_base');
    if (canonicalUrl && baseUrl) {
        const langPath = lang === 'en' ? '' : `/${lang}`;
        canonicalUrl.setAttribute('href', `${baseUrl}${langPath}`);
    }
    
    // Update OG and Twitter URLs
    const ogUrl = document.getElementById('ogUrl');
    const twitterUrl = document.getElementById('twitterUrl');
    if (ogUrl && baseUrl) {
        const langPath = lang === 'en' ? '' : `/${lang}`;
        const fullUrl = `${baseUrl}${langPath}`;
        ogUrl.setAttribute('content', fullUrl);
        if (twitterUrl) twitterUrl.setAttribute('content', fullUrl);
    }
    
    // Update hreflang links
    const hreflangEn = document.getElementById('hreflangEn');
    const hreflangFr = document.getElementById('hreflangFr');
    const hreflangNl = document.getElementById('hreflangNl');
    
    if (hreflangEn) hreflangEn.setAttribute('href', getText('seo.langue_alternatives.en') || baseUrl + '/en');
    if (hreflangFr) hreflangFr.setAttribute('href', getText('seo.langue_alternatives.fr') || baseUrl + '/fr');
    if (hreflangNl) hreflangNl.setAttribute('href', getText('seo.langue_alternatives.nl') || baseUrl + '/nl');
}


// Update select options in forms
function updateSelectOptions() {
    const projectTypeSelect = document.getElementById('projectType');
    if (projectTypeSelect) {
        const options = projectTypeSelect.querySelectorAll('option[data-i18n]');
        options.forEach(option => {
            const key = option.getAttribute('data-i18n');
            const translation = getText(key);
            if (translation) {
                option.textContent = translation;
            }
        });
    }
}

// Update cookie banner dynamically
function updateCookieBanner() {
    // This would need to be integrated with your cookie banner library
    // Update cookie banner text if the library supports it
    if (window.silktideCookieBannerManager) {
        // Update configuration with translated strings
        const cookieConfig = {
            cookieTypes: [
                {
                    id: "necessary",
                    name: getText('cookies.cookies_necessaires'),
                    description: `<p>${getText('cookies.description_cookies_necessaires')}</p>`,
                    required: true,
                    onAccept: function() {
                        console.log('Necessary cookies accepted');
                    }
                }
            ]
        };
        
        // Try to update if the library supports it
        try {
            window.silktideCookieBannerManager.updateCookieBannerConfig(cookieConfig);
        } catch (e) {
            console.log('Cookie banner update not available');
        }
    }
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('nav--mobile-open');
        });
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('nav--mobile-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && nav.classList.contains('nav--mobile-open')) {
            nav.classList.remove('nav--mobile-open');
        }
    });

    // Active nav link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Language picker functionality
function initLanguagePicker() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) {
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === savedLang);
        });
        currentLang = savedLang.toLowerCase();
    }

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected language
            const selectedLang = this.dataset.lang;
            currentLang = selectedLang.toLowerCase();
            
            // Save preference
            localStorage.setItem('preferred-language', selectedLang);
            
            // Update page content
            updatePageContent();
            
            // Update HTML lang attribute
            document.documentElement.lang = currentLang;
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to 'light'
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

function updateThemeIcon(icon, theme) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = getText('messages.envoi_en_cours') || 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send to FormSubmit.co
                const response = await fetch('https://formsubmit.co/renomansprl@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showMessage(getText('messages.succes_envoi') || 'Thank you! Your message has been sent successfully.', 'success');
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showMessage(getText('messages.erreur_envoi') || 'An error occurred, please try again later.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

function validateForm(data) {
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showMessage(getText('messages.erreur_nom') || 'Name must be at least 2 characters long', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showMessage(getText('messages.erreur_email') || 'Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

function showMessage(message, type) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
    `;
    
    const form = document.getElementById('contactForm');
    form.insertBefore(messageEl, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// Smooth scrolling for anchor links
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
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects (fade-in animations, etc.)
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card, .project-card, .stat-card').forEach(card => {
        observer.observe(card);
    });
}

// Project slideshow functionality
function initProjectSlideshow() {
    const projectPhotos = document.querySelectorAll('.project-photo');
    
    projectPhotos.forEach(photo => {
        photo.addEventListener('click', function() {
            const projectName = this.dataset.project;
            if (projectName) {
                openSlideshow(projectName);
            }
        });
        
        // Add cursor pointer style
        photo.style.cursor = 'pointer';
    });
}

function openSlideshow(projectName) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'slideshow-modal';
    modal.innerHTML = `
        <div class="slideshow-overlay"></div>
        <div class="slideshow-content">
            <button class="slideshow-close">&times;</button>
            <button class="slideshow-prev">&#10094;</button>
            <div class="slideshow-images"></div>
            <button class="slideshow-next">&#10095;</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load project images
    loadProjectImages(projectName, modal);
    
    // Close functionality
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
    };
    
    modal.querySelector('.slideshow-close').addEventListener('click', closeModal);
    modal.querySelector('.slideshow-overlay').addEventListener('click', closeModal);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Close on escape
    const escapeClose = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeClose);
        }
    };
    document.addEventListener('keydown', escapeClose);
}

async function loadProjectImages(projectName, modal) {
    const imagesContainer = modal.querySelector('.slideshow-images');
    const prevBtn = modal.querySelector('.slideshow-prev');
    const nextBtn = modal.querySelector('.slideshow-next');
    let currentIndex = 0;
    const images = [];
    
        // Load manifest
        const response = await fetch('projects-manifest.json');
        if (!response.ok) {
            throw new Error('Failed to load projects manifest');
        }
        
        const manifest = await response.json();
        const project = manifest[projectName];
        
        if (!project) {
            throw new Error(`Project "${projectName}" not found in manifest`);
        }
        
        // Create image elements
        project.images.forEach((filename, index) => {
            const img = document.createElement('img');
            img.src = `${project.folder}/${filename}`;
            img.alt = `${projectName} project image ${index + 1}`;
            img.style.display = index === 0 ? 'block' : 'none';
            imagesContainer.appendChild(img);
            images.push(img);
        });
        
        // Navigation functions
        const showImage = (index) => {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        };
        
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
        
        // Keyboard navigation
        const keyNavigation = (e) => {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }
        };
        document.addEventListener('keydown', keyNavigation);
        
        // Hide navigation if only one image
        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        
        // Clean up keyboard listener when modal closes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node === modal) {
                        document.removeEventListener('keydown', keyNavigation);
                        observer.disconnect();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true });
       
}


// Policy offcanvas functionality
function initPolicyOffcanvas() {
    const policyLinks = document.querySelectorAll('[data-policy]');
    const offcanvas = document.getElementById('policyOffcanvas');
    const closeBtn = document.getElementById('offcanvasClose');
    const overlay = offcanvas?.querySelector('.offcanvas__overlay');
    
    if (!offcanvas) {
        console.error('Offcanvas element not found');
        return;
    }
    
    policyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const policyType = this.dataset.policy;
            openPolicy(policyType);
        });
    });
    
    function openPolicy(type) {
        const title = document.getElementById('policyTitle');
        const content = document.getElementById('policyContent');
        
        if (!title || !content) {
            console.error('Policy title or content element not found');
            return;
        }
        
        // Get title and content based on policy type
        if (type === 'privacy') {
            const policyTitle = getText('politique_confidentialite.titre');
            const policyContent = getText('politique_confidentialite.texte');
            
            title.textContent = policyTitle || 'Privacy Policy';
            content.innerHTML = policyContent || '<p>Content not available.</p>';
            
        } else if (type === 'terms') {
            const termsTitle = getText('conditions_generales.titre');
            const termsContent = getText('conditions_generales.texte');
            
            title.textContent = termsTitle || 'Terms & Conditions';
            content.innerHTML = termsContent || '<p>Content not available.</p>';
        }
        
        // Open the offcanvas
        offcanvas.classList.add('offcanvas--open');
        document.body.style.overflow = 'hidden';
    }
    
    function closePolicy() {
        offcanvas.classList.remove('offcanvas--open');
        document.body.style.overflow = '';
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePolicy);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closePolicy);
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && offcanvas.classList.contains('offcanvas--open')) {
            closePolicy();
        }
    });
}

