/**
 * IBRAHIM MABROUK - Elite Brand Portfolio Engine
 * Author: Ibrahim Mabrouk
 * Tech Stack: ES6+, GSAP, Lenis, HTML5 Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
    // Primary State Management
    const state = {
        isLoaded: false,
        theme: 'dark', // 'dark' | 'light'
        mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 },
        canvas: { waves: [] }
    };

    // Initialize Page Sub-modules
    initLoader();
    initLenisScroll();
    initCustomCursor();
    initSeismicBackground();
    initMagneticElements();
    initRippleEffect();
    initNavbarBehaviour();
    initScrollProgress();
    initGSAPReveals();
    initSkillsAnimation();
    initProjectFiltering();
    initContactForm();
    initLightbox();
});

/* ==========================================================================
   PREMIUM LOADER SCREEN
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.loader-bar-progress');
    const statusText = document.querySelector('.loader-status');
    
    if (!loader || !progressBar) return;

    const phrases = [
        "INITIALIZING SEISMIC STREAM...",
        "CALIBRATING PETREL MODEL SPACE...",
        "ESTABLISHING WELL LOG CORRELATIONS...",
        "TRAINING LITHOLOGY NEURAL NETWORK...",
        "OPTIMIZING GEOPHYSICAL PIPELINE..."
    ];

    let progress = 0;
    let phraseIndex = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4;
        if (progress > 100) progress = 100;

        progressBar.style.width = `${progress}%`;

        // Cycle status phrases based on progress milestones
        if (progress > 20 && phraseIndex === 0) { phraseIndex = 1; statusText.textContent = phrases[1]; }
        if (progress > 45 && phraseIndex === 1) { phraseIndex = 2; statusText.textContent = phrases[2]; }
        if (progress > 70 && phraseIndex === 2) { phraseIndex = 3; statusText.textContent = phrases[3]; }
        if (progress > 90 && phraseIndex === 3) { phraseIndex = 4; statusText.textContent = phrases[4]; }

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('loaded');
                triggerHeroEntrance();
            }, 600);
        }
    }, 80);
}

/* ==========================================================================
   LENIS SMOOTH SCROLLER
   ========================================================================== */
