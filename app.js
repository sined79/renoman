// RENOMAN SRL Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initLanguagePicker();
    initThemeToggle();
    initContactForm();
    initSmoothScrolling();
    initScrollEffects();
    initProjectSlideshow();
    initPolicyOffcanvas();
});

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

// Translations object
const translations = {
    EN: {
        nav: {
            home: "Home",
            services: "Services",
            about: "About",
            projects: "Projects",
            clients: "Clients",
            contact: "Contact"
        },
        hero: {
            title: "Energy Storage and Electrical Installations",
            subtitle: "Helping businesses achieve energy transition and cost optimization",
            cta1: "Free Energy Audit",
            cta2: "View Our Projects"
        },
        services: {
            title: "OUR SERVICES",
            subtitle: "Diverse solutions tailored to your every need",
            service1: {
                title: "Energy Storage Systems",
                description: "Installation of industrial and commercial battery systems for cost reduction and energy independence",
                details: ["System sizing", "BESS installation", "Grid integration", "Maintenance"],
                cta: "Request Quote"
            },
            service2: {
                title: "Industrial Electrical Installation",
                description: "Complete electrical solutions for industrial and commercial facilities, RGIE compliance",
                details: ["High voltage cabling", "Electrical panels", "Certification", "Inspections"],
                cta: "Consult Expert"
            },
            service3: {
                title: "Energy Optimization",
                description: "Technical support and optimization solutions to maximize energy efficiency",
                details: ["Energy audits", "Optimization strategies", "Monitoring", "Cost-benefit analysis"],
                cta: "Schedule Audit"
            }
        },
        about: {
            title: "ABOUT RENOMAN",
            content: "RENOMAN SRL, based in Wezembeek-Oppem, Belgium, specialized in energy storage and electrical engineering since 2015. Our experienced team of 6 electrical engineers combines over 20 years of experience. RGIE certifications, partnerships with ENGIE, Sungrow, Holcim. Commitment: safety, transparency, customer satisfaction throughout Benelux. Mission: Accelerate energy transition with innovative, reliable, and cost-effective electrical solutions.",
            stats: {
                clients: "50+ Professional Clients",
                experience: "20+ Years Experience",
                compliance: "100% RGIE Compliance",
                response: "24h Response Time"
            }
        },
        projects: {
            title: "RECENT PROJECTS",
            subtitle: "Discover our latest projects",
            project1: {
                title: "Vilvoorde BESS – ENGIE/Sungrow",
                description: "Complete description with results: 2MWh installed, 30% peak cost reduction, 6-month installation"
            },
            project2: {
                title: "GO4Zero – Holcim & CBMI",
                description: "Energy monitoring system, carbon footprint reduction, improved system efficiency"
            },
            project3: {
                title: "ClimateSolution – HVAC",
                description: "Smart HVAC electrical integration, automated climate control, consumption optimization"
            }
        },
        clients: {
            title: "OUR CLIENTS",
            subtitle: "Trusted partners in energy solutions"
        },
        contact: {
            title: "Contact Our Experts",
            form: {
                name: "Name",
                email: "Email",
                projectType: "Project Type",
                message: "Message",
                submit: "Send Request"
            },
            info: {
                address: "Address",
                phone: "Phone",
                email: "Email",
                response: "Response Time"
            }
        },
        footer: {
            quickLinks: "Quick Links",
            certifications: "Certifications",
            legal: "Legal",
            privacyPolicy: "Privacy Policy",
            termsConditions: "Terms & Conditions",
        },
        cookies: {
            bannerDescription: "We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic. <a href=\"https://your-website.com/cookie-policy\" target=\"_blank\">Cookie Policy.</a>",
            acceptAllButtonText: "Accept all",
            acceptAllButtonAccessibleLabel: "Accept all cookies",
            rejectNonEssentialButtonText: "Reject non-essential",
            rejectNonEssentialButtonAccessibleLabel: "Reject non-essential",
            preferencesButtonText: "Preferences",
            preferencesButtonAccessibleLabel: "Toggle preferences",
            preferencesTitle: "Customize your cookie preferences",
            preferencesDescription: "We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.",
            creditLinkText: "Get this banner for free",
            creditLinkAccessibleLabel: "Get this banner for free",
            necessaryCookieName: "Necessary",
            necessaryCookieDescription: "These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences."
        }
    },
    FR: {
        nav: {
            home: "Accueil",
            services: "Services",
            about: "À propos",
            projects: "Projets",
            clients: "Clients",
            contact: "Contact"
        },
        hero: {
            title: "Stockage d'Énergie et Installations Électriques",
            subtitle: "Accompagner les entreprises vers la transition énergétique et l'optimisation des coûts",
            cta1: "Audit Énergétique Gratuit",
            cta2: "Voir Nos Projets"
        },
        services: {
            title: "NOS SERVICES",
            subtitle: "Solutions diversifiées adaptées à tous vos besoins",
            service1: {
                title: "Systèmes de Stockage d'Énergie",
                description: "Installation de systèmes de batteries industriels et commerciaux pour la réduction des coûts et l'indépendance énergétique",
                details: ["Dimensionnement système", "Installation BESS", "Intégration réseau", "Maintenance"],
                cta: "Demander un Devis"
            },
            service2: {
                title: "Installation Électrique Industrielle",
                description: "Solutions électriques complètes pour installations industrielles et commerciales, conformité RGIE",
                details: ["Câblage haute tension", "Tableaux électriques", "Certification", "Inspections"],
                cta: "Consulter un Expert"
            },
            service3: {
                title: "Optimisation Énergétique",
                description: "Support technique et solutions d'optimisation pour maximiser l'efficacité énergétique",
                details: ["Audits énergétiques", "Stratégies d'optimisation", "Surveillance", "Analyse coût-bénéfice"],
                cta: "Planifier un Audit"
            }
        },
        about: {
            title: "À PROPOS DE RENOMAN",
            content: "RENOMAN SRL, basée à Wezembeek-Oppem, Belgique, spécialisée dans le stockage d'énergie et l'ingénierie électrique depuis 2015. Notre équipe expérimentée de 6 ingénieurs électriciens combine plus de 20 ans d'expérience. Certifications RGIE, partenariats avec ENGIE, Sungrow, Holcim. Engagement : sécurité, transparence, satisfaction client dans tout le Benelux. Mission : Accélérer la transition énergétique avec des solutions électriques innovantes, fiables et rentables.",
            stats: {
                clients: "50+ Clients Professionnels",
                experience: "20+ Années d'Expérience",
                compliance: "100% Conformité RGIE",
                response: "Temps de Réponse 24h"
            }
        },
        projects: {
            title: "PROJETS RÉCENTS",
            subtitle: "Découvrez nos derniers projets",
            project1: {
                title: "Vilvoorde BESS – ENGIE/Sungrow",
                description: "Description complète avec résultats : 2MWh installés, 30% de réduction des coûts de pointe, installation en 6 mois"
            },
            project2: {
                title: "GO4Zero – Holcim & CBMI",
                description: "Système de surveillance énergétique, réduction empreinte carbone, efficacité système améliorée"
            },
            project3: {
                title: "ClimateSolution – HVAC",
                description: "Intégration électrique HVAC intelligente, contrôle climatique automatisé, optimisation consommation"
            }
        },
        clients: {
            title: "NOS CLIENTS",
            subtitle: "Partenaires de confiance dans les solutions énergétiques"
        },
        contact: {
            title: "Contactez Nos Experts",
            form: {
                name: "Nom",
                email: "E-mail",
                projectType: "Type de Projet",
                message: "Message",
                submit: "Envoyer la Demande"
            },
            info: {
                address: "Adresse",
                phone: "Téléphone",
                email: "E-mail",
                response: "Temps de Réponse"
            }
        },
        footer: {
            quickLinks: "Liens Rapides",
            certifications: "Certifications",
            legal: "Mentions Légales",
            privacyPolicy: "Politique de Confidentialité",
            termsConditions: "Conditions Générales",
        },
        cookies: {
            bannerDescription: "Nous utilisons des cookies sur notre site pour améliorer votre expérience utilisateur, fournir du contenu personnalisé et analyser notre trafic. <a href=\"https://your-website.com/cookie-policy\" target=\"_blank\">Politique de cookies.</a>",
            acceptAllButtonText: "Tout accepter",
            acceptAllButtonAccessibleLabel: "Accepter tous les cookies",
            rejectNonEssentialButtonText: "Refuser les non-essentiels",
            rejectNonEssentialButtonAccessibleLabel: "Refuser les cookies non-essentiels",
            preferencesButtonText: "Préférences",
            preferencesButtonAccessibleLabel: "Basculer les préférences",
            preferencesTitle: "Personnalisez vos préférences de cookies",
            preferencesDescription: "Nous respectons votre droit à la vie privée. Vous pouvez choisir de ne pas autoriser certains types de cookies. Vos préférences de cookies s'appliqueront sur l'ensemble de notre site web.",
            creditLinkText: "Obtenez cette bannière gratuitement",
            creditLinkAccessibleLabel: "Obtenez cette bannière gratuitement",
            necessaryCookieName: "Nécessaires",
            necessaryCookieDescription: "Ces cookies sont nécessaires au bon fonctionnement du site web et ne peuvent pas être désactivés. Ils aident à des choses comme la connexion et la définition de vos préférences de confidentialité."
        }
    },
    NL: {
        nav: {
            home: "Home",
            services: "Diensten",
            about: "Over ons",
            projects: "Projecten",
            clients: "Klanten",
            contact: "Contact"
        },
        hero: {
            title: "Energieopslag en Elektrische Installaties",
            subtitle: "Bedrijven helpen bij energietransitie en kostenoptimalisatie",
            cta1: "Gratis Energie-Audit",
            cta2: "Bekijk Onze Projecten"
        },
        services: {
            title: "ONZE DIENSTEN",
            subtitle: "Diverse oplossingen op maat van uw behoeften",
            service1: {
                title: "Energieopslagsystemen",
                description: "Installatie van industriële en commerciële batterijsystemen voor kostenreductie en energie-onafhankelijkheid",
                details: ["Systeemdimensionering", "BESS-installatie", "Netintegratie", "Onderhoud"],
                cta: "Offerte Aanvragen"
            },
            service2: {
                title: "Industriële Elektrische Installatie",
                description: "Complete elektrische oplossingen voor industriële en commerciële faciliteiten, AREI-conform",
                details: ["Hoogspanningsbekabeling", "Elektrische panelen", "Certificering", "Inspecties"],
                cta: "Expert Raadplegen"
            },
            service3: {
                title: "Energie-optimalisatie",
                description: "Technische ondersteuning en optimalisatieoplossingen om energie-efficiëntie te maximaliseren",
                details: ["Energie-audits", "Optimalisatiestrategieën", "Monitoring", "Kosten-batenanalyse"],
                cta: "Audit Inplannen"
            }
        },
        about: {
            title: "OVER RENOMAN",
            content: "RENOMAN SRL, gevestigd in Wezembeek-Oppem, België, gespecialiseerd in energieopslag en elektrotechniek sinds 2015. Ons ervaren team van 6 elektrotechnische ingenieurs combineert meer dan 20 jaar ervaring. AREI-certificeringen, partnerschappen met ENGIE, Sungrow, Holcim. Engagement: veiligheid, transparantie, klanttevredenheid in de hele Benelux. Missie: De energietransitie versnellen met innovatieve, betrouwbare en kosteneffectieve elektrische oplossingen.",
            stats: {
                clients: "50+ Professionele Klanten",
                experience: "20+ Jaar Ervaring",
                compliance: "100% AREI Conform",
                response: "Reactietijd 24u"
            }
        },
        projects: {
            title: "RECENTE PROJECTEN",
            subtitle: "Ontdek onze nieuwste projecten",
            project1: {
                title: "Vilvoorde BESS – ENGIE/Sungrow",
                description: "Volledige beschrijving met resultaten: 2MWh geïnstalleerd, 30% piekkosten reductie, 6 maanden installatie"
            },
            project2: {
                title: "GO4Zero – Holcim & CBMI",
                description: "Energiemonitoringsysteem, CO2-voetafdruk vermindering, verbeterde systeemefficiëntie"
            },
            project3: {
                title: "ClimateSolution – HVAC",
                description: "Slimme HVAC elektrische integratie, geautomatiseerde klimaatbeheersing, verbruiksoptimalisatie"
            }
        },
        clients: {
            title: "ONZE KLANTEN",
            subtitle: "Vertrouwde partners in energieoplossingen"
        },
        contact: {
            title: "Contacteer Onze Experts",
            form: {
                name: "Naam",
                email: "E-mail",
                projectType: "Projecttype",
                message: "Bericht",
                submit: "Verzoek Verzenden"
            },
            info: {
                address: "Adres",
                phone: "Telefoon",
                email: "E-mail",
                response: "Reactietijd"
            }
        },
        footer: {
            quickLinks: "Snelle Links",
            certifications: "Certificeringen",
            legal: "Juridische Vermeldingen",
            privacyPolicy: "Privacybeleid",
            termsConditions: "Algemene Voorwaarden"
        },
        cookies: {
            bannerDescription: "We gebruiken cookies op onze site om uw gebruikerservaring te verbeteren, gepersonaliseerde inhoud te bieden en ons verkeer te analyseren. <a href=\"https://your-website.com/cookie-policy\" target=\"_blank\">Cookiebeleid.</a>",
            acceptAllButtonText: "Alles accepteren",
            acceptAllButtonAccessibleLabel: "Alle cookies accepteren",
            rejectNonEssentialButtonText: "Niet-essentiële weigeren",
            rejectNonEssentialButtonAccessibleLabel: "Niet-essentiële cookies weigeren",
            preferencesButtonText: "Voorkeuren",
            preferencesButtonAccessibleLabel: "Voorkeuren schakelen",
            preferencesTitle: "Pas uw cookievoorkeuren aan",
            preferencesDescription: "We respecteren uw recht op privacy. U kunt ervoor kiezen bepaalde soorten cookies niet toe te staan. Uw cookievoorkeuren gelden voor onze gehele website.",
            creditLinkText: "Krijg deze banner gratis",
            creditLinkAccessibleLabel: "Krijg deze banner gratis",
            necessaryCookieName: "Noodzakelijk",
            necessaryCookieDescription: "Deze cookies zijn noodzakelijk voor de goede werking van de website en kunnen niet worden uitgeschakeld. Ze helpen bij zaken zoals inloggen en het instellen van uw privacyvoorkeuren."
        }
    }
};

