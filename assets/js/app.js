/* ============================================
   Main Application Logic
   ============================================ */

(function() {
    'use strict';
    
    // Smooth scrolling for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            });
        });
    }
    
    // Form submission handler
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Track conversion
        if (typeof trackInteraction === 'function') {
            trackInteraction('form', 'submit_' + data.service);
        }
        
        if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
                'service_type': data.service,
                'event_category': 'Lead Generation'
            });
        }
        
        alert('Thank you! We will contact you within 24 hours to schedule your consultation.');
        event.target.reset();
    }
    
    // Navbar scroll effect (debounced)
    function initNavbarScroll() {
        let lastScroll = 0;
        let ticking = false;
        const navbar = document.querySelector('.navbar');
        
        function updateNavbar(currentScroll) {
            if (currentScroll > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
            lastScroll = currentScroll;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateNavbar(currentScroll);
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Lazy load background images
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('[data-bg]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        element.style.backgroundImage = `url('${element.dataset.bg}')`;
                        element.removeAttribute('data-bg');
                        observer.unobserve(element);
                    }
                });
            });
            
            lazyImages.forEach(image => imageObserver.observe(image));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(image => {
                image.style.backgroundImage = `url('${image.dataset.bg}')`;
            });
        }
    }
    
    // Initialize on DOM ready
    function init() {
        initSmoothScroll();
        initNavbarScroll();
        initLazyLoad();
        initPerformanceMode();
        initAnimationObserver();
        
        // Attach form handler
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleSubmit);
        }
    }
    
    // Performance mode toggle
    function initPerformanceMode() {
        // Auto-detect low performance
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        if (isSlowConnection || isLowMemory) {
            enablePerformanceMode();
        }
        
        // Manual toggle (Ctrl+Shift+P)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                togglePerformanceMode();
            }
        });
    }
    
    function enablePerformanceMode() {
        document.body.setAttribute('data-performance-mode', 'true');
        console.log('⚡ Performance mode enabled');
    }
    
    function togglePerformanceMode() {
        const current = document.body.getAttribute('data-performance-mode') === 'true';
        document.body.setAttribute('data-performance-mode', !current);
        console.log(current ? '🎨 Full animation mode' : '⚡ Performance mode enabled');
    }
    
    // Intersection observer for animations
    function initAnimationObserver() {
        const animatedElements = document.querySelectorAll('.service-card, .product-card, .benefit-item');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.willChange = 'transform';
                    } else {
                        entry.target.style.willChange = 'auto';
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            animatedElements.forEach(el => observer.observe(el));
        }
    }
    
    // Debounce utility
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
    
    // Throttle utility
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
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
