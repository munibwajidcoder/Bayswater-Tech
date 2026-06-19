const fs = require('fs');
let page = fs.readFileSync('src/app/page.js', 'utf8');

// Change pt-4 to -mt-32 to drastically decrease gap
page = page.replace(
  /<div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-4">/,
  '<div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center -mt-32">'
);

fs.writeFileSync('src/app/page.js', page);
console.log('Done pulling hero up');
