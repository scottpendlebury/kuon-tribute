/**
 * Kuon Website — Interactive Scripts
 * Vanilla JS, no dependencies
 */

(function() {
    'use strict';

    // ==========================================================================
    // State
    // ==========================================================================
    const state = {
        cursorGlow: null,
        lightbox: null,
        lightboxImage: null,
        lightboxCaption: null,
        galleryItems: [],
        currentGalleryIndex: -1,
        navMenu: null,
        navToggle: null,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // ==========================================================================
    // Utility Functions
    // ==========================================================================
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

    const throttle = (fn, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    // ==========================================================================
    // Cursor Glow Effect
    // ==========================================================================
    function initCursorGlow() {
        if (state.prefersReducedMotion) return;

        state.cursorGlow = $('#cursorGlow');
        if (!state.cursorGlow) return;

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let animationId = null;

        const animate = () => {
            // Smooth follow with easing
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;

            state.cursorGlow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
            animationId = requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            state.cursorGlow.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            state.cursorGlow.classList.remove('active');
        });

        // Pause when tab hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });

        animate();
    }

    // ==========================================================================
    // Navigation Toggle (Mobile)
    // ==========================================================================
    function initNavigation() {
        state.navToggle = $('.nav-toggle');
        state.navMenu = $('#nav-menu');

        if (!state.navToggle || !state.navMenu) return;

        state.navToggle.addEventListener('click', () => {
            const expanded = state.navToggle.getAttribute('aria-expanded') === 'true';
            state.navToggle.setAttribute('aria-expanded', !expanded);
            state.navMenu.classList.toggle('open');
        });

        // Close on link click
        $$('.nav-link', state.navMenu).forEach(link => {
            link.addEventListener('click', () => {
                state.navToggle.setAttribute('aria-expanded', 'false');
                state.navMenu.classList.remove('open');
            });
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.navMenu.classList.contains('open')) {
                state.navToggle.setAttribute('aria-expanded', 'false');
                state.navMenu.classList.remove('open');
                state.navToggle.focus();
            }
        });
    }

    // ==========================================================================
    // Lightbox / Gallery
    // ==========================================================================
    function initLightbox() {
        state.lightbox = $('#lightbox');
        state.lightboxImage = $('#lightboxImage');
        state.lightboxCaption = $('#lightboxCaption');

        if (!state.lightbox) return;

        // Collect all gallery items with data-caption
        state.galleryItems = $$('.gallery-item, .cover-card');
        state.galleryItems.forEach((item, index) => {
            const placeholder = item.querySelector('.gallery-placeholder, .cover-image');
            const caption = item.querySelector('figcaption');

            if (placeholder) {
                placeholder.style.cursor = 'zoom-in';
                placeholder.addEventListener('click', () => openLightbox(index));
                placeholder.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index);
                    }
                });
                placeholder.setAttribute('tabindex', '0');
                placeholder.setAttribute('role', 'button');
                placeholder.setAttribute('aria-label', caption?.textContent || 'View image');
            }
        });

        // Close button
        $('.lightbox-close', state.lightbox)?.addEventListener('click', closeLightbox);

        // Navigation buttons
        $('.lightbox-prev', state.lightbox)?.addEventListener('click', () => navigateLightbox(-1));
        $('.lightbox-next', state.lightbox)?.addEventListener('click', () => navigateLightbox(1));

        // Click background to close
        state.lightbox.addEventListener('click', (e) => {
            if (e.target === state.lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (state.lightbox.hidden) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    function openLightbox(index) {
        if (index < 0 || index >= state.galleryItems.length) return;

        state.currentGalleryIndex = index;
        const item = state.galleryItems[index];
        const placeholder = item.querySelector('.gallery-placeholder, .cover-image');
        const caption = item.querySelector('figcaption');

        // For now, we use the placeholder's background as the "image"
        // In a real scenario, you'd have actual image URLs
        const bgColor = getComputedStyle(placeholder).backgroundColor;
        const bgImage = getComputedStyle(placeholder).backgroundImage;

        // Create a canvas representation or use the placeholder style
        state.lightboxImage.style.background = bgImage !== 'none' ? bgImage : bgColor;
        state.lightboxImage.style.backgroundSize = 'cover';
        state.lightboxImage.style.backgroundPosition = 'center';
        state.lightboxImage.src = ''; // Clear any src
        state.lightboxCaption.textContent = caption?.textContent || '';

        state.lightbox.hidden = false;
        document.body.style.overflow = 'hidden';

        // Focus trap
        setTimeout(() => $('.lightbox-close', state.lightbox)?.focus(), 100);
    }

    function closeLightbox() {
        state.lightbox.hidden = true;
        document.body.style.overflow = '';
        state.currentGalleryIndex = -1;
    }

    function navigateLightbox(direction) {
        const newIndex = state.currentGalleryIndex + direction;
        if (newIndex >= 0 && newIndex < state.galleryItems.length) {
            openLightbox(newIndex);
        }
    }

    // ==========================================================================
    // Scroll Animations (Intersection Observer)
    // ==========================================================================
    function initScrollAnimations() {
        if (state.prefersReducedMotion) {
            // Show all immediately
            $$('[data-animate]').forEach(el => el.classList.add('animated'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Add data-animate to elements we want to animate
        const animatedSelectors = [
            '.overview-card',
            '.character-card',
            '.supporting-card',
            '.timeline-item',
            '.credit-item',
            '.gallery-item',
            '.cover-card',
            '.concept-card',
            '.promo-card',
            '.legacy-card'
        ];

        animatedSelectors.forEach(selector => {
            $$(selector).forEach((el, i) => {
                el.dataset.animate = 'true';
                el.style.transitionDelay = `${i * 50}ms`;
                observer.observe(el);
            });
        });
    }

    // Add animation styles dynamically
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        [data-animate] {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        [data-animate].animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animationStyles);

    // ==========================================================================
    // Floating Particles Generation
    // ==========================================================================
    function initParticles() {
        if (state.prefersReducedMotion) return;

        const container = $('#particles');
        if (!container) return;

        const particleCount = 30;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${15 + Math.random() * 15}s`;
            particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
            particle.style.width = particle.style.height = `${1 + Math.random() * 2}px`;
            particle.style.background = Math.random() > 0.5 ? 'var(--color-bone-dim)' : 'var(--color-blood)';
            particle.style.opacity = '0';
            container.appendChild(particle);
            particles.push(particle);
        }
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = $(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = $('.site-header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: state.prefersReducedMotion ? 'auto' : 'smooth'
                    });

                    // Update URL without scroll
                    history.pushState(null, '', href);
                }
            });
        });
    }

    // ==========================================================================
    // Parallax Hero Background
    // ==========================================================================
    function initParallax() {
        if (state.prefersReducedMotion) return;

        const hero = $('.hero');
        const silhouette = $('.hero-silhouette');
        const calligraphy = $('.hero-calligraphy');

        if (!hero || !silhouette) return;

        const handleScroll = throttle(() => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY < heroHeight) {
                const progress = scrollY / heroHeight;
                silhouette.style.transform = `translateY(${progress * 50}px) scale(${1 + progress * 0.1})`;
                if (calligraphy) {
                    calligraphy.style.transform = `translateX(-50%) translateY(${progress * -30}px)`;
                }
            }
        }, 16);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ==========================================================================
    // Character Card Hover Effects
    // ==========================================================================
    function initCharacterCards() {
        $$('.character-card').forEach(card => {
            const silhouette = card.querySelector('.portrait-silhouette');
            if (!silhouette) return;

            card.addEventListener('mouseenter', () => {
                silhouette.style.transition = 'transform 0.4s ease, filter 0.4s ease';
                silhouette.style.transform = 'scale(1.05)';
                silhouette.style.filter = 'brightness(1.2) contrast(1.1)';
            });

            card.addEventListener('mouseleave', () => {
                silhouette.style.transform = 'scale(1)';
                silhouette.style.filter = 'none';
            });
        });
    }

    // ==========================================================================
    // Active Nav Link on Scroll
    // ==========================================================================
    function initActiveNav() {
        const sections = $$('section[id]');
        const navLinks = $$('.nav-link');
        const headerHeight = $('.site-header')?.offsetHeight || 80;

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            rootMargin: `-${headerHeight + 100}px 0px -60% 0px`,
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }

    // Add active nav link styles
    const navStyles = document.createElement('style');
    navStyles.textContent = `
        .nav-link.active {
            color: var(--color-blood) !important;
        }
        .nav-link.active::before {
            width: 70% !important;
        }
    `;
    document.head.appendChild(navStyles);

    // ==========================================================================
    // Kanji Flicker on Hero (additional)
    // ==========================================================================
    function initHeroKanji() {
        const heroKanji = $('.title-kanji');
        if (!heroKanji) return;

        let flickerInterval = null;

        const startFlicker = () => {
            flickerInterval = setInterval(() => {
                if (Math.random() < 0.1) {
                    heroKanji.style.textShadow = `
                        0 0 40px rgba(139, 26, 26, 0.6),
                        ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 rgba(10,10,10,0.5),
                        ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 2px rgba(139, 26, 26, 0.3)
                    `;
                    setTimeout(() => {
                        heroKanji.style.textShadow = `
                            0 0 40px rgba(139, 26, 26, 0.4),
                            2px 2px 0 rgba(10,10,10,0.5)
                        `;
                    }, 50);
                }
            }, 200);
        };

        const stopFlicker = () => {
            clearInterval(flickerInterval);
            heroKanji.style.textShadow = `
                0 0 40px rgba(139, 26, 26, 0.4),
                2px 2px 0 rgba(10,10,10,0.5)
            `;
        };

        heroKanji.addEventListener('mouseenter', startFlicker);
        heroKanji.addEventListener('mouseleave', stopFlicker);
    }

    // ==========================================================================
    // Performance: Pause animations when tab hidden
    // ==========================================================================
    function initVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            const animatedElements = $$('[data-animate].animated');
            if (document.hidden) {
                animatedElements.forEach(el => el.dataset.wasAnimated = 'true');
            } else {
                animatedElements.forEach(el => delete el.dataset.wasAnimated);
            }
        });
    }

    // ==========================================================================
    // Initialize All
    // ==========================================================================
    function init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initCursorGlow();
        initNavigation();
        initLightbox();
        initScrollAnimations();
        initParticles();
        initSmoothScroll();
        initParallax();
        initCharacterCards();
        initActiveNav();
        initHeroKanji();
        initVisibilityHandling();

        // Add loaded class for any CSS-triggered animations
        document.body.classList.add('loaded');

        console.log('%c九怨 KUON', 'font-family: "Kaisei HarunoUmi", serif; font-size: 24px; color: #8b1a1a; text-shadow: 0 0 10px rgba(139,26,26,0.5);');
        console.log('%cFromSoftware\'s 2004 Survival Horror Masterpiece', 'color: #b8a898; font-size: 12px;');
    }

    init();

})();