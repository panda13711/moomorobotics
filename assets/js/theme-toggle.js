// Theme Toggle Script
// Handles dark/light mode switching with localStorage persistence and system preference detection

(function() {
    'use strict';

    // Theme management
    const THEME_KEY = 'moomo-theme';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';

    // Get system preference
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return LIGHT_THEME;
        }
        return DARK_THEME;
    }

    // Get saved theme or default to system preference
    function getSavedTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        return saved || getSystemTheme();
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        
        // Update button text and icon
        const button = document.getElementById('theme-toggle-btn');
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');
        
        if (button) {
            if (theme === LIGHT_THEME) {
                icon.textContent = '🌙';
                text.textContent = 'Dark';
                button.setAttribute('aria-label', 'Switch to dark mode');
            } else {
                icon.textContent = '☀️';
                text.textContent = 'Light';
                button.setAttribute('aria-label', 'Switch to light mode');
            }
        }

        // Adjust starfield for light mode
        adjustStarfield(theme);
    }

    // Adjust starfield colors based on theme
    function adjustStarfield(theme) {
        // This will be called by starfield.js if it's loaded
        if (window.starfieldTheme) {
            window.starfieldTheme(theme);
        }
    }

    // Toggle between themes
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || DARK_THEME;
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyTheme(newTheme);
    }

    // Initialize theme on page load
    function initTheme() {
        const theme = getSavedTheme();
        applyTheme(theme);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const saved = localStorage.getItem(THEME_KEY);
            if (!saved) {
                const newTheme = e.matches ? LIGHT_THEME : DARK_THEME;
                applyTheme(newTheme);
            }
        });
    }

    // Initialize immediately (before DOM loads for no flash)
    initTheme();

    // Setup button after DOM loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupButton);
    } else {
        setupButton();
    }

    function setupButton() {
        const button = document.getElementById('theme-toggle-btn');
        if (button) {
            button.addEventListener('click', toggleTheme);
            
            // Keyboard accessibility
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
    }

    // Export theme function for other scripts
    window.getCurrentTheme = function() {
        return document.documentElement.getAttribute('data-theme') || DARK_THEME;
    };

})();
