/* ==========================================
   INFO EVENTS BALI - JAVASCRIPT
   Version: 2.0.3 (Fixed Hamburger Menu)
   ========================================== */

// ==========================================
// 1. CONFIGURATION
// ==========================================
const CONFIG = {
    whatsappNumber: '+628873434754',
    toastDuration: 5000,
    scrollOffset: 20
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
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    debounce(func, wait = 100) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
};

// ==========================================
// 3. DOM CACHE
// ==========================================
const DOM = {
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

    init() {
        this.header = document.getElementById('header');
        this.nav = document.getElementById('nav');
        this.navToggle = document.getElementById('navToggle');
        this.navOverlay = document.getElementById('navOverlay');
        this.backToTopBtn = document.getElementById('backToTop');
        this.contactForm = document.getElementById('contactForm');
        this.newsletterForm = document.getElementById('newsletterForm');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.monthTabs = document.querySelectorAll('.month-tab');
        this.monthTabsContainer = document.getElementById('monthTabs');
        this.monthPrev = document.getElementById('monthPrev');
        this.monthNext = document.getElementById('monthNext');
        this.monthSections = document.querySelectorAll('.month-section');
        
        console.log('✅ DOM cached');
    }
};

// ==========================================
// 4. MOBILE NAVIGATION
// ==========================================
const MobileNav = {
    isOpen: false,
    isAnimating: false,

    init() {
        const navToggle = document.getElementById('navToggle');
        const nav = document.getElementById('nav');
        
        if (!navToggle || !nav) {
            console.log('⚠️ Nav elements not found');
            return;
        }

        this.createOverlay();

        // Hamburger click
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Overlay click to close
        const overlay = document.getElementById('navOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                if (this.isOpen) this.close();
            });
        }

        // Nav links - PERBAIKAN UTAMA
        nav.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                // JANGAN preventDefault() agar link bekerja!
                console.log('📍 Link clicked:', link.textContent.trim());
                
                if (this.isOpen) {
                    // Delay close sedikit agar navigasi terjadi
                    setTimeout(() => this.close(), 100);
                }
            });
        });

        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });

        // Resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });

        console.log('✅ Mobile nav initialized');
    },

    createOverlay() {
        if (!document.getElementById('navOverlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            overlay.id = 'navOverlay';
            document.body.appendChild(overlay);
        }
    },

    toggle() {
        if (this.isAnimating) return;
        this.isOpen ? this.close() : this.open();
    },

    open() {
        if (this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = true;

        const nav = document.getElementById('nav');
        const navToggle = document.getElementById('navToggle');
        const overlay = document.getElementById('navOverlay');

        nav?.classList.add('active');
        navToggle?.classList.add('active');
        navToggle?.setAttribute('aria-expanded', 'true');
        overlay?.classList.add('active');
        
        // Lock scroll - TANPA position: fixed pada body
        document.documentElement.classList.add('nav-open');
        document.body.classList.add('nav-open');

        setTimeout(() => {
            this.isAnimating = false;
        }, 300);

        console.log('📂 Menu OPENED');
    },

    close() {
        if (!this.isOpen || this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;

        const nav = document.getElementById('nav');
        const navToggle = document.getElementById('navToggle');
        const overlay = document.getElementById('navOverlay');

        nav?.classList.remove('active');
        navToggle?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
        overlay?.classList.remove('active');
        
        // Unlock scroll
        document.documentElement.classList.remove('nav-open');
        document.body.classList.remove('nav-open');

        setTimeout(() => {
            this.isAnimating = false;
        }, 300);

        console.log('📁 Menu CLOSED');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    MobileNav.init();
});

// ==========================================
// 5. HEADER SCROLL EFFECT
// ==========================================
const HeaderScroll = {
    init() {
        const header = document.getElementById('header');
        if (!header) return;

        const handleScroll = () => {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', Utils.throttle(handleScroll, 10));
        
        // Initial check
        handleScroll();
        
        console.log('✅ Header scroll initialized');
    }
};

// ==========================================
// 6. BACK TO TOP BUTTON
// ==========================================
const BackToTop = {
    init() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        const handleScroll = () => {
            if (window.pageYOffset > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', Utils.throttle(handleScroll, 100));

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Initial check
        handleScroll();

        console.log('✅ Back to top initialized');
    }
};

// ==========================================
// 7. SMOOTH SCROLL
// ==========================================
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if just "#" or empty
                if (!href || href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const header = document.getElementById('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        console.log('✅ Smooth scroll initialized');
    }
};

// ==========================================
// 8. MONTH TABS NAVIGATION
// ==========================================
const MonthTabs = {
    init() {
        const tabs = document.querySelectorAll('.month-tab');
        const container = document.getElementById('monthTabs');
        const prevBtn = document.getElementById('monthPrev');
        const nextBtn = document.getElementById('monthNext');

        if (!tabs.length) return;

        // Tab click events
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();

                // Update active state
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Scroll to section
                const targetId = tab.getAttribute('href');
                if (targetId) {
                    const section = document.querySelector(targetId);
                    if (section) {
                        const header = document.getElementById('header');
                        const monthNav = document.querySelector('.month-navigation');
                        const headerHeight = header ? header.offsetHeight : 0;
                        const navHeight = monthNav ? monthNav.offsetHeight : 0;
                        const offset = headerHeight + navHeight + 20;
                        
                        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }

                // Scroll tab into view
                tab.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            });
        });

        // Navigation buttons
        if (prevBtn && container) {
            prevBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: -200,
                    behavior: 'smooth'
                });
            });
        }

        if (nextBtn && container) {
            nextBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: 200,
                    behavior: 'smooth'
                });
            });
        }

        // Scroll spy - update active tab on scroll
        this.initScrollSpy(tabs);

        console.log('✅ Month tabs initialized');
    },

    initScrollSpy(tabs) {
        const sections = document.querySelectorAll('.month-section');
        if (!sections.length) return;

        window.addEventListener('scroll', Utils.throttle(() => {
            const header = document.getElementById('header');
            const monthNav = document.querySelector('.month-navigation');
            const headerHeight = header ? header.offsetHeight : 0;
            const navHeight = monthNav ? monthNav.offsetHeight : 0;
            const scrollPosition = window.pageYOffset + headerHeight + navHeight + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    tabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('href') === `#${sectionId}`) {
                            tab.classList.add('active');
                        }
                    });
                }
            });
        }, 100));
    }
};

