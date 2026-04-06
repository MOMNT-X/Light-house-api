const fs = require('fs');
const content = fs.readFileSync('prisma/seed-data.js', 'utf8');

const arrayMatch = content.match(/const data = (\[[\s\S]*?\]);\s*fs\.writeFileSync/);
if (!arrayMatch) throw new Error("Could not parse data array");

const data = eval(arrayMatch[1]);

data.forEach(vendor => {
  vendor.categories.forEach(category => {
    category.items.forEach(item => {
      // Reset description to the simple version
      item.description = `Deliciously made ${item.name}.`;
    });
  });
});

const newContent = `const fs = require('fs');\n\nconst data = ${JSON.stringify(data, null, 2)};\n\nfs.writeFileSync(__dirname + '/seed-data.json', JSON.stringify(data, null, 2));\nconsole.log('seed-data.json created!');\n`;

fs.writeFileSync('prisma/seed-data.js', newContent, 'utf8');
