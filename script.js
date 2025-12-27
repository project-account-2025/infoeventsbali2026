/* ==========================================
   INFO EVENTS BALI - JAVASCRIPT
   Modern, Clean, Human-Friendly
   Version: 2.0.1 (Fixed & Optimized)
   ========================================== */

/* ==========================================
   TABLE OF CONTENTS
   ==========================================
   1. Configuration & Constants
   2. Utility Functions
   3. DOM Elements Cache
   4. Mobile Navigation (FIXED)
   5. Header Scroll Effect
   6. Back to Top Button
   7. Smooth Scroll
   8. Month Tabs Navigation
   9. FAQ Accordion
   10. Contact Form
   11. Newsletter Form
   12. Toast Notifications
   13. Scroll Animations
   14. Image Lazy Loading
   15. Counter Animation
   16. Form Enhancements
   17. Keyboard Navigation
   18. Scroll Progress
   19. Analytics Tracking
   20. Initialization
   ========================================== */

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================
const CONFIG = {
    whatsappNumber: '628873434754',
    toastDuration: 5000,
    scrollOffset: 20,
    animationThreshold: 0.1,
    debounceDelay: 100,
    throttleDelay: 100
};

const ICONS = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
};

const SUBJECT_LABELS = {
    'info-event': 'Informasi Event',
    'promosi-event': 'Promosi Event Saya',
    'media-partner': 'Media Partner',
    'kerja-sama': 'Kerja Sama Lainnya',
    'saran': 'Saran & Masukan',
    'lainnya': 'Lainnya'
};

// ==========================================
// 2. UTILITY FUNCTIONS
// ==========================================
const Utils = {
    // Debounce function
    debounce(func, wait = CONFIG.debounceDelay) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit = CONFIG.throttleDelay) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element exists - FIXED
    exists(element) {
        return element !== null && element !== undefined;
    },

    // Check if element is in viewport
    isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Get current year
    getCurrentYear() {
        return new Date().getFullYear();
    },

    // Local Storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('LocalStorage not available');
                return false;
            }
        },

        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('LocalStorage not available');
                return null;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('LocalStorage not available');
                return false;
            }
        }
    }
};

// ==========================================
// 3. DOM ELEMENTS CACHE
// ==========================================
const DOM = {
    // Will be populated on init
    header: null,
    nav: null,
    navToggle: null,
    navOverlay: null,
    backToTopBtn: null,
    contactForm: null,
    newsletterForm: null,
    faqItems: null,
    monthTabs: null,
    monthTabsContainer: null,
    monthPrev: null,
    monthNext: null,
    monthSections: null,

    // Initialize DOM cache
    init() {
        this.header = document.getElementById('header');
        this.nav = document.getElementById('nav');
        this.navToggle = document.getElementById('navToggle');
        this.backToTopBtn = document.getElementById('backToTop');
        this.contactForm = document.getElementById('contactForm');
        this.newsletterForm = document.getElementById('newsletterForm');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.monthTabs = document.querySelectorAll('.month-tab');
        this.monthTabsContainer = document.getElementById('monthTabs');
        this.monthPrev = document.getElementById('monthPrev');
        this.monthNext = document.getElementById('monthNext');
        this.monthSections = document.querySelectorAll('.month-section');
        
        console.log('✅ DOM Cache initialized');
    }
};

