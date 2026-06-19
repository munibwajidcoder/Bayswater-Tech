const fs = require('fs');
let text = fs.readFileSync('src/app/page.js', 'utf8');

// Update navbar text size from text-xs to text-sm
text = text.replace(
  /<a className='text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors' href='\/'>Services<\/a>/,
  `<a className='text-sm font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors' href='/'>Services</a>`
);
text = text.replace(
  /<a className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">About<\/a>/,
  `<a className="text-sm font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">About</a>`
);
text = text.replace(
  /<a className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">Infrastructure<\/a>/,
  `<a className="text-sm font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">Infrastructure</a>`
);
text = text.replace(
  /<a className="text-xs font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">contact<\/a>/,
  `<a className="text-sm font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors" href="#">contact</a>`
);
text = text.replace(
  /<a className="px-5 py-2 bg-gradient-to-r from-secondary to-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 hover:shadow-\[0_0_20px_rgba\(0,207,168,0\.35\)\] transition-all" href="#">Get in Touch<\/a>/,
  `<a className="px-5 py-2 bg-gradient-to-r from-secondary to-primary text-white font-bold text-sm uppercase tracking-widest rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(0,207,168,0.35)] transition-all" href="#">Get in Touch</a>`
);

fs.writeFileSync('src/app/page.js', text);
console.log('Update done');
