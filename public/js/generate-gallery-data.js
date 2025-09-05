const fs = require('fs');
const path = require('path');

// Determine the root directory of the project
const projectRoot = path.join(__dirname, '..');

// Define the paths for the source images and the output data
// '..' moves up one level from /js to the project root
const themesDir = path.join(projectRoot, 'img', 'themes');
const outputDir = path.join(projectRoot, 'data');
const outputFilePath = path.join(outputDir, 'images.json');

// Create the 'data' directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const galleryData = {};

// Read all theme folders from the themes directory
const themeFolders = fs.readdirSync(themesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

themeFolders.forEach(theme => {
  const themePath = path.join(themesDir, theme);
  const images = fs.readdirSync(themePath)
    .filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()))
    .map(file => path.join('..', 'img', 'themes', theme, file).replace(/\\/g, '/'));
  
  galleryData[theme] = images;
});

// Write the JSON data to the output file
fs.writeFileSync(outputFilePath, JSON.stringify(galleryData, null, 2), 'utf-8');

console.log('✅ Gallery data generated successfully!');