// ==========================================
// 4. MOBILE NAVIGATION - COMPLETELY FIXED
// ==========================================
const MobileNav = {
    isOpen: false,
    isAnimating: false,
    navToggle: null,
    nav: null,
    overlay: null,
    body: null,

    init() {
        // Get elements directly (don't rely on DOM cache for critical elements)
        this.navToggle = document.getElementById('navToggle');
        this.nav = document.getElementById('nav');
        this.body = document.body;

        // Check if elements exist
        if (!this.navToggle) {
            console.warn('❌ navToggle element not found');
            return;
        }

        if (!this.nav) {
            console.warn('❌ nav element not found');
            return;
        }

        // Create overlay
        this.createOverlay();
        
        // Bind events
        this.bindEvents();
        
        // Set initial ARIA attributes
        this.setAriaAttributes();

        console.log('✅ Mobile navigation initialized');
    },

    createOverlay() {
        // Check if overlay already exists
        this.overlay = document.querySelector('.nav-overlay');
        
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'nav-overlay';
            this.overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(this.overlay);
            console.log('✅ Nav overlay created');
        }
    },

    bindEvents() {
        // Main toggle button click event
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔘 Hamburger clicked!');
            
            // Prevent double trigger during animation
            if (this.isAnimating) {
                console.log('⏳ Animation in progress, ignoring click');
                return;
            }
            
            this.toggle();
        });

        // Touch event for mobile (backup)
        this.navToggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.isAnimating) return;
            
            // Small delay to prevent double trigger
            setTimeout(() => {
                if (!this.isAnimating) {
                    this.toggle();
                }
            }, 10);
        }, { passive: false });

        // Overlay click to close
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!this.isAnimating && this.isOpen) {
                    this.close();
                }
            });
        }

        // Close menu when clicking nav links
        const navLinks = this.nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    setTimeout(() => this.close(), 150);
                }
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close menu on window resize to desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.close();
                }
            }, 250);
        });

        // Prevent body scroll when menu is open
        document.addEventListener('touchmove', (e) => {
            if (this.isOpen && !this.nav.contains(e.target)) {
                e.preventDefault();
            }
        }, { passive: false });
    },

    setAriaAttributes() {
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navToggle.setAttribute('aria-controls', 'nav');
        this.navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        this.navToggle.setAttribute('role', 'button');
        this.navToggle.setAttribute('tabindex', '0');
        this.nav.setAttribute('aria-hidden', 'true');
    },

    toggle() {
        console.log('🔄 Toggle called, isOpen:', this.isOpen);
        
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        if (this.isOpen || this.isAnimating) {
            console.log('⚠️ Already open or animating');
            return;
        }
        
        console.log('📂 Opening menu...');
        
        this.isAnimating = true;
        this.isOpen = true;

        // Add active classes
        this.nav.classList.add('active');
        this.navToggle.classList.add('active');
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
        this.body.classList.add('nav-open');

        // Accessibility updates
        this.navToggle.setAttribute('aria-expanded', 'true');
        this.nav.setAttribute('aria-hidden', 'false');

        // Focus first nav link for accessibility
        const firstLink = this.nav.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }

        // Reset animating flag after transition
        setTimeout(() => {
            this.isAnimating = false;
            console.log('✅ Menu opened');
        }, 350);
    },

    close() {
        if (!this.isOpen || this.isAnimating) {
            console.log('⚠️ Already closed or animating');
            return;
        }
        
        console.log('📁 Closing menu...');
        
        this.isAnimating = true;
        this.isOpen = false;

        // Remove active classes
        this.nav.classList.remove('active');
        this.navToggle.classList.remove('active');
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        this.body.classList.remove('nav-open');

        // Accessibility updates
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.nav.setAttribute('aria-hidden', 'true');

        // Return focus to toggle button
        this.navToggle.focus();

        // Reset animating flag after transition
        setTimeout(() => {
            this.isAnimating = false;
            console.log('✅ Menu closed');
        }, 350);
    }
};

// ==========================================
// 5. HEADER SCROLL EFFECT
// ==========================================
const HeaderScroll = {
    lastScroll: 0,

    init() {
        if (!Utils.exists(DOM.header)) {
            console.warn('Header element not found');
            return;
        }

        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 10));
        
        // Check initial scroll position
        this.handleScroll();
        
        console.log('✅ Header scroll initialized');
    },

    handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }

        this.lastScroll = currentScroll;
    }
};

// ==========================================
// 6. BACK TO TOP BUTTON
// ==========================================
const BackToTop = {
    init() {
        if (!Utils.exists(DOM.backToTopBtn)) {
            console.warn('Back to top button not found');
            return;
        }

        window.addEventListener('scroll', Utils.throttle(() => {
            this.toggleVisibility();
        }, 100));

        DOM.backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
        
        // Check initial visibility
        this.toggleVisibility();
        
        console.log('✅ Back to top initialized');
    },

    toggleVisibility() {
        if (window.pageYOffset > 500) {
            DOM.backToTopBtn.classList.add('visible');
        } else {
            DOM.backToTopBtn.classList.remove('visible');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// ==========================================
// 7. SMOOTH SCROLL
// ==========================================
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                this.handleClick(e, anchor);
            });
        });
        
        console.log('✅ Smooth scroll initialized');
    },

    handleClick(e, anchor) {
        const href = anchor.getAttribute('href');

        // Skip if just "#" or empty
        if (!href || href === '#') return;

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - CONFIG.scrollOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// ==========================================
// 8. MONTH TABS NAVIGATION (Lanjutan)
// ==========================================
const MonthTabs = {
    init() {
        if (!DOM.monthTabs || DOM.monthTabs.length === 0) {
            console.log('ℹ️ Month tabs not found, skipping...');
            return;
        }

        this.bindTabClicks();
        this.bindNavButtons();
        this.bindScrollSpy();
        
        console.log('✅ Month tabs initialized');
    },

    bindTabClicks() {
        DOM.monthTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.activateTab(tab);
            });
        });
    },

    bindNavButtons() {
        if (DOM.monthPrev && DOM.monthTabsContainer) {
            DOM.monthPrev.addEventListener('click', () => {
                DOM.monthTabsContainer.scrollBy({
                    left: -200,
                    behavior: 'smooth'
                });
            });
        }

        if (DOM.monthNext && DOM.monthTabsContainer) {
            DOM.monthNext.addEventListener('click', () => {
                DOM.monthTabsContainer.scrollBy({
                    left: 200,
                    behavior: 'smooth'
                });
            });
        }
    },

    bindScrollSpy() {
        if (!DOM.monthSections || DOM.monthSections.length === 0) return;

        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateActiveTab();
        }, 100));
    },

    activateTab(tab) {
        // Update active state
        DOM.monthTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Scroll to month section
        const targetId = tab.getAttribute('href');
        if (!targetId) return;
        
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
            const navHeight = document.querySelector('.month-navigation')?.offsetHeight || 0;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - navHeight - CONFIG.scrollOffset;

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
    },

    updateActiveTab() {
        const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
        const navHeight = document.querySelector('.month-navigation')?.offsetHeight || 0;
        const scrollPosition = window.pageYOffset + headerHeight + navHeight + 100;

        DOM.monthSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                DOM.monthTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.getAttribute('href') === `#${sectionId}`) {
                        tab.classList.add('active');
                        tab.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }
                });
            }
        });
    }
};

