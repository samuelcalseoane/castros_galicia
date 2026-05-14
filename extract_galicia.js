const fs = require('fs');
const content = fs.readFileSync('/Users/samuelcalseoane/.gemini/antigravity/brain/fbe7283c-f685-4021-b4ad-5c5ea71b1e4d/.system_generated/steps/67/content.md', 'utf8');

// Find the JSON part (starts with {)
const jsonStart = content.indexOf('{');
const jsonContent = content.substring(jsonStart);

const data = JSON.parse(jsonContent);
const galicianProvinces = ['A Coruña', 'Pontevedra', 'Ourense', 'Lugo'];

const galicia = {
  type: 'FeatureCollection',
  features: data.features.filter(f => galicianProvinces.includes(f.properties.name))
};

console.log('Found provinces:', galicia.features.map(f => f.properties.name));
fs.writeFileSync('/Users/samuelcalseoane/Documents/Infografia_castros/src/data/galicia.geojson', JSON.stringify(galicia));
console.log('Written galicia.geojson');
