/* ============================================
   Starfield Canvas Animation - ULTRA OPTIMIZED
   ============================================ */

(function() {
    'use strict';
    
    const canvas = document.getElementById('universeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { 
        alpha: false,
        desynchronized: true,
        willReadFrequently: false
    });
    
    // INCREASED star count for better visibility on large screens
    const STAR_COUNT = 150; // Increased from 80 for better visibility
    const MAX_DEPTH = 10;
    const SPEED = 0.06; // Slightly slower for smoother animation
    const TARGET_FPS = 30; // Cap FPS to reduce CPU usage
    const FRAME_TIME = 1000 / TARGET_FPS;
    
    const stars = [];
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let animationId = null;
    let lastFrameTime = 0;
    let isTabVisible = true;
    
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    
    // Initialize dimensions
    function resize() {
        const ratio = window.devicePixelRatio || 1;
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        centerX = width / 2;
        centerY = height / 2;
    }
    
    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function createStar() {
        return {
            x: randomRange(-centerX, centerX),
            y: randomRange(-centerY, centerY),
            z: randomRange(1, MAX_DEPTH),
        };
    }
    
    function initStars() {
        stars.length = 0;
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(createStar());
        }
    }
    
    // Theme-aware colors
    let bgColor = { r: 4, g: 4, b: 4 };
    let starColor = { r: 255, g: 255, b: 255 };
    
    function updateThemeColors(theme) {
        if (theme === 'light') {
            bgColor = { r: 245, g: 245, b: 245 };
            starColor = { r: 50, g: 50, b: 50 };
        } else {
            bgColor = { r: 4, g: 4, b: 4 };
            starColor = { r: 255, g: 255, b: 255 };
        }
    }
    
    // Export theme function for theme-toggle.js
    window.starfieldTheme = updateThemeColors;
    
    function clearCanvas(alpha = 0.2) {
        ctx.fillStyle = `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${alpha})`;
        ctx.fillRect(0, 0, width, height);
    }
    
    function drawStar(star) {
        const k = 120 / star.z;
        const x = star.x * k + centerX;
        const y = star.y * k + centerY;
        
        // Reset star if out of bounds
        if (x < 0 || x >= width || y < 0 || y >= height) {
            Object.assign(star, createStar());
            return;
        }
        
        // Increased size and brightness for better visibility
        const size = (1 - star.z / MAX_DEPTH) * 3 + 0.6;
        const glow = 0.7 + (1 - star.z / MAX_DEPTH) * 0.3;
        
        // Use simpler circles instead of ellipses for better performance
        ctx.beginPath();
        ctx.fillStyle = `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, ${glow})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function step(currentTime) {
        // FPS throttling - only render at target FPS
        if (currentTime - lastFrameTime < FRAME_TIME) {
            animationId = requestAnimationFrame(step);
            return;
        }
        lastFrameTime = currentTime;
        
        // Pause animation if tab is not visible
        if (!isTabVisible) {
            animationId = requestAnimationFrame(step);
            return;
        }
        
        clearCanvas();
        
        // Batch star updates
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            star.z -= SPEED;
            if (star.z <= 0.6) {
                Object.assign(star, createStar());
                star.z = MAX_DEPTH;
            }
            drawStar(star);
        }
        
        animationId = requestAnimationFrame(step);
    }
    
    function renderStaticField() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        clearCanvas(1);
        for (const star of stars) {
            drawStar(star);
        }
    }
    
    function play() {
        if (prefersReducedMotion) {
            renderStaticField();
        } else {
            if (animationId) cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(step);
        }
    }
    
    // Motion preference change handler
    const handleMotionPreference = (event) => {
        prefersReducedMotion = event.matches;
        play();
    };
    
    if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', handleMotionPreference);
    } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(handleMotionPreference);
    }
    
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            initStars();
            play();
        }, 250);
    }, { passive: true });
    
    // Page visibility API - pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        isTabVisible = !document.hidden;
        if (!isTabVisible && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else if (isTabVisible && !animationId && !prefersReducedMotion) {
            play();
        }
    });
    
    // Intersection Observer - only animate when canvas is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !prefersReducedMotion) {
                if (!animationId) play();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(canvas);
    
    // Initialize with delay to reduce initial load impact
    requestIdleCallback(() => {
        resize();
        initStars();
        play();
    }, { timeout: 1000 });
})();