// ==========================================
// 9. FAQ ACCORDION
// ==========================================
const FAQ = {
    init() {
        if (!DOM.faqItems || DOM.faqItems.length === 0) {
            console.log('ℹ️ FAQ items not found, skipping...');
            return;
        }

        DOM.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (!question) return;

            // Click event
            question.addEventListener('click', () => {
                this.toggleItem(item, question);
            });

            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleItem(item, question);
                }
            });
            
            // Set initial ARIA
            question.setAttribute('role', 'button');
            question.setAttribute('tabindex', '0');
            question.setAttribute('aria-expanded', 'false');
        });
        
        console.log('✅ FAQ accordion initialized');
    },

    toggleItem(item, question) {
        const isActive = item.classList.contains('active');

        // Close all other items
        DOM.faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherQuestion) {
                otherQuestion.setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    }
};

// ==========================================
// 10. CONTACT FORM
// ==========================================
const ContactForm = {
    init() {
        if (!Utils.exists(DOM.contactForm)) {
            console.log('ℹ️ Contact form not found, skipping...');
            return;
        }

        DOM.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        console.log('✅ Contact form initialized');
    },

    handleSubmit() {
        const formData = new FormData(DOM.contactForm);
        const data = {
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            phone: formData.get('phone')?.trim() || '',
            subject: formData.get('subject') || '',
            message: formData.get('message')?.trim() || ''
        };

        // Validate form
        if (!this.validate(data)) {
            return;
        }

        // Create WhatsApp message and open
        const waMessage = this.createWhatsAppMessage(data);
        const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

        // Show success toast
        Toast.show('success', 'Pesan Terkirim!', 'Anda akan diarahkan ke WhatsApp untuk melanjutkan percakapan.');

        // Open WhatsApp after delay
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 1500);

        // Reset form
        DOM.contactForm.reset();
        
        // Remove filled classes
        DOM.contactForm.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('filled');
        });
    },

    validate(data) {
        // Check required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            Toast.show('error', 'Form Tidak Lengkap', 'Mohon lengkapi semua field yang wajib diisi.');
            return false;
        }

        // Validate email format
        if (!Utils.isValidEmail(data.email)) {
            Toast.show('error', 'Email Tidak Valid', 'Mohon masukkan alamat email yang valid.');
            return false;
        }

        // Validate minimum message length
        if (data.message.length < 10) {
            Toast.show('error', 'Pesan Terlalu Pendek', 'Mohon tulis pesan minimal 10 karakter.');
            return false;
        }

        return true;
    },

    createWhatsAppMessage(data) {
        const subjectLabel = SUBJECT_LABELS[data.subject] || data.subject;

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
};

// ==========================================
// 11. NEWSLETTER FORM
// ==========================================
const NewsletterForm = {
    init() {
        if (!Utils.exists(DOM.newsletterForm)) {
            console.log('ℹ️ Newsletter form not found, skipping...');
            return;
        }

        DOM.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        console.log('✅ Newsletter form initialized');
    },

    handleSubmit() {
        const emailInput = DOM.newsletterForm.querySelector('input[type="email"]');
        
        if (!emailInput) return;
        
        const email = emailInput.value.trim();

        // Validate email
        if (!email) {
            Toast.show('error', 'Email Kosong', 'Mohon masukkan alamat email Anda.');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            Toast.show('error', 'Email Tidak Valid', 'Mohon masukkan alamat email yang valid.');
            return;
        }

        // Simulate subscription (replace with actual API call)
        this.subscribe(email);
    },

    subscribe(email) {
        // Show loading state
        const submitBtn = DOM.newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Mendaftar...</span>';
        }

        // Simulate API call
        setTimeout(() => {
            Toast.show('success', 'Berhasil Terdaftar! 🎉', 'Terima kasih sudah berlangganan. Kamu akan menerima update event terbaru.');
            
            // Reset form
            DOM.newsletterForm.reset();
            
            // Restore button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
            
            // Save to localStorage (optional)
            Utils.storage.set('newsletter_subscribed', { email, date: new Date().toISOString() });
        }, 1000);
    }
};

// ==========================================
// 12. TOAST NOTIFICATIONS
// ==========================================
const Toast = {
    container: null,

    init() {
        this.createContainer();
        console.log('✅ Toast notifications initialized');
    },

    createContainer() {
        this.container = document.querySelector('.toast-container');

        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.container);
        }
    },

    show(type, title, message) {
        if (!this.container) {
            this.createContainer();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');

        toast.innerHTML = `
            <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Tutup notifikasi">&times;</button>
        `;

        // Add to container
        this.container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(toast);
        });

        // Auto remove after duration
        setTimeout(() => {
            this.remove(toast);
        }, CONFIG.toastDuration);

        return toast;
    },

    remove(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.add('hiding');
        toast.classList.remove('show');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    },

    // Quick methods
    success(title, message) {
        return this.show('success', title, message);
    },

    error(title, message) {
        return this.show('error', title, message);
    },

    warning(title, message) {
        return this.show('warning', title, message);
    },

    info(title, message) {
        return this.show('info', title, message);
    }
};

