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

    // ---- Init
    document.addEventListener('DOMContentLoaded', function () {
        loadTranslations();
        initLanguageSwitcher();
        initNavbarScroll();
        initNavToggle();
        initSmoothScroll();
        initFaq();
    });
})();