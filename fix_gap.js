const fs = require('fs');
let page = fs.readFileSync('src/app/page.js', 'utf8');

// Fix gap: change pt-28 to pt-4
page = page.replace(
  /<div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-28">/,
  '<div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-4">'
);

// Fix tablet footer overlapping: change md:col-span-6 to md:col-span-4
page = page.replace(
  /<div className="md:col-span-6 lg:col-span-3 flex flex-col gap-4">/g,
  '<div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">'
);
page = page.replace(
  /<div className="md:col-span-6 lg:col-span-2 flex flex-col gap-4">/g,
  '<div className="md:col-span-4 lg:col-span-2 flex flex-col gap-4">'
);

fs.writeFileSync('src/app/page.js', page);
console.log('Fixed padding and footer layout in page.js');