// ==========================================
// 13. SCROLL ANIMATIONS
// ==========================================
const ScrollAnimations = {
    observer: null,

    init() {
        const animatedElements = document.querySelectorAll(
            '.event-card, .category-card, .feature-item, .contact-card, .faq-item, .event-list-card, .stat-item'
        );

        if (!animatedElements.length) {
            console.log('ℹ️ No animated elements found, skipping...');
            return;
        }

        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements
            animatedElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            return;
        }

        this.createObserver();

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
            this.observer.observe(el);
        });
        
        console.log('✅ Scroll animations initialized');
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: CONFIG.animationThreshold
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }
};

// ==========================================
// 14. IMAGE LAZY LOADING (Lanjutan)
// ==========================================
const LazyLoading = {
    observer: null,

    init() {
        const images = document.querySelectorAll('img[data-src]');

        if (!images.length) {
            console.log('ℹ️ No lazy images found, skipping...');
            return;
        }

        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
            return;
        }

        this.createObserver();

        images.forEach(img => {
            this.observer.observe(img);
        });
        
        console.log('✅ Lazy loading initialized');
    },

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });
    },

    loadImage(img) {
        const src = img.dataset.src;
        
        if (!src) return;

        // Create a new image to preload
        const tempImage = new Image();
        
        tempImage.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        };

        tempImage.onerror = () => {
            console.warn('Failed to load image:', src);
            img.classList.add('error');
        };

        tempImage.src = src;
    }
};

// ==========================================
// 15. COUNTER ANIMATION
// ==========================================
const CounterAnimation = {
    observer: null,
    animated: new Set(),

    init() {
        const counters = document.querySelectorAll('.stat-number, [data-counter]');

        if (!counters.length) {
            console.log('ℹ️ No counters found, skipping...');
            return;
        }

        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            return;
        }

        this.createObserver();

        counters.forEach(counter => {
            this.observer.observe(counter);
        });
        
        console.log('✅ Counter animation initialized');
    },

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    },

    animateCounter(counter) {
        const targetText = counter.textContent.trim();
        const matches = targetText.match(/^(\d+)(.*)$/);
        
        if (!matches) return;

        const targetNumber = parseInt(matches[1], 10);
        const suffix = matches[2] || '';

        if (isNaN(targetNumber) || targetNumber === 0) return;

        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = targetNumber / steps;

        let current = 0;
        let step = 0;

        counter.textContent = '0' + suffix;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), targetNumber);
            counter.textContent = current.toLocaleString() + suffix;

            if (step >= steps) {
                counter.textContent = targetNumber.toLocaleString() + suffix;
                clearInterval(timer);
            }
        }, stepDuration);
    }
};

// ==========================================
// 16. FORM ENHANCEMENTS
// ==========================================
const FormEnhancements = {
    init() {
        const formGroups = document.querySelectorAll('.form-group');

        if (!formGroups.length) {
            console.log('ℹ️ No form groups found, skipping...');
            return;
        }

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
                if (input.value && input.value.trim()) {
                    group.classList.add('filled');
                } else {
                    group.classList.remove('filled');
                }
            });

            // Input event for real-time validation feedback
            input.addEventListener('input', () => {
                if (input.value && input.value.trim()) {
                    group.classList.add('has-value');
                } else {
                    group.classList.remove('has-value');
                }
            });

            // Check initial state
            if (input.value && input.value.trim()) {
                group.classList.add('filled');
                group.classList.add('has-value');
            }
        });
        
        console.log('✅ Form enhancements initialized');
    }
};

// ==========================================
// 17. KEYBOARD NAVIGATION
// ==========================================
const KeyboardNav = {
    init() {
        this.bindEscapeKey();
        this.bindTabTrap();
        this.bindSkipLink();
        
        console.log('✅ Keyboard navigation initialized');
    },

    bindEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile nav
                if (MobileNav.isOpen) {
                    MobileNav.close();
                }

                // Close any open modals (if you have them)
                const openModals = document.querySelectorAll('.modal.active, .modal.show');
                openModals.forEach(modal => {
                    modal.classList.remove('active', 'show');
                });
            }
        });
    },

    bindTabTrap() {
        const nav = document.getElementById('nav');
        
        if (!nav) return;

        const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

        nav.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && MobileNav.isOpen) {
                const focusableElements = nav.querySelectorAll(focusableSelector);
                
                if (focusableElements.length === 0) return;

                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    },

    bindSkipLink() {
        // Create skip link if not exists
        let skipLink = document.querySelector('.skip-link');
        
        if (!skipLink) {
            skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: fixed;
                top: -100px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color, #3b82f6);
                color: white;
                padding: 12px 24px;
                border-radius: 0 0 8px 8px;
                z-index: 10000;
                transition: top 0.3s ease;
                text-decoration: none;
                font-weight: 600;
            `;
            document.body.insertBefore(skipLink, document.body.firstChild);

            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '0';
            });

            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-100px';
            });
        }
    }
};

// ==========================================
// 18. SCROLL PROGRESS
// ==========================================
const ScrollProgress = {
    progressBar: null,

    init() {
        this.createProgressBar();
        this.bindScroll();
        
        // Initial update
        this.updateProgress();
        
        console.log('✅ Scroll progress initialized');
    },

    createProgressBar() {
        // Check if already exists
        this.progressBar = document.querySelector('.scroll-progress');
        
        if (!this.progressBar) {
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'scroll-progress';
            this.progressBar.setAttribute('role', 'progressbar');
            this.progressBar.setAttribute('aria-label', 'Reading progress');
            this.progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--primary-color, #3b82f6), var(--secondary-color, #06b6d4));
                z-index: 9999;
                width: 0%;
                transition: width 0.1s ease-out;
            `;
            document.body.appendChild(this.progressBar);
        }
    },

    bindScroll() {
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateProgress();
        }, 10));
    },

    updateProgress() {
        if (!this.progressBar) return;
        
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (windowHeight <= 0) {
            this.progressBar.style.width = '0%';
            return;
        }
        
        const scrolled = (window.scrollY / windowHeight) * 100;
        this.progressBar.style.width = `${Math.min(scrolled, 100)}%`;
        this.progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
    }
};

