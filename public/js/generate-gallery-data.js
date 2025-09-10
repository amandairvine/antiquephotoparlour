const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'img', 'themes');
const outputDir = path.join(projectRoot, 'data');
const outputFilePath = path.join(outputDir, 'images.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

let galleryData = {};

if (fs.existsSync(outputFilePath)) {
  const existingData = fs.readFileSync(outputFilePath, 'utf-8');
  galleryData = JSON.parse(existingData);
}

function fileExists(imagePath) {
  const localPath = path.join(projectRoot, imagePath.replace(/\.\./g, ''));
  return fs.existsSync(localPath);
}

// Step 1: Clean up existing galleryData by removing missing images
console.log('Cleaning up existing gallery data...');
for (const theme in galleryData) {
  galleryData[theme] = galleryData[theme].filter(imagePath => {
    const exists = fileExists(imagePath);
    if (!exists) {
      console.warn(`Removing missing image from images.json: ${imagePath}`);
    }
    return exists;
  });
}
console.log('✅ Existing gallery data cleaned.');

// Step 2: Find new images, placing main image first
console.log('🔎 Scanning for new images...');
const themeFolders = fs.readdirSync(themesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

themeFolders.forEach(theme => {
  const themePath = path.join(themesDir, theme);
  const themeFiles = fs.readdirSync(themePath);
  let mainImagePath = null;
  const otherImages = [];

  // Identify the main image and separate the others
  themeFiles.forEach(file => {
    const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase());
    if (isImage) {
      const filePath = path.join(themePath, file);
      if (fs.existsSync(filePath)) {
        if (file.toLowerCase().includes('-main')) {
          mainImagePath = path.join('..', 'img', 'themes', theme, file).replace(/\\/g, '/');
        } else {
          otherImages.push(path.join('..', 'img', 'themes', theme, file).replace(/\\/g, '/'));
        }
      } else {
        console.warn(`⚠️ Warning: Found a missing file during scan - ${filePath}`);
      }
    }
  });

  // Combine the lists, with the main image at the front
  let orderedImages = [];
  if (mainImagePath) {
    orderedImages.push(mainImagePath);
  }

  // You can sort the other images here if you like
  // otherImages.sort(); 

  orderedImages = orderedImages.concat(otherImages);

  // Filter out duplicates and update the galleryData
  if (!galleryData[theme]) {
    galleryData[theme] = [];
  }

  const existingImages = new Set(galleryData[theme]);
  const imagesToAdd = orderedImages.filter(image => !existingImages.has(image));

  // This is the key change to preserve the new order
  galleryData[theme] = imagesToAdd.concat(galleryData[theme]);

  // If the main image already exists in the list, reorder it to the front
  if (mainImagePath) {
    const mainImageIndex = galleryData[theme].indexOf(mainImagePath);
    if (mainImageIndex > 0) {
      galleryData[theme].splice(mainImageIndex, 1);
      galleryData[theme].unshift(mainImagePath);
    }
  }
});

// Step 3: Write the finalized, unique, and clean data to the file
fs.writeFileSync(outputFilePath, JSON.stringify(galleryData, null, 2), 'utf-8');

console.log('✅ Gallery data generated and cleaned successfully!');