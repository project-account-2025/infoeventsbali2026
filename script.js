/* ==========================================
   INFO EVENTS BALI - JAVASCRIPT
   Modern, Clean, Human-Friendly
   ========================================== */

// ==========================================
// DOM ELEMENTS
// ==========================================
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const faqItems = document.querySelectorAll('.faq-item');
const monthTabs = document.querySelectorAll('.month-tab');
const monthPrev = document.getElementById('monthPrev');
const monthNext = document.getElementById('monthNext');

// ==========================================
// MOBILE NAVIGATION
// ==========================================
function initMobileNav() {
    if (!navToggle || !nav) return;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    // Toggle menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking nav links
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
function initHeaderScroll() {
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// MONTH TABS NAVIGATION (Events Page)
// ==========================================
function initMonthTabs() {
    if (!monthTabs.length) return;

    const tabsContainer = document.getElementById('monthTabs');

    // Tab click handler
    monthTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active state
            monthTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Scroll to month section
            const targetId = tab.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const navHeight = document.querySelector('.month-navigation')?.offsetHeight || 0;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }

            // Scroll tab into view
            tab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        });
    });
    // Previous/Next buttons
    if (monthPrev && tabsContainer) {
        monthPrev.addEventListener('click', () => {
            tabsContainer.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        });
    }

    if (monthNext && tabsContainer) {
        monthNext.addEventListener('click', () => {
            tabsContainer.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });
    }

    // Update active tab on scroll
    const monthSections = document.querySelectorAll('.month-section');

    if (monthSections.length) {
        window.addEventListener('scroll', () => {
            const headerHeight = header ? header.offsetHeight : 0;
            const navHeight = document.querySelector('.month-navigation')?.offsetHeight || 0;
            const scrollPosition = window.pageYOffset + headerHeight + navHeight + 100;

            monthSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    monthTabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('href') === `#${sectionId}`) {
                            tab.classList.add('active');

                            // Scroll active tab into view
                            tab.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest',
                                inline: 'center'
                            });
                        }
                    });
                }
            });
        });
    }
}

// ==========================================
// FAQ ACCORDION
// ==========================================
function initFAQ() {
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });

        // Keyboard accessibility
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

// ==========================================
// CONTACT FORM HANDLING
// ==========================================
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form
        if (!validateForm(data)) {
            return;
        }

        // Create WhatsApp message
        const waMessage = createWhatsAppMessage(data);
        const waNumber = '628873434754'; // Ganti dengan nomor WhatsApp admin
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

        // Show success toast
        showToast('success', 'Pesan Terkirim!', 'Anda akan diarahkan ke WhatsApp untuk melanjutkan percakapan.');

        // Open WhatsApp after delay
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 1500);

        // Reset form
        contactForm.reset();
    });
}

// Validate form data
function validateForm(data) {
    // Check required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
        showToast('error', 'Form Tidak Lengkap', 'Mohon lengkapi semua field yang wajib diisi.');
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showToast('error', 'Email Tidak Valid', 'Mohon masukkan alamat email yang valid.');
        return false;
    }

    return true;
}

// Create WhatsApp message
function createWhatsAppMessage(data) {
    const subjectLabels = {
        'info-event': 'Informasi Event',
        'promosi-event': 'Promosi Event Saya',
        'media-partner': 'Media Partner',
        'kerja-sama': 'Kerja Sama Lainnya',
        'saran': 'Saran & Masukan',
        'lainnya': 'Lainnya'
    };

    const subjectLabel = subjectLabels[data.subject] || data.subject;

    let message = `Halo Admin Info Events Bali! 👋\n\n`;
    message += `*Nama:* ${data.name}\n`;
    message += `*Email:* ${data.email}\n`;

    if (data.phone) {
        message += `*WhatsApp:* ${data.phone}\n`;
    }

    message += `*Keperluan:* ${subjectLabel}\n\n`;
    message += `*Pesan:*\n${data.message}\n\n`;
    message += `---\nDikirim melalui website Info Events Bali`;

    return message;
}

// ==========================================
// NEWSLETTER FORM HANDLING
// ==========================================
function initNewsletterForm() {
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('error', 'Email Tidak Valid', 'Mohon masukkan alamat email yang valid.');
            return;
        }

        // Simulate subscription (replace with actual API call)
        showToast('success', 'Berhasil Terdaftar! 🎉', 'Terima kasih sudah berlangganan. Kamu akan menerima update event terbaru.');

        // Reset form
        newsletterForm.reset();
    });
}

