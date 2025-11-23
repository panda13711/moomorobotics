#!/bin/bash

# Website Performance Optimization Script
# Run this to minify and optimize all assets

echo "🚀 TechTribe Gadgets - Performance Optimization"
echo "================================================"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install -g clean-css-cli terser html-minifier

# Create minified directory structure
echo "📁 Creating directories..."
mkdir -p assets/css/min
mkdir -p assets/js/min

# Minify CSS files
echo "🎨 Minifying CSS files..."
cleancss -o assets/css/min/variables.min.css assets/css/variables.css
cleancss -o assets/css/min/base.min.css assets/css/base.css
cleancss -o assets/css/min/navigation.min.css assets/css/navigation.css
cleancss -o assets/css/min/hero.min.css assets/css/hero.css
cleancss -o assets/css/min/sections.min.css assets/css/sections.css
cleancss -o assets/css/min/animations.min.css assets/css/animations.css
cleancss -o assets/css/min/responsive.min.css assets/css/responsive.css

# Minify JavaScript files
echo "⚡ Minifying JavaScript files..."
terser assets/js/analytics.js -o assets/js/min/analytics.min.js -c -m
terser assets/js/starfield.js -o assets/js/min/starfield.min.js -c -m
terser assets/js/app.js -o assets/js/min/app.min.js -c -m

# Minify HTML (optional)
echo "📄 Minifying HTML..."
html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true index.html -o index.min.html

# Calculate sizes
echo ""
echo "📊 File Size Comparison:"
echo "========================"

echo "CSS (Original):"
du -sh assets/css/*.css | grep -v min

echo ""
echo "CSS (Minified):"
du -sh assets/css/min/*.min.css

echo ""
echo "JS (Original):"
du -sh assets/js/*.js | grep -v min

echo ""
echo "JS (Minified):"
du -sh assets/js/min/*.min.js

echo ""
echo "HTML:"
echo "Original: $(du -h index.html | cut -f1)"
echo "Minified: $(du -h index.min.html | cut -f1)"

echo ""
echo "✅ Optimization complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test the minified version: open index.min.html"
echo "2. Update production to use .min files"
echo "3. Enable server compression (gzip/brotli)"
echo "4. Run Lighthouse audit in Chrome DevTools"
echo ""
echo "🎯 Expected improvements:"
echo "- 80-90% faster load time"
echo "- 60-70% smaller file sizes"
echo "- Better Core Web Vitals scores"
