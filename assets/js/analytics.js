/* ============================================
   Analytics & Tracking
   ============================================ */

// Initialize Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');

// Track user interactions
function trackInteraction(element, action) {
    gtag('event', 'user_interaction', {
        'element': element,
        'action': action,
        'page': 'consumer'
    });
}

// Track page performance
window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    gtag('event', 'page_performance', {
        'event_category': 'Performance',
        'page_type': 'consumer',
        'load_time': pageLoadTime
    });
});

// Make trackInteraction available globally
window.trackInteraction = trackInteraction;
