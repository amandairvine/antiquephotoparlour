const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'img', 'themes');
const outputDir = path.join(projectRoot, 'data');
const outputFilePath = path.join(outputDir, 'images.json');
const TARGET_EXTENSION = '.webp'; // Define the new target extension

async function runScript() {
    // Ensure output directory exists (using fs/promises)
    await fs.mkdir(outputDir, { recursive: true });

    let galleryData = {};
    if (await fileExistsSync(outputFilePath)) { // Using a synchronous check for initial load
        const existingData = await fs.readFile(outputFilePath, 'utf-8');
        galleryData = JSON.parse(existingData);
    }

    async function fileExists(imagePath) {
        const localPath = path.join(projectRoot, imagePath.replace(/\.\./g, ''));
        try {
            await fs.access(localPath);
            return true;
        } catch {
            return false;
        }
    }

    function fileExistsSync(filePath) {
        try {
            require('fs').accessSync(filePath); // Use sync version for initial file check
            return true;
        } catch {
            return false;
        }
    }

    function normalizeThemeName(name) {
        return name.toLowerCase().replace(/[\s\.\,\'\"]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    }

    // --- Step 1: Standardize all image file names and convert to .webp ---
    console.log(`\n🔄 Standardizing image filenames and converting to ${TARGET_EXTENSION}...`);
    const themeFolders = (await fs.readdir(themesDir, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const theme of themeFolders) {
        const themePath = path.join(themesDir, theme);
        const themeFiles = await fs.readdir(themePath);

        for (const file of themeFiles) {
            const oldFilePath = path.join(themePath, file);
            const fileLower = file.toLowerCase();
            const extension = path.extname(fileLower);
            
            // Skip files that are already the target format or should be ignored (like .json)
            if (extension === TARGET_EXTENSION || !extension) continue;
            
            const baseName = path.basename(file, extension);
            let newFileName = baseName + TARGET_EXTENSION;

            // --- Conversion Logic ---
            try {
                // 1. Handle special case: correct double extension (e.g., image.jpg.jpg)
                if (fileLower.endsWith('.jpg.jpg')) {
                    // Use the corrected base name for the output
                    newFileName = file.substring(0, file.length - 4 - extension.length) + TARGET_EXTENSION;
                    console.log(`    ℹ️ Detected double extension on ${file}. Will use base: ${baseName}`);
                }
                
                const newFilePath = path.join(themePath, newFileName.toLowerCase()); // Always output lowercase filename

                // Use sharp to read the image, convert it to webp, and write the file
                await sharp(oldFilePath)
                    .webp({ quality: 80 })
                    .toFile(newFilePath);
                
                // If conversion was successful, delete the old file
                if (oldFilePath !== newFilePath) {
                    await fs.unlink(oldFilePath);
                }

                console.log(`✅ Converted and Renamed: ${file} -> ${newFilePath} in theme ${theme}`);

            } catch (error) {
                console.error(`❌ Failed to process ${oldFilePath}: ${error.message}`);
            }
        }
    }
    console.log('✅ All images converted and standardized.');

    // --- Step 2: Clean up existing galleryData by removing missing images ---
    console.log('\n🧹 Cleaning up existing gallery data...');
    for (const theme in galleryData) {
        // Create an array of potential WebP paths to check against
        const webpPaths = galleryData[theme].map(imagePath => {
             // Change the extension of the old path to the new target extension
             return imagePath.substring(0, imagePath.lastIndexOf('.')) + TARGET_EXTENSION;
        });

        const newPaths = [];
        for (const imagePath of webpPaths) {
            if (await fileExists(imagePath)) {
                newPaths.push(imagePath);
            } else {
                console.warn(`🗑️ Removing missing image from images.json: ${imagePath}`);
            }
        }
        galleryData[theme] = newPaths;
    }
    console.log('✅ Existing gallery data cleaned.');

    // --- Step 3: Find new images and update data ---
    console.log('\n🔎 Scanning for and updating image list...');
    for (const theme of themeFolders) {
        const themePath = path.join(themesDir, theme);
        const themeFiles = await fs.readdir(themePath);
        let mainImagePath = null;
        const otherImages = [];
        const normalizedThemeName = normalizeThemeName(theme);

        for (const file of themeFiles) {
            const fileLower = file.toLowerCase();
            if (fileLower.endsWith(TARGET_EXTENSION)) { 
                const filePath = path.join(themePath, file);
                
                const relativePath = path.join('..', 'img', 'themes', theme, file).replace(/\\/g, '/');

                // Check if the filename matches the standardized 'main' image name
                if (fileLower === `${normalizedThemeName}-main${TARGET_EXTENSION}`) {
                    mainImagePath = relativePath;
                } else {
                    otherImages.push(relativePath);
                }
            }
        }

        let orderedImages = [];
        if (mainImagePath) {
            orderedImages.push(mainImagePath);
        }

        // Sort the other images for consistent order
        otherImages.sort();
        orderedImages = orderedImages.concat(otherImages);

        galleryData[theme] = orderedImages;
    }

    // --- Step 4: Write the finalized data to the file ---
    await fs.writeFile(outputFilePath, JSON.stringify(galleryData, null, 2), 'utf-8');

    console.log(`\n🎉 Gallery data generated and updated successfully with ${TARGET_EXTENSION} files!`);
}

runScript().catch(err => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
});