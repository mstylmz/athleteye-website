/* ===========================
   AthletEye – script.js
   =========================== */

(function () {
    'use strict';

    let translations = {};
    let currentLang = 'en';

    // ---- Utility: resolve nested key like "hero.title"
    function getNestedValue(obj, path) {
        return path.split('.').reduce(function (o, k) {
            return o && o[k] !== undefined ? o[k] : null;
        }, obj);
    }

    // ---- Apply translations to all [data-i18n] elements
    function applyTranslations(lang) {
        const t = translations[lang];
        if (!t) return;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(t, key);
            if (value !== null) el.textContent = value;
        });
        document.documentElement.lang = lang;
    }

    // ---- Load translations.json and initialise
    function loadTranslations() {
        fetch('translations.json')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                translations = data;
                const saved = localStorage.getItem('ae_lang');
                const initial = (saved && data[saved]) ? saved : 'en';
                currentLang = initial;
                var sel = document.getElementById('language-selector');
                if (sel) sel.value = initial;
                applyTranslations(initial);
            })
            .catch(function (err) {
                console.warn('Could not load translations:', err);
            });
    }

    // ---- Language switcher
    function initLanguageSwitcher() {
        var sel = document.getElementById('language-selector');
        if (!sel) return;
        sel.addEventListener('change', function () {
            currentLang = sel.value;
            localStorage.setItem('ae_lang', currentLang);
            applyTranslations(currentLang);
        });
    }

    // ---- Navbar: hide on scroll down, show on scroll up
    function initNavbarScroll() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;
        var lastY = window.scrollY;
        window.addEventListener('scroll', function () {
            var y = window.scrollY;
            if (y > lastY && y > 80) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
            lastY = y;
        }, { passive: true });
    }

    // ---- Mobile nav toggle
    function initNavToggle() {
        var toggle = document.getElementById('nav-toggle');
        var links = document.querySelector('.nav-links');
        if (!toggle || !links) return;
        toggle.addEventListener('click', function () {
            links.classList.toggle('open');
        });
        // Close on link click
        links.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') links.classList.remove('open');
        });
    }

    // ---- Smooth scroll for nav links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var target = document.querySelector(link.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                var navHeight = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    // ---- Carousel
    function initCarousel() {
        var track = document.getElementById('carousel-track');
        var prevBtn = document.getElementById('carousel-prev');
        var nextBtn = document.getElementById('carousel-next');
        var dotsContainer = document.getElementById('carousel-dots');
        if (!track) return;

        var slides = track.querySelectorAll('.carousel-slide');
        var total = slides.length;
        var current = 0;

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            // Update dots
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.dot').forEach(function (d, i) {
                    d.classList.toggle('dot--active', i === current);
                });
            }
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

        // Dot clicks
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.dot').forEach(function (dot, i) {
                dot.addEventListener('click', function () { goTo(i); });
            });
        }

        // Touch / drag swipe
        var startX = 0;
        var isDragging = false;

        track.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            if (!isDragging) return;
            isDragging = false;
            var diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });

        track.addEventListener('mousedown', function (e) {
            startX = e.clientX;
            isDragging = true;
        });

        track.addEventListener('mouseup', function (e) {
            if (!isDragging) return;
            isDragging = false;
            var diff = startX - e.clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        });

        track.addEventListener('mouseleave', function () { isDragging = false; });
    }

    // ---- FAQ Accordion
    function initFaq() {
        document.querySelectorAll('.faq-question').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var answer = btn.nextElementSibling;
                var isOpen = btn.getAttribute('aria-expanded') === 'true';

                // Close all
                document.querySelectorAll('.faq-question').forEach(function (b) {
                    b.setAttribute('aria-expanded', 'false');
                    var a = b.nextElementSibling;
                    if (a) a.classList.remove('open');
                });

                // Toggle clicked
                if (!isOpen) {
                    btn.setAttribute('aria-expanded', 'true');
                    if (answer) answer.classList.add('open');
                }
            });
        });
    }

    // ---- Contact Form
    function initContactForm() {
        var form = document.getElementById('contact-form');
        var successMsg = document.getElementById('form-success');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = form.querySelector('[name="name"]').value.trim();
            var email = form.querySelector('[name="email"]').value.trim();
            var message = form.querySelector('[name="message"]').value.trim();

            if (!name || !email || !message) return;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                form.querySelector('[name="email"]').focus();
                return;
            }

            // Success
            form.reset();
            if (successMsg) {
                successMsg.hidden = false;
                setTimeout(function () { successMsg.hidden = true; }, 5000);
            }
        });
    }

    // ---- Init
    document.addEventListener('DOMContentLoaded', function () {
        loadTranslations();
        initLanguageSwitcher();
        initNavbarScroll();
        initNavToggle();
        initSmoothScroll();
        initCarousel();
        initFaq();
        initContactForm();
    });
})();