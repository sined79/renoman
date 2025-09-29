// RENOMAN SRL Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initLanguagePicker();
    initContactForm();
    initSmoothScrolling();
    initScrollEffects();
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
            
            // Show notification (since actual translation is not implemented)
            showNotification(`Language switched to ${selectedLang === 'FR' ? 'French' : 'Dutch'}. Translation feature coming soon!`);
            
            // Store preference
            localStorage.setItem('preferredLanguage', selectedLang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        const savedButton = document.querySelector(`[data-lang="${savedLang}"]`);
        if (savedButton) {
            langButtons.forEach(btn => btn.classList.remove('active'));
            savedButton.classList.add('active');
        }
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            projectType: formData.get('projectType'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!validateContactForm(data)) {
            return;
        }
        
        // Show loading state
        contactForm.classList.add('submitting');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            contactForm.classList.remove('submitting');
            submitButton.textContent = originalText;
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            
            // Show notification
            showNotification('Message sent successfully! We will respond within 24 hours.');
        }, 2000);
    });
}

// Form validation
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
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
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'Thank you! Your message has been sent successfully.';
    
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
    opacity: 0;
    transform: translateY(20px);
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

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
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