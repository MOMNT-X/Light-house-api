const fs = require('fs');
const content = fs.readFileSync('prisma/seed-data.js', 'utf8');

const arrayMatch = content.match(/const data = (\[[\s\S]*?\]);\s*fs\.writeFileSync/);
if (!arrayMatch) throw new Error("Could not parse data array");

const data = eval(arrayMatch[1]);

data.forEach(vendor => {
  vendor.categories.forEach(category => {
    category.items.forEach(item => {
      let desc = item.name;
      const lowerName = item.name.toLowerCase();
      
      if (lowerName.includes('plate') || lowerName.includes('portion') || lowerName.includes('extra') || lowerName.includes('regular') || lowerName.includes('wrap')) {
         // It's a generic size/portion name
         desc = `${item.name} of ${category.name}`;
      } else {
         if (category.name === 'Extras' || category.name === 'Drinks' || category.name === 'Proteins') {
            desc = item.name;
         } else {
            desc = `${item.name} (${category.name})`;
         }
      }
      
      item.description = `Deliciously prepared ${desc}.`;
    });
  });
});

const newContent = `const fs = require('fs');

const data = ${JSON.stringify(data, null, 2)};

fs.writeFileSync(__dirname + '/seed-data.json', JSON.stringify(data, null, 2));
console.log('seed-data.json created!');
`;

fs.writeFileSync('prisma/seed-data.js', newContent, 'utf8');