// ==========================================
// 9. FAQ ACCORDION
// ==========================================
const FAQ = {
    init() {
        const items = document.querySelectorAll('.faq-item');
        if (!items.length) return;

        items.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                items.forEach(otherItem => {
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
            });

            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });

        console.log('✅ FAQ accordion initialized');
    }
};

// ==========================================
// 10. TOAST NOTIFICATIONS (Lanjutan)
// ==========================================
const Toast = {
    container: null,

    init() {
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.container);
        }
        console.log('✅ Toast initialized');
    },

    show(type, title, message) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');

        toast.innerHTML = `
            <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        `;

        this.container.appendChild(toast);

        // Trigger show animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(toast);
        });

        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, CONFIG.toastDuration);

        return toast;
    },

    remove(toast) {
        if (!toast || !toast.parentNode) return;
        
        toast.classList.remove('show');
        toast.classList.add('hiding');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    },

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
// 11. CONTACT FORM
// ==========================================
const ContactForm = {
    init() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });

        // Real-time validation
        this.initValidation(form);

        console.log('✅ Contact form initialized');
    },

    initValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                // Remove error state on input
                const group = input.closest('.form-group');
                if (group) {
                    group.classList.remove('error');
                }
            });
        });
    },

    validateField(input) {
        const group = input.closest('.form-group');
        if (!group) return true;

        const value = input.value.trim();
        let isValid = true;

        // Required check
        if (input.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Email check
        if (input.type === 'email' && value && !Utils.isValidEmail(value)) {
            isValid = false;
        }

        // Update UI
        if (!isValid) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }

        return isValid;
    },

    handleSubmit(form) {
        // Get form data
        const data = {
            name: form.querySelector('#name')?.value.trim() || '',
            email: form.querySelector('#email')?.value.trim() || '',
            phone: form.querySelector('#phone')?.value.trim() || '',
            subject: form.querySelector('#subject')?.value || '',
            message: form.querySelector('#message')?.value.trim() || ''
        };

        // Validate
        if (!this.validate(data)) {
            return;
        }

        // Create WhatsApp message
        const waMessage = this.createWhatsAppMessage(data);
        const waUrl = `https://wa.me/+628873434754?text=${encodeURIComponent(waMessage)}`;

        // Show success toast
        Toast.success('Pesan Siap Dikirim!', 'Anda akan diarahkan ke WhatsApp...');

        // Open WhatsApp after delay
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 1500);

        // Reset form
        form.reset();
        
        // Remove any error states
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'filled');
        });
    },

    validate(data) {
        // Check required fields
        if (!data.name) {
            Toast.error('Nama Wajib Diisi', 'Mohon masukkan nama lengkap Anda.');
            return false;
        }

        if (!data.email) {
            Toast.error('Email Wajib Diisi', 'Mohon masukkan alamat email Anda.');
            return false;
        }

        if (!Utils.isValidEmail(data.email)) {
            Toast.error('Email Tidak Valid', 'Mohon masukkan alamat email yang valid.');
            return false;
        }

        if (!data.subject) {
            Toast.error('Keperluan Wajib Dipilih', 'Mohon pilih keperluan Anda.');
            return false;
        }

        if (!data.message) {
            Toast.error('Pesan Wajib Diisi', 'Mohon tulis pesan Anda.');
            return false;
        }

        if (data.message.length < 10) {
            Toast.error('Pesan Terlalu Pendek', 'Mohon tulis pesan minimal 10 karakter.');
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
        message += `---\n_Dikirim melalui website Info Events Bali_`;

        return message;
    }
};