let lenis;
function initLenisScroll() {
    lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    // Synchronize ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

/* ==========================================================================
   CUSTOM CURSOR & MOUSE GLOW TRACKING
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorGlow = document.getElementById('custom-cursor-glow');
    if (!cursor || !cursorGlow) return;

    let posX = 0, posY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
        posX = e.clientX;
        posY = e.clientY;
    });

    // Custom tick/lerp loop for cinematic fluid movement
    function updateCursorPosition() {
        // Direct tracking for center dot
        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;

        // Smooth Lerp (Linear Interpolation) lag effect for outer glow ring
        glowX += (posX - glowX) * 0.15;
        glowY += (posY - glowY) * 0.15;

        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        requestAnimationFrame(updateCursorPosition);
    }
    requestAnimationFrame(updateCursorPosition);

    // Dynamic Hover States
    const targetSelectors = 'a, button, .project-item, .cert-card, .stack-card, .highlight-card, [data-magnetic]';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(targetSelectors)) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(targetSelectors)) {
            document.body.classList.remove('cursor-hover');
        }
    });
}

/* ==========================================================================
   INTERACTIVE SEISMIC-WAVE CANVAS BACKDROP
   ========================================================================== */
function initSeismicBackground() {
    const canvas = document.getElementById('seismic-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Subsurface stratigraphic wave layouts
    const waveCount = 5;
    const waves = [];

    for (let i = 0; i < waveCount; i++) {
        waves.push({
            y: height * 0.2 + (i * (height * 0.15)), // Stack horizontally
            length: 0.0015 + (i * 0.0005),
            amplitude: 25 + (i * 12),
            frequency: 0.01 + (i * 0.005),
            phase: Math.random() * 100,
            color: i % 2 === 0 ? 'rgba(0, 240, 255, 0.06)' : 'rgba(0, 82, 255, 0.05)',
            lineWidth: 1.5 + (i * 0.5)
        });
    }

    function animateSeismicWaves() {
        ctx.clearRect(0, 0, width, height);

        waves.forEach((wave) => {
            ctx.beginPath();
            ctx.lineWidth = wave.lineWidth;
            ctx.strokeStyle = wave.color;

            for (let x = 0; x < width; x++) {
                // Determine mechanical distance to actual cursor position
                const distToMouse = Math.abs(x - mouseX);
                let distortion = 0;

                // Create a regional "seismic deflection/vibration" anomaly near cursor
                if (distToMouse < 250) {
                    const factor = (250 - distToMouse) / 250;
                    distortion = Math.sin((mouseY * 0.05) + (x * 0.03)) * 40 * factor;
                }

                // Standard sin wave calculations + custom distortion
                const y = wave.y + Math.sin(x * wave.length + wave.phase) * wave.amplitude + distortion;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
            // Advance phase values over timeline
            wave.phase += wave.frequency;
        });

        requestAnimationFrame(animateSeismicWaves);
    }

    animateSeismicWaves();
}

/* ==========================================================================
   MAGNETIC INTERACTION COEFFICIENT
   ========================================================================== */
function initMagneticElements() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);

            // Translate element halfway toward target coordinates
            gsap.to(el, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            // Smoothly snap back to origin point
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

/* ==========================================================================
   RIPPLE TRIGGER MICRO-INTERACTION
   ========================================================================== */
function initRippleEffect() {
    const clickableElements = document.querySelectorAll('.btn, .social-icon, .filter-btn');

    clickableElements.forEach((el) => {
        el.addEventListener('click', function(e) {
            const rect = el.getBoundingClientRect();
            const ripple = document.createElement('span');
            
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - (size / 2);
            const y = e.clientY - rect.top - (size / 2);

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.className = 'ripple-effect-span';

            // Clean-up existing spans if any
            const existing = el.querySelector('.ripple-effect-span');
            if (existing) existing.remove();

            el.appendChild(ripple);

            // Add custom dynamic CSS to inject the structural style if missing
            if (!document.getElementById('ripple-css')) {
                const style = document.createElement('style');
                style.id = 'ripple-css';
                style.textContent = `
                    .ripple-effect-span {
                        position: absolute;
                        border-radius: 50%;
                        background-color: rgba(0, 240, 255, 0.35);
                        transform: scale(0);
                        animation: rippleAnim 0.6s ease-out;
                        pointer-events: none;
                        z-index: 10;
                    }
                    @keyframes rippleAnim {
                        to {
                            transform: scale(2.5);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    });
}

/* ==========================================================================
   STICKY NAVBAR & DYNAMIC DIRECTION DETECTION
   ========================================================================== */
function initNavbarBehaviour() {
    const nav = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Visual height transition and blur density scaling
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide navigation on down scroll, present immediately on up scroll
        if (currentScroll > 300 && currentScroll > lastScroll && !navMenu.classList.contains('open')) {
            gsap.to(nav, { y: '-100%', duration: 0.3, ease: 'power2.out' });
        } else {
            gsap.to(nav, { y: '0%', duration: 0.3, ease: 'power2.out' });
        }

        lastScroll = currentScroll;
    });

    // Mobile Navigation Drawer Toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            
            // Subtle hamburger visual shift
            const bars = mobileToggle.querySelectorAll('.bar');
            if (mobileToggle.classList.contains('active')) {
                gsap.to(bars[0], { rotate: 45, y: 8, duration: 0.2 });
                gsap.to(bars[1], { opacity: 0, duration: 0.2 });
                gsap.to(bars[2], { rotate: -45, y: -8, duration: 0.2 });
            } else {
                gsap.to(bars[0], { rotate: 0, y: 0, duration: 0.2 });
                gsap.to(bars[1], { opacity: 1, duration: 0.2 });
                gsap.to(bars[2], { rotate: 0, y: 0, duration: 0.2 });
            }
        });

        // Close mobile drawer on any navigation link selection
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
                const bars = mobileToggle.querySelectorAll('.bar');
                gsap.to(bars[0], { rotate: 0, y: 0, duration: 0.2 });
                gsap.to(bars[1], { opacity: 1, duration: 0.2 });
                gsap.to(bars[2], { rotate: 0, y: 0, duration: 0.2 });
            });
        });
    }
}

/* ==========================================================================
   SCROLL PROGRESS COEFFICIENT
   ========================================================================== */
function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) return;
        const scrolled = (window.scrollY / totalHeight) * 100;
        bar.style.width = `${scrolled}%`;
    });
}

/* ==========================================================================
   HERO ENTRANCE SEQUENCE
   ========================================================================== */
function triggerHeroEntrance() {
    const tl = gsap.timeline();

    tl.fromTo('.navbar', 
        { y: -100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );

    tl.fromTo('.hero-badge', 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' },
        "-=0.6"
    );

    tl.fromTo('.hero-name span', 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.15 },
        "-=0.5"
    );

    tl.fromTo('.hero-title-scroller', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        "-=0.6"
    );

    tl.fromTo('.hero-desc', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        "-=0.6"
    );

    tl.fromTo('.hero-actions .btn', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12 },
        "-=0.6"
    );

    tl.fromTo('.profile-card', 
        { scale: 0.95, opacity: 0, rotateY: 15 }, 
        { scale: 1, opacity: 1, rotateY: 0, duration: 1.2, ease: 'power3.out' },
        "-=1"
    );
}

/* ==========================================================================
   GSAP INTERACTIVE REVEAL COEFFICIENTS
   ========================================================================== */
function initGSAPReveals() {
    // Check if GSAP and ScrollTrigger are initialized cleanly
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const revealTargets = document.querySelectorAll('.reveal-slide-up');

    revealTargets.forEach((target) => {
        const delay = target.getAttribute('data-delay') || 0;

        gsap.fromTo(target, 
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: parseFloat(delay),
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: target,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    });

    // Timeline Node Reveal Staggers
    const timelineElements = document.querySelectorAll('.timeline-container');
    timelineElements.forEach((section) => {
        const items = section.querySelectorAll('.timeline-item');
        
        gsap.from(items, {
            opacity: 0,
            x: -30,
            duration: 0.8,
            stagger: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
            }
        });
    });
}

/* ==========================================================================
   PROGRESS BARS VISUAL RUNS
   ========================================================================== */
function initSkillsAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card) => {
        const progressBar = card.querySelector('.skill-progress-bar');
        if (!progressBar) return;

        // Read intended styling metrics from html element
        const widthVal = progressBar.style.width;
        progressBar.style.width = '0%'; // Clear it out for visual animation trigger

        gsap.to(progressBar, {
            width: widthVal,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                once: true
            }
        });
    });
}

/* ==========================================================================
   PROJECT FILTERING SYSTEMS
   ========================================================================== */
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length === 0 || projectItems.length === 0) return;

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Remove active status from sibling buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Use GSAP timeline to hide, organize and stagger visible selections
            const tl = gsap.timeline();

            projectItems.forEach((item) => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'flex';
                    tl.fromTo(item, 
                        { scale: 0.9, opacity: 0 }, 
                        { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
                        0
                    );
                } else {
                    gsap.to(item, {
                        scale: 0.9,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

/* ==========================================================================
   CERTIFICATE & PROJECT LIGHTBOX VIEW
   ========================================================================== */
function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-content-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.btn-lightbox, .btn-cert-preview');

    if (!modal || !modalImg) return;

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const imgPath = trigger.getAttribute('data-image');
            if (!imgPath) return;

            modalImg.src = imgPath;
            modal.style.display = 'flex';
            
            // Prevent body scroll
            if (lenis) lenis.stop();
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
        modalImg.src = '';
        if (lenis) lenis.start();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

/* ==========================================================================
   SECURE CONTACT TRANSMISSION ENGINE
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get value parameters
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Standard regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !subject || !message) {
            showFeedback("All configuration fields are mandatory.", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            showFeedback("Please supply a valid communication email address.", "error");
            return;
        }

        // Simulate secure API dispatching sequence
        showFeedback("Transmitting secure packets to terminal...", "info");

        setTimeout(() => {
            showFeedback("Transmission successful. Thank you, Ibrahim will reply shortly.", "success");
            form.reset();
        }, 1500);
    });

    function showFeedback(text, type) {
        feedback.textContent = text;
        feedback.className = `form-status ${type}`;
        
        // Custom color rules mapping
        if (type === 'success') feedback.style.color = '#10B981';
        if (type === 'error') feedback.style.color = '#EF4444';
        if (type === 'info') feedback.style.color = '#00F0FF';
    }
}