// ==========================================
// TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(type, title, message) {
    // Create toast container if not exists
    let toastContainer = document.querySelector('.toast-container');

    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Set icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Tutup notifikasi">&times;</button>
    `;

    // Add to container
    toastContainer.appendChild(toast);

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 5000);
}

function removeToast(toast) {
    if (!toast) return;

    toast.classList.add('hiding');

    setTimeout(() => {
        toast.remove();
    }, 300);
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.event-card, .category-card, .feature-item, .contact-card, .faq-item');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// ==========================================
// IMAGE LAZY LOADING
// ==========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// ACTIVE NAV LINK HIGHLIGHT
// ==========================================
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ==========================================
// FLOATING CARDS ANIMATION (About Section)
// ==========================================
function initFloatingCards() {
    const cards = document.querySelectorAll('.image-card');

    if (!cards.length) return;

    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            card.style.animationPlayState = 'paused';
        });

        card.addEventListener('mouseleave', () => {
            card.style.animationPlayState = 'running';
        });
    });
}

// ==========================================
// COUNTER ANIMATION
// ==========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;

        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    updateCounter();
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    if (!counters.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetText = counter.textContent;
                const targetNumber = parseInt(targetText.replace(/\D/g, ''));
                const suffix = targetText.replace(/[0-9]/g, '');

                if (!isNaN(targetNumber)) {
                    counter.textContent = '0' + suffix;

                    let current = 0;
                    const increment = targetNumber / 50;
                    const timer = setInterval(() => {
                        current += increment;

                        if (current >= targetNumber) {
                            counter.textContent = targetNumber + suffix;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current) + suffix;
                        }
                    }, 30);
                }

                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
function initKeyboardNavigation() {
    // Close mobile menu on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile nav
            if (nav && nav.classList.contains('active')) {
                navToggle.classList.remove('active');
                nav.classList.remove('active');
                document.querySelector('.nav-overlay')?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Tab trap for mobile menu
    if (nav) {
        const focusableElements = nav.querySelectorAll('a, button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        nav.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && nav.classList.contains('active')) {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function
function debounce(func, wait = 100) {
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

// Throttle function
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get current year for copyright
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();

    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// ==========================================
// FORM INPUT ENHANCEMENTS
// ==========================================
function initFormEnhancements() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');

        if (!input) return;

        // Add focus class to parent
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            group.classList.remove('focused');

            // Add filled class if has value
            if (input.value.trim()) {
                group.classList.add('filled');
            } else {
                group.classList.remove('filled');
            }
        });

        // Check initial state
        if (input.value.trim()) {
            group.classList.add('filled');
        }
    });
}

// ==========================================
// RIPPLE EFFECT FOR BUTTONS
// ==========================================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation keyframes
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// SCROLL PROGRESS INDICATOR
// ==========================================
function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', throttle(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    }, 10));
}

// ==========================================
// PRELOADER
// ==========================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');

    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');

            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500);
    });
}

// ==========================================
// COPY TO CLIPBOARD
// ==========================================
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast('success', 'Berhasil Disalin!', 'Teks telah disalin ke clipboard.');
            })
            .catch(() => {
                fallbackCopyToClipboard(text);
            });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position: fixed; left: -9999px;';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        showToast('success', 'Berhasil Disalin!', 'Teks telah disalin ke clipboard.');
    } catch (err) {
        showToast('error', 'Gagal Menyalin', 'Tidak dapat menyalin teks ke clipboard.');
    }

    document.body.removeChild(textArea);
}

// ==========================================
// SHARE FUNCTIONALITY
// ==========================================
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(err => {
            console.log('Error sharing:', err);
        });
    } else {
        // Fallback - copy URL
        copyToClipboard(url);
    }
}

// ==========================================
// LOCAL STORAGE HELPERS
// ==========================================
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('LocalStorage not available');
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }
};

// ==========================================
// ANALYTICS TRACKING (Optional)
// ==========================================
function trackEvent(category, action, label = null, value = null) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }

    // Console log for debugging
    console.log(`📊 Event: ${category} - ${action}`, label, value);
}

// Track button clicks
function initAnalyticsTracking() {
    // Track CTA button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const btnText = btn.textContent.trim();
            trackEvent('Button', 'click', btnText);
        });
    });

    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const linkText = link.textContent.trim();
            trackEvent('Navigation', 'click', linkText);
        });
    });

    // Track external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', () => {
            const linkUrl = link.getAttribute('href');
            trackEvent('External Link', 'click', linkUrl);
        });
    });
}

// ==========================================
// ERROR HANDLING
// ==========================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ==========================================
// RESIZE HANDLER
// ==========================================
function initResizeHandler() {
    const handleResize = debounce(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
            document.querySelector('.nav-overlay')?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);

    window.addEventListener('resize', handleResize);
}

// ==========================================
// INITIALIZE ALL FUNCTIONS
// ==========================================
function init() {
    // Core functionality
    initMobileNav();
    initHeaderScroll();
    initBackToTop();
    initSmoothScroll();

    // Page specific
    initMonthTabs();
    initFAQ();
    initContactForm();
    initNewsletterForm();

    // Enhancements
    initScrollAnimations();
    initLazyLoading();
    initActiveNavHighlight();
    initFloatingCards();
    initCounterAnimation();
    initKeyboardNavigation();
    initFormEnhancements();
    initRippleEffect();
    initScrollProgress();
    initResizeHandler();

    // Optional
    updateCopyrightYear();
    // initAnalyticsTracking();

    console.log('🌴 Info Events Bali - Website Loaded Successfully!');
}

// ==========================================
// DOM READY
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==========================================
// CONSOLE BRANDING
// ==========================================
console.log(`
%c╔═══════════════════════════════════════╗
%c║      🌴 INFO EVENTS BALI 🌴           ║
%c║   Pusat Informasi Event di Bali       ║
%c║   www.infoeventsbali.com              ║
%c╚═══════════════════════════════════════╝
`,
    'color: #1e293b; font-weight: bold;',
    'color: #3b82f6; font-weight: bold;',
    'color: #64748b;',
    'color: #06b6d4;',
    'color: #1e293b; font-weight: bold;'
);

// ==========================================
// EXTERNAL LINKS TRACKING
// ==========================================
function initExternalLinksTracking() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');

    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const url = link.getAttribute('href');
            const eventTitle = link.closest('.event-list-card')?.querySelector('.event-list-title')?.textContent || 'Unknown Event';

            // Track the click
            trackEvent('External Link', 'click', `${eventTitle} - ${url}`);

            // Optional: Show toast notification
            // showToast('info', 'Membuka Link', 'Anda akan diarahkan ke website penyelenggara.');
        });
    });
}

// Add to init function
document.addEventListener('DOMContentLoaded', () => {
    initExternalLinksTracking();
});

// ==========================================
// COPY EVENT LINK FUNCTIONALITY
// ==========================================
function initCopyEventLink() {
    // Add copy button to each event card (optional feature)
    const eventCards = document.querySelectorAll('.event-list-card');

    eventCards.forEach(card => {
        const actionsDiv = card.querySelector('.event-list-actions');
        if (!actionsDiv) return;

        // Create share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'btn btn-outline-sm share-btn';
        shareBtn.innerHTML = '<span>Bagikan</span><span class="btn-icon">📤</span>';
        shareBtn.setAttribute('aria-label', 'Bagikan event ini');

        shareBtn.addEventListener('click', () => {
            const eventTitle = card.querySelector('.event-list-title').textContent;
            const eventDate = card.querySelector('.event-list-date').textContent.trim().replace(/\s+/g, ' ');
            const eventLocation = card.querySelector('.event-list-location').textContent;
            const eventLink = card.querySelector('.btn-primary').getAttribute('href');

            const shareText = `🎉 ${eventTitle}\n📅 ${eventDate}\n${eventLocation}\n\n🔗 Info: ${eventLink}\n\nvia Info Events Bali`;

            if (navigator.share) {
                navigator.share({
                    title: eventTitle,
                    text: shareText,
                    url: eventLink
                }).catch(err => console.log('Share cancelled'));
            } else {
                copyToClipboard(shareText);
            }
        });

        // Uncomment to enable share button
        // actionsDiv.appendChild(shareBtn);
    });
}

// Uncomment to enable
// document.addEventListener('DOMContentLoaded', initCopyEventLink);


// ==========================================
// END OF JAVASCRIPT
// Info Events Bali - Modern Website
// ==========================================