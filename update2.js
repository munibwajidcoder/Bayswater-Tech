const fs = require('fs');

// 1. Update globals.css
let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Add html, body overflow-x hidden
css = css.replace(
  /\/\* Premium Custom 3D Cursor Styles — desktop only \*\//,
  `html, body { overflow-x: hidden !important; width: 100%; max-width: 100vw; position: relative; }\n\n/* Premium Custom 3D Cursor Styles — desktop only */`
);

css = css.replace(
  /#mobile-menu \{[\s\S]*?#mobile-menu\.open \{ display: flex; \}/m,
  `#mobile-menu {
    position: fixed;
    top: 0; left: -100%; bottom: 0;
    width: 280px;
    background: rgba(11, 17, 32, 0.98);
    backdrop-filter: blur(20px);
    z-index: 9999;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 6rem 2rem 2rem 2rem;
    gap: 2.5rem;
    transition: left 0.3s ease;
    display: flex;
    box-shadow: 5px 0 25px rgba(0,0,0,0.5);
}
#mobile-menu.open { left: 0; }`
);

css = css.replace(
  /#mobile-menu a \{[\s\S]*?transition: color 0\.2s;\n\}/m,
  `#mobile-menu a {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #F0F4F8;
    transition: color 0.2s;
}`
);

fs.writeFileSync('src/app/globals.css', css);

// 2. Update layout.js html tag
let layoutJs = fs.readFileSync('src/app/layout.js', 'utf8');
layoutJs = layoutJs.replace(
  /<html lang="en" className="dark" suppressHydrationWarning>/,
  '<html lang="en" className="dark overflow-x-hidden" suppressHydrationWarning>'
);
fs.writeFileSync('src/app/layout.js', layoutJs);

console.log('Mobile responsiveness updated.');
