const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const themesDir = path.join(projectRoot, 'img', 'themes');
const outputDir = path.join(projectRoot, 'data');
const outputFilePath = path.join(outputDir, 'images.json');

const TARGET_EXTENSION = '.webp'; 
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif']);
const EXCLUDE_DIRS = new Set(['node_modules', 'data', '.git', '.vscode', 'temp', 'backup']); 


// --- Helper Functions ---

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
        // Use sync version for initial file check outside the main async flow
        require('fs').accessSync(filePath); 
        return true;
    } catch {
        return false;
    }
}

function normalizeThemeName(name) {
    return name.toLowerCase().replace(/[\s\.\,\'\"]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

async function findAndConvertImagesRecursively(currentDir) {
    let entries;
    try {
        entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (e) {
        // Handle cases where we don't have permission to read a directory
        console.warn(`⚠️ Warning: Could not read directory ${path.relative(projectRoot, currentDir)}: ${e.message}`);
        return;
    }


    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        // 1. Safety Guardrails: Skip critical and excluded directories
        if (entry.isDirectory()) {
            if (EXCLUDE_DIRS.has(entry.name) || entry.name.startsWith('.')) {
                continue;
            }
            // Recursively process subfolders
            await findAndConvertImagesRecursively(fullPath);
        } else if (entry.isFile()) {
            const fileLower = entry.name.toLowerCase();
            const extension = path.extname(fileLower);
            
            // 2. Check if the file needs conversion
            if (SOURCE_EXTENSIONS.has(extension)) {
                
                const baseName = path.basename(entry.name, extension);
                const newFileName = baseName.toLowerCase() + TARGET_EXTENSION;
                const newFilePath = path.join(currentDir, newFileName);

                try {
                    // Conversion with EXIF rotation fix
                    await sharp(fullPath)
                        .rotate()
                        .webp({ quality: 80 })
                        .toFile(newFilePath);
                    
                    // Delete original file
                    await fs.unlink(fullPath); 
                    
                    console.log(`✅ CONVERTED (Project-Wide): ${path.relative(projectRoot, fullPath)} -> ${newFileName}`);
                    
                } catch (error) {
                    console.error(`❌ FAILED (Project-Wide): ${path.relative(projectRoot, fullPath)}: ${error.message}`);
                }
            }
        }
    }
}

async function runScript() {
    // Initial Setup
    await fs.mkdir(outputDir, { recursive: true });

    let galleryData = {};
    if (fileExistsSync(outputFilePath)) { 
        const existingData = await fs.readFile(outputFilePath, 'utf-8');
        galleryData = JSON.parse(existingData);
    }
    
    // --- CONVERT ALL IMAGES IN THE ENTIRE PROJECT ---
    console.log(`\n🌎 Starting Project-Wide Image Conversion from ${path.relative(projectRoot, projectRoot)}/`);
    await findAndConvertImagesRecursively(projectRoot);
    console.log(`✅ Project-Wide Conversion complete. All source files deleted.`);
    
    // --- Step 1: Find Theme Folders (The conversion is done, this prepares the theme list) ---
    console.log(`\n🔄 Scanning for theme folders in ${path.relative(projectRoot, themesDir)}...`);
    
    let themeFolders;
    try {
        themeFolders = (await fs.readdir(themesDir, { withFileTypes: true }))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (e) {
        console.error(`❌ Error: Could not read themes directory ${themesDir}. Is the path correct?`);
        return;
    }
    
    console.log('✅ Theme folders list ready for data generation.');

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
            // ONLY PROCESS THE NEW TARGET EXTENSION (.webp)
            if (fileLower.endsWith(TARGET_EXTENSION)) { 
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
    console.error("\n❌ An unexpected error occurred during script execution:", err);
    process.exit(1);
});