// ==========================================
// 19. ANALYTICS TRACKING
// ==========================================
const Analytics = {
    init() {
        this.trackButtonClicks();
        this.trackNavClicks();
        this.trackExternalLinks();
        this.trackFormSubmissions();
        
        console.log('✅ Analytics tracking initialized');
    },

    trackEvent(category, action, label = null, value = null) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'value': value
            });
        }

        // Facebook Pixel (if exists)
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', action, {
                category: category,
                label: label
            });
        }

        // Console log for debugging (only in development)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`📊 Analytics: ${category} - ${action}`, label, value);
        }
    },

    trackButtonClicks() {
        document.querySelectorAll('.btn, button[type="submit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const btnText = btn.textContent?.trim() || 'Unknown Button';
                const btnClass = btn.className;
                this.trackEvent('Button', 'click', btnText);
            });
        });
    },

    trackNavClicks() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const linkText = link.textContent?.trim() || 'Unknown Link';
                this.trackEvent('Navigation', 'click', linkText);
            });
        });
    },

    trackExternalLinks() {
        document.querySelectorAll('a[href^="http"], a[target="_blank"]').forEach(link => {
            link.addEventListener('click', () => {
                const linkUrl = link.getAttribute('href');
                const linkText = link.textContent?.trim() || link.getAttribute('aria-label') || 'External Link';
                this.trackEvent('External Link', 'click', `${linkText} - ${linkUrl}`);
            });
        });
    },

    trackFormSubmissions() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                const formId = form.id || form.className || 'Unknown Form';
                this.trackEvent('Form', 'submit', formId);
            });
        });
    }
};

// ==========================================
// 20. ADDITIONAL FEATURES
// ==========================================

// Active Nav Link Highlight
const ActiveNavHighlight = {
    init() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (!sections.length || !navLinks.length) {
            console.log('ℹ️ No sections or nav links for highlighting, skipping...');
            return;
        }

        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateActiveLink(sections, navLinks);
        }, 100));
        
        // Initial check
        this.updateActiveLink(sections, navLinks);
        
        console.log('✅ Active nav highlight initialized');
    },

    updateActiveLink(sections, navLinks) {
        const scrollPosition = window.pageYOffset + 200;

        let currentSection = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
};

// Floating Cards Animation (About Section)
const FloatingCards = {
    init() {
        const cards = document.querySelectorAll('.image-card, .floating-card');

        if (!cards.length) {
            console.log('ℹ️ No floating cards found, skipping...');
            return;
        }

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.animationPlayState = 'paused';
            });

            card.addEventListener('mouseleave', () => {
                card.style.animationPlayState = 'running';
            });
        });
        
        console.log('✅ Floating cards initialized');
    }
};

