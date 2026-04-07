const fs = require('fs');
let content = fs.readFileSync('prisma/seed-data.js', 'utf8');

content = content.replace(/\. Please note: No refunds are available for order expectation mistakes\./g, ".");

fs.writeFileSync('prisma/seed-data.js', content, 'utf8');
