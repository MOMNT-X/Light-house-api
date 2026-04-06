const fs = require('fs');
let content = fs.readFileSync('prisma/seed-data.js', 'utf8');

content = content.replace(/name:\s*'([^']+)',\s*description:\s*''/g, "name: '$1', description: 'Deliciously made $1. Please note: No refunds are available for order expectation mistakes.'");

fs.writeFileSync('prisma/seed-data.js', content, 'utf8');