// Current language
window.currentLang = 'EN';

// Language picker functionality
function initLanguagePicker() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            const selectedLang = this.getAttribute('data-lang');

            // Switch language
            switchLanguage(selectedLang);

            // Store preference
            localStorage.setItem('preferredLanguage', selectedLang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'EN';
    window.currentLang = savedLang;
    switchLanguage(savedLang);

    // Set active button
    const savedButton = document.querySelector(`[data-lang="${savedLang}"]`);
    if (savedButton) {
        langButtons.forEach(btn => btn.classList.remove('active'));
        savedButton.classList.add('active');
    }

    // Update cookie banner with initial language
    updateCookieBannerLanguage();
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Default to light theme if no preference saved
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('preferredTheme', newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    }
}

// Switch language function
function switchLanguage(lang) {
    window.currentLang = lang;
    updatePageContent();
    updateCookieBannerLanguage();
}

// Update cookie banner language
function updateCookieBannerLanguage() {
    const t = translations[currentLang];
    if (window.silktideCookieBannerManager && t.cookies) {
        window.silktideCookieBannerManager.updateCookieBannerConfig({
            background: {
                showBackground: true
            },
            cookieIcon: {
                position: "bottomRight"
            },
            cookieTypes: [
                {
                    id: "necessary",
                    name: t.cookies.necessaryCookieName,
                    description: t.cookies.necessaryCookieDescription,
                    required: true,
                    onAccept: function() {
                        console.log('Add logic for the required Necessary here');
                    }
                }
            ],
            text: {
                banner: {
                    description: t.cookies.bannerDescription,
                    acceptAllButtonText: t.cookies.acceptAllButtonText,
                    acceptAllButtonAccessibleLabel: t.cookies.acceptAllButtonAccessibleLabel,
                    rejectNonEssentialButtonText: t.cookies.rejectNonEssentialButtonText,
                    rejectNonEssentialButtonAccessibleLabel: t.cookies.rejectNonEssentialButtonAccessibleLabel,
                    preferencesButtonText: t.cookies.preferencesButtonText,
                    preferencesButtonAccessibleLabel: t.cookies.preferencesButtonAccessibleLabel
                },
                preferences: {
                    title: t.cookies.preferencesTitle,
                    description: t.cookies.preferencesDescription,
                    creditLinkText: t.cookies.creditLinkText,
                    creditLinkAccessibleLabel: t.cookies.creditLinkAccessibleLabel
                }
            },
            position: {
                banner: "bottomCenter"
            }
        });
    }
}