// ==========================================
// RIPPLE EFFECT (Lanjutan)
// ==========================================
const RippleEffect = {
    init() {
        this.bindButtons();
        console.log('✅ Ripple effect initialized');
    },

    bindButtons() {
        document.querySelectorAll('.btn, .nav-toggle, .month-tab').forEach(button => {
            // Ensure position relative for ripple
            const computedStyle = window.getComputedStyle(button);
            if (computedStyle.position === 'static') {
                button.style.position = 'relative';
            }
            button.style.overflow = 'hidden';

            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    },

    createRipple(e, button) {
        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple-effect');
        if (existingRipple) {
            existingRipple.remove();
        }

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: rippleAnimation 0.6s ease-out forwards;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            z-index: 1;
        `;

        button.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }
};

// Add ripple animation keyframes
const RippleStyles = {
    init() {
        if (document.querySelector('#ripple-styles')) return;

        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes rippleAnimation {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0;
                }
            }
            
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
};

// Copyright Year Update
const CopyrightYear = {
    init() {
        const yearElements = document.querySelectorAll('.current-year, [data-year]');
        const currentYear = Utils.getCurrentYear();

        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
        
        console.log('✅ Copyright year updated');
    }
};

// Copy to Clipboard
const Clipboard = {
    copy(text) {
        if (!text) {
            Toast.show('error', 'Error', 'Tidak ada teks untuk disalin.');
            return Promise.reject('No text provided');
        }

        // Modern API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text)
                .then(() => {
                    Toast.show('success', 'Berhasil Disalin!', 'Teks telah disalin ke clipboard.');
                    return true;
                })
                .catch((err) => {
                    console.warn('Clipboard API failed, using fallback');
                    return this.fallbackCopy(text);
                });
        } else {
            return this.fallbackCopy(text);
        }
    },

    fallbackCopy(text) {
        return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.cssText = `
                position: fixed;
                left: -9999px;
                top: -9999px;
                opacity: 0;
            `;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (successful) {
                    Toast.show('success', 'Berhasil Disalin!', 'Teks telah disalin ke clipboard.');
                    resolve(true);
                } else {
                    Toast.show('error', 'Gagal Menyalin', 'Tidak dapat menyalin teks ke clipboard.');
                    reject('Copy command failed');
                }
            } catch (err) {
                document.body.removeChild(textArea);
                Toast.show('error', 'Gagal Menyalin', 'Tidak dapat menyalin teks ke clipboard.');
                reject(err);
            }
        });
    }
};

// Share Content
const Share = {
    share(title, text, url) {
        const shareData = {
            title: title || document.title,
            text: text || '',
            url: url || window.location.href
        };

        // Check if Web Share API is supported
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            return navigator.share(shareData)
                .then(() => {
                    console.log('Content shared successfully');
                    return true;
                })
                .catch((err) => {
                    if (err.name !== 'AbortError') {
                        console.log('Share cancelled or failed:', err);
                    }
                    return false;
                });
        } else {
            // Fallback - copy URL
            Toast.show('info', 'Share', 'Web Share tidak didukung. URL akan disalin.');
            return Clipboard.copy(shareData.url);
        }
    },

    // Share to specific platforms
    shareToTwitter(text, url) {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    },

    shareToFacebook(url) {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(fbUrl, '_blank', 'width=550,height=420');
    },

    shareToWhatsApp(text, url) {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        window.open(waUrl, '_blank');
    },

    shareToTelegram(text, url) {
        const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(tgUrl, '_blank');
    }
};

// ==========================================
// PRINT FUNCTIONALITY
// ==========================================
const PrintPage = {
    print() {
        window.print();
    }
};

// ==========================================
// THEME TOGGLE (Optional - Dark Mode)
// ==========================================
const ThemeToggle = {
    currentTheme: 'light',

    init() {
        // Check for saved theme preference
        const savedTheme = Utils.storage.get('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!Utils.storage.get('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Bind toggle button if exists
        const toggleBtn = document.querySelector('[data-theme-toggle]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        Utils.storage.set('theme', this.currentTheme);
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }
};

// ==========================================
// ERROR HANDLING
// ==========================================
const ErrorHandler = {
    init() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('❌ Global error:', e.message, e.filename, e.lineno);
            // You can send this to an error tracking service
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Unhandled promise rejection:', e.reason);
            // Prevent the default browser behavior
            e.preventDefault();
        });

        console.log('✅ Error handler initialized');
    }
};

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
const Performance = {
    init() {
        // Log performance metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.logMetrics();
            }, 0);
        });
    },

    logMetrics() {
        if (!window.performance) return;

        const timing = performance.timing;
        const metrics = {
            // Page load time
            pageLoad: timing.loadEventEnd - timing.navigationStart,
            // DOM ready time
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
            // First paint (if available)
            firstPaint: this.getFirstPaint()
        };

        // Only log in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📊 Performance Metrics:', metrics);
        }
    },

    getFirstPaint() {
        if (performance.getEntriesByType) {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            return firstPaint ? Math.round(firstPaint.startTime) : null;
        }
        return null;
    }
};

// ==========================================
// CONSOLE BRANDING
// ==========================================
const ConsoleBranding = {
    show() {
        const styles = [
            'color: #1e293b; font-size: 14px; font-weight: bold;',
            'color: #3b82f6; font-size: 14px; font-weight: bold;',
            'color: #64748b; font-size: 12px;',
            'color: #06b6d4; font-size: 12px;',
            'color: #1e293b; font-size: 14px; font-weight: bold;'
        ];

        console.log(`
%c╔═══════════════════════════════════════╗
%c║      🌴 INFO EVENTS BALI 🌴           ║
%c║   Pusat Informasi Event di Bali       ║
%c║   www.infoeventsbali.com              ║
%c╚═══════════════════════════════════════╝
        `, ...styles);

        console.log('%c🚀 Website loaded successfully!', 'color: #10b981; font-weight: bold;');
    }
};

// ==========================================
// PRELOADER (Optional)
// ==========================================
const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader, #preloader');
        
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        });
    }
};

// ==========================================
// MAIN INITIALIZATION
// ==========================================
const App = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.warn('⚠️ App already initialized');
            return;
        }

        console.log('🚀 Initializing Info Events Bali...');
        const startTime = performance.now();

        try {
            // Initialize DOM cache first
            DOM.init();

            // Add ripple styles
            RippleStyles.init();

            // Core functionality (order matters!)
            MobileNav.init();
            HeaderScroll.init();
            BackToTop.init();
            SmoothScroll.init();

            // Page specific features
            MonthTabs.init();
            FAQ.init();
            ContactForm.init();
            NewsletterForm.init();

            // UI Enhancements
            Toast.init();
            ScrollAnimations.init();
            LazyLoading.init();
            CounterAnimation.init();
            FormEnhancements.init();
            ScrollProgress.init();
            RippleEffect.init();

            // Navigation enhancements
            ActiveNavHighlight.init();
            KeyboardNav.init();
            FloatingCards.init();

            // Utilities
            CopyrightYear.init();
            ErrorHandler.init();
            Performance.init();
            Preloader.init();

            // Optional features
            // ThemeToggle.init(); // Uncomment if you want dark mode
            // Analytics.init(); // Uncomment if you have analytics

            // Console branding
            ConsoleBranding.show();

            this.initialized = true;

            const endTime = performance.now();
            console.log(`✅ Info Events Bali initialized in ${Math.round(endTime - startTime)}ms`);

        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    },

    // Reinitialize specific modules (useful for dynamic content)
    reinit(modules = []) {
        if (modules.length === 0) {
            console.log('🔄 Reinitializing all modules...');
            DOM.init();
            ScrollAnimations.init();
            LazyLoading.init();
            return;
        }

        modules.forEach(module => {
            if (typeof window[module]?.init === 'function') {
                window[module].init();
                console.log(`🔄 Reinitialized: ${module}`);
            }
        });
    }
};

// ==========================================
// DOM READY - START APPLICATION
// ==========================================
(function() {
    'use strict';

    const startApp = () => {
        App.init();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        // DOM already loaded
        startApp();
    }
})();

// ==========================================
// EXPOSE PUBLIC API (Lanjutan)
// ==========================================
window.InfoEventsBali = {
    // App control
    app: App,
    reinit: App.reinit.bind(App),

    // Toast notifications
    toast: {
        show: Toast.show.bind(Toast),
        success: Toast.success.bind(Toast),
        error: Toast.error.bind(Toast),
        warning: Toast.warning.bind(Toast),
        info: Toast.info.bind(Toast)
    },

    // Clipboard
    clipboard: {
        copy: Clipboard.copy.bind(Clipboard)
    },

    // Share functionality
    share: {
        native: Share.share.bind(Share),
        twitter: Share.shareToTwitter.bind(Share),
        facebook: Share.shareToFacebook.bind(Share),
        whatsapp: Share.shareToWhatsApp.bind(Share),
        telegram: Share.shareToTelegram.bind(Share)
    },

    // Theme (if enabled)
    theme: {
        toggle: ThemeToggle.toggle.bind(ThemeToggle),
        set: ThemeToggle.applyTheme.bind(ThemeToggle),
        get: () => ThemeToggle.currentTheme
    },

    // Navigation
    nav: {
        open: MobileNav.open.bind(MobileNav),
        close: MobileNav.close.bind(MobileNav),
        toggle: MobileNav.toggle.bind(MobileNav),
        isOpen: () => MobileNav.isOpen
    },

    // Utilities
    utils: Utils,

    // Analytics tracking
    track: Analytics.trackEvent.bind(Analytics),

    // Scroll to element
    scrollTo: (selector, offset = 0) => {
        const element = document.querySelector(selector);
        if (element) {
            const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Print page
    print: PrintPage.print,

    // Version info
    version: '2.0.1',
    author: 'Info Events Bali'
};

// ==========================================
// ADDITIONAL CSS STYLES (Injected via JS)
// ==========================================
const InjectStyles = {
    init() {
        if (document.querySelector('#ieb-injected-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'ieb-injected-styles';
        styles.textContent = `
            /* Toast Container */
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
                width: calc(100% - 40px);
                pointer-events: none;
            }

            /* Toast Styles */
            .toast {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 16px;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                transform: translateX(120%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                pointer-events: auto;
                border-left: 4px solid #3b82f6;
            }

            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }

            .toast.hiding {
                transform: translateX(120%);
                opacity: 0;
            }

            .toast-success {
                border-left-color: #10b981;
            }

            .toast-error {
                border-left-color: #ef4444;
            }

            .toast-warning {
                border-left-color: #f59e0b;
            }

            .toast-info {
                border-left-color: #3b82f6;
            }

            .toast-icon {
                font-size: 24px;
                line-height: 1;
                flex-shrink: 0;
            }

            .toast-content {
                flex: 1;
                min-width: 0;
            }

            .toast-title {
                font-weight: 600;
                font-size: 14px;
                color: #1e293b;
                margin-bottom: 4px;
            }

            .toast-message {
                font-size: 13px;
                color: #64748b;
                line-height: 1.4;
            }

            .toast-close {
                background: none;
                border: none;
                font-size: 20px;
                color: #94a3b8;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                transition: color 0.2s;
                flex-shrink: 0;
            }

            .toast-close:hover {
                color: #1e293b;
            }

            /* Nav Overlay */
            .nav-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 998;
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
            }

            .nav-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            /* Body when nav is open */
            body.nav-open {
                overflow: hidden;
                position: fixed;
                width: 100%;
                height: 100%;
            }

            /* Scroll Progress Bar */
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #3b82f6, #06b6d4);
                z-index: 9999;
                width: 0%;
                transition: width 0.1s ease-out;
            }

            /* Image loaded state */
            img.loaded {
                animation: fadeIn 0.3s ease;
            }

            img.error {
                opacity: 0.5;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            /* Focus visible for accessibility */
            :focus-visible {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }

            /* Skip link */
            .skip-link:focus {
                top: 0 !important;
            }

            /* Preloader fade out */
            .preloader.fade-out {
                opacity: 0;
                visibility: hidden;
                transition: all 0.5s ease;
            }

            /* Mobile Navigation Active State */
            @media (max-width: 768px) {
                .nav {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 80%;
                    max-width: 320px;
                    height: 100vh;
                    background: #ffffff;
                    box-shadow: -5px 0 30px rgba(0, 0, 0, 0.1);
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 999;
                    padding: 80px 24px 24px;
                    overflow-y: auto;
                }

                .nav.active {
                    right: 0;
                }

                .nav-list {
                    flex-direction: column;
                    gap: 8px;
                }

                .nav-link {
                    display: block;
                    padding: 12px 16px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .nav-link:hover,
                .nav-link.active {
                    background: #f1f5f9;
                }

                /* Hamburger Animation */
                .nav-toggle {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 44px;
                    height: 44px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    z-index: 1000;
                    position: relative;
                }

                .nav-toggle span {
                    display: block;
                    width: 24px;
                    height: 2px;
                    background: #1e293b;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                    position: absolute;
                }

                .nav-toggle span:nth-child(1) {
                    transform: translateY(-8px);
                }

                .nav-toggle span:nth-child(2) {
                    transform: translateY(0);
                }

                .nav-toggle span:nth-child(3) {
                    transform: translateY(8px);
                }

                /* Hamburger Active State (X) */
                .nav-toggle.active span:nth-child(1) {
                    transform: translateY(0) rotate(45deg);
                }

                .nav-toggle.active span:nth-child(2) {
                    opacity: 0;
                    transform: translateX(-20px);
                }

                .nav-toggle.active span:nth-child(3) {
                    transform: translateY(0) rotate(-45deg);
                }
            }

            /* Desktop - hide hamburger */
            @media (min-width: 769px) {
                .nav-toggle {
                    display: none !important;
                }

                .nav-overlay {
                    display: none !important;
                }

                .nav {
                    position: static !important;
                    width: auto !important;
                    height: auto !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    overflow: visible !important;
                }

                .nav-list {
                    flex-direction: row;
                }
            }

            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                *,
                *::before,
                *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;

        document.head.appendChild(styles);
        console.log('✅ Injected styles added');
    }
};

// Initialize injected styles
InjectStyles.init();

// ==========================================
// DEBUG MODE (Development Only)
// ==========================================
const Debug = {
    enabled: false,

    init() {
        // Enable debug mode with URL parameter ?debug=true
        const urlParams = new URLSearchParams(window.location.search);
        this.enabled = urlParams.get('debug') === 'true';

        if (this.enabled) {
            this.enableDebugMode();
        }
    },

    enableDebugMode() {
        console.log('%c🔧 DEBUG MODE ENABLED', 'background: #f59e0b; color: #000; padding: 4px 8px; border-radius: 4px;');

        // Add debug panel
        this.createDebugPanel();

        // Log all events
        this.logEvents();
    },

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #1e293b;
            color: #fff;
            padding: 16px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 99999;
            max-width: 300px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; color: #f59e0b;">🔧 Debug Panel</div>
            <div id="debug-info">
                <div>Viewport: <span id="debug-viewport"></span></div>
                <div>Scroll: <span id="debug-scroll"></span></div>
                <div>Nav Open: <span id="debug-nav"></span></div>
            </div>
            <button onclick="this.parentElement.remove()" style="margin-top: 8px; padding: 4px 8px; cursor: pointer;">Close</button>
        `;

        document.body.appendChild(panel);

        // Update debug info
        this.updateDebugInfo();
        window.addEventListener('scroll', () => this.updateDebugInfo());
        window.addEventListener('resize', () => this.updateDebugInfo());
    },

    updateDebugInfo() {
        const viewport = document.getElementById('debug-viewport');
        const scroll = document.getElementById('debug-scroll');
        const nav = document.getElementById('debug-nav');

        if (viewport) viewport.textContent = `${window.innerWidth}x${window.innerHeight}`;
        if (scroll) scroll.textContent = `${Math.round(window.scrollY)}px`;
        if (nav) nav.textContent = MobileNav.isOpen ? 'Yes' : 'No';
    },

    logEvents() {
        // Log click events
        document.addEventListener('click', (e) => {
            console.log('🖱️ Click:', e.target.tagName, e.target.className);
        });
    }
};

// Initialize debug mode
Debug.init();

// ==========================================
// SERVICE WORKER REGISTRATION (Optional)
// ==========================================
const ServiceWorkerManager = {
    init() {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ ServiceWorker registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('ℹ️ ServiceWorker registration skipped:', error.message);
                    });
            });
        }
    }
};

// Uncomment to enable service worker
// ServiceWorkerManager.init();

// ==========================================
// FINAL CONSOLE MESSAGE (Lanjutan)
// ==========================================
console.log(`
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
%c  🌴 Info Events Bali - JavaScript Loaded
%c  Version: 2.0.1 | Status: Ready
%c  © ${new Date().getFullYear()} Info Events Bali. All rights reserved.
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
    'color: #3b82f6;',
    'color: #10b981; font-weight: bold;',
    'color: #64748b;',
    'color: #64748b;',
    'color: #3b82f6;'
);

// ==========================================
// END OF JAVASCRIPT
// Info Events Bali - Modern Website
// Version: 2.0.1 (Fixed & Optimized)
// ==========================================