/**
 * The Singing Revolution - Cinematic Interactions
 * Scroll-triggered animations, parallax effects, and smooth interactions
 */

(function() {
    'use strict';

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    /**
     * Throttle function execution
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Linear interpolation
     */
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // ==========================================================================
    // Navigation
    // ==========================================================================

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll-based nav styling
    function updateNav() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================================================
    // Parallax Effect
    // ==========================================================================

    const hero = document.getElementById('hero');
    const parallaxLayers = document.querySelectorAll('.hero-layer');

    // Parallax configuration for each layer
    const parallaxConfig = {
        'hero-layer-bg': { speed: 0.3, scale: 1.1 },
        'hero-layer-flag': { speed: 0.2, offsetX: -5 },
        'hero-layer-couple': { speed: 0.15, offsetX: 5 },
        'hero-layer-sparks': { speed: 0.1 }
    };

    let currentScrollY = 0;
    let targetScrollY = 0;
    let rafId = null;

    function updateParallax() {
        // Smooth scroll interpolation
        currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);

        const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
        const scrollProgress = Math.min(currentScrollY / heroHeight, 1);

        parallaxLayers.forEach(layer => {
            const config = Object.entries(parallaxConfig).find(([className]) =>
                layer.classList.contains(className)
            );

            if (config) {
                const [, settings] = config;
                const yOffset = currentScrollY * settings.speed;
                const scale = settings.scale || 1;
                const xOffset = settings.offsetX || 0;

                layer.style.transform = `translate3d(${xOffset}%, ${yOffset}px, 0) scale(${scale})`;

                // Fade out as scrolling
                if (settings.speed > 0.1) {
                    layer.style.opacity = 1 - scrollProgress * 0.5;
                }
            }
        });

        // Continue animation if still scrolling
        if (Math.abs(currentScrollY - targetScrollY) > 0.5) {
            rafId = requestAnimationFrame(updateParallax);
        } else {
            rafId = null;
        }
    }

    function onScroll() {
        targetScrollY = window.scrollY;
        if (!rafId) {
            rafId = requestAnimationFrame(updateParallax);
        }
    }

    // ==========================================================================
    // Reveal on Scroll
    // ==========================================================================

    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // Animated Number Counter
    // ==========================================================================

    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    function animateNumber(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);

            // Format number with commas
            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(el => statsObserver.observe(el));

    // ==========================================================================
    // Hero Title Animation
    // ==========================================================================

    function initHeroAnimation() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        // Add initial animation class after a short delay
        setTimeout(() => {
            heroContent.querySelectorAll('.reveal-up').forEach(el => {
                el.classList.add('revealed');
            });
        }, 500);
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // Newsletter Form
    // ==========================================================================

    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // Simulate form submission
            const button = this.querySelector('button');
            const originalText = button.textContent;

            button.textContent = 'Joining...';
            button.disabled = true;

            setTimeout(() => {
                button.textContent = 'Welcome!';
                this.querySelector('input').value = '';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            }, 1000);
        });
    }

    // ==========================================================================
    // Cinematic Cursor Effect (Desktop Only)
    // ==========================================================================

    function initCursorEffect() {
        if (window.matchMedia('(hover: none)').matches) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                pointer-events: none;
                position: fixed;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #fff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease;
            }
            .cursor-ring {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.15s ease-out;
            }
            .custom-cursor.hovering .cursor-ring {
                width: 60px;
                height: 60px;
                border-color: var(--color-accent);
            }
            .custom-cursor.hovering .cursor-dot {
                transform: translate(-50%, -50%) scale(1.5);
                background: var(--color-accent);
            }
            @media (max-width: 768px) {
                .custom-cursor { display: none; }
            }
        `;
        document.head.appendChild(style);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .review-card, .highlight');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        function updateCursor() {
            cursorX = lerp(cursorX, mouseX, 0.15);
            cursorY = lerp(cursorY, mouseY, 0.15);
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(updateCursor);
        }

        updateCursor();
    }

    // ==========================================================================
    // Video Play Button Enhancement
    // ==========================================================================

    function initVideoEnhancements() {
        const videoWrapper = document.querySelector('.video-wrapper');
        if (!videoWrapper) return;

        // Add play overlay that hides on interaction
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.innerHTML = `
            <div class="video-play-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
        `;

        const overlayStyle = document.createElement('style');
        overlayStyle.textContent = `
            .video-overlay {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.4);
                cursor: pointer;
                transition: opacity 0.5s ease;
                z-index: 10;
            }
            .video-overlay.hidden {
                opacity: 0;
                pointer-events: none;
            }
            .video-play-btn {
                width: 80px;
                height: 80px;
                background: var(--color-accent);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .video-play-btn svg {
                width: 30px;
                height: 30px;
                margin-left: 4px;
            }
            .video-overlay:hover .video-play-btn {
                transform: scale(1.1);
                box-shadow: 0 0 40px rgba(201, 169, 98, 0.5);
            }
        `;
        document.head.appendChild(overlayStyle);

        videoWrapper.style.position = 'relative';
        videoWrapper.appendChild(overlay);

        overlay.addEventListener('click', () => {
            overlay.classList.add('hidden');
            // Attempt to play the iframe video
            const iframe = videoWrapper.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
            }
        });
    }

    // ==========================================================================
    // Page Load Animation
    // ==========================================================================

    function initPageLoad() {
        document.body.classList.add('loaded');

        // Stagger reveal hero elements
        setTimeout(initHeroAnimation, 300);
    }

    // ==========================================================================
    // Initialize
    // ==========================================================================

    function init() {
        // Add loading styles
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
            body:not(.loaded) {
                overflow: hidden;
            }
            body:not(.loaded) .hero-content {
                opacity: 0;
            }
            body.loaded .hero-content {
                animation: fadeInUp 1s var(--ease-out-expo) forwards;
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(loadingStyle);

        // Event listeners
        window.addEventListener('scroll', throttle(updateNav, 100));
        window.addEventListener('scroll', onScroll);

        // Initialize components
        initPageLoad();
        initCursorEffect();
        initVideoEnhancements();

        // Initial calls
        updateNav();
        onScroll();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
