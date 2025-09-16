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

function normalizeThemeName(name) {
  return name.toLowerCase().replace(/[\s\.\,\'\"]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

// Step 1: Standardize "main" image file names and convert to .jpg
console.log('🔄 Standardizing main image filenames...');
const themeFolders = fs.readdirSync(themesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

themeFolders.forEach(theme => {
  const themePath = path.join(themesDir, theme);
  const themeFiles = fs.readdirSync(themePath);
  const normalizedThemeName = normalizeThemeName(theme);

  themeFiles.forEach(file => {
    const fileExt = path.extname(file).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(fileExt);

    if (isImage) {
      // Create the new file name with a .jpg extension
      const baseName = path.basename(file, fileExt);
      const newFileName = `${baseName}.jpg`;
      const newFilePath = path.join(themePath, newFileName);

      // Only rename if the name is different
      if (file !== newFileName) {
        const oldFilePath = path.join(themePath, file);
        try {
          fs.renameSync(oldFilePath, newFilePath);
          console.log(`✅ Renamed and converted ${file} to ${newFileName} in theme ${theme}`);
        } catch (error) {
          console.error(`❌ Failed to rename ${oldFilePath}: ${error.message}`);
        }
      }
    }
  });
});
console.log('✅ All image files converted');

// Step 2: Clean up existing galleryData by removing missing images
console.log('🧹 Cleaning up existing gallery data...');
for (const theme in galleryData) {
  galleryData[theme] = galleryData[theme].filter(imagePath => {
    const exists = fileExists(imagePath);
    if (!exists) {
      console.warn(`🗑️ Removing missing image from images.json: ${imagePath}`);
    }
    return exists;
  });
}
console.log('✅ Existing gallery data cleaned.');

// Step 3: Find new images and update data
console.log('🔎 Scanning for and updating image list...');
themeFolders.forEach(theme => {
  const themePath = path.join(themesDir, theme);
  const themeFiles = fs.readdirSync(themePath);
  let mainImagePath = null;
  const otherImages = [];
  const normalizedThemeName = normalizeThemeName(theme);

  themeFiles.forEach(file => {
    const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase());
    if (isImage) {
      const filePath = path.join(themePath, file);
      if (fs.existsSync(filePath)) {
        const relativePath = path.join('..', 'img', 'themes', theme, file).replace(/\\/g, '/');
        if (file.toLowerCase() === `${normalizedThemeName}-main${path.extname(file).toLowerCase()}`) {
          mainImagePath = relativePath;
        } else {
          otherImages.push(relativePath);
        }
      } else {
        console.warn(`⚠️ Warning: Found a missing file during scan - ${filePath}`);
      }
    }
  });

  let orderedImages = [];
  if (mainImagePath) {
    orderedImages.push(mainImagePath);
  }

  // Sort the other images for consistent order
  otherImages.sort();
  orderedImages = orderedImages.concat(otherImages);

  if (!galleryData[theme]) {
    galleryData[theme] = [];
  }

  // Filter out duplicates and preserve the new order
  const existingImages = new Set(galleryData[theme]);
  const newImages = orderedImages.filter(image => !existingImages.has(image));
  galleryData[theme] = [...new Set(orderedImages.concat(galleryData[theme]))];
});

// Step 4: Write the finalized data to the file
fs.writeFileSync(outputFilePath, JSON.stringify(galleryData, null, 2), 'utf-8');

console.log('✅ Gallery data generated and updated successfully!');