// Update all page content based on current language
function updatePageContent() {
    const t = translations[currentLang];

    // Navigation
    document.querySelector('a[href="#home"]').textContent = t.nav.home;
    document.querySelector('a[href="#services"]').textContent = t.nav.services;
    document.querySelector('a[href="#about"]').textContent = t.nav.about;
    document.querySelector('a[href="#projects"]').textContent = t.nav.projects;
    document.querySelector('a[href="#clients"]').textContent = t.nav.clients;
    document.querySelector('a[href="#contact"]').textContent = t.nav.contact;

    // Hero section
    document.querySelector('.hero__title').textContent = t.hero.title;
    document.querySelector('.hero__subtitle').textContent = t.hero.subtitle;
    document.querySelector('.hero__cta a:first-child').textContent = t.hero.cta1;
    document.querySelector('.hero__cta a:last-child').textContent = t.hero.cta2;

    // Services section
    document.querySelector('#services .section-title').textContent = t.services.title;
    document.querySelector('#services .section-subtitle').textContent = t.services.subtitle;

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards[0].querySelector('.service-card__title').textContent = t.services.service1.title;
    serviceCards[0].querySelector('.service-card__description').textContent = t.services.service1.description;
    serviceCards[0].querySelector('.btn').textContent = t.services.service1.cta;

    serviceCards[1].querySelector('.service-card__title').textContent = t.services.service2.title;
    serviceCards[1].querySelector('.service-card__description').textContent = t.services.service2.description;
    serviceCards[1].querySelector('.btn').textContent = t.services.service2.cta;

    serviceCards[2].querySelector('.service-card__title').textContent = t.services.service3.title;
    serviceCards[2].querySelector('.service-card__description').textContent = t.services.service3.description;
    serviceCards[2].querySelector('.btn').textContent = t.services.service3.cta;

    // About section
    document.querySelector('#about .section-title').textContent = t.about.title;
    document.querySelector('.about__description p').textContent = t.about.content;

    const statCards = document.querySelectorAll('.stat-card');
    statCards[0].querySelector('.stat-card__label').textContent = t.about.stats.clients;
    statCards[1].querySelector('.stat-card__label').textContent = t.about.stats.experience;
    statCards[2].querySelector('.stat-card__label').textContent = t.about.stats.compliance;
    statCards[3].querySelector('.stat-card__label').textContent = t.about.stats.response;

    // Projects section
    document.querySelector('#projects .section-title').textContent = t.projects.title;
    document.querySelector('#projects .section-subtitle').textContent = t.projects.subtitle;

    const projectCards = document.querySelectorAll('.project-card');
    projectCards[0].querySelector('.project-card__title').textContent = t.projects.project1.title;
    projectCards[0].querySelector('.project-card__description').textContent = t.projects.project1.description;

    projectCards[1].querySelector('.project-card__title').textContent = t.projects.project2.title;
    projectCards[1].querySelector('.project-card__description').textContent = t.projects.project2.description;

    projectCards[2].querySelector('.project-card__title').textContent = t.projects.project3.title;
    projectCards[2].querySelector('.project-card__description').textContent = t.projects.project3.description;

    // Clients section
    document.querySelector('#clients .section-title').textContent = t.clients.title;
    document.querySelector('#clients .section-subtitle').textContent = t.clients.subtitle;

    // Contact section
    document.querySelector('#contact .section-title').textContent = t.contact.title;

    // Contact form
    document.querySelector('label[for="name"]').textContent = t.contact.form.name + ' *';
    document.querySelector('label[for="email"]').textContent = t.contact.form.email + ' *';
    document.querySelector('label[for="projectType"]').textContent = t.contact.form.projectType;
    document.querySelector('label[for="message"]').textContent = t.contact.form.message;
    document.querySelector('.contact-form .btn').textContent = t.contact.form.submit;

    // Contact info
    const contactItems = document.querySelectorAll('.contact-item strong');
    contactItems[0].textContent = '📍 ' + t.contact.info.address + ':';
    contactItems[1].textContent = '📞 ' + t.contact.info.phone + ':';
    contactItems[2].textContent = '📧 ' + t.contact.info.email + ':';
    contactItems[3].textContent = '⏰ ' + t.contact.info.response + ':';

    // Footer
    const footerSections = document.querySelectorAll('.footer__section h4');
    if (footerSections.length >= 3) {
        footerSections[0].textContent = t.footer.quickLinks;
        footerSections[1].textContent = t.footer.certifications;
        footerSections[2].textContent = t.footer.legal;
    }

    // Footer links
    const footerLinks = document.querySelectorAll('.footer__links a[data-policy]');
    footerLinks.forEach(link => {
        const policy = link.getAttribute('data-policy');
        if (policy === 'privacy') {
            link.textContent = t.footer.privacyPolicy;
        } else if (policy === 'terms') {
            link.textContent = t.footer.termsConditions;
        }
    });

    // Update form placeholder
    document.querySelector('#message').setAttribute('placeholder', t.contact.form.message + '...');

    // Update success message
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        successMessage.textContent = currentLang === 'FR' ? 'Merci ! Votre message a été envoyé avec succès.' :
                                   currentLang === 'NL' ? 'Dank je wel! Je bericht is succesvol verzonden.' :
                                   'Thank you! Your message has been sent successfully.';
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            projectType: formData.get('projectType'),
            message: formData.get('message')
        };
        
        if (!validateContactForm(data)) {
            return;
        }
        
        contactForm.classList.add('submitting');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        
        // Préparer un envoi POST vers Formsubmit avec fetch
        fetch('https://formsubmit.co/foguemaurice@gmail.com', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'  // On demande une réponse JSON
            }
        })
        .then(response => {
            contactForm.classList.remove('submitting');
            submitButton.textContent = originalText;
            if (response.ok) {
                showSuccessMessage();
                contactForm.reset();
                const successNotifications = {
                    EN: 'Message sent successfully! We will respond within 24 hours.',
                    FR: 'Message envoyé avec succès ! Nous répondrons dans les 24 heures.',
                    NL: 'Bericht succesvol verzonden! We reageren binnen 24 uur.'
                };
                showNotification(successNotifications[currentLang]);
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .catch(error => {
            contactForm.classList.remove('submitting');
            submitButton.textContent = originalText;
            showNotification('An error occurred, please try again later.');
            console.error('Form submission error:', error);
        });
    });
}


