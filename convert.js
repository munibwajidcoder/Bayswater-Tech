const fs = require('fs');
let html = fs.readFileSync('_backup/index.html', 'utf8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyContent = bodyMatch ? bodyMatch[1] : '';

const scriptMatch = bodyContent.match(/<script>([\s\S]*?)<\/script>/i);
let scriptContent = scriptMatch ? scriptMatch[1] : '';
bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/i, '');

// Basic HTML to JSX replacement
let jsx = bodyContent;
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');

// Fix unclosed images
jsx = jsx.replace(/<img([^>]+)>/g, (m, g1) => {
  if (g1.trim().endsWith('/')) return m;
  return '<img' + g1 + ' />';
});

// Fix unclosed inputs
jsx = jsx.replace(/<input([^>]+)>/g, (m, g1) => {
  if (g1.trim().endsWith('/')) return m;
  return '<input' + g1 + ' />';
});

// Fix br
jsx = jsx.replace(/<br>/g, '<br />');

// Remove HTML comments inside JSX
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Convert inline styles to objects
jsx = jsx.replace(/style="([^"]+)"/g, (m, styleStr) => {
  const parts = styleStr.split(';');
  let styleObj = {};
  for(let part of parts) {
    if(!part.trim()) continue;
    let idx = part.indexOf(':');
    if (idx === -1) continue;
    let key = part.slice(0, idx).trim();
    let val = part.slice(idx + 1).trim();
    key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    styleObj[key] = val;
  }
  return "style={" + JSON.stringify(styleObj) + "}";
});

// Fix viewBox
jsx = jsx.replace(/viewBox=/g, 'viewBox=');

// Fix onclick React errors
jsx = jsx.replace(/onclick="closeMobileMenu\(\)"/g, 'onClick={() => window.closeMobileMenu()}');

scriptContent = scriptContent.replace(
    'function closeMobileMenu() {',
    'window.closeMobileMenu = closeMobileMenu;\n        function closeMobileMenu() {'
);

const pageJs = `'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // --- CLIENT SIDE SCRIPT ---
    ${scriptContent}
  }, []);

  return (
    <>
      ${jsx}
    </>
  );
}
`;

fs.writeFileSync('src/app/page.js', pageJs);
console.log('JSX converted perfectly!');
