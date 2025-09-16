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

// Step 1: Standardize all image file names and convert to .jpg
console.log('🔄 Standardizing image filenames and converting to .jpg...');
const themeFolders = fs.readdirSync(themesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

themeFolders.forEach(theme => {
  const themePath = path.join(themesDir, theme);
  const themeFiles = fs.readdirSync(themePath);

  themeFiles.forEach(file => {
    const oldFilePath = path.join(themePath, file);
    const fileLower = file.toLowerCase();

    // Special case to correct .jpg.jpg files
    if (fileLower.endsWith('.jpg.jpg')) {
      const newFileName = file.substring(0, file.length - 4);
      const newFilePath = path.join(themePath, newFileName);

      try {
        fs.renameSync(oldFilePath, newFilePath);
        console.log(`✅ Corrected double extension: ${file} to ${newFileName} in theme ${theme}`);
      } catch (error) {
        console.error(`❌ Failed to rename ${oldFilePath}: ${error.message}`);
      }
    }
    // Handle non-.jpg images (e.g., .png, .jpeg, .gif)
    else if (fileLower.endsWith('.jpeg') || fileLower.endsWith('.png') || fileLower.endsWith('.gif')) {
      const newFileName = file.substring(0, file.lastIndexOf('.')) + '.jpg';
      const newFilePath = path.join(themePath, newFileName);

      try {
        fs.renameSync(oldFilePath, newFilePath);
        console.log(`✅ Converted ${file} to ${newFileName} in theme ${theme}`);
      } catch (error) {
        console.error(`❌ Failed to rename ${oldFilePath}: ${error.message}`);
      }
    }
    // Handle .jpg images with incorrect case (e.g., .JPG)
    else if (fileLower.endsWith('.jpg') && file !== fileLower) {
      const newFileName = fileLower;
      const newFilePath = path.join(themePath, newFileName);

      try {
        fs.renameSync(oldFilePath, newFilePath);
        console.log(`✅ Standardized filename to lowercase: ${newFileName} in theme ${theme}`);
      } catch (error) {
        console.error(`❌ Failed to rename ${oldFilePath}: ${error.message}`);
      }
    }
  });
});
console.log('✅ All images standardized.');

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
    // Only process files that have a .jpg extension
    const fileLower = file.toLowerCase();
    if (fileLower.endsWith('.jpg')) {
      const filePath = path.join(themePath, file);
      if (fs.existsSync(filePath)) {
        const relativePath = path.join('..', 'img', 'themes', theme, file).replace(/\\/g, '/');

        // Check if the filename matches the standardized 'main' image name
        if (file === `${normalizedThemeName}-main.jpg`) {
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

  // Replace the old list with the newly generated, clean list
  galleryData[theme] = orderedImages;
});

// Step 4: Write the finalized data to the file
fs.writeFileSync(outputFilePath, JSON.stringify(galleryData, null, 2), 'utf-8');

console.log('✅ Gallery data generated and updated successfully!');

// Step 4: Write the finalized data to the file
fs.writeFileSync(outputFilePath, JSON.stringify(galleryData, null, 2), 'utf-8');

console.log('✅ Gallery data generated and updated successfully!');