// Form validation
function validateContactForm(data) {
    const errors = [];

    const errorMessages = {
        EN: {
            name: 'Name must be at least 2 characters long',
            email: 'Please enter a valid email address'
        },
        FR: {
            name: 'Le nom doit contenir au moins 2 caractères',
            email: 'Veuillez saisir une adresse e-mail valide'
        },
        NL: {
            name: 'Naam moet minstens 2 tekens bevatten',
            email: 'Gelieve een geldig e-mailadres in te voeren'
        }
    };

    if (!data.name || data.name.trim().length < 2) {
        errors.push(errorMessages[currentLang].name);
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push(errorMessages[currentLang].email);
    }

    if (errors.length > 0) {
        showNotification(errors.join('. '), 'error');
        return false;
    }

    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success message in form
function showSuccessMessage() {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const successMessages = {
        EN: 'Thank you! Your message has been sent successfully.',
        FR: 'Merci ! Votre message a été envoyé avec succès.',
        NL: 'Dank je wel! Je bericht is succesvol verzonden.'
    };

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = successMessages[currentLang];

    const contactForm = document.getElementById('contactForm');
    contactForm.appendChild(successDiv);

    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
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

// Scroll effects
function initScrollEffects() {
    // Header background on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .project-card, .stat-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close">&times;</button>
        </div>
    `;
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                padding: var(--space-16);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            }
            
            .notification--error {
                border-color: var(--color-error);
                background: rgba(var(--color-error-rgb), 0.05);
            }
            
            .notification--success {
                border-color: var(--color-success);
                background: rgba(var(--color-success-rgb), 0.05);
            }
            
            .notification__content {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: var(--space-12);
            }
            
            .notification__message {
                color: var(--color-text);
                font-size: var(--font-size-sm);
                line-height: var(--line-height-normal);
            }
            
            .notification__close {
                background: transparent;
                border: none;
                color: var(--color-text-secondary);
                font-size: var(--font-size-lg);
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all var(--duration-fast) var(--ease-standard);
            }
            
            .notification__close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification__close');
    closeButton.addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Service card interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.service-card .btn')) {
        e.preventDefault();
        const serviceName = e.target.closest('.service-card').querySelector('.service-card__title').textContent;
        const contactSection = document.querySelector('#contact');
        const projectTypeSelect = document.querySelector('#projectType');
        
        // Scroll to contact section
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Pre-fill project type if applicable
        if (projectTypeSelect) {
            setTimeout(() => {
                if (serviceName.includes('Energy Storage')) {
                    projectTypeSelect.value = 'energy-storage';
                } else if (serviceName.includes('Electrical Installation')) {
                    projectTypeSelect.value = 'electrical-installation';
                } else if (serviceName.includes('Energy Optimization')) {
                    projectTypeSelect.value = 'energy-audit';
                }
            }, 500);
        }
    }
});

// Add CSS classes for animations
const animationStyles = `
.service-card,
.project-card,
.stat-card {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.6s ease;
}

.animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.header--scrolled {
    backdrop-filter: blur(10px);
}
`;

// Add animation styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize tooltips for certifications
function initTooltips() {
    const certificationItems = document.querySelectorAll('.footer__links li');
    
    certificationItems.forEach(item => {
        if (item.textContent.includes('RGIE')) {
            item.title = 'Règlement général sur les installations électriques - Belgian electrical safety regulation';
        } else if (item.textContent.includes('ENGIE')) {
            item.title = 'Certified partner of ENGIE, leading energy company';
        } else if (item.textContent.includes('Sungrow')) {
            item.title = 'Authorized installer of Sungrow energy storage systems';
        }
    });
}

// Call tooltip initialization
initTooltips();

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const nav = document.querySelector('.nav');
        if (nav && nav.classList.contains('nav--mobile-open')) {
            nav.classList.remove('nav--mobile-open');
        }
        
        // Also close any open notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.querySelector('.notification__close').click();
        });
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handlers
const debouncedScrollHandler = debounce(function() {
    // Re-run scroll-dependent functions
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Project photo slideshow functionality
function initProjectSlideshow() {
    const projectPhotos = document.querySelectorAll('.project-photo');

    projectPhotos.forEach(photo => {
        photo.addEventListener('click', function() {
            const projectName = this.getAttribute('data-project');
            openSlideshow(projectName);
        });
    });
}

// Open slideshow modal
function openSlideshow(projectName) {
    // Get all images for this project
    const projectImages = getProjectImages(projectName);
    let currentImageIndex = 0;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'slideshow-modal';
    modal.innerHTML = `
        <div class="slideshow-overlay" id="slideshowOverlay">
            <div class="slideshow-container">
                <button class="slideshow-close" id="slideshowClose">&times;</button>
                <div class="slideshow-content">
                    <img src="${projectImages[currentImageIndex]}" alt="${projectName} project photo" class="slideshow-image" id="slideshowImage">
                    <div class="slideshow-info">
                        <h3>${getProjectTitle(projectName)}</h3>
                        <p class="slideshow-counter">${currentImageIndex + 1} / ${projectImages.length}</p>
                    </div>
                </div>
                ${projectImages.length > 1 ? `
                    <button class="slideshow-nav slideshow-prev" id="slideshowPrev">&#10094;</button>
                    <button class="slideshow-nav slideshow-next" id="slideshowNext">&#10095;</button>
                ` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const overlay = modal.querySelector('#slideshowOverlay');
    const closeBtn = modal.querySelector('#slideshowClose');
    const prevBtn = modal.querySelector('#slideshowPrev');
    const nextBtn = modal.querySelector('#slideshowNext');
    const image = modal.querySelector('#slideshowImage');
    const counter = modal.querySelector('.slideshow-counter');

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeSlideshow();
        }
    });

    closeBtn.addEventListener('click', closeSlideshow);

    // Navigation functions
    function updateImage() {
        image.src = projectImages[currentImageIndex];
        image.alt = `${projectName} project photo ${currentImageIndex + 1}`;
        if (counter) {
            counter.textContent = `${currentImageIndex + 1} / ${projectImages.length}`;
        }
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
        updateImage();
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % projectImages.length;
        updateImage();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Add keyboard navigation
    document.addEventListener('keydown', handleSlideshowKeydown);

    function handleSlideshowKeydown(e) {
        if (e.key === 'Escape') {
            closeSlideshow();
        } else if (e.key === 'ArrowLeft' && projectImages.length > 1) {
            prevImage();
        } else if (e.key === 'ArrowRight' && projectImages.length > 1) {
            nextImage();
        }
    }
}

// Get all images for a project
function getProjectImages(projectName) {
    const imageMap = {
        'vilvoorde': ['projects/sungrow/sungrow-1.jpg'],
        'go4zero': ['projects/go4zero/go4zero-1.jpg'],
        'climatesolution': ['projects/climate-solutions/climate-solutions-1.jpg']
    };

    return imageMap[projectName] || ['photo-placeholder.svg'];
}

function closeSlideshow() {
    const modal = document.querySelector('.slideshow-modal');
    if (modal) {
        modal.remove();
        document.removeEventListener('keydown', handleSlideshowKeydown);
    }
}

function handleSlideshowKeydown(e) {
    if (e.key === 'Escape') {
        closeSlideshow();
    }
}

function getProjectTitle(projectName) {
    const titles = {
        'vilvoorde': 'Vilvoorde BESS – ENGIE/Sungrow',
        'go4zero': 'GO4Zero – Holcim & CBMI',
        'climatesolution': 'ClimateSolution – HVAC'
    };
    return titles[projectName] || 'Project Photos';
}

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Initialize slideshow
    initProjectSlideshow();

    // Trigger initial animations
    setTimeout(() => {
        const firstViewElements = document.querySelectorAll('.hero .animate-in, .service-card, .stat-card');
        firstViewElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 100);
        });
    }, 500);
});

