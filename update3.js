const fs = require('fs');

// 1. Update page.js
let page = fs.readFileSync('src/app/page.js', 'utf8');

// Add main-header ID
page = page.replace(
  /<header className="fixed top-6/,
  '<header id="main-header" className="fixed top-6'
);

// Update openMobileMenu and closeMobileMenu logic
page = page.replace(
  /function openMobileMenu\(\) \{[\s\S]*?\}/,
  `function openMobileMenu() {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
            const header = document.getElementById('main-header');
            if (header) header.style.opacity = '0';
            if (header) header.style.pointerEvents = 'none';
        }`
);

page = page.replace(
  /function closeMobileMenu\(\) \{[\s\S]*?\}/,
  `function closeMobileMenu() {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
            const header = document.getElementById('main-header');
            if (header) header.style.opacity = '1';
            if (header) header.style.pointerEvents = 'auto';
        }`
);

fs.writeFileSync('src/app/page.js', page);

// 2. Update globals.css
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Reduce font size of mobile menu links
css = css.replace(
  /font-size: 1\.1rem;/g,
  'font-size: 0.85rem;'
);

// Add footer responsive adjustments and header transition
css = css.replace(
  /\/\* ===== RESPONSIVE OVERRIDES ===== \*\//,
  `/* ===== RESPONSIVE OVERRIDES ===== */
#main-header { transition: opacity 0.3s ease; }`
);

// Inject tighter footer spacing for mobile
css = css.replace(
  /\/\* Footer \*\//,
  `/* Footer */
    footer.py-20 { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
    footer .gap-12 { gap: 2rem !important; }
    footer .mb-20 { margin-bottom: 2rem !important; }`
);

fs.writeFileSync('src/app/globals.css', css);

console.log('Done!');