// ==========================================
// 12. NEWSLETTER FORM
// ==========================================
const NewsletterForm = {
    init() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });

        console.log('✅ Newsletter form initialized');
    },

    handleSubmit(form) {
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) return;

        const email = emailInput.value.trim();

        // Validate
        if (!email) {
            Toast.error('Email Kosong', 'Mohon masukkan alamat email Anda.');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            Toast.error('Email Tidak Valid', 'Mohon masukkan alamat email yang valid.');
            return;
        }

        // Get submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Mendaftar...</span>';
        }

        // Simulate API call (replace with actual API)
        setTimeout(() => {
            // Success
            Toast.success('Berhasil Terdaftar! 🎉', 'Terima kasih sudah berlangganan newsletter kami.');
            
            // Reset form
            form.reset();

            // Restore button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }

            // Save to localStorage (optional)
            try {
                localStorage.setItem('newsletter_subscribed', JSON.stringify({
                    email: email,
                    date: new Date().toISOString()
                }));
            } catch (e) {
                // Ignore localStorage errors
            }
        }, 1000);
    }
};

// ==========================================
// 13. SCROLL ANIMATIONS
// ==========================================
const ScrollAnimations = {
    init() {
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            console.log('⚠️ IntersectionObserver not supported');
            return;
        }

        const elements = document.querySelectorAll(
            '.event-card, .category-card, .feature-item, .contact-card, .faq-item, .event-list-card, .stat-item'
        );

        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
            observer.observe(el);
        });

        console.log('✅ Scroll animations initialized');
    }
};

// ==========================================
// 14. IMAGE LAZY LOADING
// ==========================================
const LazyLoading = {
    init() {
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
            return;
        }

        const images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    
                    // Add loaded class
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });

        images.forEach(img => observer.observe(img));

        console.log('✅ Lazy loading initialized');
    }
};

// ==========================================
// 15. COPYRIGHT YEAR
// ==========================================
const CopyrightYear = {
    init() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });

        console.log('✅ Copyright year updated to', currentYear);
    }
};

// ==========================================
// 16. SCROLL PROGRESS BAR
// ==========================================
const ScrollProgress = {
    bar: null,

    init() {
        // Create progress bar
        this.bar = document.querySelector('.scroll-progress');
        if (!this.bar) {
            this.bar = document.createElement('div');
            this.bar.className = 'scroll-progress';
            document.body.appendChild(this.bar);
        }

        // Update on scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.update();
        }, 10));

        // Initial update
        this.update();

        console.log('✅ Scroll progress initialized');
    },

    update() {
        if (!this.bar) return;

        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (windowHeight <= 0) {
            this.bar.style.width = '0%';
            return;
        }

        const scrolled = (window.scrollY / windowHeight) * 100;
        this.bar.style.width = `${Math.min(scrolled, 100)}%`;
    }
};

// ==========================================
// 17. FORM ENHANCEMENTS
// ==========================================
const FormEnhancements = {
    init() {
        const formGroups = document.querySelectorAll('.form-group');
        if (!formGroups.length) return;

        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            if (!input) return;

            // Focus state
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });

            // Blur state
            input.addEventListener('blur', () => {
                group.classList.remove('focused');
                
                // Add filled class if has value
                if (input.value && input.value.trim()) {
                    group.classList.add('filled');
                } else {
                    group.classList.remove('filled');
                }
            });

            // Check initial state
            if (input.value && input.value.trim()) {
                group.classList.add('filled');
            }
        });

        console.log('✅ Form enhancements initialized');
    }
};

// ==========================================
// 18. FLOATING CARDS ANIMATION
// ==========================================
const FloatingCards = {
    init() {
        const cards = document.querySelectorAll('.image-card');
        if (!cards.length) return;

        cards.forEach(card => {
            // Pause animation on hover
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
// 19. COUNTER ANIMATION (Lanjutan)
// ==========================================
const CounterAnimation = {
    animated: new Set(),

    init() {
        if (!('IntersectionObserver' in window)) return;

        const counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animate(entry.target);
                    this.animated.add(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));

        console.log('✅ Counter animation initialized');
    },

    animate(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);
        
        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = text.replace(/\d+/, '').trim();
        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = target / steps;

        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), target);
            element.textContent = current + suffix;

            if (step >= steps) {
                clearInterval(timer);
                element.textContent = target + suffix;
            }
        }, stepDuration);
    }
};