// Policy Offcanvas functionality
function initPolicyOffcanvas() {
    const policyLinks = document.querySelectorAll('[data-policy]');
    const offcanvas = document.getElementById('policyOffcanvas');
    const offcanvasClose = document.getElementById('offcanvasClose');
    const offcanvasOverlay = offcanvas.querySelector('.offcanvas__overlay');

    // Add click listeners to policy links
    policyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const policy = this.getAttribute('data-policy');
            openPolicyOffcanvas(policy);
        });
    });

    // Close offcanvas when clicking close button
    if (offcanvasClose) {
        offcanvasClose.addEventListener('click', closePolicyOffcanvas);
    }

    // Close offcanvas when clicking overlay
    if (offcanvasOverlay) {
        offcanvasOverlay.addEventListener('click', closePolicyOffcanvas);
    }

    // Close offcanvas on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && offcanvas.classList.contains('open')) {
            closePolicyOffcanvas();
        }
    });
}

function openPolicyOffcanvas(policy) {
    const offcanvas = document.getElementById('policyOffcanvas');
    const policyTitle = document.getElementById('policyTitle');
    const policyContent = document.getElementById('policyContent');

    // Get current language
    const currentLang = window.currentLang || 'EN';

    // Set title based on policy and language
    const titles = {
        privacy: {
            EN: 'Privacy Policy',
            FR: 'Politique de Confidentialité',
            NL: 'Privacybeleid'
        },
        terms: {
            EN: 'Terms & Conditions',
            FR: 'Conditions Générales',
            NL: 'Algemene Voorwaarden'
        }
    };

    policyTitle.textContent = titles[policy][currentLang];

    // Load content
    const contentId = `${policy}-${currentLang.toLowerCase()}`;
    const contentElement = document.getElementById(contentId);

    if (contentElement) {
        policyContent.innerHTML = contentElement.innerHTML;
    } else {
        policyContent.innerHTML = '<p>Content not available for the selected language.</p>';
    }

    // Show offcanvas
    offcanvas.style.display = 'block';
    // Force reflow
    offcanvas.offsetHeight;
    offcanvas.classList.add('open');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closePolicyOffcanvas() {
    const offcanvas = document.getElementById('policyOffcanvas');

    offcanvas.classList.remove('open');

    // Hide after transition
    setTimeout(() => {
        offcanvas.style.display = 'none';
        // Restore body scroll
        document.body.style.overflow = '';
    }, 250); // Match transition duration
}