const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Remove existing broken footer overrides
css = css.replace(/\/\* Footer \*\/[\s\S]*?\/\* Button wrap \*\//, '/* Button wrap */');

// Inject the new, robust footer overrides into the mobile media query
css = css.replace(
  /\/\* Button wrap \*\//,
  `/* Footer Robust Mobile */
    footer .grid { display: flex !important; flex-direction: column !important; gap: 3rem !important; }
    footer .md\\:col-span-12, footer .md\\:col-span-6 { width: 100% !important; margin-bottom: 1rem; }
    /* Button wrap */`
);

// Inject into tablet media query
css = css.replace(
  /\.py-60 \{ padding-top: 5rem !important; padding-bottom: 5rem !important; \}/,
  `.py-60 { padding-top: 5rem !important; padding-bottom: 5rem !important; }
    
    /* Footer Robust Tablet */
    footer .grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 3rem !important; }
    footer .grid > div:first-child { grid-column: span 2 !important; }`
);

fs.writeFileSync('src/app/globals.css', css);
console.log('Footer CSS fixed');