// ==========================================
// 20. KEYBOARD NAVIGATION
// ==========================================
const KeyboardNav = {
    init() {
        // Skip to main content
        this.createSkipLink();

        // Focus visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        console.log('✅ Keyboard navigation initialized');
    },

    createSkipLink() {
        // Check if skip link already exists
        if (document.querySelector('.skip-link')) return;

        const skipLink = document.createElement('a');
        skipLink.className = 'skip-link';
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        
        // Insert at beginning of body
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
};

// ==========================================
// 21. PERFORMANCE MONITOR (Development)
// ==========================================
const PerformanceMonitor = {
    init() {
        // Only run in development
        if (window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1') {
            return;
        }

        // Log performance metrics
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                
                console.log('📊 Performance Metrics:');
                console.log(`   DOM Ready: ${domReady}ms`);
                console.log(`   Page Load: ${loadTime}ms`);
            }, 0);
        });
    }
};

// ==========================================
// 22. ERROR HANDLER
// ==========================================
const ErrorHandler = {
    init() {
        window.addEventListener('error', (e) => {
            console.error('❌ JavaScript Error:', e.message);
            // Could send to analytics here
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Unhandled Promise Rejection:', e.reason);
        });

        console.log('✅ Error handler initialized');
    }
};

// ==========================================
// 23. SERVICE WORKER REGISTRATION (Optional)
// ==========================================
const ServiceWorkerManager = {
    init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Uncomment to enable service worker
                // navigator.serviceWorker.register('/sw.js')
                //     .then(reg => console.log('✅ Service Worker registered'))
                //     .catch(err => console.log('⚠️ Service Worker failed:', err));
            });
        }
    }
};

// ==========================================
// 24. MAIN APP INITIALIZATION
// ==========================================
const App = {
    initialized: false,
    version: '2.0.3',

    init() {
        if (this.initialized) {
            console.log('⚠️ App already initialized');
            return;
        }

        console.log('🚀 Starting Info Events Bali v' + this.version);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const startTime = performance.now();

        try {
            // Initialize DOM cache first
            DOM.init();

            // Core functionality (must have)
            MobileNav.init();
            HeaderScroll.init();
            BackToTop.init();
            SmoothScroll.init();

            // Page-specific features
            MonthTabs.init();
            FAQ.init();

            // Forms
            ContactForm.init();
            NewsletterForm.init();
            FormEnhancements.init();

            // UI Enhancements
            Toast.init();
            ScrollAnimations.init();
            ScrollProgress.init();
            LazyLoading.init();
            FloatingCards.init();
            CounterAnimation.init();

            // Utilities
            CopyrightYear.init();
            KeyboardNav.init();
            ErrorHandler.init();
            PerformanceMonitor.init();
            ServiceWorkerManager.init();

            // Mark as initialized
            this.initialized = true;

            const endTime = performance.now();
            const initTime = Math.round(endTime - startTime);

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`✅ Info Events Bali ready! (${initTime}ms)`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        } catch (error) {
            console.error('❌ Initialization error:', error);
        }
    },

    // Public method to reinitialize specific module
    reinit(moduleName) {
        const modules = {
            'nav': MobileNav,
            'header': HeaderScroll,
            'backToTop': BackToTop,
            'smoothScroll': SmoothScroll,
            'monthTabs': MonthTabs,
            'faq': FAQ,
            'contactForm': ContactForm,
            'newsletterForm': NewsletterForm,
            'toast': Toast,
            'scrollAnimations': ScrollAnimations,
            'scrollProgress': ScrollProgress
        };

        if (modules[moduleName]) {
            modules[moduleName].init();
            console.log(`🔄 ${moduleName} reinitialized`);
        } else {
            console.warn(`⚠️ Module "${moduleName}" not found`);
        }
    }
};

// ==========================================
// 25. START APPLICATION
// ==========================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    // DOM already loaded
    App.init();
}

// ==========================================
// 26. PUBLIC API
// ==========================================

// Expose to global scope for external access
window.InfoEventsBali = {
    // Version info
    version: App.version,
    
    // Toast notifications
    toast: Toast,
    
    // Navigation control
    nav: {
        open: () => MobileNav.open(),
        close: () => MobileNav.close(),
        toggle: () => MobileNav.toggle(),
        isOpen: () => MobileNav.isOpen
    },
    
    // Reinitialize modules
    reinit: (module) => App.reinit(module),
    
    // Utility functions
    utils: Utils
};

// ==========================================
// END OF FILE
// ==========================================